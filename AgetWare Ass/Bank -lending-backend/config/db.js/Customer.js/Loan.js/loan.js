const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Customer = require('./Customer');

const Loan = sequelize.define('Loan', {
  loan_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  customer_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Customer,
      key: 'customer_id'
    }
  },
  principal_amount: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false
  },
  total_amount: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false
  },
  interest_rate: {
    type: DataTypes.DECIMAL(5,2),  // yearly interest rate %
    allowNull: false
  },
  loan_period_years: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  monthly_emi: {
    type: DataTypes.DECIMAL(12,2),
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'ACTIVE'
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

Loan.belongsTo(Customer, { foreignKey: 'customer_id' });

module.exports = Loan;
