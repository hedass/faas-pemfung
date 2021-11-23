const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

const defaultURL =
  "https://twitter.com/motivational/status/1462934836222599172";
const defaultWidth = 1366;
const defaultHeight = 768;
const defaultDir = "temp/";

/* GET users listing. */
router.get("/", async (req, res, next) => {
  let params = req.query;
  let url = params.url || defaultURL;
  let width = parseFloat(params.width) || defaultWidth;
  let height = parseFloat(params.height) || defaultHeight;
  let returnName = makeid(50);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  await page.setViewport({ width: width, height: height });
  await page.screenshot({ path: path.join(defaultDir, returnName + ".png") });

  await browser.close();
  let options = {
    root: path.join(__dirname, "../", defaultDir),
  };

  let fileName = returnName + ".png";
  console.log("asdasd");
  res.sendFile(fileName, options, function (err) {
    if (err) {
      console.log(err);
    } else {
      try {
        fs.unlinkSync(path.join(__dirname, "../", defaultDir, fileName));
        //file removed
      } catch (e) {
        console.error(e);
      }
      console.log("Sent:", fileName);
    }
  });
});

function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

module.exports = router;
