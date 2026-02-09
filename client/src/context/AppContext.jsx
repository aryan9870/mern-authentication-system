import { createContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [authenticatedUser, setAuthenticatedUser] = useState(false);
    axios.defaults.withCredentials = true;

    const getAuthState = async () => {
        const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
        console.log(data);
        if(data.success) {
            setIsLoggedin(true);
            getAuthenticatedUser();
        }
    }

    const getAuthenticatedUser = async () => {
        const {data} = await axios.get(backendUrl + '/api/user/me')
        if(data.success) {
            setAuthenticatedUser(data.user);
        }
    };

    useEffect(() => {
        getAuthState()
    }, [])

    const value = {
        backendUrl,
        isLoggedin, setIsLoggedin,
        authenticatedUser, setAuthenticatedUser,
        getAuthenticatedUser
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}