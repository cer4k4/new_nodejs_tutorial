const express = require('express')
const app = express()
const port = 3000

const cb0 = function (req, res, next) {
  console.log('CB0')
  next()
}

const cb1 = function (req, res, next) {
  console.log('CB1')
  next()
}

const cb2 = function (req, res) {
  res.json('Hello from C!')
}

app.get('/example/c', [cb1, cb0, cb2])


app.listen(port,() => {
	console.log(`Example app listening on port ${port}`);
})
