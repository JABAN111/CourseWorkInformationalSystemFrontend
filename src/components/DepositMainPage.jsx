import  { useState } from 'react';
import './protected-styles.scss';
import Modal from '@mui/material/Modal'; // Импортируем Modal
import Box from '@mui/material/Box';
import NewAccountForm from "./deposit/NewAccountForm.jsx";
// import NewAccountForm from './NewAccountForm'; // Импортируем компонент формы

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
    const [newAccountModalOpen, setNewAccountModalOpen] = useState(false); // Состояние для открытия/закрытия модального окна
    const handleOpenAccountModal = () => setNewAccountModalOpen(true); // Функция открытия
    const handleCloseAccountModal = () => setNewAccountModalOpen(false); // Функция закрытия

    const [newWithdrawMoneyModalOpen, setNewWithdrawMoneyModalOpen] = useState(false); // Состояние для открытия/закрытия модального окна
    const handleOpenWithdraw = () => setNewWithdrawMoneyModalOpen(true); // Функция открытия
    const handleCloseWithdraw = () => setNewWithdrawMoneyModalOpen(false); // Функция закрытия
    return (
        <div className="app">
            <main className="main-content">
                <header className="header">
                    {/* Поиск можно добавить позже */}
                </header>
                <section className="dashboard">
                    <div className="dashboard-grid">
                        <div className="dashboard-item large" onClick={handleOpenAccountModal} style={{cursor: 'pointer'}}> {/* Добавляем обработчик клика */}
                            <img src={"/logo/newAccount.svg"} alt="new account"/>
                            <p>Новый счет</p>
                        </div>
                        {/* Остальные элементы панели */}
                        <div className="dashboard-item">
                            <div className="icon">
                                <img src="/logo/take/take.svg" alt="take money"/>
                            </div>
                            <p>Снять</p>
                        </div>
                        <div className="dashboard-item">
                            <img src="/logo/put.svg" alt="put money"/>
                            <p>Внести</p>
                        </div>
                        <div className="dashboard-item">
                            <img src="/logo/transfer.svg" alt="transfer"/>
                            <p>Перевод</p>
                        </div>
                    </div>
                </section>
            </main>

            {/* Модальное окно открытия нового счета*/}
            <Modal
                open={newAccountModalOpen}
                onClose={handleCloseAccountModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyles}>
                    <NewAccountForm onClose = {handleCloseAccountModal}/>

                </Box>
            </Modal>

            {/* Модальное окно снятия денег*/}
            <Modal
                open={newAccountModalOpen}
                onClose={handleCloseAccountModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyles}>
                    <NewAccountForm onClose = {handleCloseAccountModal}/>

                </Box>
            </Modal>
        </div>
    );
}

export default DepositMainPage;