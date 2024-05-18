import { useParams } from "react-router-dom";
import {useState, useEffect} from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import LayoutDashboard from "./LayoutDashboard";
import Alert from "./Alert";
import { ContextoPuntos } from "./contextos/ContextoPuntos";
import { useContext, useRef } from "react";
import { useAuth0 } from "@auth0/auth0-react";
function ActivitieComplete() {
    const { id } = useParams();
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [activity, setActivity] = useState(null);
    const {puntos, setPuntos} = useContext(ContextoPuntos);
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [textoGPT, setTextoGPT] = useState("Cargando actividad...");
    const buttonRef = useRef(null);
    const [completed, setCompleted] = useState(false);
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    useEffect(() => {
        const getActivity = async () => {
            const response = await axios.get('http://localhost:3000/activitie/' + id);
            setActivity(response.data.data);
            const usuario = ((await axios.post('http://localhost:3000/perfil', {idUsuario: user.sub})).data).data;
            if(!response.data.data.answerGPT){

                const formData = new FormData();

                formData.append('text', response.data.data.description);
                
                console.log(JSON.stringify({
                    perfil: usuario.profile, 
                    nivelEducativo: response.data.data.scolar_level, 
                    carrera: usuario.career, 
                    materia: response.data.data.subject, 
                    edad: usuario.edad, 
                    descripcionActividad: response.data.data.description, 
                    observaciones: response.data.data.observations}));
                const responseGPT = await axios.post('https://gradescare.onrender.com/actividad', 
                {
                    perfil: usuario.profile, 
                    nivelEducativo: response.data.data.scolar_level, 
                    carrera: usuario.career, 
                    materia: response.data.data.subject, 
                    edad: usuario.edad, 
                    descripcionActividad: response.data.data.description, 
                    observaciones: response.data.data.observations});
                setTextoGPT(responseGPT.data);
                const finalResponse = await axios.post('http://localhost:3000/activitie/answer/' + id, {answer: responseGPT.data, points: 100});
                console.log(finalResponse.data);
            }
        }
        getActivity();
    }, []);
    const completarActividad = async () => {
        const response = await axios.post('http://localhost:3000/activitie/complete/' + id, {idUsuario: user.sub});
        if(response.data.success){
            openAlert("¡Actividad completada!",
                <div>
                    <h2>¡Has completado la actividad con éxito!</h2>
                    <p>¡Los puntos serán sumados a tu cuenta!</p>
                </div>,
                'success',
                null,
                null,
                null
            )
            setPuntos(puntos + activity.points);
            buttonRef.current.style.display = 'none';
            setCompleted(true);
        }
    }

    return (
        <LayoutDashboard>
            {activity ? (<>
            <h1 className="bold">{activity.title}</h1>
            <div className="content">
                {activity.completed === 1 || completed? <p className="bold" style={{color:'blue'}}>Completada</p> : <p>Pendiente</p>}
                <p>{activity.subject}</p>
                <p>{activity.points} puntos</p>
                <p>{activity.description}</p>
                <ReactMarkdown>{activity.answerGPT ? activity.answerGPT : textoGPT}</ReactMarkdown>
                <p>{activity.observations}</p>
                {activity.completed !== 1 && <button className="login" onClick={() => {openAlert(
                    "¿Deseas completar la actividad?",
                    <div>
                        <h2>¡Confiamos en ti!</h2>
                        <p>Con tu ayuda, podemos hacer de esta plataforma algo que realmente puede ayudarte</p>
                    </div>,
                    'question',
                    null,
                    true,
                    completarActividad
                )
                }} ref={buttonRef}>Completar actividad</button>}
            </div>
            </>) : <p>Cargando...</p>}
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
        </LayoutDashboard>
    );
}

export default ActivitieComplete;