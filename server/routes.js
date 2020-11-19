const router = require('express').Router();
const productController = require("./controller/products")

router.post('/', productController.createProduct);

module.exports = router;
// Router.use() requires a middleware function