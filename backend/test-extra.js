const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://suryarahulroy321_db_user:Surya123@cluster0.gjgqcsj.mongodb.net/mealhub?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    const MealEntry = require('./models/MealEntry');
    const meals = await MealEntry.find({ 'entries.extra': { $gt: 0 } });
    let count = 0;
    meals.forEach(m => {
       m.entries.forEach(e => { if (e.extra > 0) count++; });
    });
    console.log('Total entries with extra > 0:', count);
    if (meals.length > 0) {
      console.log('Last updated entry:', meals[meals.length - 1].updatedAt);
    }
    process.exit(0);
  });
