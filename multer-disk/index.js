const express = require('express')
const multer = require('multer')
const app = express()
const cors = require('cors')

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

app.use(cors())
app.use('/semantic-ui-css', express.static(__dirname + '/node_modules/semantic-ui-css/'))

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
  console.log('Express on localhost:3000')
})
