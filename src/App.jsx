import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import LayoutDashboard from "./components/LayoutDashboard";
import { useAuth0 } from "@auth0/auth0-react";
import {ContextoPuntosProvider} from "./components/contextos/ContextoPuntos";
import Dashboard from "./components/Dashboard";
import ActivitieComplete from "./components/ActivitieComplete";

function App() {
    const { user, isAuthenticated, isLoading } = useAuth0();

    return (
      <BrowserRouter>
        <Routes>
            <Route path = "/">
                <Route index element={isAuthenticated ? 
                <ContextoPuntosProvider>
                        <Dashboard />
                </ContextoPuntosProvider>
                : <Login/> }/>
                <Route path = "activitie/:id" element={isAuthenticated ? 
                    <ContextoPuntosProvider>
                        <ActivitieComplete />
                    </ContextoPuntosProvider>
                    : <Navigate to="/" /> }/>
            </Route>
        </Routes>
      </BrowserRouter>  
    );
}

export default App;