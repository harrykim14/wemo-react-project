const express = require('express'); // express 모듈 불러오기

// Constants : 포트와 호스트를 지정하기
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express(); // express 어플 생성
app.get('/', (req, res) => {
    res.send('Hello Node.js Server!');
});
// '/'라는 경로로 요청이 오면 response로 'Hello Node.js Server!'전달

app.listen(PORT, HOST); // 해당 포트와 호스트에서 HTTP 서버를 시작
console.log(`Running on http://${HOST}:${PORT}`) // 다 끝나면 콘솔로 해당 호스트와 포트를 출력