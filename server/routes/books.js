// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  res.render('books/add', {
    title: 'books', books: {
      title: '',
      description: '',
      price: '',
      author: '',
      genre: ''
    }
});
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add', (req, res, next) => {
  const book = await new Book(req.body);
  console.log(book);
  try {
    await book.save();
    res.redirect('/books');
  } catch (e) {
    console.log(e);
    res.end();
  }
});

// GET the Book Details page in order to edit an existing Book
router.get('/:id', (req, res, next) => {
  const _id = req.params.id;
  try {
    const books = await Book.findById(_id);
    if (!books) {
      return res.status(404).send('Book not found.');
    }
    res.render('books/details', { title: 'Edit Book', books });
  } catch (e) {
    res.status(500).send();
  }
});

// POST - process the information passed from the details form and update the document
router.post('/:id', (req, res, next) => {
  const _id = req.params.id;
  try {
    const book = await Book.findByIdAndUpdate(_id, {
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      author: req.body.author,
      genre: req.body.genre
    })
    res.redirect('/books');
  } catch (e) {
    console.log(e);
    res.end();
  }
});

// GET - process the delete by user id
router.get('/delete/:id', (req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books')
  } catch (e) {
    console.log(e);
    res.end();
  }
});


module.exports = router;
