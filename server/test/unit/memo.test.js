const memoController = require('../../controller/memo');
const userModel = require('../../models/Users');
const httpMocks = require('node-mocks-http');
const userinfo = require('../data/userinfo.json')

userModel.create = jest.fn();

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    next = jest.fn();

    req.body = userinfo;
})

describe("Create Memo with MemoController", () => {
    it("should have a createMemo function", () => {
        expect(typeof memoController.createMemo).toEqual("function");
    })
})
