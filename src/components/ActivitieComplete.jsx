import { useParams } from "react-router-dom";
import {useState, useEffect, act} from "react";
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
    const [archivo, setArchivo] = useState(null);
    const [mostrarApartado, setMostrarApartado] = useState(false);
    const [evaluacion, setEvaluacion] = useState("Cargando evaluación...");
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
    function transformarCadena(cadena) {
        // Reemplazar saltos de línea por '\n'
        cadena = cadena.replace(/\n/g, '\\n');
        // Reemplazar comillas dobles por comillas simples
        cadena = cadena.replace(/"/g, "'");
        return cadena;
    }
    const handleFileUpload = (e) => {
        try{
            setArchivo(e.target.files[0]);
        }catch(error){
            openAlert("Error al subir el archivo", "Ocurrió un error inesperado al subir el archivo", "error", null);
        }
    };
    useEffect(() => {
        const getActivity = async () => {
            const response = await axios.get('https://grades-care-backend.onrender.com/activitie/' + id);
            setActivity(response.data.data);
            const usuario = ((await axios.post('https://grades-care-backend.onrender.com/perfil', {idUsuario: user.sub})).data).data;
            if(!response.data.data.answerGPT){
                const responseGPT = await axios.post('https://gradescare.onrender.com/actividad', 
                {
                    perfil: usuario.profile, 
                    nivelEducativo: response.data.data.scolar_level, 
                    carrera: usuario.career, 
                    materia: response.data.data.subject, 
                    descripcionActividad: response.data.data.description, 
                    observaciones: response.data.data.observations,
                    aptitudes: usuario.aptitudes
                });
                setTextoGPT(responseGPT.data);
                const finalResponse = await axios.post('https://grades-care-backend.onrender.com/activitie/answer/' + id, {answer: responseGPT.data});
                console.log(finalResponse.data);
            }
        }
        getActivity();
    }, []);

    
    const completarActividad = async (puntosObt) => {
        const response = await axios.post('https://grades-care-backend.onrender.com/activitie/complete/' + id, {idUsuario: user.sub, evaluacion: evaluacion, points:puntosObt});
        if(response.data.success){
            openAlert("¡Actividad completada!",
                <div>
                    <h2>¡Has completado la actividad con éxito!</h2>
                    <p>¡<span className="bold" style={{color: '#f5a122'}}>{puntosObt}</span> puntos serán sumados a tu cuenta!</p>
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
    useEffect(() => {
        if(evaluacion != "Cargando evaluación..."){
            console.log("Evaluación: ", evaluacion);
            let puntosObt = evaluacion.split("/100")[0].charAt(evaluacion.split("/100")[0].length - 2) + evaluacion.split("/100")[0].charAt(evaluacion.split("/100")[0].length - 1);            setPuntos(parseInt(puntos)+ parseInt(puntosObt));
            completarActividad(puntosObt);
        }
    }, [evaluacion]);
    const subirArchivo = async () => {
        const formData = new FormData();
        formData.append('file', archivo);
        openAlert("Subiendo archivo...", "Estamos subiendo tu archivo para revisión", "loading", null, null, null)
        const response = await axios.post('https://grades-care-backend.onrender.com/upload', formData, {headers: {'Content-Type': 'multipart/form-data'}});
        if(response.data.success){
            openAlert("¡Archivo subido!",
                <div>
                    <h2>¡Has subido el archivo con éxito!</h2>
                    <p>¡Ahora nuestra <span className="bold">IA</span> se encargará de revisarlo!</p>
                </div>,
                'success',
                null,
                null,
                null
            )
            const url = response.data.url;
            console.log(activity)
            console.log(JSON.stringify({url: url, tarea: transformarCadena(activity.answerGPT)}) );
            const responseEvaluacion = await axios.post('https://gradescare.onrender.com/evaluar', {url_pdf: url, tarea: transformarCadena(activity.answerGPT)});
            setEvaluacion(responseEvaluacion.data);
            console.log(responseEvaluacion.data);
            setMostrarApartado(true);
        }else{
            openAlert("¡Error al subir el archivo!",
                <div>
                    <h2>¡Hubo un error al subir el archivo!</h2>
                    <p>¡Inténtalo de nuevo más tarde!</p>
                </div>,
                'error',
                null,
                null,
                null
            )
        }
    };

    const deleteActivitie = async () => {
        const response = await axios.delete('https://grades-care-backend.onrender.com/activitie/' + id);
        if(response.data.success){
            openAlert("¡Actividad eliminada!",
                <div>
                    <h2>¡La actividad ha sido eliminada con éxito!</h2>
                    <p>¡No podrás recuperarla!</p>
                </div>,
                'success',
                '/',
                null,
                null
            )
        }else{
            openAlert("¡Error al eliminar la actividad!",
                <div>
                    <h2>¡Hubo un error al eliminar la actividad!</h2>
                    <p>¡Inténtalo de nuevo más tarde!</p>
                </div>,
                'error',
                null,
                null,
                null
            )
        }
    }
    return (
        <LayoutDashboard>
            {activity ? (<>
            <h1 className="bold">{activity.title}</h1>
            <div className="content">
                {activity.completed === 1 || completed? <p className="bold" style={{color:'blue'}}>Completada</p> : <p>Pendiente</p>}
                <p>Materia: {activity.subject}</p>
                <p>Vale {activity.points} puntos</p>
                <p>Descripción dada: {activity.description}</p>
                <p>Observaciones y restricciones dadas: {activity.observations}</p>
                <ReactMarkdown>{activity.answerGPT ? activity.answerGPT : textoGPT}</ReactMarkdown>
                
                {activity.completed !== 1 &&
                <>
                    <label className="login">
                        Calificar trabajo
                        <input type="file" onChange={handleFileUpload} style={{display:'none'}}/>
                    </label>
                    {archivo &&
                    <>
                        <h1>{archivo.name}</h1>
                        <button className="login" onClick={() => subirArchivo()}>Subir para revisión</button>
                        <p>Para la revisión <span className="bold">NO</span> es necesaria portada ni ningún adorno, el trabajo en sí mismo es suficiente.</p>
                    </>
                    }
                </>}
                
                 <div style={mostrarApartado || activity.completed === 1 ? {display:'block'} : {display: 'none'}}>
                    <h2>¿Cómo puedo mejorar?</h2>
                    <ReactMarkdown>{activity.evaluacion ? activity.evaluacion : evaluacion}</ReactMarkdown>
                </div>
            </div>
            </>) : <p>Cargando...</p>}
            <h2 className="bold" style={{color:'red'}}>Zona de peligro</h2>
            <button className="login" style={{backgroundColor: '#fc0339', fontWeight:'bold', color:'white'}} onClick={
                
                () => openAlert("¿Eliminar actividad?",
                <div>
                    <h2>¡Estás a punto de eliminar una actividad!</h2>
                    <p>¡No podrás recuperarla!</p>
                </div>,
                'question',
                '/',
                true,
                deleteActivitie
                )
                }>Eliminar actividad</button>
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