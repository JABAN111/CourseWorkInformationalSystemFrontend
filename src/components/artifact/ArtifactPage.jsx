import {useState} from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import RequestKey from "./forms/RequestKey.jsx";
import ClientKeys from "./forms/ClientKeys.jsx";
import ArtifactStorageInfo from "./forms/ArtifactStorageInfo.jsx";
import '../../i18n.js'
import {useTranslation} from "react-i18next";
import {Alert, Snackbar} from "@mui/material";

const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    border: '2px solid #000',
    boxShadow: 24,
};


const ArtifactPage = () => {
    const [t] = useTranslation();

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success',
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

    const [requestKey, setRequestKey] = useState(false)
    const handleOpenRequestKeyModal = () => setRequestKey(true);
    const handleCloseRequestKeyModal = (message, severity) => {
        setRequestKey(false);
        // showNotification(message, severity);
    }

    const [allKeys, setAllKeys] = useState(false)
    const handleOpenAllKeys = () => setAllKeys(true);
    const handleCloseAllKeys = (message, severity) => {
        // showNotification(message, severity);
        setAllKeys(false);
    }

    const [artifactStorageInfo, setArtifactStorageInfo] = useState(false);
    const handleOpenArtifactStorageInfo = () => setArtifactStorageInfo(true);
    const handleCloseArtifactStorageInfo = (message, severity) => {
        // showNotification(message, severity);
        setArtifactStorageInfo(false);
    }


    return (
        <div className="export">
            <main className="main-content">
                <section className="dashboard">
                    <div className="dashboard-grid">
                        <div className="dashboard-item">
                            <div style={{cursor: 'pointer'}} onClick={handleOpenRequestKeyModal} className="icon">
                                <img src="/logo/take/take.svg" alt="take money"/>
                            </div>
                            <p>
                                {t('artifactMain.getKey')}
                            </p>
                        </div>
                        <div className="dashboard-item">
                            <div style={{cursor: 'pointer'}} onClick={handleOpenAllKeys}>
                                <img src="/logo/put.svg" alt="put money"/>
                                <p>
                                    {t('artifactMain.getInfoAboutKeys')}
                                </p>
                            </div>
                        </div>
                        <div className="dashboard-item">
                            <div style={{cursor: 'pointer'}} onClick={handleOpenArtifactStorageInfo}>
                                <img src="/logo/put.svg" alt="put money"/>
                                <p>{t('artifactMain.getInfoAboutStorage')}</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Modal
                open={requestKey}
                onClose={handleCloseRequestKeyModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyles}>
                    <RequestKey onClose={handleCloseRequestKeyModal}/>
                </Box>
            </Modal>
            <Modal
                open={allKeys}
                onClose={handleCloseAllKeys}

                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyles}>
                    <ClientKeys onClose={handleCloseAllKeys}/>
                </Box>
            </Modal>
            <Modal
                open={artifactStorageInfo}
                onClose={handleCloseArtifactStorageInfo}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyles}>
                    <ArtifactStorageInfo onClose={handleCloseArtifactStorageInfo}/>
                </Box>
            </Modal>
            <Snackbar
                open={notification.open}
                autoHideDuration={8000}
                onClose={handleCloseNotification}
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{width: '100%'}}>
                    {notification.message}
                </Alert>
            </Snackbar>

        </div>
    )

}

export default ArtifactPage;