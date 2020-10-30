// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

// define the book model
let Book = require('../models/books');

/* GET books List page. READ */
router.get('/', (req, res, next) => {
  // find all books in the books collection
  Book.find( (err, books) => {
    if (err) {
      return console.error(err);
    }
    else {
      console.log(books)
      res.render('books/index', {
        title: 'Books',
        books: books
      });
    }
  });

});

//  GET the Book Details page in order to add a new Book
router.get('/add', (req, res, next) => {
  res.render('books/details', {
    title: 'books' ,books: {
      Title: '',
      Description: '',
      Price: '',
      Author: '',
      Genre: ''
    }, 
      
});
});

// POST process the Book Details page and create a new Book - CREATE
router.post('/add',async (req, res, next) => {
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
router.get('/details/:id',async (req, res, next) => {
  const _id = req.params.id;
  try {
    const books = await Book.findById(_id);
    if (!books) {
      return res.status(404).send('Book not found.');
    }
    res.render('books/details', { title: 'Edit Book', books });
  } catch (e) {
    console.log(e)
    res.status(500).send();
  }
});

// POST - process the information passed from the details form and update the document
router.post('/details/:id',async (req, res, next) => {
  const _id = req.params.id;
  try {
    const book = await Book.findByIdAndUpdate(_id, {
      Title: req.body.Title,
      Description: req.body.Description,
      Price: req.body.Price,
      Author: req.body.Author,
      Genre: req.body.Genre
    })
    res.redirect('/books');
  } catch (e) {
    console.log(e);
    res.end();
  }
});

// GET - process the delete by user id
router.get('/delete/:id', async(req, res, next) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    res.redirect('/books')
  } catch (e) {
    console.log(e);
    res.end();
  }
});


module.exports = router;
