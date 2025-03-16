const express = require('express');
const mongoose = require('mongoose');
const Employee = require("./models/Employee");

const app = express();
const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/company', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB Connection Error:", err));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('index', { foo: 'FOO' });
});

app.get('/generate', async (req, res) => {
  for (let index = 0; index < 10; index++) {
    try {
      let completed = Math.floor(Math.random() * 50) + 101; // Always > 100
      let canceled = Math.floor(Math.random() * completed); // Ensure canceled <= completed

      let cancelPercentage = (canceled / completed) * 100;
      let Level, rating;

      // Determine Level based on canceled percentage
      if (cancelPercentage < 20) {
        Level = 1;
        rating = (Math.random() * 1) + 4.0;  // 4.0 - 5.0
      } else if (cancelPercentage >= 20 && cancelPercentage <= 60) {
        Level = 2;
        rating = (Math.random() * 1.5) + 2.5; // 2.5 - 4.0
      } else {
        Level = 3;
        rating = (Math.random() * 2.5); // 0.0 - 2.5
      }

      let e = await Employee.create({
        name: `Driver${index + 1}`,
        Level: Level,
        rating: parseFloat(rating.toFixed(1)), // Keep one decimal place
        completed: completed,
        canceled: canceled,
        rides: completed+canceled
      });
      console.log(e);
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  }
  res.render('index', { foo: 'FOO' });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
