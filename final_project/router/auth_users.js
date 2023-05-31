const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ "username": "user2", "password": "password2" }];

const isValid = (username) => { //returns boolean
    //write code to check is the username is valid
}

const authenticatedUser = (username, password) => { //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username);
    console.log(password);
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }
    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });
        req.session.authorization = {
            accessToken,
            username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    let isbn = req.params.isbn;
    let review = req.body.review;
    if (req.session.authorization) {
        let userName = req.session.authorization['username'];
        if (userName in books[isbn].reviews) {
            books[isbn].reviews[userName] === review;
            return res.status(200).send("review updated successfully");
        } else {
            books[isbn].reviews[userName] === review;
            return res.status(200).send("review added successfully");
        }

    } else {
        return res.status(208).json({ message: "user is not login" });
    }


});


regd_users.delete("/auth/review/:isbn", (req, res) => {
    isbn = req.params.isbn;
    if (req.session.authorization) {
        let userName = req.session.authorization['username'];
        if (userName in books[isbn].reviews) {
            delete books[isbn].reviews.username;
            return res.status(200).send("review deleted successfully");
        } else {
            return res.status(400).send("user is not authorise to delete this review");
        }
    } else {
        return res.status(208).send("you have to log in to perform this operation");
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;