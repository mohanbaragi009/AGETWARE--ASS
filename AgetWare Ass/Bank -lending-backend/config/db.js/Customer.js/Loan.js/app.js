const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const customerRoutes = require('./routes/customerRoutes');
const loanRoutes = require('./routes/loanRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('Bank Lending System API'));

app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/loans', loanRoutes);

sequelize.sync({ force: false })  // set to 'true' to reset DB each run
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to sync database:', err);
  });
