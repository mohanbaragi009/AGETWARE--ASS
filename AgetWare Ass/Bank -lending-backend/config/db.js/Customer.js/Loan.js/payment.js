const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Loan = require('./Loan');

const Payment = sequelize.define('Payment', {
  payment_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  loan_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Loan,
      key: 'loan_id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false
  },
  payment_type: {
    type: DataTypes.ENUM('EMI', 'LUMP_SUM'),
    allowNull: false
  }
}, {
  timestamps: true,
  createdAt: 'payment_date',
  updatedAt: false
});

Payment.belongsTo(Loan, { foreignKey: 'loan_id' });

module.exports = Payment;
