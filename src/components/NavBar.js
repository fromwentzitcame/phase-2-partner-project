import { NavLink } from "react-router-dom";

const linkStyles = {
    display: "inline-flex",
    padding: "12px",
    marginBottom: "10px",
    background: "#a79d51",
    textDecoration: "none",
    WebkitTextStroke: "0.1px black",
    color: "white",
    borderRadius: "0 0 10px 10px",
}

function NavBar() {
    return (
        <div style={{ display: "flex", justifyContent: "space-around", position: "relative", maxWidth: "1000px", margin: "auto"}}>
            <NavLink
                to="/"
                exact
                style={linkStyles}
                activeStyle={{
                    background: "#625c2e",
                }}
            >
                Home
            </NavLink>
            <NavLink
                to="/bookshelf"
                exact
                style={linkStyles}
                activeStyle={{
                    background: "#625c2e",
                }}
            >
                Bookshelf
            </NavLink>
            <NavLink
                to="/addbook"
                exact
                style={linkStyles}
                activeStyle={{
                    background: "#625c2e",
                }}
            >
                Add a Book
            </NavLink>
        </div>
    )
}

export default NavBar