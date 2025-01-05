import "react";
import './SideBar.scss';
import React, {useState} from "react";
import DepositMainPage from "./deposit/DepositMainPage.jsx";
import NewAccountForm from "./deposit/forms/NewAccountForm.jsx";
import WithdrawForm from "./deposit/forms/WithdrawMoney.jsx";
import useAuth from "../hooks/useAuth.jsx";
import TransferForm from "./deposit/forms/TransferForm.jsx";
import AccountInfoForm from "./deposit/forms/AccountInfoForm.jsx";
import ExportTabv0 from "./ExportTabv0.jsx";
import ExportTab from "./export/ExportTab.jsx";

function SideBar() {

    const [activeTab, setActiveTab] = useState('deposit');

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
                return <DepositMainPage/>
            case 'bankCells':
                return <h1>Банковские ячейки</h1>
            // return <BankCells />
            case 'report':
                // return <h1>Отчет и экспорт</h1>
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
                    <img className="profile-photo" id={"profile-photo-img"} src={"/pizdec.jpg"} alt={"profile photo"} />
                    <div className="profile-info">
                        <p className="profile-name">
                            {userfullname}
                        </p>
                        <p className="profile-email">{getUserEmail()}</p>
                    </div>
                </div>
                <nav className="menu">
                    <div className={"menu-div"}>
                        <button
                            onClick={newActiveTab('deposit')}
                            className={`menu-item ${activeTab === 'deposit' ? 'active' : ''}`}
                        >
                            Счет
                        </button>
                    </div>
                    <div className={"menu-div"}>
                        <button
                            onClick={newActiveTab('bankCells')}
                            className={`menu-item ${activeTab === 'bankCells' ? 'active' : ''}`}
                        >
                            Банковские ячейки
                        </button>
                    </div>
                    <div className={"menu-div"}>
                        <button
                            onClick={newActiveTab('report')}
                            className={`menu-item ${activeTab === 'report' ? 'active' : ''}`}
                        >
                            Экспорт
                        </button>
                    </div>
                </nav>
            </aside>
            <div id="main">
                {renderPage()}
            </div>
        </div>
    );
}

export default SideBar;