const axios = require('axios');

// Make a request for a user with a given ID
axios.get('https://www.twse.com.tw/exchangeReport/STOCK_DAY?response=json&date=20210528&stockNo=2610')
  .then(function (response) {
    // handle success
    console.log(response);
    console.log(response.data.date);
    console.log(response.data.title);
    console.log(response.data.data[0]);
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  });