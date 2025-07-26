const Loan = require('../models/Loan');
const Payment = require('../models/Payment');

exports.createPayment = async (req, res) => {
  try {
    const { loan_id } = req.params;
    const { amount, payment_type } = req.body;

    if (!amount || !payment_type) {
      return res.status(400).json({ error: 'Amount and payment_type are required' });
    }

    const loan = await Loan.findByPk(loan_id);
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    const validTypes = ['EMI', 'LUMP_SUM'];
    if (!validTypes.includes(payment_type.toUpperCase())) {
      return res.status(400).json({ error: 'Invalid payment type' });
    }

    const payment = await Payment.create({
      loan_id,
      amount,
      payment_type: payment_type.toUpperCase()
    });

    // Calculate new balance and EMIs left after payment
    const paidPayments = await Payment.findAll({ where: { loan_id } });
    const totalPaid = paidPayments.reduce((acc, p) => acc + parseFloat(p.amount), 0);
    const balance = parseFloat(loan.total_amount) - totalPaid;
    const emisLeft = Math.ceil(balance / loan.monthly_emi);

    // Update loan status if fully paid
    if (balance <= 0) {
      loan.status = 'PAID_OFF';
      await loan.save();
    }

    res.status(200).json({
      payment_id: payment.payment_id,
      loan_id,
      message: 'Payment recorded successfully.',
      remaining_balance: balance > 0 ? balance : 0,
      emis_left: emisLeft > 0 ? emisLeft : 0
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
