const express = require('express')
// express 모듈을 가져오기
const app = express()
// express 모듈 내 express()를 사용해 생성
const port = 5000
const bodyparser = require('body-parser');
const cookieparser = require('cookie-parser');

const config = require('./config/key')
const { User } = require("./models/User");
const { auth } = require("./middleware/auth")

app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());
app.use(cookieparser())

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify : false,
}).then(() => console.log('mongoDB connected!'))
  .catch(err => console.log("err"))



app.get('/', (req, res) => {
  console.log('Cookies: ', req.cookies)
  res.send('Hello NodeMon!!')
})

app.post('/product', (req, res) =>{
  console.log('req.body :', req.body);
})

app.post('/user',(req, res) => {
  console.log('req.body :', req.body);
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
