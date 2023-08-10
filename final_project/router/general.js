const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


async function fetchBooks() {
    // Simulating a delay, like fetching data from a database
    await new Promise(resolve => setTimeout(resolve, 1000));
    return books; // assuming books is a global variable or available in scope
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    try {
        const result = await fetchBooks();
        res.send(JSON.stringify(result));
    } catch (error) {
        res.status(500).send('Error fetching books');
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    //Im asuming the fist number is the ISBN as there no other such field  
    try {
        const result = await fetchBooks();
        res.send(result[req.params.isbn]);
    } catch (error) {
        res.status(500).send('Error fetching books by isbn');
    }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
        const arrBooks = Object.values( await fetchBooks())
    
        let found = false
        arrBooks.forEach(book =>{
            if(book.author == req.params.author){
                found =true
                return res.send(book);
            }
        });
        if(!found){
            return res.send("Not found")
        }
    } catch (error) {
        res.status(500).send('Error fetching books by author');
    }
});

// Get all books based on title
public_users.get('/title/:title',async function (req, res) {

    try {
        const arrBooks = Object.values( await fetchBooks())
    
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
    } catch (error) {
        res.status(500).send('Error fetching books by title');
    }
});

//  Get book review
public_users.get('/review/:isbn',async function (req, res) {
  //Im asuming the first number is the ISBN as there no other such field  
    try {
        const result = await fetchBooks();
        res.send(result[req.params.isbn].reviews);
    } catch (error) {
        res.status(500).send('Error fetching book reviews by isbn');
    }
});

module.exports.general = public_users;
