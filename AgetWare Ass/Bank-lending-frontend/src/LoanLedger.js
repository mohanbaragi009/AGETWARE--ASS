import React, { useState } from "react";
import { getLoanLedger } from "../api/api";

const LoanLedger = () => {
  const [loanId, setLoanId] = useState("");
  const [ledger, setLedger] = useState(null);
  const [error, setError] = useState(null);

  const fetchLedger = async () => {
    try {
      const res = await getLoanLedger(loanId);
      setLedger(res.data);
      setError(null);
    } catch {
      setError("Failed to fetch ledger");
      setLedger(null);
    }
  };

  return (
    <div>
      <h3>Loan Ledger</h3>
      <input
        type="text"
        placeholder="Loan ID"
        value={loanId}
        onChange={(e) => setLoanId(e.target.value)}
      />
      <button onClick={fetchLedger} disabled={!loanId}>Get Ledger</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {ledger && (
        <div>
          <p><b>Loan ID:</b> {ledger.loan_id}</p>
          <p><b>Balance:</b> {ledger.balance_amount}</p>
          <p><b>Monthly EMI:</b> {ledger.emi_amount}</p>
          <p><b>EMIs Left:</b> {ledger.emi_left}</p>

          <h4>Transactions</h4>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Date</th>
                <th>Amount</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {ledger.transactions.map((tx) => (
                <tr key={tx.transaction_id}>
                  <td>{new Date(tx.date).toLocaleDateString()}</td>
                  <td>{tx.amount}</td>
                  <td>{tx.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LoanLedger;
