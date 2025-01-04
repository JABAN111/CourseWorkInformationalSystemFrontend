import  "react";
import Public from "./components/Public.jsx";
import useAuth from "./hooks/useAuth.jsx";
import SideBar from "./components/SideBar.jsx";

function App() {
    const [isLogin, token, userInfo, isLoading] = useAuth();

    if (isLoading) {
        // Пока идет загрузка данных авторизации
        return <div>Loading...</div>;
    }

    return (
        <div>
            {isLogin ? <SideBar /> : <Public />}
        </div>
    );
}

export default App;