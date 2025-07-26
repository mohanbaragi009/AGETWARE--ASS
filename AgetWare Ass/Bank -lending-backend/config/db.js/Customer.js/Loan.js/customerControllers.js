const Customer = require('../models/Customer');

exports.createCustomer = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const customer = await Customer.create({ name });
    res.status(201).json({ customer_id: customer.customer_id, name: customer.name });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
