const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
}
  
const authenticatedUser = (username,password)=>{
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });
    if(validusers.length > 0){
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
        return res.status(404).json({message: "Error logging in"});
    }
   if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({message: "Invalid Login. Check username and password"});
}});


regd_users.post("/register", (req,res) => {
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

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username =req.session.authorization.username

  //this is just double protection
  if(username == undefined){
    return res.status(404).json({message: "Unauthorized."});
  }
  
  const review = req.body.review;
  const isbn = req.params.isbn;

  console.log(review,username,isbn)

  const newReview ={
    "username": username,
    "review" : review 
  }
  //this line of code adds a new review to the object if not there
  //and in case its aready there it substitutes it
  books[isbn].reviews[username] = review

  return res.status(300).json({message: "Success, your review was registered!"});
});




module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
