import {useState} from 'react';
import '../protected-styles.scss';
import Modal from '@mui/material/Modal'; // Импортируем Modal
import Box from '@mui/material/Box';
import NewAccountForm from "./forms/NewAccountForm.jsx";
import WithdrawMoney from "./forms/WithdrawMoney.jsx";
import {Alert, Fade, Slide, Snackbar, styled} from "@mui/material";
import '../../i18n.js'
import AddMoney from "./forms/AddMoney.jsx";
import TransferForm from "./forms/TransferForm.jsx";
import AccountsInfoForm from "./forms/AccountInfoForm.jsx";
import {useTranslation} from "react-i18next";

const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    border: '2px solid #000',
    boxShadow: 24,
};

function DepositMainPage() {
    const {t} = useTranslation();

    const [newAccountModalOpen, setNewAccountModalOpen] = useState(false); // Состояние для открытия/закрытия модального окна
    const handleOpenAccountModal = () => setNewAccountModalOpen(true); // Функция открытия
    const handleCloseAccountModal = () => setNewAccountModalOpen(false); // Функция закрытия

    const [newWithdrawMoneyModalOpen, setNewWithdrawMoneyModalOpen] = useState(false); // Состояние для открытия/закрытия модального окна
    const handleOpenWithdraw = () => setNewWithdrawMoneyModalOpen(true); // Функция открытия
    const handleCloseWithdraw = () => setNewWithdrawMoneyModalOpen(false);

    const [addMoneyModalOpen, setAddMoneyModalOpen] = useState(false); // Состояние для открытия/закрытия модального окна
    const handleOpenAddingMoney = () => setAddMoneyModalOpen(true); // Функция открытия
    const handleCloseAddingMoney = () => setAddMoneyModalOpen(false);

    const [transferMoneyModalOpen, setTransferMoneyModalOpen] = useState(false); // Состояние для открытия/закрытия модального окна
    const handleOpenTransferMoney = () => setTransferMoneyModalOpen(true); // Функция открытия
    const handleCloseTransferMoney = () => setTransferMoneyModalOpen(false);

    const [accountInfoFormModalOpen, setAccountInfoFormModalOpen] = useState(false); // Состояние для открытия/закрытия модального окна
    const handleOpenAccountInfoForm = () => setAccountInfoFormModalOpen(true); // Функция открытия
    const handleCloseAccountInfoForm = () => {
        setAccountInfoFormModalOpen(false);
    }


    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success', // Добавим уровень важности (success, error, warning, info)
    });

    const showNotification = (message, severity = 'success') => {
        setNotification({open: true, message, severity});
    };
    const handleCloseNotification = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification((prev) => ({...prev, open: false})); // Создаём новый объект
    };

    const handleNewAccountSubmit = (message, severity) => { // Пример использования уведомления
        handleCloseAccountModal();
        showNotification(message, severity);
    }

    const handleWithdrawMoneySubmit = (message, severity) => {
        handleCloseWithdraw();
        showNotification(message, severity)
    }

    const handleAddMoneySubmit = (message, severity) => {
        handleCloseAddingMoney()
        showNotification(message, severity)
    }

    const handleTransferMoneySubmit = (message, severity) => {
        handleCloseTransferMoney()
        showNotification(message, severity)
    }
    const handleAccountInfoFormModalSubmit = (message, severity) => {
        handleCloseAccountInfoForm();
        showNotification(message, severity)
    }


    return (
        <div className="app">
            <main className="main-content">
                <section className="dashboard">
                    <div className="dashboard-grid">
                        <div className="dashboard-item large" onClick={handleOpenAccountModal}
                             style={{cursor: 'pointer'}}>
                            <img src={"/logo/newAccount.svg"} alt="new account"/>
                            <p>{t("depositMain.newAccount")}</p>
                        </div>
                        <div className="dashboard-item">
                            <div onClick={handleOpenWithdraw} style={{cursor: 'pointer'}} className="icon">
                                <img src="/logo/take/take.svg" alt="take money"/>
                            </div>
                            <p>{t("depositMain.withdraw")}</p>
                        </div>
                        <div className="dashboard-item">
                            <div onClick={handleOpenAddingMoney}>
                                <img src="/logo/put.svg" alt="put money"/>
                                <p>{t("depositMain.put")}</p>
                            </div>
                        </div>
                        <div className="dashboard-item">
                            <div onClick={handleOpenTransferMoney}>
                                <img src="/logo/transfer.svg" alt="transfer"/>
                                <p>{t("depositMain.transfer")}</p>
                            </div>
                        </div>
                        <div className="dashboard-item">
                            <div onClick={handleOpenAccountInfoForm}>
                                <img src="/logo/take/take.svg" alt="take money"/>
                                <p>{t("depositMain.info")}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Modal
                open={newAccountModalOpen}
                onClose={handleCloseAccountModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyles}>
                    <NewAccountForm onClose={handleCloseAccountModal} onSubmit={handleNewAccountSubmit}/>

                </Box>
            </Modal>

            {/* Модальное окно снятия денег*/}
            <Modal
                open={newWithdrawMoneyModalOpen}
                onClose={handleCloseWithdraw}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyles}>
                    <WithdrawMoney onClose={handleCloseWithdraw} onSubmit={handleWithdrawMoneySubmit}/>

                </Box>
            </Modal>

            <Modal
                open={addMoneyModalOpen}
                onClose={handleCloseAddingMoney}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyles}>
                    <AddMoney onClose={handleCloseAddingMoney} onSubmit={handleAddMoneySubmit}/>

                </Box>
            </Modal>

            <Modal
                open={transferMoneyModalOpen}
                onClose={handleCloseTransferMoney}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyles}>
                    <TransferForm onClose={handleCloseTransferMoney} onSubmit={handleTransferMoneySubmit}/>
                </Box>
            </Modal>

            <Modal
                open={accountInfoFormModalOpen}
                onClose={handleCloseAccountInfoForm}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyles}> {/* Используем условные стили */}
                    <AccountsInfoForm onClose={handleCloseAccountInfoForm} onSubmit={handleAccountInfoFormModalSubmit}/>
                </Box>
            </Modal>
            <Snackbar
                open={notification.open}
                autoHideDuration={8000} // Увеличил время показа
                onClose={handleCloseNotification}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{width: '100%'}}>
                    {notification.message}
                </Alert>
            </Snackbar>

        </div>
    );
}

export default DepositMainPage;