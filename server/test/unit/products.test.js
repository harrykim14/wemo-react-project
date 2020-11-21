// Jest가 Test파일을 찾을 때에는 {filename}.test.js, {filename}.spec.js 혹은 프로젝트 내 tests 폴더 내 모든 파일을 검색함

describe("Calculation", () => {
    test('two plus two is four', () => {
        expect(2 + 2).toBe(4);
    })
    // PASS  test/unit/products.test.js
    // √ two plus two is four (1 ms)
    
    test('two plus two is not five', () => {
        expect(2 + 2).not.toBe(5);
    })
})

/*
* 테스트문 기본 작성법

test("테스트 설명", () => {
  expect("검증 대상").toXxx("기대 결과")
})

*/

const productController = require('../../controller/products');
const productModel = require('../../models/Product');
const httpMocks = require('node-mocks-http');
const newProduct = require('../data/new-product.json');

productModel.create= jest.fn();
productModel.find = jest.fn();
// Mocking function으로 대체하기

let req, res, next;
beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
      // httpMocks를 사용하여 request, response를 생성
    next = jest.fn();

    req.body = newProduct;
})

describe("Product Controller Create", () => {
  it("should have a createProduct function", () => {
      expect(typeof productController.createProduct).toEqual("function");
  });

  // toBe() 함수는 숫자나 문자와 같은 객체가 아닌 기본형(primitive) 값을 비교할 때 사용됩
  // 객체를 검증할 때엔 toEqual을 사용하자
  
  it("should call ProductModel.create", async () => {       
      await productController.createProduct(req, res, next);
      expect(productModel.create).toBeCalledWith(newProduct);
  });

  it("should return 201 response code", async () =>{
      await productController.createProduct(req, res, next);
      expect(res.statusCode).toBe(201);
      expect(res._isEndCalled()).toBeTruthy();
      // _isEndCalled는 httpMocks에서 제공하는 메서드
      // .toBeTruthy는 해당 상태를 boolean값으로 반환함
      // 자바스크립트의 특성상 boolean값 뿐만아니라 1값이 true이고 0값이 false인 것을 이용해서도 toBeTruthy()를 사용할 수도 있다
  });

  it("should return json body in response", async () =>{
      productModel.create.mockReturnValue(newProduct);
      await productController.createProduct(req, res, next);
      expect(res._getJSONData()).toStrictEqual(newProduct);
      // _getJSONData는 httpMocks에서 제공하는 메서드로 JSON.parse(response._getData())의 축약형임
  });

  it("should handle error", async () => {
      // 몽고 DB로 처리하는 부분은 정상적으로 처리(에러 발생 또한 정상적으로 몽고 DB에서 처리하는 것)한다고 가정
      const errorMessage = { message : "description property missing"};
      // 에러 메세지는 임의로 생성
      const rejectedPromise = Promise.reject(errorMessage);
      // 비동기 결과값은 성공시에 Promise.resolve로, 실패하면 Promise.reject로 처리된다
      productModel.create.mockReturnValue(rejectedPromise);
      await productController.createProduct(req, res, next);
      expect(next).toBeCalledWith(errorMessage);
  })
})

describe("Product Controller Get", () => {
    it("should have a getProducts functions", () => {
        expect(typeof productController.getProduct).toBe("function");
    })

    it("should call ProductModel.find({})", async () => {
        await productController.getProduct(req, res, next);
        expect(productModel.find).toHaveBeenCalledWith({});
    })
})