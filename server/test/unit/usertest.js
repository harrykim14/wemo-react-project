const userController = require('../../controller/users');
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

describe("User Controller Create", () => {
    it("should have a createUser function", () => {
        expect(typeof userController.createUser).toEqual("function");
    })

    it("should call userModel.create", async () => {
        await userController.createUser(req, res, next);
        expect(userModel.create).toBeCalledWith(userinfo)
    })

    it("should return 201 response code", async () => {
        await userController.createUser(req, res, next);
        expect(res.statusCode).toBe(201);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should return json body in response", async () => {
        userModel.create.mockReturnValue(userinfo);
        await userController.createUser(req, res, next);
        expect(res._getJSONData()).toStrictEqual(userinfo);
    })

    it("should handle error", async () => {
        const errorMessage = { message : "Same username is already exsist" }
        const rejectedPromise = Promise.reject(errorMessage);
        userModel.create.mockReturnValue(rejectedPromise);
        await userController.createUser(req, res, next);
        expect(next).toBeCalledWith(errorMessage);
    })
})