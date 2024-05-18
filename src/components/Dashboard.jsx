import LayoutDashboard from "./LayoutDashboard";
import {useState, useEffect, useRef} from "react";
import Alert from "./Alert";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Activitie from "./Activitie";
function Dashboard() {
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [activities, setActivities] = useState([]);

    const titleRef = useRef(null);
    const descriptionRef = useRef(null);
    const subjectRef = useRef(null);
    const observationsRef = useRef(null);
    const tipoRef = useRef(null);


    const { user, isAuthenticated, isLoading } = useAuth0();

    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    const getActivities = async () => {
        const response = await axios.post('https://grades-care-backend.onrender.com/activities', {idUsuario: user.sub});
        setActivities(response.data.data);
    }
    useEffect(() => {
        getActivities();
    }, []);

    const crearActividad = async () => {
        const response = await axios.post('https://grades-care-backend.onrender.com/activitie', {idUsuario: user.sub, title: titleRef.current.value, description: descriptionRef.current.value, subject: subjectRef.current.value, observations: observationsRef.current.value, type: tipoRef.current.value});
        if(response.data.success){
            openAlert("¡Actividad creada!",
                <div>
                    <h2>¡Tu actividad ha sido creada!</h2>
                    <p>¡Ahora podrás disfrutar de una experiencia personalizada!</p>
                </div>,
                'success',
                null,
                null,
                null
            )
            getActivities();
        }else{
            openAlert("¡Error!",
                <div>
                    <h2>¡Hubo un error al crear la actividad!</h2>
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
            <h1 className="bold">Actividades</h1>
            <div className="activities">
                {
                    activities.map((activity, index) => (
                        <Activitie 
                            key={index}
                            id={activity.id}
                            titulo={activity.title}
                            descripcion={activity.description}
                            materia={activity.subject}
                            puntos={activity.points}
                            actividad={activity.answerGPT}
                            observaciones={activity.observations}
                            terminada={activity.completed}
                        />
                    ))
                }
                <button className="activitie" style={{
                    alignItems: 'center',
                }} 
                onClick={() => openAlert('Crear actividad',
                    <form>
                        <label htmlFor="title">Título:</label>
                        <input type="text" id="title" name="title" ref={titleRef}/>
                        <label htmlFor="description">Da una descripción de lo que te falla, para que nuestra <span className="bold">IA</span> te proponga una actividad a tu medida:</label>
                        <textarea type="text" id="description" name="description"  ref={descriptionRef}></textarea>
                        <label htmlFor="subject">Materia:</label>
                        <input type="text" id="subject" name="subject" ref={subjectRef}/>
                        <label htmlFor="observations">Observaciones o restricciones:</label>
                        <input type="text" id="observations" name="observations" ref={observationsRef} />
                    </form>,
                    'mascot',
                    null,
                    true,
                    crearActividad)
                }
                
                >
                    <h3>Crear actividad</h3>
                    <img src="/img/add.png" alt="Imagen de añadir" />
                </button>
            </div>
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

export default Dashboard;