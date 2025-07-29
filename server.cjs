const express = require('express');
const app = express();
app.use(express.json());

app.post('/api/payroll', (req, res) => {
  const gross = req.body.gross || 0;
  let net = gross;
  let deductions = {};

  const lowerLimit = 8000;
  const upperLimit = 72000;
  let pensionableEarnings = Math.min(gross, upperLimit);
  let nssfTierI = Math.min(pensionableEarnings, lowerLimit) * 0.06;
  let nssfTierII = Math.max(0, Math.min(pensionableEarnings - lowerLimit, upperLimit - lowerLimit)) * 0.06;
  deductions.NSSF = (nssfTierI + nssfTierII) * 2;
  net -= deductions.NSSF;

  deductions.SHIF = Math.min(0.0275 * gross, 5000);
  net -= deductions.SHIF;

  deductions.HousingLevy = 0.015 * gross;
  net -= deductions.HousingLevy;

  let taxableIncome = net;
  let PAYE = taxableIncome > 24000 ? (taxableIncome - 24000) * 0.3 : 0;
  deductions.PAYE = PAYE;
  net -= PAYE;

  res.json({ gross, net: Math.round(net), deductions });
});

app.post('/api/contact', (req, res) => {
  res.json({ status: 'success', data: req.body });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));