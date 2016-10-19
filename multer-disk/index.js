const express = require('express')
const multer = require('multer')
const app = express()

app.use(express.static('public'))

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, `public/uploads`)
  },
  filename: function (req, file, callback) {
    callback(null, `${Date.now()}-${file.originalname}`)
  }
})

const upload = multer({ storage: storage }).single('userImage')

app.get('/', function (req, res) {
  res.sendFile(`${__dirname}/index.html`)
})

app.post('/api/images', function (req, res) {
  upload(req, res, function (err) {
    if (err) return res.end('Error uploading file!', err)
    else {
      res.end(`${req.file.filename}`)
    }
  })
})

app.listen(3000, function () {
  console.log
('Express on localhost:3000')
})
