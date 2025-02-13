import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import authFetch from "../../../hooks/authFetch.jsx";
import '../../../i18n.js'
import { useTranslation } from "react-i18next";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#64b5f6',
        },
        background: {
            default: '#212121',
            paper: '#424242',
        },
    },
});

const RetrieveArtifact = ({
                              onClose
                          }) => {
    const { t } = useTranslation();

    const [passport, setPassport] = useState('');
    const [cellNumber, setCellNumber] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!passport || !cellNumber) {
            setError('Пожалуйста, заполните все поля.');
            return;
        }

        try {
            const response = await authFetch("http://localhost:8080/api/v0/artifact/retrieve", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    passportID: passport,
                    storageUuid: cellNumber,
                }),
            });

            if (!response.ok) throw new Error("Ошибка получения артефакта");

            onClose()
            // const blob = await response.blob();
            // const url = window.URL.createObjectURL(blob);
            //
            // const a = document.createElement("a");
            // a.href = url;
            // a.download = `artifact_receipt.pdf`;
            // document.body.appendChild(a);
            // a.click();
            // document.body.removeChild(a);
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    p: 3,
                    bgcolor: 'background.paper',
                    borderRadius: 1,
                    maxWidth: 400,
                    margin: '0 auto',
                }}
            >
                <div className="artifact-form-container">
                    <h2>{t("artifactMain.retrieveArtifact.info")}</h2>
                    {error && <div className="error-message">{t("notifications.error")}: {error}</div>}
                    <form onSubmit={handleSubmit} className="artifact-form">
                        <TextField
                            label={t("artifactMain.retrieveArtifact.passport")}
                            value={passport}
                            onChange={(e) => setPassport(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />

                        <TextField
                            label={t("artifactMain.retrieveArtifact.cellNumber")}
                            value={cellNumber}
                            onChange={(e) => setCellNumber(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />

                        <Button type="submit" variant="contained" style={{ marginTop: '20px' }}>
                            {t("artifactMain.retrieveArtifact.getArtifact")}
                        </Button>
                    </form>
                </div>
            </Box>
        </ThemeProvider>
    );
};

export default RetrieveArtifact;