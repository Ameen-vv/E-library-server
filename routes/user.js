import express from 'express';
import {   addToCart, getCartItems, removeFromCart, signIn, userCheck, userRegister } from '../controllers/userController.js';
import { userAuth } from '../middlewares/auth.js';
const router = express.Router();


router.post('/register',userRegister);
router.post('/signIn',signIn);
router.get('/authorize',userCheck);
router.get('/addToCart/:proId',userAuth,addToCart);
router.get('/getCartItems',userAuth,getCartItems);
router.get('/removeCartItem/:proId',userAuth,removeFromCart);




export default router;