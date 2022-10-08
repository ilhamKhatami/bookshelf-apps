document.addEventListener('DOMContentLoaded', () => {
    const books = [];
    let filterBooks = [];
    const STORAGE_KEY = 'BOOK-APPS';
    const RENDER_EVENT = 'render-book';
    const SEARCH_EVENT = 'filter-book';

    document.addEventListener(RENDER_EVENT, () => {
        const container = document.querySelector('.flex');
        container.innerHTML = '';
        
        const currentPage = document.querySelector('.content-top h3').innerText;

        for (const book of books) {
            if (book.isComplete == false) {
                const box = makeBook(book);
                if (currentPage == 'Belum selesai dibaca') {
                    container.append(box);
                }
            } else {
                const box = makeBook(book);
                if (currentPage == 'Selesai dibaca') {
                    container.append(box);
                }
            }
        }
    })

    document.addEventListener(SEARCH_EVENT, () => {
        const container = document.querySelector('.flex');
        container.innerHTML = '';

        const currentPage = document.querySelector('.content-top h3').innerText;

        for (const book of filterBooks) {
            if (book.isComplete == false) {
                if (currentPage == 'Belum selesai dibaca') {
                    const box = makeBook(book);
                    container.append(box);
                } else if (currentPage == 'Daftar Buku') {
                    const box = makeBook(book, true);
                    container.append(box);
                }
            } else {
                if (currentPage == 'Selesai dibaca') {
                    const box = makeBook(book);
                    container.append(box);
                } else if (currentPage == 'Daftar Buku') {
                    const box = makeBook(book, true);
                    container.append(box);
                }
            }
        }
    })

    document.querySelectorAll('.buttons').forEach(button => {
        button.addEventListener('click', () => {
            const container = document.getElementById('content');
            container.innerHTML = '';
            let topContent = '';
            let content = '';

            topContent = renderTitleContent(button.innerText, true);

            if (button.innerText == 'Beranda') {
                topContent = renderTitleContent(button.innerText, false);
                content = renderDisplayBeranda();
            } else if (button.innerText == 'Tambah Buku') {
                topContent = renderTitleContent(button.innerText, false);
                content = renderDisplayForm();
            } else if (button.innerText == 'Daftar Buku') {
                content = renderDisplayDaftarBuku('All');
            } else if (button.innerText == 'Belum selesai dibaca') {
                content = renderDisplayDaftarBuku(false);
            } else if (button.innerText == 'Selesai dibaca') {
                content = renderDisplayDaftarBuku(true);
            }

            container.append(topContent, content);
        })
    })

    function renderTitleContent(target, hasSearchBox) {
        let container = '';
        const title = createElementAtribute('h3', { innerText: target });
        const line = createElementAtribute('hr');
        
        if (hasSearchBox) {
            container = createElementAtribute('div');

            let searchBox = renderDisplaySearchBox();
            let content = createElementAtribute('div', { classList: 'content-top' });

            content.append(title, searchBox);
            container.append(content, line);
        } else {
            container = createElementAtribute('div', { classList: 'content-title' });

            container.append(title, line);
        }

        return container;
    }

    function renderDisplaySearchBox() {
        const container = createElementAtribute('form', {classList: 'search-box'});
        const searchBox = createElementAtribute('label', {
            innerHTML: 'Cari : <input type="text" id="inputCari"><button type="submit"><i class="fa-solid fa-magnifying-glass"></i></button>'
        })

        container.addEventListener('submit', () => {
            const target = document.getElementById('inputCari').value;
            searchBook(target);
        })
        
        container.append(searchBox);
        return container;
    }

    function renderDisplayBeranda() {
        const container = createElementAtribute('div', { classList: 'welcome-section' });

        const heading = createElementAtribute('h1', { innerText: "Selamat datang di Bookshelf Apps" });
        const text = createElementAtribute('h4', { innerText: "Simpan buku favoritemu disini!" });

        container.append(heading, text);
        return container;
    }

    function renderDisplayForm() {
        const container = createElementAtribute('form', { 
            classList: "form card",
            id: 'form'
        });

        const title = createElementAtribute('h2', { innerText: 'Tambahkan Buku Baru' });

        const labelJudul = createElementAtribute('label', { innerText: 'Judul :' });
        const inputJudul = createElementAtribute('input', {
            type: 'text',
            id: 'judul',
            required: 'true'
        });
        
        const labelPenulis = createElementAtribute('label', { innerText: 'Penulis :' });
        const inputPenulis = createElementAtribute('input', {
            type: 'text',
            id: 'penulis',
            required: 'true'
        });
        
        const labelTahun = createElementAtribute('label', { innerText: 'Tahun :' });
        const inputTahun = createElementAtribute('input', {
            type: 'number',
            id: 'tahun',
            required: 'true'
        });

        const inputSelesai = createElementAtribute('label', {
            innerHTML: '<input type="checkbox" id="selesaiDibaca">Selesai dibaca',
        });

        const inputSubmit = createElementAtribute('input', {
            type: 'submit',
            value: 'Tambah Buku'
        });

        container.append(title, labelJudul, inputJudul, labelPenulis, inputPenulis, labelTahun, inputTahun, inputSelesai, inputSubmit);

        container.addEventListener('submit', event => {
            // event.preventDefault();
            addBook();
            
        })
        return container;
    }

    function renderDisplayDaftarBuku(condition) { 
        const container = createElementAtribute('div', {classList: 'flex'});

        for (const book of books) {
            if (book.isComplete == condition) {
                const box = makeBook(book, false);
                container.append(box);
            } else if (condition == 'All') {
                const box = makeBook(book, true)
                container.append(box);
            }
        }

        return container;
    }

    function searchBook(target) {
        filterBooks = books.filter(book => { return book.title.match(new RegExp(target, 'i'))});
        document.dispatchEvent(new Event(SEARCH_EVENT));
    }

    function makeBook(Object, mark) {
        const container = createElementAtribute('div', {classList: 'box card'});
        const title = createElementAtribute('h3', {innerText: Object.title});
        const author = createElementAtribute('p', {innerText: Object.author});
        const year = createElementAtribute('p', {innerText: Object.year});
        const line = createElementAtribute('hr');
        const isComplete = createElementAtribute('p', {
            innerText: Object.isComplete 
            ? 'Selesai dibaca' 
            : 'Belum selesai dibaca'
        });

        const flexBox = createElementAtribute('div', {classList: 'flex-box'});
        const textBox = createElementAtribute('div', {classList: 'text-box'});
        const actionBox = createElementAtribute('div', {classList: 'action-box'});
        
        textBox.append(title, author, year);

        if (mark === true) {
            if (Object.isComplete == true) {
                const mark = createElementAtribute('div', {
                    classList: 'mark',
                    innerHTML: '<i class="fa-solid fa-check">'
                })
                actionBox.append(mark);
            }
        } else {
            let action = '';
            const deleteBook = createElementAtribute('button', {
                classList: 'danger',
                innerHTML: '<i class="fa-solid fa-xmark"></i>'
            })

            deleteBook.addEventListener('click', () => {
                removeBookFromObject(Object.id);
            })
            
            if (Object.isComplete) {
                action = createElementAtribute('button', {
                    classList: 'succes',
                    innerHTML: '<i class="fa-solid fa-rotate-left"></i>'
                })

                action.addEventListener('click', () => {
                    undoBookFromComplete(Object.id);
                })
            } else {
                action = createElementAtribute('button', {
                    classList: 'succes',
                    innerHTML: '<i class="fa-solid fa-check">'
                })

                action.addEventListener('click', () => {
                    addBookToComplete(Object.id);
                })
            }
            actionBox.append(action, deleteBook);
        }

        flexBox.append(textBox, actionBox);
        container.append(flexBox, line, isComplete);

        return container;
    }

    function addBook() {
        const title = document.getElementById('judul').value;
        const author = document.getElementById('penulis').value;
        const year = document.getElementById('tahun').value;
        const isComplete = document.getElementById('selesaiDibaca').checked;

        const id = generateId();
        const bookObject = generateBookObject(id, title, author, year, isComplete);
        books.push(bookObject);
        saveData();
    }

    function addBookToComplete(bookId) {
        const bookTarget = findBook(bookId);

        if (bookTarget == null) return;

        bookTarget.isComplete = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function undoBookFromComplete(bookId) {
        const bookTarget = findBook(bookId);
        
        if (bookTarget == null) return;
        
        bookTarget.isComplete = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function removeBookFromObject(bookId) {
        const bookTarget = findBookIndex(bookId);

        if (bookTarget == null) return;

        const confirmation = confirm("Apakah kamu yakin untuk menghapus buku?");
        if (!confirmation) return;

        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }

    function findBook(bookId) {
        for (const book of books) {
            if (book.id == bookId) {
                return book;
            }
        }
        return null;
    }

    function findBookIndex(bookId) {
        for (const index in books) {
            if (books[index].id == bookId) {
                return index;
            }
        }
        return null;
    }

    function generateId() {
        return +new Date();
    }

    function generateBookObject(id, title, author, year, isComplete) {
        return {id, title, author, year,isComplete};
    }

    function createElementAtribute(element, atribute) {
        return Object.assign(document.createElement(element), atribute);
    }

    function saveData() {
        if (isStorageExits()) {
            const parsed = JSON.stringify(books);
            localStorage.setItem(STORAGE_KEY, parsed);
        }
    }

    function isStorageExits() {
        if (typeof(Storage) == "undefined") {
            alert("Browser tidak mendukung web storage");
            return false;
        }
        return true;
    }

    function loadDataFromStorage() {
        const dataString = localStorage.getItem(STORAGE_KEY);
        const data = JSON.parse(dataString);

        if (data !== null) {
            for (const book of data) {
                books.push(book);
            }
        }
    }

    if (isStorageExits()) {
        loadDataFromStorage();
    }
})