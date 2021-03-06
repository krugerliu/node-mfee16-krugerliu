const connection = require("./utils/db.js");

// http://expressjs.com/en/starter/hello-world.html
// 導入 express 這個 package
const express = require("express");
// 利用 express 建立一個 express application
let app = express();

// module < package < framework
// express is a package，但完整到足以被稱為是框架

// 可以指定一個或多個目錄是「靜態資源目錄」
// 自動幫你為 public 裡面的檔案建立路由
app.use(express.static("public"));
app.use("/admin", express.static("public-admin"));

// 設定一些 application 變數
// 第一個是變數 views
// 第二個是檔案夾名稱
app.set("views", "views");
// 告訴 express 我們用的 view engine 是 pug
app.set("view engine", "pug");

app.use(function (req, res, next) {
  console.log("無用 Middleware");
  // 「幾乎」都要呼叫，讓他往下繼續
  next();
});

// middleware 中間件 中介函式
// 在 express 裡
// req -> router
// req -> middleware..... -> router
app.use(function (req, res, next) {
  let current = new Date();
  console.log(`有人來訪問了喔 在 ${current}`);
  // 「幾乎」都要呼叫，讓他往下繼續
  next();
});

let stockRouter = require("./routes/stock");
app.use("/stock", stockRouter);

let apiRouter = require("./routes/api")
app.use("/api",apiRouter);

let authRouter = require("./routes/auth")
app.use("/auth",authRouter)

// 路由 router
// (request, response) {} 去回應這個請求
app.get("/", function (req, res) {
  // res.send("Hello Express BBB");
  res.render("index");
  // views/index.pug
});

app.get("/about", function (req, res, next) {
  // res.send("About Express AAAA");
  res.render("about");
});

// app.get("/about", function (req, res) {
//   console.log("我是 ABOUT - BBBBB");
//   res.send("<h1>About Express BBBB</h1>");
// });

app.get("/test", function (req, res) {
  res.send("Test Express");
});

/*
app.get("/stock", async (req, res) => {
  let queryResults = await connection.queryAsync("SELECT * FROM stock;");
  res.render("stock/list", {
    stocks: queryResults,
  });
});

app.get("/stock/:stockCode", async (req, res) => {
  let queryResults = await connection.queryAsync("SELECT*FROM stock_price WHERE stock_id = ? ORDER BY date;", req.params.stockCode)
  res.render("stock/detail", {
      stockPrices: queryResults,
  });
})
*/

app.listen(3000, async () => {
  // 在 web server 開始的時候，去連線資料庫
  await connection.connectAsync();
  console.log(`我跑起來了喔 在 port 3000`);
});