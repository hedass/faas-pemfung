var express = require("express");
var router = express.Router();
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const sizeOf = require("image-size");

const defaultDir = "temp/";

/* GET home page. */
router.post("/", async function (req, res, next) {
  console.log(req.files.file.data);
  let file = req.files.file;
  let filename = makeid(50);
  let type = file.mimetype.split("/")[0];
  let extension = file.mimetype.split("/")[1];
  console.log(req);
  let quality = 0.1;

  if (type !== "image") {
    res.status(415).send({ err: "Invalid Media Type" });
  } else {
    let fileSource = `temp/${filename}.${extension}`;
    let destSource = `temp/${filename}_resized.${extension}`;
    fs.writeFileSync(fileSource, req.files.file.data);

    let dimensions = sizeOf(fileSource);

    await sharp(fileSource)
      .resize({ height: parseInt(dimensions.height * quality) })
      .toFile(destSource);
    res.sendFile(
      `${filename}_resized.${extension}`,
      { root: path.join(__dirname, "../", defaultDir) },
      function (err) {
        if (err) {
          console.log(err);
        } else {
          try {
            fs.unlinkSync(path.join(__dirname, "../", fileSource));
            fs.unlinkSync(path.join(__dirname, "../", destSource));
            //file removed
          } catch (e) {
            console.error(e);
          }
          console.log("Sent:", destSource);
        }
        res.end();
      }
    );
  }
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
