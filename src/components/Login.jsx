import { useAuth0 } from "@auth0/auth0-react";
import "./css/login.css"
function Login() {
    const { loginWithRedirect } = useAuth0();

    return (
        <div id="main">
            <img src="/img/Logo-B.png" alt="Logo de la página" id="logo" style={{height:'200px', filter:'invert(1)'}}/>
            <div id="header">
            
                <div className="login welcome">                    
                    Bienvenido
                </div>
                <div className="bottom login" id="middle">a <span className="bold">MOTIVAI</span></div>
                <div className="bottom login" id="left"></div>
                <div className="bottom login" id="right"></div>
            </div>
            <div className="fondo">
                <h2>La plataforma para <span className="bold">complementar</span> tu educación</h2>
                <button onClick={() => loginWithRedirect()} className="login">Iniciar sesión</button>
            </div>
        </div>
    );
}

export default Login;