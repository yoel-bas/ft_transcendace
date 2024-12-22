import React, { createContext, useContext, useState, useEffect} from 'react';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {axiosInstance} from '../../utils/axiosInstance';
import { fetchSearchResults } from '../friendHelper';

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const [authUser, setauthUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [try2fa, setTry2fa] = useState(false);
    const pathname = usePathname();
    const router = useRouter();
    const [signupData, setSignupData] = useState(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const [debouncedSearchInput, setDebouncedSearchInput] = useState(searchInput);

    const API = process.env.NEXT_PUBLIC_API_URL;

    const fetchAuthUser = async () => {
        try {
            const response = await axios(`${API}/user/`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const user = response.data;
            setauthUser(user);
            if (user) 
                setIsAuthenticated(true);
            } catch (error) {
            setauthUser(null);
            setError(error);
            setIsAuthenticated(false);
            if (pathname !== '/login')
                router.push('/landing');
        } 
        finally {
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
          setDebouncedSearchInput(searchInput);
        }, 300);
        return () => {
          clearTimeout(handler);
        };
      }
      , [searchInput]);
      

      useEffect(() => {
        setSearchResults([]);
        if(searchInput.length > 0) {
          fetchSearchResults(searchInput, setSearchResults, setSearchLoading);
        }
      }, [debouncedSearchInput]);

    useEffect(() => {
        fetchAuthUser();
    }
    , [pathname] );
    return (
        <UserContext.Provider value={{
                                        authUser,
                                        setauthUser,
                                        setLoading,
                                        loading,
                                        error,
                                        isAuthenticated,
                                        fetchAuthUser,
                                        setIsAuthenticated,
                                        setTry2fa,
                                        try2fa,
                                        setSearchInput,
                                        searchResults,
                                        searchLoading,
                                        setSignupData,
                                        signupData,
                                        setIsSearching,
                                        isSearching
                                    }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === null) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};

// Export the UserContext directly for access in components
// export { UserContext };
