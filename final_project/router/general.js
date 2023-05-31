const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log(username);
    console.log(password);
    const doesExist = (username) => {
        let userswithsamename = users.filter((user) => {
            return user.username === username
        });
        if (userswithsamename.length > 0) {
            return true;
        } else {
            return false;
        }
    }
    if (username && password) {
        if (!doesExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function(req, res) {
    res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function(req, res) {
    let isbn = req.params.isbn;
    res.send(books[isbn]);
});

// Get book details based on author
public_users.get('/author/:author', function(req, res) {
    let author = req.params.author;
    let i = 0;
    let mybook = Object.values(books);

    let filtered_books = mybook.filter((book) => book.author === author);
    if (filtered_books.length > 0) {
        res.send(JSON.stringify(filtered_books, null, 4));
    } else {
        console.log("no books correspond to this author")
    }

});

// Get all books based on title
public_users.get('/title/:title', function(req, res) {
    let title = req.params.title;
    let i = 0;
    let mybook = Object.values(books);

    let filtered_books = mybook.filter((book) => book.title === title);
    if (filtered_books.length > 0) {
        res.send(JSON.stringify(filtered_books, null, 4));
    } else {
        console.log("no books correspond to this author")
    }
});

//  Get book review
public_users.get('/review/:isbn', function(req, res) {
    let isbn = req.params.isbn;
    let i = 0;

    let mybook = Object.entries(books);

    let filtered_books = mybook.map(([key, val] = entry) => {
        if (key === isbn) {
            res.send(val.reviews);
            return val.reviews;
        }
    })
    console.log("book not found")


});
let myPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
        res.send(JSON.stringify(books, null, 4));
    }, 6000)
});
myPromise1.then((successMessage) => {
    console.log("From Callback " + successMessage);
});
const fetchPromise = fetch(
    "https://localhost:5000//isbn/:isbn"
);

fetchPromise
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        return response.json();
    })
    .then((data) => {
        console.log(data[0].name);
    });

module.exports.general = public_users;