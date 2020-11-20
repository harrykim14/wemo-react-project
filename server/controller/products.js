// Product Controller

const productModel = require('../models/Product');

exports.basic = (req, res) => {
    res.send("Product의 기본 페이지 로딩")
}

exports.createProduct = async (req, res, next) => {
    try {
    const createProduct = await productModel.create(req.body);
    console.log("createProduct", createProduct)
    // createProduct Promise { <pending> } 이라고 나오는 이유는 처리방식이 비동기방식이기 때문임
    // async, await를 사용하여 비동기를 동기화시킴
    res.status(201).json(createProduct)
    // 객체 데이터들은 대부분 json형식으로 send하게 된다
    } catch (error) {
        next(error);
    }

}