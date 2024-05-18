import LayoutDashboard from "./LayoutDashboard";

function Prizes() {
    const avatares = [];

    for(let i = 0; i < 10; i++){
        avatares.push({id: i, nombre: "Avatar " + (i+1), puntos: (i+1) * 100, imagen: `/img/avatares/avatar${i+1}.jpg`})
    
    }
    return (
    <LayoutDashboard>
        <div className="content">
            <h1 className="bold">Premios</h1>
            <div className="prizes">
                {
                    avatares.map((avatar, index) => (
                        <div className="prize" key={index}>
                            <img src={avatar.imagen} alt={avatar.nombre} className="avatar"/>
                            <h3>{avatar.nombre}</h3>
                            <p>{avatar.puntos} puntos</p>
                        </div>
                    ))
                }
            </div>
        </div>
    </LayoutDashboard>);
}

export default Prizes;