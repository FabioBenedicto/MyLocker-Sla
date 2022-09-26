import React, { useState, createContext } from 'react';

export const SplashScreenContext = createContext({});

export function SplashScreenContextProvider({ children }) {
    const [splashScreen, setSplashScreen] = useState(true);

    return (
        <SplashScreenContext.Provider value={{ splashScreen, setSplashScreen }}>
            {children}
        </SplashScreenContext.Provider>
    );
}
