const express = require('express')
const app = express()
const port = 3000
const exphbs = require('express-handlebars')


app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' })) //handlebars註冊樣板引擎
app.set('view engine', 'hbs')

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

require('./routes')(app)
module.exports = app
