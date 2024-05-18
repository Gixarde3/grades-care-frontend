import { createContext, useState } from "react";
const ContextoPuntos = createContext();

function ContextoPuntosProvider({children}) {
    const [puntos, setPuntos] = useState(0);
    return (
        <ContextoPuntos.Provider value={{puntos, setPuntos}}>
            {children}
        </ContextoPuntos.Provider>
    );
}

export { ContextoPuntos, ContextoPuntosProvider };
