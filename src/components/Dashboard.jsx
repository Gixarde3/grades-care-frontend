import LayoutDashboard from "./LayoutDashboard";
import {useState, useEffect} from "react";
import Alert from "./Alert";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import Activitie from "./Activitie";
function Dashboard() {
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const [activities, setActivities] = useState([]);
    const { user, isAuthenticated, isLoading } = useAuth0();

    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }

    useEffect(() => {
        const getActivities = async () => {
            const response = await axios.post('http://localhost:3000/activities', {idUsuario: user.sub});
            setActivities(response.data.data);
        }
        getActivities();
    }, []);
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