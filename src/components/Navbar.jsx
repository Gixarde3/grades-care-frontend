import User from "./User";
import "./css/main.css";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <Link to="/">Inicio</Link>
            <User />
        </nav>
    );
}

export default Navbar;