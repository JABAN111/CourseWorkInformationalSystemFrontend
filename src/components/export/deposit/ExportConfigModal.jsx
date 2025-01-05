import { useState } from "react";
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    FormControl,
    FormControlLabel,
    Checkbox,
    FormLabel,
    Select,
    MenuItem,
    InputLabel,
    CircularProgress,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import authFetch from "../../../hooks/authFetch.jsx";
import { GET_DEPOSITS } from "../../../config.js";

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

const ExportConfigModal = ({ open, onClose, onSubmit }) => {
    const [passport, setPassport] = useState("");
    const [exportFormat, setExportFormat] = useState("xlsx");
    const [operations, setOperations] = useState({
        deposits: false,
        withdrawals: false,
        transfers: false,
    });
    const [excludedCurrencies, setExcludedCurrencies] = useState({
        galeons: false,
        rubalions: false,
        euralions: false,
    });
    const [loading, setLoading] = useState(false);
    const [accounts, setAccounts] = useState([]);
    const [passportSent, setPassportSent] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState("");

    const isReadyToSubmit = passportSent && selectedAccount;

    const handlePassportChange = (event) => {
        setPassport(event.target.value)
        setPassportSent(false)

    }

    const handleSendPassport = () => {
        if (!passport) {
            alert("Пожалуйста, введите паспортные данные.");
            return;
        }

        setLoading(true);

        authFetch(`${GET_DEPOSITS}/${passport}`, { method: "GET" })
            .then((response) => response.json())
            .then((data) => {
                setAccounts(data);
                setPassportSent(true);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Невалидный паспорт, ошибка:", error);
                alert("Невалидный паспорт");
                setLoading(false);
            });
    };

    const handleAccountChange = (event) => setSelectedAccount(event.target.value);

    const handleOperationChange = (event) =>
        setOperations({ ...operations, [event.target.name]: event.target.checked });

    const handleCurrencyChange = (event) =>
        setExcludedCurrencies({
            ...excludedCurrencies,
            [event.target.name]: event.target.checked,
        });

    const handleSubmit = () => {
        const payload = {
            passport,
            account: selectedAccount,
            exportFormat,
            operations: Object.keys(operations).filter((key) => operations[key]),
            excludedCurrencies: Object.keys(excludedCurrencies).filter(
                (key) => excludedCurrencies[key]
            ),
        };
        onSubmit(payload);
        onClose();
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
                        Конфигурация экспорта
                    </Typography>

                    <TextField
                        id="passport"
                        label="Паспортные данные"
                        variant="outlined"
                        fullWidth
                        value={passport}
                        onChange={handlePassportChange}
                        sx={{ mb: 2 }}
                    />

                    <Button
                        variant="contained"
                        onClick={handleSendPassport}
                        disabled={passportSent || loading}
                        sx={{ mb: 2 }}
                    >
                        {loading ? <CircularProgress size={24} /> : "Отправить паспорт"}
                    </Button>

                    <FormControl fullWidth disabled={!passportSent} sx={{ mb: 2 }}>
                        <InputLabel id="account-label">Счет</InputLabel>
                        <Select
                            labelId="account-label"
                            id="account"
                            value={selectedAccount}
                            onChange={handleAccountChange}
                        >
                            {accounts.map((acc) => (
                                <MenuItem key={acc.id} value={acc.id}>
                                    {acc.depositAccountName} (Баланс: {acc.balance}) (Валюта:{" "}
                                    {acc.moneyType})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <FormLabel>Формат экспорта</FormLabel>
                        <Select
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            disabled={!passportSent}
                        >
                            <MenuItem value="xlsx">Excel (.xlsx)</MenuItem>
                            <MenuItem value="pdf">PDF</MenuItem>
                            <MenuItem value="csv">CSV</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <FormLabel>Типы операций</FormLabel>
                        {["deposits", "withdrawals", "transfers"].map((type) => (
                            <FormControlLabel
                                key={type}
                                control={
                                    <Checkbox
                                        name={type}
                                        checked={operations[type]}
                                        onChange={handleOperationChange}
                                        disabled={!passportSent}
                                    />
                                }
                                label={
                                    type === "deposits"
                                        ? "Внесения сумм"
                                        : type === "withdrawals"
                                            ? "Снятия"
                                            : "Переводы"
                                }
                            />
                        ))}
                    </FormControl>

                    <FormControl component="fieldset" sx={{ mb: 2 }}>
                        <FormLabel>Исключить валюты</FormLabel>
                        {["galeons", "rubalions", "euralions"].map((currency) => (
                            <FormControlLabel
                                key={currency}
                                control={
                                    <Checkbox
                                        name={currency}
                                        checked={excludedCurrencies[currency]}
                                        onChange={handleCurrencyChange}
                                        disabled={!passportSent}
                                    />
                                }
                                label={
                                    currency === "galeons"
                                        ? "Галеоны"
                                        : currency === "rubalions"
                                            ? "Рубалионы"
                                            : "Евралионы"
                                }
                            />
                        ))}
                    </FormControl>

                    <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        onClick={handleSubmit}
                        disabled={!isReadyToSubmit}
                    >
                        Сформировать отчет
                    </Button>
                </Box>
            </Modal>
        </ThemeProvider>
    );
};

export default ExportConfigModal;