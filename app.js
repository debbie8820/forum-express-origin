const express = require('express')
const exphbs = require('express-handlebars')
const db = require('./models') //引入資料庫
const app = express()
const port = 3000

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) //handlebars註冊樣板引擎
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)
module.exports = app
