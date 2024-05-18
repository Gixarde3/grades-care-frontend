import Alert from "./Alert";
import {useState} from "react";
import { useNavigate } from "react-router-dom";
function Activitie({titulo, descripcion, materia, puntos, actividad, observaciones, terminada, id}) {
    const [alert, setAlert] = useState(null);
    const [alertOpen, setAlertOpen] = useState(false);
    const navigate = useNavigate();
    const openAlert = (title, message, kind, redirectRoute, asking, onAccept) => {
        setAlert({ title: title, message: message, kind: kind, redirectRoute: redirectRoute, asking: asking, onAccept: onAccept});
        setAlertOpen(true);
    }
    const closeAlert = () => {
        setAlert(null);
        setAlertOpen(false);
    }
    return (
        <>
            <button className="activitie" onClick = {() => navigate(`activitie/${id}`)}>
                <p className="puntos">{puntos} pts.</p>
                <h2>{titulo}</h2>
                <p>{descripcion}</p>
                <p>{materia}</p>
            </button>
            <Alert 
                isOpen={alertOpen}
                title={alert?.title}
                message={alert?.message}
                kind={alert?.kind}
                closeAlert={closeAlert}
                redirectRoute={alert?.redirectRoute}
                asking={alert?.asking}
                onAccept={alert?.onAccept}/>
        </>
        
    );  
}

export default Activitie;