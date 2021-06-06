const axios = require("axios");
const fs = require("fs/promises");
const moment = require("moment");
const mysql = require("mysql");
const Promise = require("bluebird");
require("dotenv").config();

let connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});
// mysql本身是沒有Promise的(新版本有支援)，所以用bluebird來將連線Promise化
connection = Promise.promisifyAll(connection);

(async function () {
  try {
    // 進行連線 (Promise之後函式後面都要加上Async)
    await connection.connectAsync();
    let stockId = await fs.readFile("stock.txt", "utf-8");
    console.log(`股票代碼：${stockId}`);
    let result = await connection.queryAsync(`SELECT stock_id FROM stock WHERE stock_id = ${stockId}`);
    if (result.length <= 0) {
      let response = await axios.get(`https://www.twse.com.tw/zh/api/codeQuery?query=${stockId}`);
      let resData = response.data.suggestions[0];
      let resDataSplit = resData.split("\t");
      if (resDataSplit.length > 1) {
        // mysql 套件內, insert,update,delete 都要使用 queryAsync 去執行(類似 exec 的指令)
        connection.queryAsync(
          `INSERT INTO stock (stock_id, stock_name) VALUES ('${resDataSplit[0]}', '${resDataSplit[1]}');`
        );
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    connection.end();
  }
})();