import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api/v1",
});

export const createCustomer = (data) => API.post("/customers", data);
export const createLoan = (data) => API.post("/loans", data);
export const makePayment = (loanId, data) => API.post(`/loans/${loanId}/payments`, data);
export const getLoanLedger = (loanId) => API.get(`/loans/${loanId}/ledger`);
export const getAccountOverview = (customerId) => API.get(`/loans/customer/${customerId}/overview`);
