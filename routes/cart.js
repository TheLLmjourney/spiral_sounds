import express from 'express'
import { cartController, getAll, getCartCount } from '../controllers/cartController.js'


export const cartRouter = express.Router()

cartRouter.post('/add', cartController)
cartRouter.get('/cart-count', getCartCount)
cartRouter.get('/', getAll)