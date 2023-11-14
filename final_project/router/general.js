const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.query.username;
    const password = req.query.password;
  
    if(username && password) {
      if(!isValid(username)) {
        users.push({
          "username": username, 
          "password": password
        });
        return res.status(200).json({message: "User added successfully"});
      }
      return res.status(200).json({message: "User already exist"});
    } else {
      return res.status(200).json({message: "username &/ password not provided"});
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    res.status(200).json({ message: books });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  res.status(200).send(books[req.params.isbn]);
  //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    res.status(200).send(Object.values(books).filter((book) => book.author === req.params.author));
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    res.status(200).send(Object.values(books).filter((book) => book.title === req.params.title));
  //return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    res.status(200).send(books[req.params.isbn].reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;

// Get all books – Using async callback function
const axios = require('axios');
async function fetchData() {
    try {
        const response = await axios.get(' https://kamalinade-5000.theiadocker-0-labs-prod-theiak8s-4-tor01.proxy.cognitiveclass.ai/ ');
        const books = response.data;
        res.status(200).json({ message: books });
    } catch (error) {
        console.error('Error fetching data:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
public_users.get('/', fetchData);

//Search by ISBN – Using Promises
const findBookByIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
      if (books.hasOwnProperty(isbn)) {
        resolve(books[isbn]);
      } else {
        reject(new Error('Book not found'));
      }
    });
  };
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    findBookByIsbn(isbn)
      .then((book) => {
        res.status(200).send(book);
      })
      .catch((error) => {
        console.error('Error:', error.message);
        res.status(404).send('Book not found');
      });
});

//Search by Author Using Callbacks
const findBooksByAuthorCallback = (author, callback) => {
    const matchingBooks = Object.values(books).filter((book) => book.author === author);
    if (matchingBooks.length > 0) {
      callback(null, matchingBooks);
    } else {
      callback(new Error('Books by author not found'));
    }
}; 
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    findBooksByAuthorCallback(author, (error, books) => {
      if (error) {
        console.error('Error:', error.message);
        res.status(404).send('Books by author not found');
      } else {
        res.status(200).send(books);
      }
    });
});

//Search by title Using callbacks
const findBooksByTitleCallback = (title, callback) => {
    const matchingBooks = Object.values(books).filter((book) => book.title === title);
    if (matchingBooks.length > 0) {
      callback(null, matchingBooks);
    } else {
      callback(new Error('Books by title not found'));
    }
};
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    findBooksByTitleCallback(title, (error, books) => {
      if (error) {
        console.error('Error:', error.message);
        res.status(404).send('Books by title not found');
      } else {
        res.status(200).send(books);
      }
    });
});
  