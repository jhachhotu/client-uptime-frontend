import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize from local storage on load
    useEffect(() => {
        const storedToken = localStorage.getItem('jwt_token');
        const storedEmail = localStorage.getItem('user_email');

        if (storedToken) {
            try {
                const decoded = jwtDecode(storedToken);
                // Check if token is expired
                if (decoded.exp * 1000 < Date.now()) {
                    logout();
                } else {
                    setToken(storedToken);
                    setUser({ email: decoded.sub || storedEmail });
                }
            } catch (err) {
                logout();
            }
        }
        setLoading(false);
    }, []);

    const login = (jwtToken, email) => {
        localStorage.setItem('jwt_token', jwtToken);
        localStorage.setItem('user_email', email);
        setToken(jwtToken);
        setUser({ email });
    };

    const logout = () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_email');
        setToken(null);
        setUser(null);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
