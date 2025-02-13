import {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from "@mui/material/Box";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import authFetch from "../../../hooks/authFetch.jsx";
import '../../../i18n.js'
import {useTranslation} from "react-i18next";

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

const dangerLevels = ["low", "medium", "high", "extreme"];

const RequestUpdate = () => {
    const [t] = useTranslation();

    const [artifactsList, setArtifactsList] = useState([]);
    const [artifactName, setArtifactName] = useState('');
    const [currentDangerLevel, setCurrentDangerLevel] = useState('');
    const [newDangerLevel, setNewDangerLevel] = useState('');
    const [error, setError] = useState('');

    const getAllArtifactData = async () => {
        try {
            const response = await authFetch("http://localhost:8080/api/v0/artifact/reference", { method: "GET" });
            if (!response.ok) throw new Error("Ошибка загрузки данных");

            const data = await response.json();
            setArtifactsList(data);
        } catch (error) {
            console.error("Ошибка при получении данных об артефактах:", error);
        }
    };

    useEffect(() => {
        getAllArtifactData();
    }, []);

    const handleArtifactChange = (event) => {
        const selectedArtifact = artifactsList.find(art => art.name === event.target.value);
        if (selectedArtifact) {
            setArtifactName(selectedArtifact.name);
            setCurrentDangerLevel(selectedArtifact.magicalProperty.dangerLevel);
            setNewDangerLevel(selectedArtifact.magicalProperty.dangerLevel);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!artifactName || !newDangerLevel) {
            setError('Выберите артефакт и новый уровень опасности.');
            return;
        }

        try {
            const response = await authFetch(
                "http://localhost:8080/api/v0/artifact/update-level",
                {
                    method: "PUT",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: artifactName,
                        newDangerLevel: newDangerLevel,
                    }),
                }
            );

            if (!response.ok) throw new Error("Ошибка обновления уровня опасности");

            // Обновляем список после изменения
            getAllArtifactData();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 1,
                maxWidth: 400,
                margin: '0 auto',
            }}>
                <h2>{t("artifactMain.updateDangerLevel")}</h2>
                {error && <div className="error-message">{t("notifications.error")}: {error}</div>}

                <FormControl fullWidth margin="normal">
                    <InputLabel id="artifact-label">{t("artifactMain.chooseArtifact")}</InputLabel>
                    <Select
                        labelId="artifact-label"
                        value={artifactName}
                        onChange={handleArtifactChange}
                        required
                    >
                        {artifactsList.map((artifact) => (
                            <MenuItem key={artifact.name} value={artifact.name}>
                                {artifact.name.replace(/_/g, ' ')} ({artifact.magicalProperty.dangerLevel})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {artifactName && (
                    <>
                        <FormControl fullWidth margin="normal">
                            <InputLabel id="danger-level-label">{t("artifactMain.chooseNewDangerLevel")}</InputLabel>
                            <Select
                                labelId="danger-level-label"
                                value={newDangerLevel}
                                onChange={(e) => setNewDangerLevel(e.target.value)}
                            >
                                {dangerLevels.map((level) => (
                                    <MenuItem key={level} value={level}>
                                        {level.charAt(0).toUpperCase() + level.slice(1)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Button type="submit" variant="contained" onClick={handleSubmit} style={{marginTop: '20px'}}>
                            {t("artifactMain.updateLevel")}
                        </Button>
                    </>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default RequestUpdate;