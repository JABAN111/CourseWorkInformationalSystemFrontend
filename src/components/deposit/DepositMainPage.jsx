import {useState} from 'react';
import '../protected-styles.scss';
import Modal from '@mui/material/Modal'; // Импортируем Modal
import Box from '@mui/material/Box';
import NewAccountForm from "./forms/NewAccountForm.jsx";
import WithdrawMoney from "./forms/WithdrawMoney.jsx";
import {Fade, Slide, Snackbar, styled} from "@mui/material";
import AddMoney from "./forms/AddMoney.jsx";
import TransferForm from "./forms/TransferForm.jsx";
import AccountsInfoForm from "./forms/AccountInfoForm.jsx";

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
    const handleCloseWithdraw = () => setNewWithdrawMoneyModalOpen(false);

    const [addMoneyModalOpen, setAddMoneyModalOpen] = useState(false); // Состояние для открытия/закрытия модального окна
    const handleOpenAddingMoney = () => setAddMoneyModalOpen(true); // Функция открытия
    const handleCloseAddingMoney = () => setAddMoneyModalOpen(false);

    const [transferMoneyModalOpen, setTransferMoneyModalOpen] = useState(false); // Состояние для открытия/закрытия модального окна
    const handleOpenTransferMoney = () => setTransferMoneyModalOpen(true); // Функция открытия
    const handleCloseTransferMoney = () => setTransferMoneyModalOpen(false);

    const [accountInfoFormModalOpen, setAccountInfoFormModalOpen] = useState(false); // Состояние для открытия/закрытия модального окна
    const handleOpenAccountInfoForm = () => setAccountInfoFormModalOpen(true); // Функция открытия
    const handleCloseAccountInfoForm = () => setAccountInfoFormModalOpen(false);


    const AccountInfoModalStyle = styled(Box)(({ theme }) => ({
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%', // Увеличиваем ширину
        maxWidth: 800, // Максимальная ширина, чтобы не было слишком большим на больших экранах
        height: '80%',
        maxHeight: 600,
        overflow: 'auto', // Добавляем прокрутку, если контент не помещается
        border: '2px solid #000',
        boxShadow: 24,
        padding: theme.spacing(3), // Добавляем отступы внутри модального окна
        backgroundColor: theme.palette.background.paper, // Фон модального окна
    }));
    // const accountInfoModalStyles = accountInfoFormModalOpen ? { ...modalStyles, width: '80%', maxWidth: 800, height: '80%', maxHeight: 600, overflow: 'auto' } : modalStyles;

    const [showNotification, setShowNotification] = useState({
        open: false,
        Transition: Fade,
    });
    const [textNotification, setTextNotification] = useState('');

    function SlideTransition(props) {
        return <Slide {...props} direction="up"/>;
    }

    const handleCloseNotification = () => {
        setShowNotification({
            ...showNotification,
            open: false,
        });
    };

    const processNotification = (Transition, message) => () => {
        setTextNotification(message);

        setShowNotification({
            open: true,
            Transition,
        });
    };

    return (
        <div className="app">
            <main className="main-content">
                {/*<header className="header">*/}
                {/*    <input value={"поиск"}/>*/}
                {/*     Поиск можно добавить позже*/}
                {/*</header>*/}
                <section className="dashboard">
                    <div className="dashboard-grid">
                        <div className="dashboard-item large" onClick={handleOpenAccountModal}
                             style={{cursor: 'pointer'}}> {/* Добавляем обработчик клика */}
                            <img src={"/logo/newAccount.svg"} alt="new account"/>
                            <p>Новый счет</p>
                        </div>
                        <div className="dashboard-item">
                            <div onClick={handleOpenWithdraw} style={{cursor: 'pointer'}} className="icon">
                                <img src="/logo/take/take.svg" alt="take money"/>
                            </div>
                            <p>Снять</p>
                        </div>
                        <div className="dashboard-item">
                            <div onClick={handleOpenAddingMoney}>
                                <img src="/logo/put.svg" alt="put money"/>
                                <p>Внести</p>
                            </div>
                        </div>
                        <div className="dashboard-item">
                            <div onClick={handleOpenTransferMoney}>
                                <img src="/logo/transfer.svg" alt="transfer"/>
                                <p>Перевод</p>
                            </div>
                        </div>
                        <div className="dashboard-item">
                            <div onClick={handleOpenAccountInfoForm}>
                                <img src="/logo/take/take.svg" alt="take money"/>
                                <p>Информация о счетах</p>
                            </div>
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
                    <NewAccountForm onClose={handleCloseAccountModal}/>

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
                    <WithdrawMoney onClose={handleCloseWithdraw}/>

                </Box>
            </Modal>

            <Modal
                open={addMoneyModalOpen}
                onClose={handleCloseAddingMoney}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyles}>
                    <AddMoney onClose={handleCloseAddingMoney}/>

                </Box>
            </Modal>

            <Modal
                open={transferMoneyModalOpen}
                onClose={handleCloseTransferMoney}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyles}>
                    <TransferForm onClose={handleCloseTransferMoney}/>
                </Box>
            </Modal>

            <Modal
                open={accountInfoFormModalOpen}
                onClose={handleCloseAccountInfoForm}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyles}> {/* Используем условные стили */}
                    <AccountsInfoForm onClose={handleCloseAccountInfoForm}/>
                </Box>
            </Modal>


            <Snackbar
                open={showNotification.open}
                onClose={handleCloseNotification}
                TransitionComponent={showNotification.Transition}
                message={textNotification}
                key={showNotification.Transition.name}
                autoHideDuration={1200}

            />
        </div>
    );
}

export default DepositMainPage;