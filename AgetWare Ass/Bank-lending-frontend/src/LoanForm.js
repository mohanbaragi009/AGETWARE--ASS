import React, { useState } from "react";
import { createLoan } from "../api/api";

const LoanForm = ({ customerId }) => {
  const [principal, setPrincipal] = useState("");
  const [years, setYears] = useState("");
  const [rate, setRate] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerId) {
      setResponse("Please create a customer first.");
      return;
    }
    try {
      const res = await createLoan({
        customer_id: customerId,
        loan_amount: Number(principal),
        loan_period_years: Number(years),
        interest_rate_yearly: Number(rate),
      });
      setResponse(`Loan created! Loan ID: ${res.data.loan_id}, EMI: ${res.data.monthly_emi}`);
      setPrincipal("");
      setYears("");
      setRate("");
    } catch (err) {
      setResponse("Error creating loan");
    }
  };

  return (
    <div>
      <h3>Create Loan</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Principal"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Loan Period (Years)"
          value={years}
          onChange={(e) => setYears(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Interest Rate (%)"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          required
        />
        <button type="submit">Create Loan</button>
      </form>
      <p>{response}</p>
    </div>
  );
};

export default LoanForm;
