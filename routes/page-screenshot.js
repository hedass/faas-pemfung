const puppeteer = require("puppeteer");
var path = require("path");
var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", async (req, res, next) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://www.youtube.com/");
  await page.setViewport({ width: 1366, height: 768 });
  await page.screenshot({ path: "example.png" });

  await browser.close();
  var options = {
    root: path.join(__dirname, "../"),
  };

  var fileName = "example.png";
  console.log("asdasd");
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Sent:", fileName);
    }
  });
});

module.exports = router;
