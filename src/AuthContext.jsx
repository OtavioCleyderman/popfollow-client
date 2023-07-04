import { createContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState([null]);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate()

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      setToken(storedToken);
    }
    if (storedUser) {
      setUser(storedUser)
    }
    setIsLoading(false);
  }, []);

  const login = (user, token) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return navigate("/signin");
  };

  return (
      <AuthContext.Provider value={{ user, token, isLoading, setUser, setToken,  login, logout }}>
        {children}
      </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
