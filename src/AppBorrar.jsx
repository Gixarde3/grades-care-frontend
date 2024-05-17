import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios'



function AppBorrar() {
  const [count, setCount] = useState(0)
  const { loginWithRedirect } = useAuth0();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const { logout } = useAuth0();
  useEffect(() => {
    const response = axios.get('http://localhost:3000');
  }, [])

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <>
      <button onClick={() => loginWithRedirect()}>Log In</button>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
        Log Out
      </button>

    </>
  )
}

export default AppBorrar
