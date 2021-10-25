import '../App.css';
import React, {useState, useEffect} from 'react'
import { Route, Switch } from 'react-router-dom';
import Home from './Home';
import Bookshelf from './Bookshelf';
import NavBar from './NavBar';
import AddBook from './AddBook';
import Header from './Header';

const pageStyle = {
  backgroundColor: "#f3eeda",
  borderRadius: "10px 10px 0 0",
  borderTop: "solid 1px",
  boxShadow: "0 -0.5px 5px",
  height: "fill"
}

function App() {
// set state
  const [allBooks, setAllBooks] = useState([])
  const [displayBooks, setDisplayBooks] = useState([])
  const [bookshelf, setBookShelf] = useState([])
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    author: "",
    img: "",
    genre: "",
    description: "",
    publishYear: "",
    bookshelf: false
  })

// GET data from local db.json
  useEffect(() =>{
    fetch('http://localhost:3000/books')
      .then(resp => resp.json())
      .then(data => {
        setAllBooks(data)
        setDisplayBooks(data)
        setBookShelf(data.filter(item => item.bookshelf !== false))
      })
  }, [])

// form submit functionality
  function handleFormChange(e) {
    setFormData({...formData, [e.target.name] : e.target.value})
  }

  function handleChecked(e) {
    setFormData({...formData, [e.target.name] : e.target.checked})
  }
  
  function handleSubmit(e) {
    e.preventDefault()
    fetch('http://localhost:3000/books', {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(formData) 
    }).then(r => r.json())
    .then(data => {
      setDisplayBooks([...allBooks, data])
      updateShelf(data)
      setFormData({
        id: "",
        title: "",
        author: "",
        img: "",
        genre: "",
        description: "",
        publishYear: "",
        bookshelf: false
      })
    })
  }

  function handleClick(book) {
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            bookshelf: !book.bookshelf,
        })
    })
        .then(resp => resp.json())
        .then(data => {
            updateShelf(data)
            const idx = displayBooks.findIndex(item => item.id === book.id)
            const tempBooks = [...displayBooks]
            tempBooks[idx].bookshelf = data.bookshelf
            setDisplayBooks(tempBooks)
        })
  }
// bookshelf functionality
  function updateShelf(clickedBook) {
    if (clickedBook.bookshelf === true) {
      const shelf = [...bookshelf, clickedBook]
      setBookShelf(shelf)
    } else {
      const shelf = bookshelf.filter(item => item.id !== clickedBook.id)
      setBookShelf(shelf)
    }
  }
  
  
// delete a book from the catalog
  function deleteBook(clickedBook) {
    const updatedBooks = displayBooks.filter(book => book.id !== clickedBook.id)
    setDisplayBooks(updatedBooks)
  }
  
  function handleDelete(book) {
    fetch(`http://localhost:3000/books/${book.id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    })
        .then(resp => resp.json())
        .then(data => console.log(data))
    
    deleteBook(book)
  }

  return (
    <div>
      <Header />
      <div style={pageStyle}>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <Home allBooks={displayBooks} updateShelf={updateShelf} handleClick={handleClick} handleDelete={handleDelete} />
          </Route>
          <Route exact path="/bookshelf">
            <Bookshelf bookshelf={bookshelf} updateShelf={updateShelf} handleDelete={handleDelete}/>
          </Route>
          <Route exact path="/addbook">
            <AddBook formData={formData} handleFormChange={handleFormChange} handleSubmit={handleSubmit} handleChecked={handleChecked} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
