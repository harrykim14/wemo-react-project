const request = require('supertest');
const app = require('../../server');

let newProductData = require('../data/new-product.json');
let firstProduct;
/*

{
    "name" : "Memo",
    "description" : "Sample Product",
    "price" : 10000
}

*/

it ("POST /product", async () => {
    const response = await request(app)
        .post('/product')
        .send(newProductData);
    expect(response.statusCode).toEqual(201)
    expect(response.body.name).toEqual("Memo");
    expect(response.body.description).toEqual("Sample Product");

})

it ("should return 500 on POST /product", async () => {
    const response = await request(app)
    .post('/product')
    .send({ name : "phone"})
    expect(response.statusCode).toBe(500);
    console.log('response.body', response.body);
    expect(response.body).toStrictEqual({ message : "Product validation failed: description: Path `description` is required."})
})

it("GET /product", async () => {
    const response = await request(app).get('/product');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    firstProduct = response.body[0]
})

it("GET /product/:productId", async () => {
    const response = await request(app).get(`/product/${firstProduct._id}`)
    expect(response.statusCode).toBe(200);
    expect(response.body.name).toEqual(firstProduct.name);
    expect(response.body.description).toEqual(firstProduct.description);
})

it("GET id doesnt exist /product/:productId", async () => {
    const response = await request(app).get('/product/5fb5f297826f6024fc5e46bc')
    expect(response.statusCode).toBe(404);
})