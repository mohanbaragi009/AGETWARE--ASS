import React, { useState } from "react";
import { getAccountOverview } from "../api/api";

const AccountOverview = () => {
  const [customerId, setCustomerId] = useState("");
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  const fetchOverview = async () => {
    try {
      const res = await getAccountOverview(customerId);
      setOverview(res.data);
      setError(null);
    } catch {
      setError("Failed to fetch overview");
      setOverview(null);
    }
  };

  return (
    <div>
      <h3>Account Overview</h3>
      <input
        type="text"
        placeholder="Customer ID"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
      />
      <button onClick={fetchOverview} disabled={!customerId}>Get Overview</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {overview && (
        <div>
          <p><b>Customer ID:</b> {overview.customer_id}</p>
          <p><b>Total Loans:</b> {overview.total_loans}</p>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Loan ID</th>
                <th>Principal</th>
                <th>Total Amount</th>
                <th>Total Interest</th>
                <th>EMI</th>
                <th>Amount Paid</th>
                <th>EMIs Left</th>
              </tr>
            </thead>
            <tbody>
              {overview.loans.map((loan) => (
                <tr key={loan.loan_id}>
                  <td>{loan.loan_id}</td>
                  <td>{loan.principal}</td>
                  <td>{loan.total_amount}</td>
                  <td>{loan.total_interest}</td>
                  <td>{loan.emi_amount}</td>
                  <td>{loan.amount_paid}</td>
                  <td>{loan.emis_left}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AccountOverview;
