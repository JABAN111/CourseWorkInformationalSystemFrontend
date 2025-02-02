import {useState} from "react";
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Modal,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import authFetch from "../../../hooks/authFetch.jsx";
import {useTranslation} from "react-i18next";
import '../../../i18n.js'

const theme = createTheme({
    palette: {
        mode: "dark",
        primary: {
            main: "#64b5f6",
        },
        background: {
            default: "#212121",
            paper: "#424242",
        },
    },
});

const ArtifactExportModal = ({open, onClose, onSubmit}) => {
    const [t] = useTranslation();

    const [passport, setPassport] = useState("");
    const [artifactTypes, setArtifactTypes] = useState([]); // Теперь массив
    const [exportFormat, setExportFormat] = useState("xlsx");
    const [loading, setLoading] = useState(false);

    const isReadyToSubmit = passport && exportFormat;

    const handleArtifactTypeChange = (event) => {
        setArtifactTypes(event.target.value); // Значение будет массивом выбранных элементов
    };



    const handleCustomSubmit = () => {
        setLoading(true);
        const queryParams = new URLSearchParams();
        queryParams.append("accountId", passport);

        if (artifactTypes.length) {
            artifactTypes.forEach((type) => {
                queryParams.append("types", type);
            });
        }

        const url = `http://localhost:8080/api/v0/export/artifact/${exportFormat}?${queryParams.toString()}`;

        authFetch(url, {method: "GET"})
            .then((response) => {
                if (response.ok) {
                    return response.blob();
                } else {
                    throw new Error("Ошибка при скачивании файла.");
                }
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `artifact_report.${exportFormat}`;
                a.click();
                window.URL.revokeObjectURL(url);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Ошибка при скачивании отчета:", error);
                setLoading(false);
            });
    };

    return (
        <ThemeProvider theme={theme}>
            <Modal open={open} onClose={onClose}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        maxWidth: 500,
                        width: "100%",
                    }}
                >
                    <Typography variant="h6" gutterBottom>
                        {t('artifactMain.exportArtifact.title')}
                    </Typography>

                    <TextField
                        id="passport"
                        label={t('artifactMain.exportArtifact.ID')}
                        variant="outlined"
                        fullWidth
                        value={passport}
                        onChange={(e) => setPassport(e.target.value)}
                        sx={{mb: 2}}
                    />

                    <FormControl fullWidth sx={{mb: 2}}>
                        <InputLabel>{t('artifactMain.exportArtifact.types_optional')}</InputLabel>
                        <Select
                            multiple
                            value={artifactTypes}
                            onChange={handleArtifactTypeChange}
                            renderValue={(selected) => selected.join(", ")} // Отображение выбранных элементов
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="middle">Middle</MenuItem>
                            <MenuItem value="dangerous">Dangerous</MenuItem>
                            <MenuItem value="extreme">Extreme</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{mb: 2}} disabled={!passport}>
                        <InputLabel>{t('artifactMain.exportArtifact.exportFormat')}</InputLabel>
                        <Select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                        >
                            <MenuItem value="xlsx">Excel (.xlsx)</MenuItem>
                            <MenuItem value="pdf">PDF</MenuItem>
                            <MenuItem value="csv">CSV</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleCustomSubmit}
                        disabled={!isReadyToSubmit || loading}
                    >
                        {loading ? <CircularProgress size={24}/> : t('artifactMain.exportArtifact.build')}
                    </Button>
                </Box>
            </Modal>
        </ThemeProvider>
    );
};

export default ArtifactExportModal;