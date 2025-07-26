const Loan = require('../models/Loan');
const Payment = require('../models/Payment');
const Customer = require('../models/Customer');
const { Op, fn, col } = require('sequelize');

function round2(num) {
  return Math.round(num * 100) / 100;
}

exports.createLoan = async (req, res) => {
  try {
    const { customer_id, loan_amount, loan_period_years, interest_rate_yearly } = req.body;

    if (!customer_id || !loan_amount || !loan_period_years || !interest_rate_yearly) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const customer = await Customer.findByPk(customer_id);
    if (!customer) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    // Simple interest calculation
    const I = loan_amount * loan_period_years * (interest_rate_yearly / 100);
    const A = round2(loan_amount + I);
    const monthly_emi = round2(A / (loan_period_years * 12));

    const loan = await Loan.create({
      customer_id,
      principal_amount: loan_amount,
      total_amount: A,
      interest_rate: interest_rate_yearly,
      loan_period_years,
      monthly_emi,
      status: 'ACTIVE'
    });

    return res.status(201).json({
      loan_id: loan.loan_id,
      customer_id: loan.customer_id,
      total_amount_payable: parseFloat(loan.total_amount),
      monthly_emi: parseFloat(loan.monthly_emi)
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

async function computePayments(loan_id) {
  const payments = await Payment.findAll({
    where: { loan_id }
  });
  const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.amount), 0);
  return totalPaid;
}

exports.getLedger = async (req, res) => {
  try {
    const { loan_id } = req.params;
    const loan = await Loan.findByPk(loan_id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    const payments = await Payment.findAll({ where: { loan_id }, order: [['payment_date', 'ASC']] });
    const amountPaid = await computePayments(loan_id);
    const balanceAmount = parseFloat(loan.total_amount) - amountPaid;
    const emisLeft = Math.ceil(balanceAmount / loan.monthly_emi);

    const transactions = payments.map(p => ({
      transaction_id: p.payment_id,
      date: p.payment_date,
      amount: parseFloat(p.amount),
      type: p.payment_type
    }));

    res.json({
      loan_id: loan.loan_id,
      customer_id: loan.customer_id,
      principal: parseFloat(loan.principal_amount),
      total_amount: parseFloat(loan.total_amount),
      monthly_emi: parseFloat(loan.monthly_emi),
      amount_paid: amountPaid,
      balance_amount: balanceAmount,
      emis_left: emisLeft,
      transactions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAccountOverview = async (req, res) => {
  try {
    const { customer_id } = req.params;
    const customer = await Customer.findByPk(customer_id);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const loans = await Loan.findAll({ where: { customer_id } });
    if (!loans.length) return res.status(404).json({ error: 'No loans for customer' });

    const overview = [];

    for (const loan of loans) {
      const amountPaid = await computePayments(loan.loan_id);
      const balanceAmount = parseFloat(loan.total_amount) - amountPaid;
      const emisLeft = Math.ceil(balanceAmount / loan.monthly_emi);

      overview.push({
        loan_id: loan.loan_id,
        principal: parseFloat(loan.principal_amount),
        total_amount: parseFloat(loan.total_amount),
        total_interest: round2(parseFloat(loan.total_amount) - parseFloat(loan.principal_amount)),
        emi_amount: parseFloat(loan.monthly_emi),
        amount_paid: amountPaid,
        emis_left: emisLeft
      });
    }

    res.json({
      customer_id,
      total_loans: loans.length,
      loans: overview
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
