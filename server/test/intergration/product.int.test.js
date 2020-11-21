const request = require('supertest');
const app = require('../../server');

let newProductData = require('../data/new-product.json');

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