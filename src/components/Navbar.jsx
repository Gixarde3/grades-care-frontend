import User from "./User";
import "./css/main.css";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav>
            <Link to="/">
                <img src="/img/Logo-Ofi.png" alt="Logo Oficial" id="logo"/>
                Inicio
                </Link>
                <h1 className="bold">MOTIVAI</h1>
            <User />
        </nav>
    );
}

export default Navbar;