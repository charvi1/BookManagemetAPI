const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const basicAuth = require('../middleware/auth');
router.use(basicAuth);
// POST /books: Create a new book entry
router.post('/', async (req, res) => {
    try {
        const { title, author, genre, publicationYear, image, isbn, description } = req.body;

        if (!title || !author) {
            return res.status(400).json({ message: 'Title and Author are required' });
        }

        const newBook = new Book({
            title,
            author,
            genre,
            publicationYear,
            image,
            isbn,
            description
        });

        await newBook.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET /books: Retrieve a list of all books, with optional filtering and pagination
router.get('/', async (req, res) => {
    try {
        const { genre, author, publicationYear, page = 1, limit = 10 } = req.query;
        let query = {};

        if (genre) query.genre = genre;
        if (author) query.author = author;
        if (publicationYear) query.publicationYear = publicationYear;

        const books = await Book.find(query)
            .skip((page - 1) * limit)  // Skip documents based on the page number
            .limit(parseInt(limit))    // Limit the number of documents per page
            .exec();

        const totalBooks = await Book.countDocuments(query);  // Total number of books for pagination

        res.status(200).json({
            totalBooks,
            totalPages: Math.ceil(totalBooks / limit),
            currentPage: parseInt(page),
            books
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// GET /search: Search for books by title, author, or ISBN
router.get('/search', async (req, res) => {
    try {
        const { title, author, isbn } = req.query;
        let query = {};

        if (title) query.title = { $regex: title, $options: 'i' };  // Case-insensitive search
        if (author) query.author = { $regex: author, $options: 'i' };
        if (isbn) query.isbn = isbn;

        const books = await Book.find(query);
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// GET /books/:id: Retrieve the details of a single book by its ID
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// PUT /books/:id: Update an existing book's details
router.put('/:id', async (req, res) => {
    try {
        const { title, author, genre, publicationYear, image, isbn, description } = req.body;

        const updatedBook = await Book.findByIdAndUpdate(
            req.params.id,
            { title, author, genre, publicationYear, image, isbn, description },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(updatedBook);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE /books/:id: Remove a book from the collection
router.delete('/:id', async (req, res) => {
    try {
        const deletedBook = await Book.findByIdAndDelete(req.params.id);

        if (!deletedBook) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
