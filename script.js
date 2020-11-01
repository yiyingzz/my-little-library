let library = [];

//set up book class
function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

// add methods to use with books --> one instance of function shared b/t all books vs. the individual values are different for the properties in Book class above (and need to be set upon book creation)
Book.prototype.toggleRead = function () {
  this.isRead = true;
};

// date added func?

// book progress % calc
Book.prototype.getProgress = function (page) {
  if (this.isRead) {
    this.progress = 100;
  } else {
    this.progress = (page / this.pages) * 100;
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
  console.log("did this run");
  addBookToLibrary();
});

console.log(document.querySelector('button[type="submit"'));
