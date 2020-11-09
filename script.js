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
  // getProgress: function (page) {
  //   if (this.isRead) {
  //     this.progress = 100;
  //   } else {
  //     this.progress = parseInt((page / this.pages) * 100); // this seems to round down
  //   }
  // }
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
  displayBooks();
}

// display books
function displayBooks() {
  // grab ul (depend on reading or read)
  let ul = "";
  // need to clear the ul first otherwise just keeps adding
  document.getElementById("read").innerHTML = "";
  document.getElementById("reading").innerHTML = "";

  // loop through library obj
  library.forEach((book) => {
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
    li.append(pPages);
    const pProgress = document.createElement("p");
    pProgress.setAttribute("class", "card__progress");
    pProgress.innerText = readInfo;
    li.append(pProgress);
    ul.append(li);
  });
  //ul.innerHTML = html
}

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  addBookToLibrary();
});
