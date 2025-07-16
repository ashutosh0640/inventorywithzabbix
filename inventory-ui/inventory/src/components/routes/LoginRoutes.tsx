import { useNavigate } from "react-router-dom";
import LoginPage from "../../pages/LoginPage";

export const LoginRoute = () => {
    console.log("login route...")
    const navigate = useNavigate();
    return <LoginPage onLoginSuccess={() => navigate('/dashboard')} />;
};


