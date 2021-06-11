// http 是 NodeJS 內建的 web server，所以不用安裝, 不須像 PHP 要搭配 web server （apache or nginx)
// NodeJS 直接開發一個 web server
// 參考網站資料 https://nodejs.org/docs/latest-v14.x/api/http.html
const http = require("http");
const { URL } = require("url");
const fs = require("fs/promises");
// createServer(Listener)
// Listener(request, response) 負責處理進來的連線, request 是請求物件, response 是回覆物件
const server = http.createServer(async (req, res) => {
  console.log("a connection come from client side");
  console.log(req.url);

  // 將 url 一般化，移除他的 query string、非必要的結尾斜線，並且一率小寫
  const path = req.url.replace(/\/?(?:\?.*)?$/, "").toLocaleLowerCase();
  console.log(`path:${path}`);

  // 處理 query string
  const url = new URL(req.url, `http://${req.headers.host}`);
  console.log(url.searchParams);

  res.statusCode = 200; // 2xx, 3xx, 4xx, 5xx
  res.setHeader("Content-Type", "text/plain;charset=UTF-8");

  // 路由 router
  switch (path) {
    case "":
      res.end("Hi ~ This is the home page");
      break;
    case "/test":
      // res.setHeader("Content-Type", "text/plain;charset=UTF-8"); 也可用 plain 取代使用 html 的方式
      res.setHeader("Content-Type", "text/html;charset=UTF-8");
      let content = await fs.readFile("test.html");
      res.end(content);
      break;
    case "/about":
      // 把 query string 抓出來用, 如 http://localhost:3000/about?name=Peter
      // set vs get 存取運算子
      let name = url.searchParams.get("name") || "friend!";
      res.end(`Hi, ${name} this is the web page about us`);
      break;
    default:
      res.writeHead(404);
      res.end("Not Found");
  }
});

// 需要先 createServer 後, 才可以 listen, port 3000 則是可依據實際需要變更 port number, 不一定是要 3000, 而 80 是預設值
server.listen(3000, () => {console.log("Server 開始監聽 3000 port");});



