let myLibrary; // main storage of library data
let bookId;
const items = document.getElementById('items');
const authorForm = document.querySelector('#author');
const titleForm = document.querySelector('#title');
const pagesForm = document.querySelector('#pages');
const readBtn = document.querySelector('#readToggle');
const addBtn = document.querySelector('#addBtn');

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
]


addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    addBookLibrary();
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

function Book(id, author, title, pages, status) {
    this.id = id;
    this.author = author;
    this.title = title;
    this.pages = pages;
    this.status = status;
}

addBookLibrary = () => {
    const bookStatus = readBtn.innerText;
    const bookItem = new Book(bookId, authorForm.value, titleForm.value, pagesForm.value, bookStatus);
    bookId++;
    myLibrary.push(bookItem);
    saveData();

    clearForm();
    render();
}

searchBook = (dataId) => {
    for(let item of myLibrary) {
        if (item.id == dataId) {
            console.log('found');
            return myLibrary.indexOf(item);
        }
    }

    console.log('Not found');
};

updateBook = (e) => {
    const itemId = e.target.nextElementSibling.dataset.id;
    const key = Object.keys(myLibrary)[searchBook(itemId)];
    let book = myLibrary[key].status;
    if(book == 'Unfinished') {
        myLibrary[key].status = 'Finished';
    } else {
        myLibrary[key].status = 'Unfinished';
    }
    render();
    saveData();
};

deleteBook = (e) => {
    let itemId = e.target.dataset.id;
    console.log(itemId);
    myLibrary.splice(searchBook(itemId), 1);
    saveData();
    render();
};

render = () => {
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
        btn.addEventListener('click', (e) => updateBook(e));
    });
    
    delBtn.forEach(btn => {
        btn.addEventListener('click', (e) => deleteBook(e));
    });
}

clearForm = () => {
    authorForm.value = '';
    titleForm.value = '';
    pagesForm.value = '';
    readBtn.innerText = 'Finished';
};

loadProgram = () => {
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
    saveData();
    render();
};

saveData = () => {
    localStorage.setItem(STORAGE_NAME, JSON.stringify(myLibrary));
    localStorage.setItem(STORAGE_ID, bookId);
}


loadProgram();
