const memoController = require('../../controller/memo');
const memoModel = require('../../models/Memo');
const httpMocks = require('node-mocks-http');
const memosFromDB = require('../data/memosFromDB.json');
const newMemo = require('../data/new-memo.json');
const Memo = require('../../models/Memo');

// 메모 모델 실행 함수는 jest에 의해 mocking 혹은 spying되어야 함
memoModel.create = jest.fn();
memoModel.find = jest.fn();
memoModel.update = jest.fn();
memoModel.findOneAndUpdate = jest.fn();

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

    req.body = newMemo;
    req.params.userid = "testUser";
    // moveMemo용 파라미터, 나중엔 body로 처리해야 할 것
    req.params.x = 70;
    req.params.y = 70;
    req.params.memoNum = 1;
})


describe("Create Memo with MemoController", () => {
    it("should have a createMemo function", () => {
        expect(typeof memoController.createMemo).toEqual("function");
    })
    
    it("should call MemoModel.create", async () => {
        await memoController.createMemo(req, res, next);
        expect(memoModel.create).toBeCalledWith(newMemo);
    })

    it("should return 201 response code", async () => {
        await memoController.createMemo(req, res, next);
        expect(res.statusCode).toEqual(201);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should return json body in response", async () => {
        memoModel.create.mockReturnValue(newMemo);
        await memoController.createMemo(req, res, next);
        expect(res._getJSONData()).toStrictEqual(newMemo);
    })

    it("should handle error", async () => {
        const errorMessage = { message : "memoNum must be unique value"};
        const rejectedPromise = Promise.reject(errorMessage);
        memoModel.create.mockReturnValue(rejectedPromise);
        await memoController.createMemo(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })
})

describe("Create Memo with MemoController", () => { 
    it("should have a getMemos function", () => {
        expect(typeof memoController.getMemos).toEqual("function");
    })

    it("should call find function", async () => {
        await memoController.getMemos(req, res, next);
        expect(memoModel.find).toHaveBeenCalledWith(req.params.userid);
    })

    it("should return 200 response", async () => {
        await memoController.getMemos(req, res, next);
        expect(res.statusCode).toEqual(200);
        expect(res._isEndCalled).toBeTruthy();
    })

    it("should return json body in response", async () => {
        memoModel.find.mockReturnValue(memosFromDB);
        await memoController.getMemos(req, res, next);
        expect(res._getJSONData()).toStrictEqual(memosFromDB);
    })

    it("should handle errors", async () => {
        const errorMessage = { message : "Failed to find memos from DB"};
        const rejectedPromise = Promise.reject(errorMessage);
        Memo.find.mockReturnValue(rejectedPromise);
        await memoController.getMemos(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})

const updatedMemo = [{ 
    "userid" : "testUser",
    "height": "250px", 
    "width": "250px",
    "x": 70, "y": 70, 
    "bgColor": "#EBF2B6", 
    "memoNum" : 1, "memoContext": "다이어트는 내일부터", 
    "memoCategory" : "workout",
    "memoLocked": true, "memoImport": false, 
    "zIndex": 51, "createDate": "12월 17일"}]

describe("User can move memo when they want", () => { 
    it("should have moveMemo function", () => {
        expect(typeof memoController.moveMemo).toEqual("function");
    })   

    it("should call findOneAndUpdate function", async () => {
        const searchFlag = { "$and": { "userid": req.params.userid, "memoNum": req.params.memoNum }};
        const updateMemo = { "$set": { "x": req.params.x, "y": req.params.y }}
        memoModel.findOneAndUpdate.mockReturnValue(updatedMemo)
        await memoController.moveMemo(req, res, next);
        expect(memoModel.findOneAndUpdate).toHaveBeenCalledWith(
            searchFlag, updateMemo,
            { new: true }
        )
    })

    it("should return json body and response code 200", async () => {
        const searchFlag = { "$and": { "userid": req.params.userid, "memoNum": req.params.memoNum }};
        const updateMemo = { "$set": { "x": req.params.x, "y": req.params.y }}
        memoModel.findOneAndUpdate.mockReturnValue(updatedMemo)
        await memoController.moveMemo(req, res, next);
        
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(updatedMemo);
    })

    it("should handle 404 when memo doesnt exsist in DB", async () => {
        memoModel.findOneAndUpdate.mockReturnValue(null);
        await memoController.moveMemo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should handle etc errors", async () => {
        const errorMessage = { message: "Couldnt change the location of memo"};
        const rejectedPromise = Promise.reject(errorMessage);
        memoModel.findOneAndUpdate.mockReturnValue(rejectedPromise);
        await memoController.moveMemo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
        
    })

})