import {useNavigate } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import './css/alert.css';
function Alert({ isOpen, title, message, kind, closeAlert, redirectRoute, asking, onAccept}) {
    const navigate = useNavigate();
    const redirectTo = () => {
      if(redirectRoute){
        navigate(redirectRoute);
      }else{
        closeAlert()
      }
    }
    const images = {
      'success': 'success.png',
      'error': 'error.png',
      'question': 'question.png',
      'loading': 'loading.svg',
      'mascot' : 'mascot.jpg'
    }
    const accept = () => {
      closeAlert();
      onAccept();
    }
    return isOpen ? (
        <div className="alert">
          <div className="content-alert">
            
            
            <button className="close-alert" onClick={closeAlert}
              data-tooltip-id='tooltip'
              data-tooltip-content='Cerrar alerta'
              data-tooltip-place='top'
            >
              <img src={`img/close.webp`} id="closeAlert" alt="Icono cerrar la alerta" />
            </button>
            <h1>{title}</h1>
            <img src={`img/` + (images[kind])} alt="Icono de alerta" className="icon"/>
            <div style={{color:'black', textAlign:'center', margin:'1rem'}}>{message}</div>
            <div style={{display:'flex', width:'80%', justifyContent:'space-around'}}>
              {kind === 'loading' ? '' : <button className="accept" onClick={asking ? accept : redirectTo}>
                Aceptar
              </button>}
              {
                asking ? (
                  <button className="login" onClick={closeAlert} style={{backgroundColor: '#FE2A2A'}}>
                    Cancelar
                  </button>
                ) : ''
              }
            </div>
            </div>
            <Tooltip id="tooltip"></Tooltip>
        </div>
      ) : null;
}
 
export default Alert;