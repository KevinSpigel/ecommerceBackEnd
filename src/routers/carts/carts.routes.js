const { Router } = require('express')
const CartsController = require('../../controllers/carts.controller')

const router = Router()

router.get('/', CartsController.getCarts)
router.get('/:cid', CartsController.getCartById)
router.post('/', CartsController.addCart)
router.post('/:cid/products/:pid', CartsController.addProductToCart)
router.put('/:cid', CartsController.updatePropertiesProducts)
router.put('/:cid/products/:pid', CartsController.updateCartProduct)
router.delete('/:cid/products/:pid', CartsController.deleteProductFromCart)
router.delete('/:cid', CartsController.deleteCart)

module.exports = router