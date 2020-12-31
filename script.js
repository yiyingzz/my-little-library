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
  // add to localStorage
  localStorage.setItem("books", JSON.stringify(library));
  displayBooks();
}

// display books
function displayBooks() {
  // grab ul (depend on reading or read)
  // need to clear the ul first otherwise just keeps adding
  document.getElementById("read").innerHTML = "";
  document.getElementById("reading").innerHTML = "";

  // loop through library obj
  library.forEach((book, index) => {
    let ul = "";
    readInfo = "";
    if (book.isRead) {
      readInfo = "read";
      ul = document.getElementById("read");
    } else {
      readInfo = "in progress";
      ul = document.getElementById("reading");
    }
    // build html
    let html = `
        <h2 class="card__title">${book.title}</h2>
        <p class="card__author">${book.author}</p>
        <p class="card__pages">${book.pages} pages</p>
        <p class="card__progress">${readInfo}</p>
      `;
    const li = document.createElement("li");
    li.setAttribute("class", "card");
    li.setAttribute("id", index);
    const h2 = document.createElement("h2");
    h2.setAttribute("class", "card__title");
    h2.innerText = book.title;
    li.append(h2);
    const pAuthor = document.createElement("p");
    pAuthor.setAttribute("class", "card__author");
    pAuthor.innerText = book.author;
    li.append(pAuthor);
    const pPages = document.createElement("p");
    pPages.setAttribute("class", "card__pages");
    pPages.innerText = book.pages + " pages";
    li.append(pPages);
    const pProgress = document.createElement("p");
    pProgress.setAttribute("class", "card__progress");
    pProgress.innerText = readInfo;
    li.append(pProgress);
    ul.append(li);
  });
  attachToggleReadEventListener();
}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  addBookToLibrary();
});

function attachToggleReadEventListener() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", function (e) {
      if (e.target.className === "card__progress") {
        library[e.currentTarget.id].toggleRead();
        displayBooks();
      }
    });
  });
}

// rewrite below as one named function that is an evt listener, attach to all 3 nav links, function needs to take in parameter (event, use event target class/id to decide what to show/hide)
document.querySelector(".nav__reading").addEventListener("click", function () {
  this.classList.add("active");
  document.querySelector(".nav__read").classList.remove("active");
  document.querySelector(".nav__add").classList.remove("active");
  document.getElementById("reading").style.display = "block";
  document.getElementById("read").style.display = "none";
  document.querySelector(".form").style.display = "none";
});

document.querySelector(".nav__read").addEventListener("click", function () {
  this.classList.add("active");
  document.querySelector(".nav__reading").classList.remove("active");
  document.querySelector(".nav__add").classList.remove("active");
  document.getElementById("read").style.display = "block";
  document.getElementById("reading").style.display = "none";
  document.querySelector(".form").style.display = "none";
});

document.querySelector(".nav__add").addEventListener("click", function () {
  this.classList.add("active");
  document.querySelector(".nav__read").classList.remove("active");
  document.querySelector(".nav__reading").classList.remove("active");
  document.querySelector(".form").style.display = "block";
});

//onload
document.addEventListener("DOMContentLoaded", function () {
  if (0 < localStorage.length) {
    libraryData = JSON.parse(localStorage.getItem("books"));
    library = libraryData.map((item) => {
      const book = new Book(item.title, item.author, item.pages, item.progress);
      return book;
    });
    displayBooks();
  }
});

// NOTES:
// need form error handling
// if title & author exact match for something already in library[], "do you already have this book on your list?" --> parse title & author in lower case to check for matches
// add delete button to delete books
