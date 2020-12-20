// Memo Controller

const memoModel = require('../models/Memo');

exports.createMemo = async (req, res, next) => {
    try {
    const createMemo = await memoModel.create(req.body);
    console.log("createMemo", createMemo)
    // createProduct Promise { <pending> } 이라고 나오는 이유는 처리방식이 비동기방식이기 때문임
    // async, await를 사용하여 비동기를 동기화시킴
    res.status(201).json(createMemo)
    // 객체 데이터들은 대부분 json형식으로 send하게 된다
    } catch (error) {
        next(error);
    }
}

exports.getMemos = async (req, res, next) => {
    try {
        const writtenMemos = await memoModel.find(req.params.userid) 
        res.status(200).json({success: true, writtenMemos});
    } catch(error){
        next(error);
    }
}