const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Im asuming the fist number is the ISBN as there no other such field  
  return res.send(books[req.params.isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const arrBooks = Object.values(books)

    let found = false
    arrBooks.forEach(book=>{
        if(book.author == req.params.author){
            found =true
            return res.send(book);
        }
    });
    if(!found){
        return res.send("Not found")
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const arrBooks = Object.values(books)

    let found = false
    arrBooks.forEach(book=>{
        if(book.title == req.params.title){
            found =true
            return res.send(book);
        }
    });
    if(!found){
        return res.send("Not found")
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Im asuming the fist number is the ISBN as there no other such field  
  return res.send(books[req.params.isbn]);
});

module.exports.general = public_users;
