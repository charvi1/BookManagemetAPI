const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    genre: {
        type: String,
        default: ''
    },
    publicationYear: {
        type: Number,
        default: null
    },
    image: {
        type: String,
        default: 'https://via.placeholder.com/150'
    },
    isbn: {
        type: String,
        unique: true,
        default: ''
    },
    description: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Book', bookSchema);
