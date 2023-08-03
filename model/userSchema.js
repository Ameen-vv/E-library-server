import mongoose from "mongoose";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const cartItemSchema = new Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    },
    quantity: {
        type: Number,
        min: 1,
        default: 1, 
    },
});

const userSchema = new Schema({
    userName:String,
    email:String,
    password:String,
    cart: {
        type: [cartItemSchema],
        default: [],
    },

});


const userModel = mongoose.model('User',userSchema);
export default userModel;