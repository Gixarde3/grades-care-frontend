import { useAuth0 } from "@auth0/auth0-react";
import { useEffect, useState } from "react";
import { useContext } from "react";
import axios from "axios";
import "./css/main.css";
import { useNavigate } from "react-router-dom";
import { ContextoPuntos } from "./contextos/ContextoPuntos";
function User() {
    const [optionsOpened, setOptionsOpened] = useState(false);
    const { user, isAuthenticated, isLoading } = useAuth0();
    const { logout } = useAuth0();
    const {puntos, setPuntos} = useContext(ContextoPuntos);
    const navigate = useNavigate();
    
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem'
        }}>
            <div id="datos" style={{marginRight:'1rem'}}>
                <h3>{user.name}</h3>
                <p>Puntos: {puntos}</p>
            </div>
            <button id="profile" onClick={() => setOptionsOpened(!optionsOpened)}>
                <img src={`${user.picture}`} alt={`Foto de perfil de ${user.name}`} />
                <div className={`options ${optionsOpened ? "open" : "close"}`}>
                    <button className="logout option" onClick={() => navigate('prizes')}>
                        Canjear puntos
                        <img src="/img/brush.png" alt="" />
                    </button>
                    <button className = "logout option" onClick={() => {
                            logout({ logoutParams: { returnTo: window.location.origin } }); 
                        }}>
                        Log Out
                        <img src="/img/logout.png" alt="Cerrar sesión" />
                    </button>
                </div>
            </button>
        </div>
        
    );
}

export default User