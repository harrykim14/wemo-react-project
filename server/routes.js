const router = require('express').Router();
const productController = require("./controller/products");
const { route } = require('./server');

router.post('/', productController.createProduct);
router.get('/', productController.getProduct);
router.get('/:productId', productController.getProductById);

module.exports = router;
// Router.use() requires a middleware function