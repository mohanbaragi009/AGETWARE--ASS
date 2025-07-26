import React, { useState } from "react";
import { makePayment } from "../api/api";

const PaymentForm = () => {
  const [loanId, setLoanId] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("EMI");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await makePayment(loanId, { amount: Number(amount), payment_type: type });
      setMessage(`Payment successful! Remaining Balance: ${res.data.remaining_balance}, EMIs left: ${res.data.emis_left}`);
      setLoanId("");
      setAmount("");
      setType("EMI");
    } catch (err) {
      setMessage("Payment failed");
    }
  };

  return (
    <div>
      <h3>Make Payment</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Loan ID"
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          step="0.01"
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="EMI">EMI</option>
          <option value="LUMP_SUM">LUMP_SUM</option>
        </select>
        <button type="submit">Pay</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default PaymentForm;
