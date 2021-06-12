let myLibrary; // main storage of library data
let bookId;
const items = document.getElementById('items');
const authorForm = document.querySelector('#author');
const titleForm = document.querySelector('#title');
const pagesForm = document.querySelector('#pages');
const readBtn = document.querySelector('#readToggle');
const addBtn = document.querySelector('#addBtn');

// CONSTANTS
const STORAGE_NAME = 'library';
const STORAGE_ID = 'bookId';
const FILLER_DATA = [
    {
        id: 0,
        author: 'Masashi Kishimoto',
        title: 'Naruto, Volume 1',
        pages: '192',
        status: 'Unfinished',
    },
    {   
        id: 1,
        author: 'Masashi Kishimoto',
        title: 'Naruto, Volume 2',
        pages: '216',
        status: 'Unfinished',
    }
];

// Bind events
addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    Book.addBookLibrary();
});

readBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const button = e.target;
    if (button.innerText == 'Finished') {
        button.innerText = 'Unfinished';
    } else {
        button.innerText = 'Finished';
    }
});

// CLASSES
class RenderElement {
    // Class for rendering the book list
    render() {
        items.innerHTML = myLibrary.map((book) => {
            return `
            <div id="book-item">
                <p>${book.title}</p>
                <p>${book.author}</p>
                <p>${book.pages}</p>
                <div class="item-prop">
                    <button id="btnStatus" class="${book.status}"><i class="fas fa-check"></i></button>
                    <button id="btnDel" data-id="${book.id}"><i class="fas fa-trash"></i></button>
                </div>
            </div>`;
        }).join('');

        let statusBtn = document.querySelectorAll('#btnStatus');
        let delBtn = document.querySelectorAll('#btnDel');

        statusBtn.forEach(btn => {
            btn.addEventListener('click', (e) => Book.updateBook(e));
        });
        
        delBtn.forEach(btn => {
            btn.addEventListener('click', (e) => Book.deleteBook(e));
        });
    }

    clearForm() {
        authorForm.value = '';
        titleForm.value = '';
        pagesForm.value = '';
        readBtn.innerText = 'Finished';
    };
};

class LocalData {
    renderElem = new RenderElement();

    // This class if for loading and sacing data from the local storage
    loadProgram() {
        const getBooks = JSON.parse(localStorage.getItem(STORAGE_NAME));
        const getId = JSON.parse(localStorage.getItem(STORAGE_ID));
        if (getBooks && getBooks.length != 0) {
            const storedBooks = getBooks;
            const storedId = getId;
            myLibrary = [...storedBooks];
            bookId = parseInt(storedId);
            console.log('loaded');
        } else {
            myLibrary = [...FILLER_DATA];
            bookId = 2;
            console.log('default');
        }
        storage.saveData();
        this.renderElem.render();
    }

    saveData() {
        localStorage.setItem(STORAGE_NAME, JSON.stringify(myLibrary));
        localStorage.setItem(STORAGE_ID, bookId);
    }
};

class Book {
    renderElem = new RenderElement();
    storage = new LocalData();

    // This class is for making a new book, updating, searching and deleting
    constructor(id, author, title, pages, status) {
        this.id = id;
        this.autor = author;
        this.title = title;
        this.pages = pages;
        this.status = status;
    }

    // add books to the library
    // some methods are static because there are no constructor overloading in js
    static addBookLibrary() {
        const bookStatus = readBtn.innerText;
        const bookItem = new Book(bookId, authorForm.value, titleForm.value, pagesForm.value, bookStatus);
        bookId++;
        myLibrary.push(bookItem);
        this.storage.saveData();

        this.renderElem.clearForm();
        this.renderElem.render();
    }

    // search book in the list
    searchBook(dataId) {
        for(let item of myLibrary) {
            if (item.id == dataId) {
                console.log('found');
                return myLibrary.indexOf(item);
            }
        }
        console.log('Not found');
    }

    // update the book
    static updateBook(e) {
        console.log(e.target.nextElementSibling);
        const itemId = e.target.nextElementSibling.dataset.id;
        const key = Object.keys(myLibrary)[searchBook(itemId)];
        let book = myLibrary[key].status;
        if(book == 'Unfinished') {
            myLibrary[key].status = 'Finished';
        } else {
            myLibrary[key].status = 'Unfinished';
        }
        this.renderElem.render();
        this.storage.saveData();
    }

    // delete book
    static deleteBook(e) {
        let itemId = e.target.dataset.id;
        console.log(itemId);
        myLibrary.splice(searchBook(itemId), 1);
        
        this.storage.saveData();
        this.renderElem.render();
    };
}

// function Book(id, author, title, pages, status) {
//     this.id = id;
//     this.author = author;
//     this.title = title;
//     this.pages = pages;
//     this.status = status;
// }
const storage = new LocalData();
storage.loadProgram();
