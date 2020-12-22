const memoController = require('../../controller/memo');
const memoModel = require('../../models/Memo');
const httpMocks = require('node-mocks-http');
const memosFromDB = require('../data/memosFromDB.json');
const newMemo = require('../data/new-memo.json');

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
    req.params.userId = "testUser";

    // moveMemo용 파라미터, 나중엔 body로 처리해야 할 것
    req.params.x = 70;
    req.params.y = 70;
    req.params.memoNum = 1;

    // resizeMemo용 파라미터
    req.params.height = '300px';
    req.params.width = '300px'; 

    // rewriteMemo용 파라미터
    req.params.memoContext = "오늘은 운동을 좀 할까요";

    // paintMemo용 파라미터
    req.params.bgColor = "#b6f2cb";

    // lockMemo용 파라미터
    req.params.memoLocked = true;

    // markMemo용 파라미터
    req.params.memoImport = true;

    // throwOrRestore용 파라미터
    req.params.memoTrash = true;
})

/* 새 메모를 클릭했을 때 새로 메모를 생성하는 api 테스트 코드 */
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

/* 로그인한 특정 사용자가 쓴 메모를 전부 가져오는 api 테스트 코드 */
describe("Get written Memo with MemoController", () => { 
    it("should have a getMemos function", () => {
        expect(typeof memoController.getMemos).toEqual("function");
    })

    it("should call find function", async () => {
        await memoController.getMemos(req, res, next);
        expect(memoModel.find).toHaveBeenCalledWith(req.params.userId);
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
        memoModel.find.mockReturnValue(rejectedPromise);
        await memoController.getMemos(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})

/* 드래그로 메모의 위치변경 api 테스트 코드 */
const movedMemo = [{ 
    "userId" : "testUser",
    "height": "250px", 
    "width": "250px",
    "x": 70, "y": 70, 
    "bgColor": "#EBF2B6", 
    "memoNum" : 1, "memoContext": "다이어트는 내일부터", 
    "memoCategory" : "workout", "memoTrash" : false,
    "memoLocked": true, "memoImport": false, 
    "zIndex": 51, "createDate": "12월 17일"}]

describe("User can move memo when they want", () => { 

    it("should have moveMemo function", () => {
        expect(typeof memoController.moveMemo).toEqual("function");
    })   

    it("should call findOneAndUpdate function", async () => {
        let searchFlag = { "$and": { "userId": req.params.userId, "memoNum": req.params.memoNum }};
        let willMove = { "$set": { "x": req.params.x, "y": req.params.y }}
        memoModel.findOneAndUpdate.mockReturnValue(movedMemo)
        await memoController.moveMemo(req, res, next);
        expect(memoModel.findOneAndUpdate).toHaveBeenCalledWith(
            searchFlag, willMove,
            { new: true }
        )
    })

    it("should return json body and response code 200", async () => {
        memoModel.findOneAndUpdate.mockReturnValue(movedMemo)
        await memoController.moveMemo(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(movedMemo);
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

/* 메모 사이즈 변경 api 테스트 코드 */
const resizedMemo = [{ 
    "userId" : "testUser",
    "height": "300px", 
    "width": "300px",
    "x": 300, "y": 70, 
    "bgColor": "#EBF2B6", 
    "memoNum" : 1, "memoContext": "다이어트는 내일부터", 
    "memoCategory" : "workout", "memoTrash" : false,
    "memoLocked": true, "memoImport": false, 
    "zIndex": 51, "createDate": "12월 17일"}]

describe("User can resize memo when they want", () => {
    it("should have resizeMemo function", () => {
        expect(typeof memoController.resizeMemo).toEqual("function");
    })

    it("should call findOneAndUpdate function", async () => {
        let searchFlag = { "$and": { "userId": req.params.userId, "memoNum": req.params.memoNum }};
        let willResize = { "$set": { "height": req.params.height, "width": req.params.width }}
        memoModel.findOneAndUpdate.mockReturnValue(resizedMemo)
        await memoController.resizeMemo(req, res, next);
        expect(memoModel.findOneAndUpdate).toHaveBeenCalledWith(
            searchFlag, willResize,
            { new: true }
        )
    })

    it("should return json body and response code 200", async () => {
        memoModel.findOneAndUpdate.mockReturnValue(resizedMemo)
        await memoController.resizeMemo(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(resizedMemo);
    })

    it("should handle 404 when memo doesnt exsist in DB", async () => {
        memoModel.findOneAndUpdate.mockReturnValue(null);
        await memoController.resizeMemo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should handle etc errors", async () => {
        const errorMessage = { message: "Couldnt change the size of memo"};
        const rejectedPromise = Promise.reject(errorMessage);
        memoModel.findOneAndUpdate.mockReturnValue(rejectedPromise);
        await memoController.resizeMemo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })    
})

/* 메모 내용 수정 api 테스트 코드 */
const revicedMemo = [{ 
    "userId" : "testUser",
    "height": "250px", 
    "width": "250px",
    "x": 300, "y": 70, 
    "bgColor": "#EBF2B6", 
    "memoNum" : 1, "memoContext": "오늘은 운동을 좀 할까요", 
    "memoCategory" : "workout", "memoTrash" : false,
    "memoLocked": true, "memoImport": false, 
    "zIndex": 51, "createDate": "12월 17일"}]

describe("User can rewrite memo context", () => {

    it("should have rewriteMemo function", () => {
        expect(typeof memoController.rewriteMemo).toEqual("function");
    })

    it("should call findOneAndUpdate function", async () => {
        let searchFlag = { "$and": { "userId": req.params.userId, "memoNum": req.params.memoNum }};
        let reviseMemo = { "$set": { "memoContext": req.params.memoContext }}
        memoModel.findOneAndUpdate.mockReturnValue(revicedMemo)
        await memoController.rewriteMemo(req, res, next);
        expect(memoModel.findOneAndUpdate).toHaveBeenCalledWith(
            searchFlag, reviseMemo,
            { new: true }
        )
    })

    it("should return json body and response code 200", async () => {
        memoModel.findOneAndUpdate.mockReturnValue(revicedMemo)
        await memoController.resizeMemo(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(revicedMemo);
    })

    it("should handle 404 when memo doesnt exsist in DB", async () => {
        memoModel.findOneAndUpdate.mockReturnValue(null);
        await memoController.resizeMemo(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should handle etc errors", async () => {
        const errorMessage = { message: "Couldnt change the context of memo"};
        const rejectedPromise = Promise.reject(errorMessage);
        memoModel.findOneAndUpdate.mockReturnValue(rejectedPromise);
        await memoController.resizeMemo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })  
})

/* 메모 배경색 바꾸는 기능 테스트 코드 */
const bgChangedMemo = [{ 
    "userId" : "testUser",
    "height": "250px", 
    "width": "250px",
    "x": 300, "y": 70, 
    "bgColor": "#b6f2cb", 
    "memoNum" : 1, "memoContext": "다이어트는 내일부터", 
    "memoCategory" : "workout", "memoTrash" : false,
    "memoLocked": true, "memoImport": false, 
    "zIndex": 51, "createDate": "12월 17일"}]

describe("User can change background-color of memo", () => {
    it("should have paintMemo function", () => {
        expect(typeof memoController.paintMemo).toEqual("function");
    })

    it("should call findOneAndUpdate function", async () => {
        let searchFlag = { "$and": { "userId": req.params.userId, "memoNum": req.params.memoNum }};
        let paintBgColor = { "$set": { "bgColor": req.params.bgColor }}
        memoModel.findOneAndUpdate.mockReturnValue(bgChangedMemo)
        await memoController.paintMemo(req, res, next);
        expect(memoModel.findOneAndUpdate).toHaveBeenCalledWith(
            searchFlag, paintBgColor,
            { new: true }
        )
    })

    it("should return json body and response code 200", async () => {
        memoModel.findOneAndUpdate.mockReturnValue(bgChangedMemo);
        await memoController.paintMemo(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(bgChangedMemo);
    })

    it("should handle etc errors", async () => {
        const errorMessage = { message: "Couldnt change background color of memo"};
        const rejectedPromise = Promise.reject(errorMessage);
        memoModel.findOneAndUpdate.mockReturnValue(rejectedPromise);
        await memoController.paintMemo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})

/* 메모 잠금 & 잠금해제 테스트 코드 */

const lockedMemo = [{ 
    "userId" : "testUser",
    "height": "250px", 
    "width": "250px",
    "x": 300, "y": 70, 
    "bgColor": "#EBF2B6", 
    "memoNum" : 1, "memoContext": "다이어트는 내일부터", 
    "memoCategory" : "workout", "memoTrash" : false,
    "memoLocked": true, "memoImport": false, 
    "zIndex": 51, "createDate": "12월 17일"}]

describe("User can lock or unlock memo which was written", () => {
    it("should have changeLockStateMemo function", () => {
        expect(typeof memoController.changeLockStateMemo).toEqual("function");
    })

    it("should call findOneAndUpdate function", async () => {
        let searchFlag = { "$and": { "userId": req.params.userId, "memoNum": req.params.memoNum }};
        let unlockMemo = { "$set": { "memoLocked": req.params.memoLocked }};
        memoModel.findOneAndUpdate.mockReturnValue(lockedMemo)
        await memoController.changeLockStateMemo(req, res, next);
        expect(memoModel.findOneAndUpdate).toHaveBeenCalledWith(
            searchFlag, unlockMemo,
            { new: true}
        )
    })

    it("should return json body and response code 200", async () => {
        memoModel.findOneAndUpdate.mockReturnValue(lockedMemo);
        await memoController.changeLockStateMemo(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(lockedMemo);
    })

    it("should handle etc errors", async () => {
        const errorMessage = { message: "Couldnt change lock state of memo"};
        const rejectedPromise = Promise.reject(errorMessage);
        memoModel.findOneAndUpdate.mockReturnValue(rejectedPromise);
        await memoController.changeLockStateMemo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})

/* 메모 보관함 & 보관함에서 제거 테스트 코드 */

const importantMemo = [{ 
    "userId" : "testUser",
    "height": "250px", 
    "width": "250px",
    "x": 300, "y": 70, 
    "bgColor": "#EBF2B6", 
    "memoNum" : 1, "memoContext": "다이어트는 내일부터", 
    "memoCategory" : "workout", "memoTrash" : false,
    "memoLocked": true, "memoImport": true, 
    "zIndex": 51, "createDate": "12월 17일"}]

describe("User can mark the memo by clicking star mark", () => {
    it("should have changeMarkStateMemo function", () => {
        expect(typeof memoController.changeMarkStateMemo).toEqual("function");
    })

    it("should call findOneAndUpdate function", async () => {
        let searchFlag = { "$and": { "userId": req.params.userId, "memoNum":req.params.memoNum }};
        let unmarkMemo = { "$set": { "memoImport": req.params.memoImport }};
        memoModel.findOneAndUpdate.mockReturnValue(importantMemo);
        await memoController.changeMarkStateMemo(req, res, next);
        expect(memoModel.findOneAndUpdate).toHaveBeenCalledWith(
            searchFlag, unmarkMemo,
            { new: true }
        )
    })

    it("should return json body and response code 200", async () => {
        memoModel.findOneAndUpdate.mockReturnValue(importantMemo);
        await memoController.changeMarkStateMemo(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(importantMemo);
    })

    it("should handle etc errors", async () => {
        const errorMessage = { message: "Couldnt change mark state of memo"}
        const rejectedPromise = Promise.reject(errorMessage);
        memoModel.findOneAndUpdate.mockReturnValue(rejectedPromise);
        await memoController.changeMarkStateMemo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})

/* 메모 휴지통 & 복구 코드 */
const thrownMemo = [{ 
    "userId" : "testUser",
    "height": "250px", 
    "width": "250px",
    "x": 300, "y": 70, 
    "bgColor": "#EBF2B6", 
    "memoNum" : 1, "memoContext": "다이어트는 내일부터", 
    "memoCategory" : "workout", "memoTrash" : false,
    "memoLocked": true, "memoImport": true, 
    "zIndex": 51, "createDate": "12월 17일"}]

describe("Memo can be delete or restore", () => {
    it("should have throwOrRestoreMemo function", () => {
        expect(typeof memoController.throwOrRestoreMemo).toEqual("function");
    })

    it("should call findOneAndUpdate function", async () => {
        let searchFlag = { "$and": { "userId": req.params.userId, "memoNum": req.params.memoNum }}
        let memoToTrash = { "$set": {"memoTrash": req.params.memoTrash }};
        memoModel.findOneAndUpdate.mockReturnValue(thrownMemo);
        await memoController.throwOrRestoreMemo(req, res, next);
        expect(memoModel.findOneAndUpdate).toHaveBeenCalledWith(
            searchFlag, memoToTrash,
            { new: true }
        )
    })

    it("should send JSON body in response", async () => {
        memoModel.findOneAndUpdate.mockReturnValue(thrownMemo);
        await memoController.throwOrRestoreMemo(req, res, next);
        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toEqual(200);
        expect(res._getJSONData()).toStrictEqual(thrownMemo);
    })

    it("should handle errors", async () => {
        const errorMessage = { message : "Couldnt move memo to trash" };
        const rejectedPromise = Promise.reject(errorMessage);
        memoModel.findOneAndUpdate.mockReturnValue(rejectedPromise);
        await memoController.throwOrRestoreMemo(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})

/* 메모 내용을 기반으로한 검색 테스트 코드 */