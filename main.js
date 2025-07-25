// local storage nya
console.log("Hello, world!");
const STORAGE_KEY = "bookshelf_app";
let books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

// dom element
const bookForm = document.getElementById("bookForm");
const searchForm = document.getElementById("searchBook");
const incompleteBookList = document.getElementById("incompleteBookList");
const completeBookList = document.getElementById("completeBookList");

// funct nyimpen ke local storage
function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// funct render buku ke rak
function renderBooks(bookList = books) {
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  bookList.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.dataset.bookid = book.id;
    bookElement.setAttribute("data-testid", "bookItem");
    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div>
        <button data-testid="bookItemIsCompleteButton">${
          book.isComplete ? "Selesai dibaca" : "Belum selesai dibaca"
        }</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
        <button data-testid="bookItemEditButton">Edit Buku</button>
      </div>
    `;

    book.isComplete
      ? completeBookList.appendChild(bookElement)
      : incompleteBookList.appendChild(bookElement);
  });

  addButtonEvents(); //event listener ke button
}

// funct add buku
bookForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const newBook = {
    id: +new Date(),
    title: document.getElementById("bookFormTitle").value,
    author: document.getElementById("bookFormAuthor").value,
    year: parseInt(document.getElementById("bookFormYear").value),
    isComplete: document.getElementById("bookFormIsComplete").checked,
  };
  books.push(newBook);
  saveToStorage();
  renderBooks();
  bookForm.reset();
});

// funct remove/delete buku
function addButtonEvents() {
  // button selesai/lom dibaca
  document
    .querySelectorAll("[data-testid='bookItemIsCompleteButton']")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const bookId = parseInt(btn.closest("[data-bookid]").dataset.bookid);
        const bookIndex = books.findIndex((book) => book.id === bookId);
        books[bookIndex].isComplete = !books[bookIndex].isComplete;
        saveToStorage();
        renderBooks();
      });
    });

  // button delete
  document
    .querySelectorAll("[data-testid='bookItemDeleteButton']")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const bookId = parseInt(btn.closest("[data-bookid]").dataset.bookid);
        books = books.filter((book) => book.id !== bookId);
        saveToStorage();
        renderBooks();
      });
    });

  // button edit
  document
    .querySelectorAll("[data-testid='bookItemEditButton']")
    .forEach((btn) => {
      btn.addEventListener("click", () => {
        const bookId = parseInt(btn.closest("[data-bookid]").dataset.bookid);
        const book = books.find((book) => book.id === bookId);
        document.getElementById("bookFormTitle").value = book.title;
        document.getElementById("bookFormAuthor").value = book.author;
        document.getElementById("bookFormYear").value = book.year;
        document.getElementById("bookFormIsComplete").checked = book.isComplete;
        books = books.filter((b) => b.id !== bookId);
      });
    });
}

// function search book
searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const keyword = document
    .getElementById("searchBookTitle")
    .value.toLowerCase();
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(keyword)
  );
  renderBooks(filteredBooks);
});

// run render
renderBooks();
