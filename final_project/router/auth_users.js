const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
    "username":"Nada Sm", 
    "password":"1234"
}];

const isValid = (username)=>{
    const user = users.filter(user => user.username === username);
    if(user.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{
    const user = users.filter(user => user.username === username);
    if (username === user[0].username && password === user[0].password) {
      return true;
    } else {
      return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (!username || !password) {
      return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign(
        {
          data: password,
        },
        "access",
        { expiresIn: 60 * 60 }
      );
  
      req.session.authorization = {
        accessToken,
        username,
      };
      return res.status(200).send("User successfully logged in");
    } else {
      return res
        .status(208)
        .json({ message: "Invalid Login. Check username and password" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let book = books[req.params.isbn];
    if (book) {
      if (req.body.review) {
        book["reviews"] = req.body.review;
      }
      return res.status(200).json({ message: "Review added successfully" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  //return res.status(300).json({message: "Yet to be implemented"});
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
    let book = books[req.params.isbn];
    if (book) {
      if (req.body.review) {
        book["reviews"] = "";
      }
      return res.status(200).json({ message: "Review deleted successfully" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
