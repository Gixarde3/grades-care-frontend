import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
function App() {
    return (
      <BrowserRouter>
        <Routes>
            <Route path = "/">
                <Route index element={<>Hola mundo</>}/>
            </Route>
        </Routes>
      </BrowserRouter>  
    );
}

export default App;