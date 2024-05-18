import { Children, useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Navbar from "./Navbar";
import { ContextoPuntos } from "./contextos/ContextoPuntos";
import Alert from "./Alert";
function LayoutDashboard(props) {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [usuarioNuevo, setUsuarioNuevo] = useState(false);
    const {puntos, setPuntos} = useContext(ContextoPuntos);
    const { logout } = useAuth0();
    const idUsuario = user.sub;
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [perfil, setPerfil] = useState(null);
    const [carrera, setCarrera] = useState(null);

    const perfilText = useRef(null);
    const carreraText = useRef(null);
    const aptitudesRef = useRef(null);
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    const registrar = async () => {

        console.log( {idUsuario: idUsuario, profile: perfil, career: carrera});
        const response = await axios.post(`https://grades-care-backend.onrender.com/register`, {idUsuario: idUsuario, profile: perfilText.current.value, career: carreraText.current.value, aptitudes: aptitudesRef.current.value});
        if(response.data.success){
            openAlert("¡Registro exitoso!",
                <div>
                    <h2>¡Gracias por registrarte!</h2>
                    <p>¡Ahora podrás disfrutar de una experiencia personalizada!</p>
                </div>,
                'mascot',
                null,
                null,
                null
            )
        }else{
            openAlert("¡Error!",
                <div>
                    <h2>¡Hubo un error al registrarte!</h2>
                    <p>¡Inténtalo de nuevo más tarde!</p>
                </div>,
                'mascot',
                null,
                null,
                null
            )
        }
    }
    
    useEffect(() => {
        console.log("Perfil: ", perfil);
    }, [perfil]);
    useEffect(() => {
        console.log("Carrera: ", carrera);
    }, [carrera]);

    useEffect(() => {
        const getUsuarioNuevo = async () => {
            const response = await axios.post(`https://grades-care-backend.onrender.com`, {idUsuario: idUsuario});
            if(!response.data.success){
                console.log("Usuario nuevo");
                    openAlert("¡Bienvenido!", <div>
                    <h2>¡Gracias por registrarte!</h2>
                    <p>Completa este formulario para <span className="bold">personalizar</span> tu experiencia</p>
                    <form>
                        <label>
                            Descríbete de la mejor manera
                            <span className="bold">Procura hablar de cómo te gusta aprender</span>
                            <textarea placeholder="Soy un@ estudiante de licenciatura en..." ref={perfilText}></textarea>
                        </label>
                        <label>
                            Escribe tu campo de interés o tu carrera
                            <input type="text" placeholder="Ingeniería en sistemas" ref={carreraText}/>
                        </label>
                        <label>
                            También dinos en lo que eres buen@, con lo que te sientes más <span className="bold">cómod@</span> haciendo
                            <input type="text" placeholder="Programación, artes, deportes" ref={aptitudesRef}/>
                        </label>
                    </form>
                </div>,'mascot',null,true,registrar);
                setUsuarioNuevo(true);
                setPuntos(0);
            }else{
                setPuntos(response.data.usuario.points);
            }
        }

        getUsuarioNuevo();
    }, []);

    return (
        <>
            <Navbar />
            <main>
                {props.children}
            </main>
            <Alert
                isOpen={alertOpen}
                title={alert?.title}
                message={alert?.message}
                kind={alert?.kind}
                closeAlert={closeAlert}
                redirectRoute={alert?.redirectRoute}
                asking={alert?.asking}
                onAccept={alert?.onAccept}
            />
        </>
    );
}

export default LayoutDashboard;