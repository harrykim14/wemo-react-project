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
        const writtenMemos = await memoModel.find(req.params.userId) 
        res.status(200).json(writtenMemos);
    } catch(error){
        next(error);
    }
}

exports.moveMemo = async(req, res, next) => {
    try{
        const  updateMemoLocation = await memoModel.findOneAndUpdate(
            { $and: { userId: req.params.userId, memoNum: req.params.memoNum }},
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
            { $and: { userId: req.params.userId, memoNum: req.params.memoNum }},
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
            { $and: { userId: req.params.userId, memoNum: req.params.memoNum }},
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
            { $and: { userId: req.params.userId, memoNum: req.params.memoNum }},
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

exports.changeLockStateMemo = async(req, res, next) => {
    try { 
        if(req.params.memoLocked){
            const lockMemo = await memoModel.findOneAndUpdate(
                { $and: { userId: req.params.userId, memoNum: req.params.memoNum }},
                { $set: { memoLocked: true }},
                { new: true })
            if (lockMemo) 
                res.status(200).json(lockMemo);
            else 
                res.status(404).send();
        } else {
            const unlockMemo = await memoModel.findOneAndUpdate(
                { $and: { userId: req.params.userId, memoNum: req.params.memoNum }},
                { $set: { memoLocked: false }},
                { new: true }
            )
            if(unlockMemo)
                res.status(200).json(unlockMemo);
            else 
                res.status(404).send();
        }

    } catch(error) {
        next(error);
    }
}

exports.changeMarkStateMemo = async(req, res, next) => {
    try { 
        if(req.params.memoImport){
            const markMemo = await memoModel.findOneAndUpdate(
                { $and: { userId: req.params.userId, memoNum: req.params.memoNum }},
                { $set: { memoImport: true }},
                { new: true })
            if (markMemo) 
                res.status(200).json(markMemo);
            else 
                res.status(404).send();
        } else {
            const unmarkMemo = await memoModel.findOneAndUpdate(
                { $and: { userId: req.params.userId, memoNum: req.params.memoNum }},
                { $set: { memoImport: false }},
                { new: true }
            )
            if(unmarkMemo)
                res.status(200).json(unmarkMemo);
            else 
                res.status(404).send();
        }

    } catch(error) {
        next(error);
    }
}

exports.throwOrRestoreMemo = async(req, res, next) => {
    try { 
        if(req.params.memoTrash){
            const throwMemo = await memoModel.findOneAndUpdate(
                { $and: { userId: req.params.userId, memoNum: req.params.memoNum }},
                { $set: { memoTrash: true }},
                { new: true })
            if (throwMemo) 
                res.status(200).json(throwMemo);
            else 
                res.status(404).send();
        } else {
            const restoreMemo = await memoModel.findOneAndUpdate(
                { $and: { userId: req.params.userId, memoNum: req.params.memoNum }},
                { $set: { memoTrash: false }},
                { new: true }
            )
            if(restoreMemo)
                res.status(200).json(restoreMemo);
            else 
                res.status(404).send();
        }

    } catch(error) {
        next(error);
    }
}

exports.findWrittenMemo = async (req, res, next) => {
    try {
        // get방식을 사용할 것이기 때문에 searchWord는 쿼리문으로 받아올 것
        let searchWord = req.params.s;
        // find 메서드는 정규식을 이용하여 검색
        const result = await memoModel.find({memoContext: new RegExp(searchWord, 'i')})
        
            if(!result) {
                res.status(404).send();
            } else {
                if (result.length >= 1) {
                    res.status(200).json(result)
                } else {
                    res.status(200).send("해당하는 메모가 없습니다.")
                }
            }            

    } catch(error) {
        next(error);
    }  
}

exports.deleteMemo = async (req, res, next) => {
    try {
        const delResult = await memoModel.findOneAndDelete(
            { $and: { userId: req.params.userId, memoNum: req.params.memoNum }}
        )
            console.log("delResult", delResult);
        if(delResult)
            res.status(200).json(delResult)
        else 
            res.status(404).send();

    } catch(error) {
        next(error);
    }  
}