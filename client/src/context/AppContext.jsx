import { createContext, useEffect } from "react";
import { useState } from "react";
import axios from "axios";

export const AppContext = createContext()

export const AppContextProvider = (props) => {

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [authenticatedUser, setAuthenticatedUser] = useState(null);

    const getAuthenticatedUser = async () => {
        axios.defaults.withCredentials = true;
        const {data} = await axios.get(backendUrl + '/api/user/me')
        console.log("getauthenticateduser: ", data);
        setAuthenticatedUser(data.user);
        console.log("getauthuser runing")
    }



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