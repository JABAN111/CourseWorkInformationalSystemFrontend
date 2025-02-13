import {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import TextareaAutosize from '@mui/material/TextareaAutosize';
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


const RequestKey = () => {
    const [t] = useTranslation();

    const [artifactsList, setArtifactsList] = useState([]);

    const [passport, setPassport] = useState('');
    const [artifactName, setArtifactName] = useState('');
    const [dangerLevel, setDangerLevel] = useState('');
    const [description, setDescription] = useState('');
    const [key, setKey] = useState(null);
    const [error, setError] = useState('');

    const getAllArtifactData = async () => {
        try {
            const response = await authFetch(
                "http://localhost:8080/api/v0/artifact/reference",
                {
                    method: "GET",
                }
            );

            if (!response.ok) throw new Error("Ошибка загрузки данных");

            const data = await response.json();
            setArtifactsList(
                data
            )
        } catch (error) {
            console.error("Ошибка при получении данных об артефактах:", error);
            return []; // В случае ошибки возвращаем пустой массив
        }
    };

    useEffect(() => {
        getAllArtifactData()
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setKey(null);

        if (!passport || !artifactName || !description) {
            setError('Пожалуйста, заполните все поля.');
            return;
        }

        try {
            // console.log(description)
            const encodedDescription = encodeURIComponent(description);
            const urlT = `http://localhost:8080/api/v0/artifact/get-key/`+encodedDescription
            console.log(urlT)
            const response = await authFetch(urlT,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: artifactName,
                        // magicalProperty: {
                        //     dangerLevel: dangerLevel,
                        //     property:
                        // },
                        currentClient: {
                            passportID: passport
                        },
                        // artifactHistory: {
                        //     reasonToSave: description,
                        // }
                    }),
                });
            if (!response.ok) throw new Error("Ошибка получения ключа");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `key.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            // onClose(t('notifications.operationSucceeded'),'success')
        } catch (err) {
            setError(err.message);
        }
    };

    const handleArtifactChange = (event) => {
        const selectedArtifact = artifactsList.find(art => art.name === event.target.value);
        if (selectedArtifact) {
            setArtifactName(selectedArtifact.name);
            setDangerLevel(selectedArtifact.magicalProperty.dangerLevel);
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
                    <h2>{t("artifactMain.getKeyComponent.info")}</h2>
                    {error && <div className="error-message">{t("notifications.error")}</div>}
                    <form onSubmit={handleSubmit} className="artifact-form">
                        <TextField
                            label={t("artifactMain.getKeyComponent.ID")}
                            value={passport}
                            onChange={(e) => setPassport(e.target.value)}
                            required
                            fullWidth
                            margin="normal"
                        />

                        <FormControl fullWidth margin="normal">
                            <InputLabel
                                id="artifact-label">{t("artifactMain.getKeyComponent.chooseArtifact")}</InputLabel>
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

                        <TextareaAutosize
                            minRows={5}
                            placeholder={t("artifactMain.getKeyComponent.goalKeeping")}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            style={{
                                width: '100%',
                                marginTop: '16px',
                                padding: '8px',
                                boxSizing: 'border-box',
                                fontFamily: 'Roboto, sans-serif',
                                fontSize: '16px'
                            }}
                        />

                        <Button type="submit" variant="contained" style={{marginTop: '20px'}}>
                            {t("artifactMain.getKeyComponent.getKey")}
                        </Button>

                        {key && (
                            <div className="key-display">
                                <h3>{t("artifactMain.getKeyComponent.urKey")}:</h3>
                                <p>{key}</p>
                            </div>
                        )}
                    </form>
                </div>
            </Box>
        </ThemeProvider>
    );
};

export default RequestKey;