const Period = require('../models/Period');

async function getPeriodDates(req) {
  const messId = req.user.messId;
  let startDate, endDate, selectedPeriod = null;

  if (req.query.periodId) {
    selectedPeriod = await Period.findOne({ _id: req.query.periodId, messId }).populate('managerId', 'username');
  } else {
    selectedPeriod = await Period.findOne({ messId, isActive: true }).populate('managerId', 'username');
  }

  if (selectedPeriod) {
    startDate = new Date(selectedPeriod.startDate);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(selectedPeriod.endDate);
    endDate.setHours(23, 59, 59, 999);
  } else {
    // Fallback to month/year
    const now = new Date();
    const month = parseInt(req.query.month) || now.getMonth() + 1;
    const year = parseInt(req.query.year) || now.getFullYear();
    
    startDate = new Date(year, month - 1, 1);
    startDate.setHours(0, 0, 0, 0);
    endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);
  }

  return { startDate, endDate, selectedPeriod };
}

module.exports = { getPeriodDates };
