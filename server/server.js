const express = require('express'); // express 모듈 불러오기
// const bodyparser = require('body-parser');
// express 버전업에 따라 bodyparser가 할 수 있는 일을 express가 할 수 있게 됨

// Constants : 포트와 호스트를 지정하기
const PORT = 8080;
const HOST = 'localhost';
const config = require('./config/key')

// App
const app = express(); // express 어플 생성
app.use(express.json());

// MongoDB 연결하기
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true,
    useFindAndModify : false,
}).then(() => console.log('mongoDB connected!'))
  .catch(err => console.log("err"))

app.get('/', (req, res) => {
    res.send('Hello Node.js Server!');
});
// '/'라는 경로로 요청이 오면 response로 'Hello Node.js Server!'전달


const productRoute = require('./routes');
app.use("/product", productRoute)
// 해당 접근이 있으면 라우터로 보냄 라우터의 기본 주소가 /product이므로
// 라우터 내 기본 경로 + a 와 같이 처리하게 될 것
// 라우터에서 이 경로를 처리하게 할 것이기 때문에 아래와 같이 처리

app.listen(PORT, HOST); // 해당 포트와 호스트에서 HTTP 서버를 시작
console.log(`Running on http://${HOST}:${PORT}`) // 다 끝나면 콘솔로 해당 호스트와 포트를 출력

