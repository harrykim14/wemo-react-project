const request = require('supertest');
const app = require('../../server');

let newProductData = require('../data/new-product.json');
let firstProduct, secondProduct;
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
    expect(response.body).toStrictEqual({ message : "Product validation failed: description: Path `description` is required."})
})

it("GET /product", async () => {
    const response = await request(app).get('/product');
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
    expect(response.body[0].name).toBeDefined();
    expect(response.body[0].description).toBeDefined();
    firstProduct = response.body[0];
    secondProduct = response.body[1];
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

it("PUT /product/:productId", async () => {
    const res = await request(app)
                      .put(`/product/${firstProduct._id}`)
                      .send({ name : "Updated Product Name", description : "Updated Product Desicription"})
    expect(res.statusCode).toBe(200);
    expect(res.body.name).toEqual("Updated Product Name");
    expect(res.body.description).toEqual("Updated Product Desicription");
})

it("PUT id doesnt exist /product/:productId", async () => {
    const res = await request(app).put('/product/5fb5f297826f6024fc5e46bc');
    expect(res.statusCode).toBe(404);
})

it("DELETE /product/:productId", async () => {
    const res = await request(app)
                .delete(`/product/${secondProduct._id}`)
                .send();
    expect(res.statusCode).toBe(200);
})

it("DELETE /product/:prlductId", async () => {
    const res = await request(app)
                     .delete('/product/5fb5f297826f6024fc5e46bc')
                     .send();
    expect(res.statusCode).toBe(404);
})