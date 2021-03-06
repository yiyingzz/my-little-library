const library = {};
library.books = [
  {
    title: "The Handmaid's Tale",
    author: "Margaret Atwood",
    pages: "314",
    isRead: true,
    id: 1
  },
  {
    title: "Grokking Algorithms",
    author: "Aditya Y. Bhargava",
    pages: "256",
    isRead: false,
    id: 2
  }
];
library.count = 3;

const form = {
  form: document.querySelector("form"),
  title: document.querySelector('input[id="title"]'),
  author: document.querySelector('input[id="author"]'),
  pages: document.querySelector('input[id="pages"]'),
  isRead: document.querySelector('input[id="progress"]'),
  link: document.querySelector(".nav__link--add"),
  errors: {
    title: false,
    author: false,
    pages: false
  }
};

const list = document.querySelector("#booklist");
const formLink = document.querySelector(".nav__link--add");
const readingLink = document.querySelector(".nav__link--reading");
const readLink = document.querySelector(".nav__link--read");
const allLink = document.querySelector(".nav__link--all");
const emptyList = document.querySelector("#empty");
let activeView = allLink;
let activeCategory = "all";

//set up book class
function Book(title, author, pages, isRead, id) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
  this.id = id;
}

Book.prototype = {
  constructor: Book,
  toggleRead: function () {
    this.isRead = !this.isRead;
  }
};

function validateForm() {
  if (form.title.value.trim() == false) {
    form.errors.title = true;
    form.title.classList.add("form__input--error");
    form.title.nextElementSibling.style.display = "block";
  }

  if (form.author.value.trim() == false) {
    form.errors.author = true;
    form.author.classList.add("form__input--error");
    form.author.nextElementSibling.style.display = "block";
  }

  if (form.pages.value.trim() === "" || isNaN(Number(form.pages.value))) {
    form.errors.pages = true;
    form.pages.classList.add("form__input--error");
    form.pages.nextElementSibling.style.display = "block";
  }

  if (!form.errors.title && !form.errors.author && !form.errors.pages) {
    return addBookToLibrary(
      form.title.value.trim(),
      form.author.value.trim(),
      form.pages.value,
      form.isRead.checked
    );
  }
  return false;
}

function clearErrors(elem) {
  elem.classList.remove("form__input--error");
  elem.nextElementSibling.style.display = "none";
  form.errors[elem.id] = false;
}

function addBookToLibrary(title, author, pages, isRead) {
  const id = library.count;
  const newBook = new Book(title, author, pages, isRead, id);
  library.books.push(newBook);
  library.count++;
  localStorage.setItem("library", JSON.stringify(library));
  toggleForm();
  displayBooks(activeCategory);
}

function filterBooks(category) {
  let filteredLibrary = [];
  if (category === "all") {
    filteredLibrary = library.books;
  } else if (category === "reading") {
    library.books.forEach((book) => {
      if (!book.isRead) {
        filteredLibrary.push(book);
      }
    });
  } else if (category === "read") {
    library.books.forEach((book) => {
      if (book.isRead) {
        filteredLibrary.push(book);
      }
    });
  }
  return filteredLibrary;
}

function displayBooks(category) {
  list.innerHTML = "";

  if (0 < library.books.length) {
    emptyList.style.display = "none";
    const filteredLibrary = filterBooks(category);
    filteredLibrary.forEach((book) => {
      const ul = list;
      let isRead = false;
      if (book.isRead) {
        isRead = true;
      }
      const li = document.createElement("li");
      li.setAttribute("class", "card");
      li.setAttribute("id", book.id);
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
    attachEventListeners();
  } else {
    emptyList.style.display = "block";
  }
}

function attachEventListeners() {
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.addEventListener("click", function (e) {
      const progressRegex = /card__progress--update/;
      const deleteRegex = /card__modify--/;
      if (progressRegex.test(e.target.className)) {
        let bookIndex = "null";
        library.books.forEach((book, index) => {
          if (book.id === parseInt(e.currentTarget.id)) {
            bookIndex = index;
          }
        });
        library.books[bookIndex].toggleRead();
        localStorage.setItem("library", JSON.stringify(library));
        displayBooks(activeCategory);
      }
      if (deleteRegex.test(e.target.className)) {
        let bookIndex = "null";
        library.books.forEach((book, index) => {
          if (book.id === parseInt(e.currentTarget.id)) {
            bookIndex = index;
          }
        });
        library.books.splice(bookIndex, 1);
        localStorage.setItem("library", JSON.stringify(library));
        displayBooks(activeCategory);
      }
    });
  });
}

function determineView(e) {
  const nav = document.getElementsByClassName("nav__link");
  for (let item of nav) {
    item.classList.remove("active");
  }
  if (e.target.dataset.view !== "add") {
    activeView = e.target;
    activeView.classList.add("active");
    activeCategory = e.target.dataset.view;
    displayBooks(activeCategory);
    if (form.form.style.display === "block") {
      // close form if it's already open
      toggleForm();
    }
  } else {
    toggleForm();
  }
}

function toggleForm() {
  if (form.form.style.display === "block") {
    form.form.style.display = "none";
    document.querySelector(".nav__link--add").classList.remove("active");
    activeView.classList.add("active");
  } else {
    form.form.style.display = "block";
    form.link.classList.add("active");
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

  form.form.addEventListener("submit", function (e) {
    e.preventDefault();
    validateForm();
  });
  document.querySelector(".form__close").addEventListener("click", toggleForm);

  form.title.addEventListener("input", function () {
    clearErrors(this);
  });
  form.author.addEventListener("input", function () {
    clearErrors(this);
  });
  form.pages.addEventListener("input", function () {
    clearErrors(this);
  });

  /* check for stored data */
  if (0 < localStorage.length) {
    libraryData = JSON.parse(localStorage.getItem("library"));
    library.count = libraryData.count;
    library.books = [];
    library.books = libraryData.books.map((item) => {
      const book = new Book(
        item.title,
        item.author,
        item.pages,
        item.isRead,
        item.id
      );
      return book;
    });
  }
  displayBooks(activeCategory);
  activeView = allLink;
  allLink.classList.add("active");
});

// NOTES:
// if title & author exact match for something already in library[], "do you already have this book on your list?" --> parse title & author in lower case to check for matches
// add edit button for editing book info
