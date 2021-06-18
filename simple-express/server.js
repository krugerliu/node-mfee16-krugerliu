// http://expressjs.com/en/starter/hello-world.html
// 導入 express 這個 package
const express = require("express");
// 利用 expresss 建立一個 express application app
let app = express();

// module < package < framework
// express is a package，但完整到足以被稱為是框架

app.use(express.static("public"));

// middleware 中間件 中介函式
// 在 express 裡
// req -> router
// req -> middlewares..... -> router
app.use(function (req, res, next) {
  let current = new Date();
  // 放入系統日期
  console.log(`client side calling at ${current}`);
  // 幾乎都要呼叫，讓他往下繼續
  next();
});

// 路由 router
app.get("/", function (req, res) {
  // res.send 的內容也可以由 html 字串組合而成
  res.send("<html><body>Hello ~ <font color='red'>Express</font></body></html>");
});

app.get("/about", function (req, res) {
  res.send("About Express AAAAAA");
});

app.get("/test", function (req, res) {
  //res.send("Test Express");
  // 可使用 html 語法
  //let myTest = "<html><body>it is <font color='red'>my test</font></body></html>";
  let myTest = str_conbine();
  res.send(myTest);
});

function str_conbine(){
  let v_html = "<html><body>";
  v_html += "it is come from <font color='red'>my test</font>"
  v_html += "</body></html>";
  return v_html;
};

// port 3000 則是可依據實際需要變更 port number, 不一定是要 3000, 而 80 是預設值
app.listen(3000, () => {
  console.log(`開始監聽 port 3000`);
});