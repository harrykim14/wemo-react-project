// Memo Controller

const memoModel = require('../models/Memo');

exports.createMemo = async (req, res, next) => {
    try {
    const createMemo = await memoModel.create(req.body);
    // console.log("createMemo", createMemo)
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

    // 12-27: 쿼리문으로 직접 보내는 req.params.xxx에서 req.body로 변경, 나중엔 memoNum에서 memoId로 변경해야 함
    let searchFlag = { userId: req.body.userId, memoNum: req.body.memoNum }
    // Mongoose 업데이트로 $and 쿼리가 사라짐
    let setProps = { $set: {  x: req.body.x, y: req.body.y}};

    try{
        const  updateMemoLocation = await memoModel.findOneAndUpdate(
            searchFlag,
            setProps, // 상동
            { new: true }
        )

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
           { userId: req.body.userId, memoNum: req.body.memoNum },
            { $set: { height: req.body.height, width: req.body.width }},
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
           { userId: req.body.userId, memoNum: req.body.memoNum },
            { $set: { memoContext: req.body.memoContext }},
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
           { userId: req.body.userId, memoNum: req.body.memoNum },
            { $set: { bgColor: req.body.bgColor }},
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
        if(req.body.memoLocked){
            const lockMemo = await memoModel.findOneAndUpdate(
               { userId: req.body.userId, memoNum: req.body.memoNum },
                { $set: { memoLocked: true }},
                { new: true })
            if (lockMemo) 
                res.status(200).json(lockMemo);
            else 
                res.status(404).send();
        } else {
            const unlockMemo = await memoModel.findOneAndUpdate(
               { userId: req.body.userId, memoNum: req.body.memoNum },
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
        if(req.body.memoImport){
            const markMemo = await memoModel.findOneAndUpdate(
               { userId: req.body.userId, memoNum: req.body.memoNum },
                { $set: { memoImport: true }},
                { new: true })
            if (markMemo) 
                res.status(200).json(markMemo);
            else 
                res.status(404).send();
        } else {
            const unmarkMemo = await memoModel.findOneAndUpdate(
               { userId: req.body.userId, memoNum: req.body.memoNum },
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
        if(req.body.memoTrash){
            const throwMemo = await memoModel.findOneAndUpdate(
               { userId: req.body.userId, memoNum: req.body.memoNum },
                { $set: { memoTrash: true }},
                { new: true })
            if (throwMemo) 
                res.status(200).json(throwMemo);
            else 
                res.status(404).send();
        } else {
            const restoreMemo = await memoModel.findOneAndUpdate(
               { userId: req.body.userId, memoNum: req.body.memoNum },
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
        let writter = req.params.userId;
        // find 메서드는 정규식을 이용하여 검색
        const result = await memoModel.find({userId: writter, memoContext: new RegExp(searchWord, 'i')})
        
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
           { userId: req.body.userId, memoNum: req.body.memoNum }
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