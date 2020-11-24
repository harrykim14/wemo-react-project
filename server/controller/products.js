// Product Controller

const productModel = require('../models/Product');

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

exports.getProduct = async (req, res, next) => {
    try{
        const allProducts = await productModel.find({});
        res.status(200).json(allProducts);
    } catch (error) {
        next(error);
    }
}

exports.getProductById = async (req, res, next) => {
    try{
        const oneProduct = await productModel.findById(req.params.productId);
        if (oneProduct) {
            res.status(200).json(oneProduct);
        } else {
            res.status(404).send()
        }
    } catch (error){
        next(error);
    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        await productModel.findByIdAndUpdate(
            req.params.productId,
            req.body,
            { new : true }
        );
    } catch (error) {
        next(error)
    }
}