import bookModel from "../model/bookSchema.js"


export const getAllBooks = (req, res) => {
    try {
        bookModel
            .find({}, {
                _id: 1,
                title: 1,
                subtitle: 1,
                price: 1,
                image: 1
            }).then((response) => {
                res.status(200).json({ data: response });
            });
    } catch (err) {
        res.status(500);
    }
}

export const getBookDetails = (req, res) => {
    try {
        const id = req.params.id;
        bookModel
            .findById(id)
            .then((response) => {
                res.status(200).json({ data: response });
            })
    } catch (err) {
        res.status(500);
    }
}