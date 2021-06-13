const axios = require("axios");
const fs = require("fs/promises");
const mysql = require("mysql");
const Promise = require("bluebird");
const sys_date = require("moment");
require("dotenv").config();

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection = Promise.promisifyAll(connection);
(async function () {
  try {
    await connection.connectAsync();
    let stockId = await fs.readFile("stock.txt", "utf-8");
    let v_stockCode = stockId.split("\r\n");
    for (let i=0; i < v_stockCode.length; i++) {
        if (v_stockCode[i] !==""){
            let result = await connection.queryAsync(`SELECT stock_id FROM stock WHERE stock_id = ${v_stockCode[i]}`);
            if (result.length <= 0) {
                let response_stockCode = await axios.get(`https://www.twse.com.tw/zh/api/codeQuery?query=${v_stockCode[i]}`);
                checkNewStock(response_stockCode.data.suggestions[0]);      // 檢查證交所是否有此股票代碼
            };
            let response = await axios.get(
                "https://www.twse.com.tw/exchangeReport/STOCK_DAY",
                {params: {response: "json", date: sys_date().format("YYYYMMDD"), stockNo: v_stockCode[i]}}
            );
            if (response.data.stat !== "OK") {throw `證交所無此股票代碼: ${v_stockCode[i]} \n`;}; //無此股票代碼時,立即 throw exception 中斷往下執行
            console.log(response.data.title);
            let stockData = response.data.data;
            let stockTransaction = response.data.data.map((stockData) => {
                stockData = stockData_reFormat(stockData, v_stockCode[i]);  // 資料重新校正回歸
                return stockData;
            });
            await connection.queryAsync(`insert ignore into stock_price (stock_id, date, volume, amount, open_price, high_price, low_price, close_price, delta_price, transactions) VALUES ?`, [stockTransaction]);
            console.log(`股票代碼： ${v_stockCode[i]} 已完成更新\n\n`);
        };
    };
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  };
})();

function checkNewStock(resData){
    let resDataSplit = resData.split("\t");
    if (resDataSplit.length > 1) {
        connection.queryAsync(`INSERT INTO stock (stock_id, stock_name) VALUES ('${resDataSplit[0]}', '${resDataSplit[1]}');`);
    };
};

function stockData_reFormat(stockData, v_stockCode){
    stockData = stockData.map((value) => {return value.replace(/,/g, "");});
    stockData[0] = parseInt(stockData[0].replace(/\//g, ""), 10) + 19110000;
    stockData[0] = sys_date(stockData[0], "YYYYMMDD").format("YYYY-MM-DD");
    stockData.unshift(v_stockCode);
    console.log(`交易日期 : ` + stockData[1] + `   收盤價格 : ` + stockData[6]);
    return stockData;
};