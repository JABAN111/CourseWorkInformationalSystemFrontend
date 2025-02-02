import "react";
import './SideBar.scss';
import '../i18n.js'
import React, {useState} from "react";
import DepositMainPage from "./deposit/DepositMainPage.jsx";
import WithdrawForm from "./deposit/forms/WithdrawMoney.jsx";
import ExportTab from "./export/ExportTab.jsx";
import ArtifactPage from "./artifact/ArtifactPage.jsx";
import {useTranslation} from "react-i18next";
function SideBar() {

    const [activeTab, setActiveTab] = useState('deposit');
    const { t, i18n } = useTranslation();
    const changeLanguage = (lang) => {
        i18n.changeLanguage(lang);
    };

    const getUserData = () => {
        const userInfo = sessionStorage.getItem('userInfo');

        if (!userInfo) {
            console.error("user info not found")
            return
            // throw new Error("user info not found")
        }
        return JSON.parse(userInfo);
    }

    const getFullNameUser = () => {
        const data = getUserData()
        return `${data.full_name}`
    }

    const getUserEmail = () => {
        const data = getUserData()
        return `${data.email}`
    }

    const renderPage = () => {
        switch (activeTab) {
            case 'deposit':
                // return <ArtifactStorageInfo/>
                return <DepositMainPage/>
            case 'bankCells':
                return <ArtifactPage/>
            case 'report':
                // return <RequestKey/>
                return <ExportTab/>
            default:
                return <WithdrawForm/>
        }
    }
    const newActiveTab = (tab) => {
        return () => {
            setActiveTab(tab)
        }
    }

    const userfullname = getFullNameUser();

    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="profile">
                    <img className="profile-photo" id={"profile-photo-img"} src={"/pizdec.jpg"} alt={"profile photo"}/>
                    <div className="profile-info">
                        <p className="profile-name">
                            {userfullname}
                        </p>
                        <p className="profile-email">{getUserEmail()}</p>
                        <div className="profile">
                            <p className="profile-name">{t("language.change")}</p>
                            <button className="lang-btn" onClick={() => changeLanguage("ru")}>
                                {t("language.russian")}
                            </button>
                            <button className="lang-btn" onClick={() => changeLanguage("en")}>
                                {t("language.english")}
                            </button>
                        </div>
                    </div>
                </div>
                <nav className="menu">
                    <button onClick={() => setActiveTab("deposit")}
                            className={`menu-item ${activeTab === "deposit" ? "active" : ""}`}>
                        {t("sidebar.deposit")}
                    </button>
                    <button onClick={() => setActiveTab("bankCells")}
                            className={`menu-item ${activeTab === "bankCells" ? "active" : ""}`}>
                        {t("sidebar.bankCells")}
                    </button>
                    <button onClick={() => setActiveTab("report")}
                            className={`menu-item ${activeTab === "report" ? "active" : ""}`}>
                        {t("sidebar.report")}
                    </button>
                </nav>
            </aside>
            <div id="main">
                {renderPage()}
            </div>
        </div>
    );
}

export default SideBar;