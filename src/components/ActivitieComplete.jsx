import { useParams } from "react-router-dom";
import {useState, useEffect} from "react";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import LayoutDashboard from "./LayoutDashboard";
function ActivitieComplete() {
    const { id } = useParams();
    const [activity, setActivity] = useState(null);
    useEffect(() => {
        const getActivity = async () => {
            const response = await axios.get('http://localhost:3000/activitie/' + id);
            setActivity(response.data.data);
        }
        getActivity();
    }, []);
    return (
        <LayoutDashboard>
            {activity ? (<>
            <h1 className="bold">{activity.title}</h1>
            <div className="content">
                {activity.completed === 1 ? <p className="bold" style={{color:'blue'}}>Completada</p> : <p>Pendiente</p>}
                <p>{activity.subject}</p>
                <p>{activity.points} puntos</p>
                <p>{activity.description}</p>
                <ReactMarkdown>{activity.answerGPT}</ReactMarkdown>
                <p>{activity.observations}</p>
            </div>
            </>) : <p>Cargando...</p>}
        </LayoutDashboard>
    );
}

export default ActivitieComplete;