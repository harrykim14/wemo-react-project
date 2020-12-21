const router = require('express').Router();
// const productController = require("./controller/products");
const userController = require('./controller/users');
const memoController = require('./controller/memo');
const { route } = require('./server');

/*
router.post('/', productController.createProduct);
router.get('/', productController.getProduct);
router.get('/:productId', productController.getProductById);
router.put('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);
*/
router.post('/userRegister', userController.createUser);

router.post('/createMemo', memoController.createMemo);
router.get('/getMemos/:userid', memoController.getMemos);
router.post('/moveMemo', memoController.moveMemo);


module.exports = router;
// Router.use() requires a middleware function