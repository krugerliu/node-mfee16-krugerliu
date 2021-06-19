const express = require("express");
// 可以把 router 想成一個小的、獨立的應用（跟app應用差不多）
const router = express.Router();
const connection = require("../utils/db")

router.get("/", async (req, res) => {
    let queryResults = await connection.queryAsync("SELECT * FROM stock;");
    res.render("stock/list", {stocks: queryResults});
});


router.get("/:stockCode", async (req, res) => {
    // res.send(req.params.stockCode);

    let stock = await connection.queryAsync(
		"SELECT * FROM stock WHERE stock_id=?;",
		req.params.stockCode
	);
	if (stock.length === 0) {
		throw new Error("查無代碼");
	}
	stock = stock[0];

    // 總共有幾筆??
	let count = await connection.queryAsync(
		"SELECT count(*) as total FROM stock_price WHERE stock_id= ?",
		req.params.stockCode
	);
	// console.log(count);
	const total = count[0].total;
	const perPage = 5;
	const lastPage = Math.ceil(total / perPage);

	// 現在在第幾頁
	const currentPage = req.query.page || 1;
	const offset = (currentPage - 1) * perPage;


    let queryResults = await connection.queryAsync(
		"SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date LIMIT ? OFFSET ?;",
		[req.params.stockCode, perPage, offset]
	);
    res.render("stock/detail", {
		stock,
		stockPrices: queryResults,
		pagination: {
			lastPage,
			currentPage,
			total,
		},
	});
  
    //let queryResults = await connection.queryAsync("SELECT * FROM stock_price WHERE stock_id = ? ORDER BY date;", req.params.stockCode);
    //res.render("stock/detail", {stockPrices: queryResults});
});



module.exports = router;