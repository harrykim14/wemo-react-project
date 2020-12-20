const memoController = require('../../controller/memo');
const memoModel = require('../../models/Memo');
const httpMocks = require('node-mocks-http');
const memosFromDB = require('../data/memosFromDB.json');
const newMemo = require('../data/new-memo.json');

// 메모 모델 실행 함수는 jest에 의해 mocking 혹은 spying되어야 함
memoModel.create = jest.fn();
memoModel.find = jest.fn();

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

    req.body = newMemo;
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
