import React, { useState, useEffect, useRef } from "react";
import Keycloak from "keycloak-js";

const client = new Keycloak({
    url: import.meta.env.VITE_KEYCLOAK_URL,
    realm: import.meta.env.VITE_KEYCLOAK_REALM,
    clientId: import.meta.env.VITE_KEYCLOAK_CLIENTID,
});

const useAuth = () => {
    const isRun = useRef(false);
    const [token, setToken] = useState(null);
    const [isLogin, setLogin] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Добавлено состояние загрузки

    useEffect(() => {
        if (isRun.current) return;

        isRun.current = true;
        client
            .init({ onLoad: "login-required" })
            .then((res) => {
                setLogin(res);
                setToken(client.token);

                const user = client.tokenParsed;
                sessionStorage.setItem("token", client.token);

                const userData = {
                    username: user.preferred_username,
                    given_name: user.given_name,
                    family_name: user.family_name,
                    email: user.email,
                    full_name: user.name,
                };

                setUserInfo(userData);
                sessionStorage.setItem("userInfo", JSON.stringify(userData));
            })
            .catch((error) => {
                console.error("Keycloak initialization error:", error);
                setLogin(false); // Если произошла ошибка, пользователь не авторизован
            })
            .finally(() => {
                setIsLoading(false); // Завершаем загрузку
            });
    }, []);

    return [isLogin, token, userInfo, isLoading];
};

export default useAuth;