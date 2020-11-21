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

it ("should return 500 on POST /product", async () => {
    const response = await request(app)
    .post('/product')
    .send({ name : "phone"})
    expect(response.statusCode).toBe(500);
    console.log('response.body', response.body);
    expect(response.body).toStrictEqual({ message : "Product validation failed: description: Path `description` is required."})
})