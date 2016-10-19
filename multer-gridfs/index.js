const express = require("express")
const app = express()
const fs = require("fs")
const multer = require("multer")
const upload = multer({ dest: "./uploads" })
const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost/super-file-upload-demo")
const conn = mongoose.connection

const Grid = require("gridfs-stream")
Grid.mongo = mongoose.mongo
var gfs

conn.once("open", function () {
  gfs = Grid(conn.db)

  app.get("/", function (req, res) {
    // renders a multipart/form-data form
    res.render("home")
  })

  // second parameter is multer middleware.
  app.post("/", upload.single("image"), function (req, res, next) {
    /*
    Create a gridfs-stream into which we pipe multer's temporary file saved in uploads. After which we delete multer's temp file.
    */
    var writestream = gfs.createWriteStream({
      filename: req.file.originalname
    })

    /*
    Pipe multer's temp file /uploads/filename into the stream we created above. On end deletes the temporary file.
    */
    var name = req.file.originalname
    fs.createReadStream("./uploads/" + req.file.filename)
      .on("end", function () {
        fs.unlink("./uploads/" + req.file.filename, function (err) {
          res.send(`Success! Open /files/${name}`)
        })
      })
      .on("err", function (err) {
        res.send("Error! Image upload is failed", err)
      })
      .pipe(writestream)
  })

  // sends the image we saved by filename
  app.get("/files/:filename", function (req, res) {
    var readstream = gfs.createReadStream({
      filename: req.params.filename
    })
    readstream.on("error", function (err) {
      res.send("No image found with that title")
    })
    readstream.pipe(res)
  })

  // delete the image
  app.delete("/files/:filename", function (req, res) {
    gfs.exist({ filename: req.params.filename }, function (err, found) {
      if (err) return res.send("Error occured!", err)
      if (found) {
        gfs.remove({ filename: req.params.filename }, function (err) {
          if (err) return res.send("Error occured!", err)
          res.send("Image deleted!")
        })
      } else {
        res.send("No image found with that title!")
      }
    })
  })
})

app.set("view engine", "ejs")
app.set("views", "./views")

if (!module.parent) {
  app.listen(3000, function () {
    console.log('Express on localhost:3000')
  })
}
