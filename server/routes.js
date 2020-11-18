const router = require('express').Router();
const productController = require("./controller/products")

router.get('/', productController.basic)

module.exports = router;
// Router.use() requires a middleware function