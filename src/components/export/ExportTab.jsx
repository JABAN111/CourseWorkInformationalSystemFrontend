import Box from "@mui/material/Box";
import NewAccountForm from "../deposit/forms/NewAccountForm.jsx";
import Modal from "@mui/material/Modal";
import {useState} from "react";
import ExportConfigModal from "./deposit/ExportConfigModal.jsx";
import authFetch from "../../hooks/authFetch.jsx";
import {EXPORT_XLSX, GET_DEPOSITS} from "../../config.js";

const modalStyles = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    border: '2px solid #000',
    boxShadow: 24,
};

const ExportTab = () => {
    const [modalOpen, setModalOpen] = useState(false);

    const handleOpen = () => setModalOpen(true);
    const handleClose = () => setModalOpen(false);

    const handleExport = (config) => {
        console.log("Отправляем запрос на сервер с данными:", config);

        authFetch(
            `${GET_DEPOSITS}/${EXPORT_XLSX}`,
            {
                method: 'GET',
                // body: JSON.stringify(config),
            }

        ).then(r =>
            console.log(r)
        )

        // Здесь реализуйте отправку запроса на сервер
    };
    // const [newBankExportModalOpen, setNewBankExportModalOpen] = useState(false);
    // const handleOpenBankExportModal = () => setNewBankExportModalOpen(true);
    // const handleCloseBankExportModal = () => setNewBankExportModalOpen(false);


    return (
        <div className="export">
            <main className="main-content">
                <section className="dashboard">
                    <div className="dashboard-grid">
                        <div className="dashboard-item">
                            <div style={{cursor: 'pointer'}} onClick={handleOpen} className="icon">
                                <img src="/logo/take/take.svg" alt="take money"/>
                            </div>
                            <p>Банковские операции</p>
                        </div>
                        <div className="dashboard-item">
                            <div>
                                <img src="/logo/put.svg" alt="put money"/>
                                <p>Операции, связанные с артефактом</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <ExportConfigModal
                open={modalOpen}
                onClose={handleClose}
                onSubmit={handleExport}
            />
        </div>
    )

}

export default ExportTab;