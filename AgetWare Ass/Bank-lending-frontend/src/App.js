import React, { useState } from "react";
import CustomerForm from "./components/CustomerForm";
import LoanForm from "./components/LoanForm";
import PaymentForm from "./components/PaymentForm";
import LoanLedger from "./components/LoanLedger";
import AccountOverview from "./components/AccountOverview";

function App() {
  const [customerId, setCustomerId] = useState(null);

  const handleCustomerCreated = (id) => {
    setCustomerId(id);
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>Bank Lending System</h1>

      <CustomerForm onCustomerCreated={handleCustomerCreated} />
      <hr />

      <LoanForm customerId={customerId} />
      <hr />

      <PaymentForm />
      <hr />

      <LoanLedger />
      <hr />

      <AccountOverview />
    </div>
  );
}

export default App;
