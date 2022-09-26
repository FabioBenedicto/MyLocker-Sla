import { useContext } from 'react';
import { SplashScreenContext } from '../contexts/SplashScreenContext';

export default function useSplashScreen() {
    return useContext(SplashScreenContext);
}
