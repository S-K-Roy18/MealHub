const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Mess = require('./models/Mess');
const User = require('./models/User');
const GasCylinder = require('./models/GasCylinder');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const gas = await GasCylinder.find({}).populate('messId', 'name').populate('addedBy', 'username');
    console.log(`Global gas cylinders in DB (${gas.length}):`);
    gas.forEach(g => {
      console.log('Gas document:', {
        _id: g._id,
        mess: g.messId?.name,
        buyingDate: g.buyingDate,
        price: g.price,
        createdAt: g.createdAt
      });
    });

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
    mongoose.disconnect();
  }
}

run();
