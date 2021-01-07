const router = require('express').Router();
// const productController = require("./controller/products");
const userController = require('./controller/users');
const memoController = require('./controller/memo');
// const { route } = require('./server');

/*
router.post('/', productController.createProduct);
router.get('/', productController.getProduct);
router.get('/:productId', productController.getProductById);
router.put('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);
*/
router.post('/isUniqueId', userController.isUniqueId)
router.post('/userRegister', userController.createUser);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.post('/createMemo', memoController.createMemo); // checked
router.get('/getMemos/:userId', memoController.getMemos); // checked
router.post('/findWrittenMemo/:s', memoController.findWrittenMemo); // checked
router.post('/moveMemo', memoController.moveMemo); // checked
router.post('/resizeMemo', memoController.resizeMemo);
router.post('/rewriteMemo', memoController.rewriteMemo);
router.post('/paintMemo', memoController.paintMemo);
router.post('/lockOrUnlock', memoController.changeLockStateMemo);
router.post('/markOrUnmark', memoController.changeMarkStateMemo);
router.post('/throwOrRestore', memoController.throwOrRestoreMemo);
router.delete('/deleteMemo/:memoId', memoController.deleteMemo);


module.exports = router;
// Router.use() requires a middleware function