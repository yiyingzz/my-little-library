let library = [];

//set up book class
function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

// NEED A WAY TO ADD MULTIPLE METHODS TO Book.prototype --> use class Book & constructor ES6???
// stackoverflow.com/questions/40337873/adding-multiple-methods-to-a-javascript-prototype

Book.prototype = {
  constructor: Book,
  toggleRead: function () {
    this.isRead = !this.isRead;
  },
  getProgress: function (page) {
    if (this.isRead) {
      this.progress = 100;
    } else {
      this.progress = parseInt((page / this.pages) * 100); // this seems to round down
    }
  }
};

// this function gets called after user fills out inputs to add new book info (title, author, etc)
// create new book first, then call addBook function
function addBookToLibrary() {
  const title = document.querySelector('input[name="title"]').value;
  const author = document.querySelector('input[name="author"]').value;
  const pages = parseInt(document.querySelector('input[name="pages"]').value);
  const progress = document.querySelector('input[name="progress"]').checked;
  const newBook = new Book(title, author, pages, progress);
  library.push(newBook);
  console.log(library);
}

// display books
function displayBooks() {}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  addBookToLibrary();
});
