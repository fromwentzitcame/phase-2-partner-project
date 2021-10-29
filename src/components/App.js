import '../App.css';
import React, {useState, useEffect} from 'react'
import { Route, Switch } from 'react-router-dom';

import Home from './Home';
import Bookshelf from './Bookshelf';
import NavBar from './NavBar';
import AddBook from './AddBook';
import Header from './Header';
import Search from './Search';
import ShelfSearch from './ShelfSearch';
import BookDetails from './BookDetails';

import ScrollToTop from './ScrollToTop';

const pageStyle = {
  backgroundColor: "#f3eeda",
  borderRadius: "10px 10px 0 0",
  borderTop: "solid 1px",
  boxShadow: "0 -0.5px 5px",
  minHeight: "100vh",
  position: "relative",
  top: "-40px"
}

function App() {
// set state
  const [allBooks, setAllBooks] = useState([])
  const [secondShelf, setSecondShelf] = useState([])
  const [search, setSearch] = useState("")
  const [shelfSearch, setShelfSearch] = useState("")
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
    fetch('https://pure-thicket-24955.herokuapp.com/books')
      .then(resp => resp.json())
      .then(data => {
        setAllBooks(data)
        setDisplayBooks(data)
        setBookShelf(data.filter(item => item.bookshelf !== false))
        setSecondShelf(data.filter(item => item.bookshelf !== false))
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
    if (formData.img === "") {
      formData.img = "http://lgimages.s3.amazonaws.com/nc-md.gif"
    }
    fetch('https://pure-thicket-24955.herokuapp.com/books', {
      method: "POST",
      headers: {
        "Content-Type" : "application/json"
      },
      body: JSON.stringify(formData) 
    }).then(r => r.json())
    .then(data => {
      setAllBooks([...displayBooks, data])
      setDisplayBooks([...displayBooks, data])
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

  function handleSearch(e) {
    setSearch(e.target.value)
    const tempBooks = allBooks.filter(item => item.title.toLowerCase().includes(e.target.value.toLowerCase()))
    setDisplayBooks(tempBooks)
  }

  function handleShelfSearch(e) {
    setShelfSearch(e.target.value)
    const tempBooks = secondShelf.filter(item => item.title.toLowerCase().includes(e.target.value.toLowerCase()))
    setBookShelf(tempBooks)
  }

  function handleClick(book) {
    fetch(`https://pure-thicket-24955.herokuapp.com/books/${book.id}`, {
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
      setSecondShelf(shelf)
    } else {
      const shelf = bookshelf.filter(item => item.id !== clickedBook.id)
      setBookShelf(shelf)
      setSecondShelf(shelf)
    }
  }
  
  
// delete a book from the catalog
  function deleteBook(clickedBook) {
    const updatedBooks = displayBooks.filter(book => book.id !== clickedBook.id)
    setDisplayBooks(updatedBooks)
  }
  
  function handleDelete(book) {
    fetch(`https://pure-thicket-24955.herokuapp.com/books/${book.id}`, {
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
    <div style={{height: "100vh"}}>
      <Header />
      <div style={pageStyle}>
        <NavBar />
        <ScrollToTop />
        <Switch>
          <Route exact path="/">
            <Search search={search} handleSearch={handleSearch} />
            <Home allBooks={displayBooks} updateShelf={updateShelf} handleClick={handleClick} handleDelete={handleDelete} />
          </Route>
          <Route exact path="/bookshelf">
            <ShelfSearch search={shelfSearch} handleSearch={handleShelfSearch} />
            <Bookshelf bookshelf={bookshelf} updateShelf={updateShelf} handleDelete={handleDelete} handleClick={handleClick} />
          </Route>
          <Route exact path="/addbook">
            <AddBook formData={formData} handleFormChange={handleFormChange} handleSubmit={handleSubmit} handleChecked={handleChecked} />
          </Route>
          <Route exact path="/book/:id">
            <BookDetails handleClick={handleClick} handleDelete={handleDelete}/>
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
