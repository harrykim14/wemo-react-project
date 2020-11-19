module.exports = {
    testEnvironment : "node",
}

// Mongoose: looks like you're trying to test a Mongoose app with Jest's default jsdom test environment.
// Please make sure you read Mongoose's docs on configuring Jest to test Node.js apps: http://mongoosejs.com/docs/jest.html
// 경고문구에 따라 jest 환경설정 파일을 만들고 테스트 환경을 node로 설정한다 (기본값은 jsdom)