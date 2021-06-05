const axios = require("axios");
const fs = require("fs");
// 須先安裝 moment.js (可使用 npm install moment 指令安裝)
const sys_date = require("moment");
// 須先安裝 bluebird.js (可使用 npm install bluebird 指令安裝)
const Promise = require("bluebird");
const readFileBlue = Promise.promisify(fs.readFile);

// 呼叫具有 promise 功能的函式, 以便進行非同步處理
// readFilePromise()
readFileBlue("stock.txt", "utf-8")
  .then((stockCode) => {
    console.log("股票代號 : ", stockCode);
    return axios.get("https://www.twse.com.tw/exchangeReport/STOCK_DAY", {
      params: {
        response: "json",
        date: sys_date().format("YYYYMMDD"),
        stockNo: stockCode,
      },
    });
  })
  .then((response) => {
    if (response.data.stat === "OK") {
      //console.log(response.data.date);
      console.log(response.data.title);
      for (let i=0; i < response.data.data.length; i++){
        console.log(`交易日期 : ` + response.data.data[i][0] + `   收盤價格 : ` + response.data.data[i][6]);
      };
    }
  })
  .catch((err) => {
    console.error(err);
  });

  // 具有 promise 功能的函式, 可進行非同步處理
  /* function readFilePromise() {
    return new Promise((resolve, reject) => {
      fs.readFile("stock.txt", "utf8", (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }; */