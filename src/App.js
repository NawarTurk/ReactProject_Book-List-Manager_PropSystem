import BookList from './components/BookList';
import {useState, useEffect} from 'react';
import axios from 'axios';
import BookCreate from './components/BookCreate';

function App() {
    const [books, setBooks] = useState([]);

  
    const fetchBooks = async () => {
        const response = await axios.get('http://localhost:3001/books');
        setBooks(response.data);
    };

    // fetchBooks(); very bad, infinite loop of reloading
    useEffect(()=> {
        fetchBooks();
    }, []);

    const editBookById = async (id, newTitle) => {
        const response = axios.put(`http://localhost:3001/books/${id}`, {
            title: newTitle
        });
        console.log(response);
         
        const updatedBooks = books.map((book) => {
            if (book.id === id) {
                // return {...book, title: newTitle};
                return {...book, ...response.data};
            }

            return book;
        });

        setBooks(updatedBooks);
    };

    const deleteBookById = async (id) => {
        await axios.delete(`http://localhost:3001/books/${id}`)
        const updatedBooks = books.filter((book) => {
            return book.id != id;
        })
        
        setBooks(updatedBooks);
    };

    const createBook = async (title) => {
        const response = await axios.post('http://localhost:3001/books', {
            title
        });
        // console.log(response)
        const updatedBooks = [
            ...books,
            response.data
            // {
            //     id: Math.round(Math.random()*9999), 
            //     title,
            // }
        ];

        setBooks(updatedBooks);
    };

    return (
        <div className="app">
            <h1>Reading List</h1>
            <BookList books={books} onDelete={deleteBookById} onEdit={editBookById}/>
            <BookCreate onCreate={createBook} />
        </div>
    );
}

export default App;