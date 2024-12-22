import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;
export const getCookies = async () => {
    try {
        const response = await axios.get(`${API}/cookies/`, {
            withCredentials: true,
        });
        const cookies = response.data;
        return cookies;
    } catch (error) {
    }
};

export const logout = async (
    csrfToken, setIsAuthenticated, setauthUser, router
) => {
    try {
        const response = await axios.post(`${API}/logout/`, {}, {
            headers: {
                'X-CSRFToken': csrfToken,
            },
            withCredentials: true,  // Ensures cookies are sent
        });
        setIsAuthenticated(false);
        // setauthUser(null);
        router.push('/landing');
    } catch (error) {
        setIsAuthenticated(false);
        setauthUser(null);
    }
};

