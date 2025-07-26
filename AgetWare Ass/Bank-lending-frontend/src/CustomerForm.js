import React, { useState } from "react";
import { createCustomer } from "../api/api";

const CustomerForm = ({ onCustomerCreated }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await createCustomer({ name });
      onCustomerCreated(res.data.customer_id);
      setMessage(`Customer created with ID: ${res.data.customer_id}`);
      setName("");
    } catch (err) {
      setMessage("Error creating customer");
    }
  };

  return (
    <div>
      <h3>Create Customer</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Customer Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <button type="submit">Create</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default CustomerForm;
