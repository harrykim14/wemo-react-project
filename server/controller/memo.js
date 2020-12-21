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
        const  updateMemoLocation = await memoModel.findOneAndUpdate(
            { $and: { userId: req.params.userid, memoNum: req.params.memoNum }},
            { $set: {  x: req.params.x, y: req.params.y}},
            { new: true }
        )

        // console.log("updateMemoLocation", updateMemoLocation);

        if(updateMemoLocation) 
            res.status(200).json(updateMemoLocation) 
        else 
            res.status(404).send()
    

    } catch(error) {
        next(error)
    }
}

exports.resizeMemo = async(req, res, next) => {
    try{
        const updateMemoSize = await memoModel.findOneAndUpdate(
            { $and: { userId: req.params.userid, memoNum: req.params.memoNum }},
            { $set: { height: req.params.height, width: req.params.width }},
            { new: true }
        )

        if(updateMemoSize) 
            res.status(200).json(updateMemoSize) 
        else
            res.status(404).send()

    } catch(error) {
        next(error)
    }
}

exports.rewriteMemo = async(req, res, next) => {
    try { 
        const updateMemoContext = await memoModel.findOneAndUpdate(
            { $and: { userId: req.params.userid, memoNum: req.params.memoNum }},
            { $set: { memoContext: req.params.memoContext }},
            { new : true }
        )

        if(updateMemoContext) 
            res.status(200).json(updateMemoContext)
        else 
            res.status(404).send()

    } catch(error) {
        next(error);
    }
}

exports.paintMemo = async(req, res, next) => {
    try { 
        const paintMemo = await memoModel.findOneAndUpdate(
            { $and: { userId: req.params.userid, memoNum: req.params.memoNum }},
            { $set: { bgColor: req.params.bgColor }},
            { new : true }
        )

        if(paintMemo) 
            res.status(200).json(paintMemo)
        else 
            res.status(404).send()

    } catch(error) {
        next(error);
    }
}