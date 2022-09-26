import React, { useState, createContext, useEffect } from 'react';
import api from '../services/api';

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState({
        ra: '',
        first_name: '',
        last_name: '',
        email: '',
    });
    const [cookieLoaded, setCookieLoaded] = useState(false);
    const [cookieValue, setCookieValue] = useState(false);

    useEffect(() => {
        api
            .get('/validate/students', { withCredentials: true })
            .then((response) => {
                setUser({ ...response.data });
                setCookieLoaded(true);
                setCookieValue(true);
            })
            .catch((err) => {
                console.log(err.response.data);
                setCookieLoaded(true);
            });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, cookieLoaded }}>
            {children}
        </UserContext.Provider>
    );
}
