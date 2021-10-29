import React, {useState, useEffect} from 'react'
import { useParams, Link } from 'react-router-dom'
import bookAdd from '../data/bookadd.png';
import bookAdded from '../data/bookadded.png';
import bookRemove from '../data/bookremove.png';

const main = {
    display:"flex",
    flexWrap:"wrap",
    marginTop:"20px",
    justifyContent:"space-around",
}

const cardStyle = {
    flexDirection: "column",
    border:"solid 1px lightgray",
    borderRadius: "20px", 
    maxWidth:"1000px",
    minHeight: "500px", 
    margin:"20px 50px", 
    background:"white",
    padding: "15px",
    boxShadow: "8px 8px 10px #A29e73",
    transition: "all .2s ease-in-out",
    position: "relative",
}

function BookDetails({handleClick, handleDelete}) {
    const [book, setBook] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [bookIcon, setBookIcon] = useState(bookAdded)

    const id = useParams().id

    useEffect(() => {
        fetch(`https://pure-thicket-24955.herokuapp.com/books/${id}`)
            .then(resp => resp.json())
            .then(data => {
                setBook(data)
                setIsLoaded(true)
                if (data.bookshelf === true) {
                    setClicked(true)
                }
            })
        }, [id])

    if(!isLoaded) return <div style={{textAlign: "center"}}><h1>Loading...</h1></div>

    const {title, author, genre, img, publishYear, description} = book

    return (
        <div style={main}>
            <div class="book-details" style={cardStyle}>
                <div style={{display:"flex", margin:"10px"}}>
                    <div style={{width:"25%"}}>
                        <img style={{height: "300px", paddingRight:"20px"}} src={img} alt={title}></img>
                    </div>
                    <div style={{width:"50%", marginLeft: "100px", marginTop: "35px"}}>
                        <h1>{title}</h1>
                        <h3>Author: {author}</h3>
                        <h4>First Published in {publishYear}</h4>
                        <h4> Genre: {genre}</h4>
                    </div>
                    <div style={{width:"25%", textAlign:"right", paddingRight:"10px"}}>
                        <p
                            className="bookshelfButton"
                            title={clicked ? "Remove from Bookshelf" : "Add to Bookshelf"}
                            onClick={() => {setClicked(!clicked); handleClick(book)}}
                        >
                            {clicked ?
                                <img
                                    className="iconDetail"
                                    src={bookIcon}
                                    alt="book icon"
                                    onMouseOver={() => setBookIcon(bookRemove)}
                                    onMouseOut={() => setBookIcon(bookAdded)}
                                />
                                :
                                <img
                                    className="iconDetail"
                                    src={bookAdd} 
                                    alt="book icon"
                                />
                            }
                        </p>
                    </div>
                </div>
                <h4 style={{marginLeft:"10px"}}>Description</h4>
                <p style={{margin:"0 10px 20px 10px"}}>
                    {description}
                </p>
                <span>
                    <Link to="/"><button style={{marginLeft:"10px"}} onClick={() => handleDelete(book)}>Delete from Library</button></Link>
                    <Link to="/"><button style={{marginLeft:"10px"}}>Return to Library</button></Link>
                </span>
            </div>
        </div>

    )
}

export default BookDetails