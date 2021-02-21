let library = [];
let activeView = ""; // default is all for desktop, reading for mobile

const form = document.querySelector("form");
const formLink = document.querySelector(".nav__link--add");
const reading = document.querySelector("#reading");
const readingLink = document.querySelector(".nav__link--reading");
const read = document.querySelector("#read");
const readLink = document.querySelector(".nav__link--read");
const all = document.querySelector("#all");
const allLink = document.querySelector(".nav__link--all");

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
    let isRead = false;
    // let progressCSS = "card__border--reading";
    if (book.isRead) {
      isRead = true;
      // progressCSS = "card__border--read";
      ul = document.getElementById("read");
    } else {
      ul = document.getElementById("reading");
    }
    // build html
    // let html = `

    //     <h2 class="card__title">${book.title}</h2>
    //     <p class="card__author">${book.author}</p>
    //     <p class="card__pages">${book.pages} pages</p>
    //     <p class="card__progress">${readInfo}</p>
    //   `;

    // let html = `
    //   <div class="card__border ${progressCSS}"></div>
    //     <div class="card__heading">
    //       <h2 class="card__title">${book.title}</h2>
    //       <div class="card__edit"></div>
    //     </div>
    //     <p class="card__author">${book.author}</p>
    //     <p class="card__pages">${book.pages} pages</p>
    //     <p class="card__progress">${isRead}</p>
    //   `;
    const li = document.createElement("li");
    li.setAttribute("class", "card");
    li.setAttribute("id", index);
    const border = document.createElement("div");
    if (isRead) {
      border.setAttribute("class", "card__border card__border--read");
    } else {
      border.setAttribute("class", "card__border card__border--reading");
    }
    li.append(border);
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
    pPages.innerText = "Length: " + book.pages + " pages";
    li.append(pPages);
    const pProgress = document.createElement("p");
    pProgress.setAttribute("class", "card__progress");
    if (isRead) {
      pProgress.innerText = "Status: Read";
    } else {
      pProgress.innerText = "Status: Reading";
    }
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
// this is the event listener
function determineView(e) {
  if (e.target.dataset.view === "add") {
    toggleForm();
  } else {
    showCategory(e.target.dataset.view);
    console.log("determine");
    console.log(activeView);
    activeView = e.target;
  }
  const nav = document.getElementsByClassName("nav__link");
  for (let item of nav) {
    item.classList.remove("active");
  }
  e.target.classList.add("active"); // clicking on form link to close causes this to activate
  // check if form & if form link is already active, if it is, remove
}

// this should be a function that runs through the library array and displays the matching category, so the default will always be "all"
// this also prevents having the categories split when there are multiple (so just have one <ul> to catch everything, and use the nav links as filters, instead of 3 different <ul>?)
function showCategory(category) {
  const categories = document.getElementsByClassName("category");
  for (let item of categories) {
    item.style.display = "none";
  }
  form.style.display = "none";
  document.getElementById(category).style.display = "grid";
}

function toggleForm() {
  const form = document.querySelector("form");
  if (form.style.display === "block") {
    form.style.display = "none";
    document.querySelector(".nav__link--add").classList.remove("active");
    activeView.classList.add("active");
    console.log("toggleform");
    console.log(activeView);
  } else {
    form.style.display = "block";
  }
}

//onload
document.addEventListener("DOMContentLoaded", function () {
  /* event listeners */
  const navLinks = document.querySelectorAll(".nav__link");
  for (let link of navLinks) {
    link.addEventListener("click", function (e) {
      determineView(e);
    });
  }

  document.querySelector(".form__close").addEventListener("click", toggleForm);

  /* check for stored data */
  if (0 < localStorage.length) {
    libraryData = JSON.parse(localStorage.getItem("books"));
    library = libraryData.map((item) => {
      const book = new Book(item.title, item.author, item.pages, item.progress);
      return book;
    });
    displayBooks();
    // set activeView here (default on load)
    activeView = readingLink;
    readingLink.classList.add("active");
  }
});

// NOTES:
// need form error handling
// if title & author exact match for something already in library[], "do you already have this book on your list?" --> parse title & author in lower case to check for matches
// add delete button to delete books
// add edit button for editing book info
