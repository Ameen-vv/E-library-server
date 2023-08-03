import { generateToken } from "../Auth/JWT.js"
import userModel from "../model/userSchema.js"
import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'
import mongoose from "mongoose"



export const userRegister = (req, res) => {
    try {
        let { userName, password, email } = req.body;
        userModel.findOne({ email })
            .then((user) => {
                if (user) {
                    res.status(200).json({
                        registration: false,
                        message: 'user already exist with this email'
                    });
                } else {
                    bcrypt.hash(password, 10)
                        .then((hash) => {
                            const newUser = new userModel({
                                userName,
                                email,
                                password: hash,
                            });
                            newUser.save()
                                .then((user) => {
                                    const token = generateToken({
                                        userId: user._id
                                    });
                                    res.status(200).json({
                                        registration: true,
                                        token,
                                        message: 'Registration Success'
                                    });
                                });
                        });
                };
            });
    } catch (err) {
        res.status(500).json({
            message: 'server error'
        });
    }
}


export const signIn = (req, res) => {
    try {
        let { email, password } = req.body;
        userModel.findOne({ email })
            .then((user) => {
                if (user) {
                    bcrypt.compare(password, user.password, function (err, result) {
                        if (result) {
                            const token = generateToken({
                                userId: user._id
                            })
                            res.status(200).json({
                                logIn: true,
                                token,
                                message: 'Login success'
                            });
                        } else {
                            res.status(200).json({
                                logIn: false,
                                message: 'Incorrect Password'
                            });
                        }
                    })
                } else {
                    res.status(200).json({
                        logIn: false,
                        message: 'user do not exist please register'
                    });
                }
            })
    } catch (err) {
        res.status(500);
    }
}

export const userCheck = (req, res) => {
    try {
        let token = req.headers?.authorization;
        if (token) {
            jwt.verify(token, process.env.TOKEN_SECRET, (err, result) => {
                if (err) {
                    res.status(401).json({ authorization: false });
                } else {
                    userModel.findOne({ _id: result.userId }).then((user) => {
                        user ? res.status(200).json({ authorization: true })
                            : res.status(401).json({ authorization: false });
                    })
                }
            })
        } else {
            res.status(401)
                .json({ authorization: false });
        }
    } catch (err) {
        res.status(500);
    }
}

export const addToCart = async (req, res) => {
    try {
        let proId = req.params.proId;
        let userId = req.userLogged;
        let user = await userModel.findById(userId);
        let proCheck = user.cart.find((item) => item.product == proId);
        if (proCheck) {
            proCheck.quantity += 1;
        } else {
            user.cart.push({
                product: proId,
                quantity: 1
            });
        };

        await user.save();
        res.status(200)
            .json({ ok: true, message: 'added to cart' });

    }
    catch (err) {
        res.status(500);
    }
}


export const getCartItems = (req, res) => {
    try {
        userModel.findById(req.userLogged)
            .populate('cart.product', 'title price price image _id subtitle')
            .then((user) => {
                res.status(200)
                    .json({ data: user.cart });
            })
    }
    catch (err) {
        res.status(500);
    }
};

export const removeFromCart = (req, res) => {
    try {
        let proId = req.params.proId;
        let userId = req.userLogged;
        let action = req.params.operation;

        userModel.findById(userId)
            .then((user) => {
                let cart = user.cart.filter((item) => {
                    if(item.product._id == proId){
                        if(action = 'del'){
                            return false;
                        }else{
                            if(item.quantity <= 1){
                                return false;
                            }else{
                                item.quantity -= 1;
                                return true;
                            }
                        }
                    }else{
                        return true;
                    }
                })
                user.cart = cart;
                user.save()
                    .then(() => {
                        res.status(200)
                            .json({ok:true,message:'removed from cart'});
                    })
            })
    }
    catch (err) {
        res.status(500);
    }
}



