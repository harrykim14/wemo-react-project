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
const allProducts = require('../data/all-products.json');
const idProduct = require('../data/id-product.json');

productModel.create= jest.fn();
productModel.find = jest.fn();
productModel.findById = jest.fn();
productModel.findByIdAndUpdate = jest.fn();
productModel.findByIdAndDelete = jest.fn();
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

    it('should return 200 response', async () => {
        await productController.getProduct(req, res, next);
        expect(res.statusCode).toEqual(200);
        expect(res._isEndCalled).toBeTruthy();
    })

    it('shuold return json body in response', async () => {
        productModel.find.mockReturnValue(allProducts);
        await productController.getProduct(req, res, next);
        expect(res._getJSONData()).toStrictEqual(allProducts);
    })

    it("should handle errors", async () => {
        const errorMessage = { message : "Finding product data error"};
        // 1. 임의적으로 에러 메세지를 생성
        const rejectedPromise = Promise.reject(errorMessage);
        // 2. 에러 메세지를 포함한 reject Promise 객체를 생성
        productModel.find.mockReturnValue(rejectedPromise);
        // 3. 모델의 기능(create, find 등)을 mockReturnValue로 모방
        await productController.getProduct(req, res, next);
        // 4. 비동기 처리되는 컨트롤러 실행
        expect(next).toHaveBeenCalledWith(errorMessage);
        // 5. 예상되는 에러 메세지와 함께 호출되는지 확인
    })
})

describe("Product Controller GetById", () => {
    it("should have a getProductById", () => {
        expect(typeof productController.getProductById).toBe("function");
    })

    it("should call ProductModel.findById", async () => {
        req.params.productId = idProduct;
        await productController.getProductById(req, res, next);
        expect(productModel.findById).toBeCalledWith(idProduct);
    })

    it ("should return json body and response code 200", async () => {
        productModel.findById.mockReturnValue(newProduct);
        await productController.getProductById(req, res, next);
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(newProduct);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should return 404 when item doesnt exist", async () => {
        productModel.findById.mockReturnValue(null);
        await productController.getProductById(req, res, next);
        expect (res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })
    
    it("should handle errors", async () => {
        const errorMessage = { message : "error"}
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findById.mockReturnValue(rejectedPromise);
        await productController.getProductById(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})

const updatedProduct = { name : "updated name", description : "updated description" };

describe("Product Controller Update", () => {
    it ("should have an updateProduct function", () =>{
        expect(typeof productController.updateProduct).toBe("function");
    })

    it("should call productModel.findByIdAndUpdate", async () => {
        req.params.productId = idProduct;
        req.body = updatedProduct;
        await productController.updateProduct(req, res, next);
        expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
            idProduct, updatedProduct, {new : true}
        )
    })

    it("should return json body and response code 200", async () => {
        req.params.productId = idProduct;
        req.body = updatedProduct;
        productModel.findByIdAndUpdate.mockReturnValue(updatedProduct);
        await productController.updateProduct(req, res, next);

        expect(res._isEndCalled()).toBeTruthy();
        expect(res.statusCode).toBe(200);
        expect(res._getJSONData()).toStrictEqual(updatedProduct);
    })

    it("should handle 404 when item doesnt exsist", async () => {
        productModel.findByIdAndUpdate.mockReturnValue(null);
        await productController.updateProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
        // 컨트롤러에서 .send()로 error를 보내야 truthy 함수에서 true를 받아 처리할 수 있다
    })

    it ("should handle errors", async () => {
        const errorMessage = { message : "update error"};
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndUpdate.mockReturnValue(rejectedPromise);
        await productController.updateProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})

describe('Product Controller Delete', () => {

    it("should have delete product function", () => {
        expect(typeof productController.deleteProduct).toBe("function");
    })
    
    it("should call productModel.findByIdAndDelete", async () => {
        req.params.productId = idProduct;
        await productController.deleteProduct(req, res, next);
        expect(productModel.findByIdAndDelete).toHaveBeenCalledWith(idProduct);
    })

    it("should return 200 response and json body", async () => {
        let deletedProduct = {
            name : "Deleted Product",
            description : "Deleted Product Description"
        }
        productModel.findByIdAndDelete.mockReturnValue(deletedProduct)
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(deletedProduct);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should return handle 404 when item doesnt exsist", async () => {
        productModel.findByIdAndDelete.mockReturnValue(null);
        await productController.deleteProduct(req, res, next);
        expect(res.statusCode).toBe(404);
        expect(res._isEndCalled()).toBeTruthy();
    })

    it("should handle errors", async () => {
        const errorMessage = { message : "Product Delete Error"};
        const rejectedPromise = Promise.reject(errorMessage);
        productModel.findByIdAndDelete.mockReturnValue(rejectedPromise);
        await productController.deleteProduct(req, res, next);
        expect(next).toHaveBeenCalledWith(errorMessage);
    })
})
