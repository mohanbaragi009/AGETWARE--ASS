const express = require('express');
const router = express.Router();
const loanController = require('../controllers/loanController');
const paymentController = require('../controllers/paymentController');

// Loan lending
router.post('/', loanController.createLoan);

// Loan ledger
router.get('/:loan_id/ledger', loanController.getLedger);

// Customer account overview
router.get('/customer/:customer_id/overview', loanController.getAccountOverview);

// Payments on loan
router.post('/:loan_id/payments', paymentController.createPayment);

module.exports = router;
