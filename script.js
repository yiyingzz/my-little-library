let library = [];
let activeView = "";
let activeCategory = "all";

const list = document.querySelector("#booklist");
const form = document.querySelector("form");
const formLink = document.querySelector(".nav__link--add");
const readingLink = document.querySelector(".nav__link--reading");
const readLink = document.querySelector(".nav__link--read");
const allLink = document.querySelector(".nav__link--all");
const emptyList = document.querySelector("#empty");

//set up book class
function Book(title, author, pages, isRead) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  //this.id = id;
}

Book.prototype = {
  constructor: Book,
  toggleRead: function () {
    this.isRead = !this.isRead;
  }
};

function addBookToLibrary() {
  const title = document.querySelector('input[name="title"]').value;
  const author = document.querySelector('input[name="author"]').value;
  const pages = parseInt(document.querySelector('input[name="pages"]').value);
  const isRead = document.querySelector('input[name="progress"]').checked;
  //const id = idCount;
  const newBook = new Book(title, author, pages, isRead);
  library.push(newBook);
  localStorage.setItem("books", JSON.stringify(library));
  displayBooks(activeCategory);
}

function filterBooks(category) {
  let filteredLibrary = [];
  if (category === "all") {
    filteredLibrary = library;
  } else if (category === "reading") {
    library.forEach((book) => {
      if (!book.isRead) {
        filteredLibrary.push(book);
      }
    });
  } else if (category === "read") {
    library.forEach((book) => {
      if (book.isRead) {
        filteredLibrary.push(book);
      }
    });
  }
  return filteredLibrary;
}

function displayBooks(category) {
  list.innerHTML = "";

  if (0 < library.length) {
    emptyList.style.display = "none";
    const filteredLibrary = filterBooks(category);
    filteredLibrary.forEach((book, index) => {
      const ul = list;
      let isRead = false;
      if (book.isRead) {
        isRead = true;
      }
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
      const divModifyContainer = document.createElement("div");
      divModifyContainer.setAttribute("class", "card__modify-container");
      const pProgress = document.createElement("p");
      pProgress.setAttribute("class", "card__progress");
      let progressHtml = "Status: ";
      if (isRead) {
        progressHtml += `<a href="javascript:void(0);" class="card__progress--update card__progress--update-read">Read</a>`;
      } else {
        progressHtml += `<a href="javascript:void(0);" class="card__progress--update">Reading</a>`;
      }
      pProgress.innerHTML = progressHtml;
      const divModify = document.createElement("div");
      divModify.setAttribute("class", "card__modify");
      const aDelete = document.createElement("a");

      aDelete.setAttribute("class", "card__modify--link");
      if (isRead) {
        aDelete.setAttribute(
          "class",
          "card__modify--link card__modify--link-read"
        );
      }
      aDelete.setAttribute("href", "javascript:void(0);");
      const imgDelete = document.createElement("img");
      imgDelete.setAttribute("src", "./assets/delete.svg");
      imgDelete.setAttribute("alt", "");
      imgDelete.setAttribute("class", "card__modify--icon");
      aDelete.append(imgDelete);
      divModifyContainer.append(pProgress);
      divModifyContainer.append(divModify);
      divModify.append(aDelete);
      li.append(divModifyContainer);
      ul.append(li);
    });
    attachToggleReadEventListener();
  } else {
    emptyList.style.display = "block";
  }
}

function attachToggleReadEventListener() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", function (e) {
      console.log("added click");
      console.log(e.target.className);
      const progressRegex = /card__progress--update/;
      const deleteRegex = /card__modify--/;
      if (progressRegex.test(e.target.className)) {
        library[e.currentTarget.id].toggleRead();
        localStorage.setItem("books", JSON.stringify(library));
        console.log(localStorage);
        displayBooks(activeCategory);
      }
      if (deleteRegex.test(e.target.className)) {
        library.splice(this.id, 1);
        localStorage.setItem("books", JSON.stringify(library));
        console.log(localStorage);
        displayBooks(activeCategory);
      }
    });
  });
}

// rewrite below as one named function that is an evt listener, attach to all 3 nav links, function needs to take in parameter (event, use event target class/id to decide what to show/hide)
// this is the event listener
function determineView(e) {
  const nav = document.getElementsByClassName("nav__link");
  for (let item of nav) {
    item.classList.remove("active");
  }
  if (e.target.dataset.view === "add") {
    toggleForm();
  } else {
    activeView = e.target;
    activeCategory = e.target.dataset.view;
    displayBooks(activeCategory);
  }
}

function toggleForm() {
  const form = document.querySelector("form");
  if (form.style.display === "block") {
    form.style.display = "none";
    document.querySelector(".nav__link--add").classList.remove("active");
    activeView.classList.add("active");
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

  document.querySelector("form").addEventListener("submit", function (e) {
    e.preventDefault();
    addBookToLibrary();
  });
  document.querySelector(".form__close").addEventListener("click", toggleForm);

  /* check for stored data */
  if (0 < localStorage.length) {
    libraryData = JSON.parse(localStorage.getItem("books"));
    library = [];
    library = libraryData.map((item) => {
      const book = new Book(item.title, item.author, item.pages, item.isRead);
      return book;
    });
    displayBooks(activeCategory);
    activeView = allLink;
    allLink.classList.add("active");
  }
});

// NOTES:
// need form error handling
// if title & author exact match for something already in library[], "do you already have this book on your list?" --> parse title & author in lower case to check for matches
// add delete button to delete books
// add edit button for editing book info
