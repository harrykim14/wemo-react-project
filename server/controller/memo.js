// Memo Controller

const memoModel = require('../models/Memo');

exports.createMemo = async (req, res, next) => {
    try {
    const createMemo = await memoModel.create(req.body);
    // console.log("createMemo", createMemo)
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
        res.status(200).json(writtenMemos);
    } catch(error){
        next(error);
    }
}

exports.moveMemo = async(req, res, next) => {
    try{
        const updateMemoLocation = await memoModel.findOneAndUpdate(
            { $and: { userid: req.params.userid, memoNum: req.params.memoNum }},
            { $set: {  x: req.params.x, y: req.params.y}},
            { new: true }
        )

        console.log("updateMemoLocation", updateMemoLocation);

        if(updateMemoLocation) {
            res.status(200).json(updateMemoLocation);
        } else {
            res.status(404).send();
        }

    } catch(error) {
        next(error)
    }
}