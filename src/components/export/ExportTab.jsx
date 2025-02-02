import { useState } from "react";
import ExportConfigModal from "./deposit/ExportConfigModal.jsx";
import ArtifactExportModal from "./artifact/ArtifactExportModal.jsx";
import authFetch from "../../hooks/authFetch.jsx";
import '../../i18n.js'
import { EXPORT_XLSX, GET_DEPOSITS } from "../../config.js";
import {useTranslation} from "react-i18next";
import {Alert, Snackbar} from "@mui/material";

const ExportTab = () => {
    const { t } = useTranslation(); // Подключаем переводы

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
        setNotification((prev) => ({...prev, open: false}));
    };

    const [bankModalOpen, setBankModalOpen] = useState(false);
    const [artifactModalOpen, setArtifactModalOpen] = useState(false);

    const handleOpenBankModal = () => setBankModalOpen(true);
    const handleCloseBankModal = () => setBankModalOpen(false);

    const handleOpenArtifactModal = () => setArtifactModalOpen(true);
    const handleCloseArtifactModal = () => setArtifactModalOpen(false);

    const handleExportDeposit = (config) => {
        console.log("Отправляем запрос на сервер с данными:", config);

        authFetch(
            `${GET_DEPOSITS}/${EXPORT_XLSX}`,
            {
                method: 'GET',
            }
        ).then(response => console.log(response));
    };

    // const handleExportArtifact = ()

    return (
        <div className="export">
            <main className="main-content">
                <section className="dashboard">
                    <div className="dashboard-grid">
                        <div className="dashboard-item">
                            <div style={{ cursor: "pointer" }} onClick={handleOpenBankModal} className="icon">
                                <img src="/logo/take/take.svg" alt="take money" />
                            </div>
                            <p>{t("export.bankOperations")}</p>
                        </div>
                        <div className="dashboard-item">
                            <div style={{ cursor: "pointer" }} onClick={handleOpenArtifactModal} className="icon">
                                <img src="/logo/put.svg" alt="put money" />
                            </div>
                            <p>{t("export.artifactOperations")}</p>
                        </div>
                    </div>
                </section>
            </main>

            <ExportConfigModal
                open={bankModalOpen}
                onClose={handleCloseBankModal}
                onSubmit={handleExportDeposit}
            />
            <ArtifactExportModal
                open={artifactModalOpen}
                onClose={handleCloseArtifactModal}
                onSubmit={handleExportDeposit}
            />
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
};

export default ExportTab;