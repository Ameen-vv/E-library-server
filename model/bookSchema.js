import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: String,
    subtitle: String,
    authors: String,
    publisher: String,
    pages: Number,
    year: Number,
    rating: Number,
    desc: String,
    price: Number,
    image: String,
         
});

const bookModel = mongoose.model('Book',bookSchema);
export default bookModel;
