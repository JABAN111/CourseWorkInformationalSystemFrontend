import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {ADD_TO_DEPOSIT, GET_DEPOSITS, TRANSFER} from "../../../config.js";
import authFetch from "../../../hooks/authFetch.jsx";

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

const TransferForm = () => {
    const [amount, setAmount] = useState(""); // Сумма
    const [passport, setPassport] = useState(""); // Паспорт
    const [accounts, setAccounts] = useState([]); // Список своих счетов
    const [fromAccount, setFromAccount] = useState(""); // Счет, с которого списываются средства
    const [toAccount, setToAccount] = useState(""); // Счет, на который переводятся средства
    const [passportSent, setPassportSent] = useState(false); // Флаг отправки паспорта
    const [loading, setLoading] = useState(false); // Загрузка
    const [transferToOwnAccount, setTransferToOwnAccount] = useState(false); // Чекбокс состояния
    const [anotherAccount, setAnotherAccount] = useState(""); // Чужой счет

    const handlePassportChange = (event) => setPassport(event.target.value);
    const handleAmountChange = (event) => setAmount(event.target.value);
    const handleFromAccountChange = (event) => setFromAccount(event.target.value);
    const handleToAccountChange = (event) => setToAccount(event.target.value);
    const handleAnotherAccountChange = (event) =>
        setAnotherAccount(event.target.value);

    const handleToggleTransferToOwn = (event) =>
        setTransferToOwnAccount(event.target.checked);

    const handleSendPassport = () => {
        if (!passport) {
            alert("Пожалуйста, введите паспортные данные.");
            return;
        }

        setLoading(true);
        authFetch(`${GET_DEPOSITS}/${passport}`, {
            method: "GET",
        })
            .then((r) => r.json())
            .then((data) => {
                setAccounts(data);
                setPassportSent(true);
                setLoading(false);
            })
            .catch((r) => {
                console.error("Ошибка:", r);
                alert("Невалидный паспорт");
                setLoading(false);
            });
    };

    const handleTransfer = () => {
        if (!fromAccount) {
            alert("Пожалуйста, выберите счет для списания.");
            return;
        }
        if (!toAccount && transferToOwnAccount) {
            alert("Пожалуйста, выберите счет для зачисления.");
            return;
        }
        if (!anotherAccount && !transferToOwnAccount) {
            alert("Пожалуйста, введите счет другого аккаунта.");
            return;
        }

        const payload = {
            fromAccount,
            amount,
            toAccount: transferToOwnAccount ? toAccount : anotherAccount,
        };

        authFetch(TRANSFER, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
        }).then((response) => {
            if (response.status === 200) {
                alert("Перевод выполнен успешно!");
            } else {
                alert("Ошибка перевода.");
            }
        });
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    p: 3,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    maxWidth: 400,
                    margin: "0 auto",
                }}
            >
                <Typography variant="h5" component="h2" gutterBottom>
                    Перевод средств
                </Typography>

                <TextField
                    id="passport"
                    label="Паспортные данные"
                    variant="outlined"
                    value={passport}
                    onChange={handlePassportChange}
                    fullWidth
                    disabled={passportSent || loading}
                />

                <Button
                    variant="contained"
                    onClick={handleSendPassport}
                    disabled={passportSent || loading}
                >
                    {loading ? <CircularProgress size={24} /> : "Отправить паспорт"}
                </Button>

                <FormControl fullWidth disabled={!passportSent}>
                    <InputLabel id="from-account-label">Счет списания</InputLabel>
                    <Select
                        labelId="from-account-label"
                        id="from-account"
                        value={fromAccount}
                        onChange={handleFromAccountChange}
                    >
                        {accounts.map((acc) => (
                            <MenuItem key={acc.id} value={acc.id}>
                                {acc.depositAccountName} (Баланс: {acc.balance}) (Валюта:{" "}
                                {acc.moneyType})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControlLabel
                    control={
                        <Switch
                            checked={transferToOwnAccount}
                            onChange={handleToggleTransferToOwn}
                        />
                    }
                    label="Перевести на один из своих счетов"
                />

                {transferToOwnAccount ? (
                    <FormControl fullWidth disabled={!passportSent}>
                        <InputLabel id="to-account-label">Счет зачисления</InputLabel>
                        <Select
                            labelId="to-account-label"
                            id="to-account"
                            value={toAccount}
                            onChange={handleToAccountChange}
                        >
                            {accounts.map((acc) => (
                                <MenuItem key={acc.id} value={acc.id}>
                                    {acc.depositAccountName} (Баланс: {acc.balance}) (Валюта:{" "}
                                    {acc.moneyType})
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                ) : (
                    <TextField
                        id="anotherAccount"
                        label="Номер счета другого аккаунта"
                        variant="outlined"
                        value={anotherAccount}
                        disabled={!passportSent || !fromAccount}
                        onChange={handleAnotherAccountChange}
                        fullWidth
                    />
                )}

                <TextField
                    id="amount"
                    label="Сумма перевода"
                    variant="outlined"
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                    fullWidth
                    inputProps={{ min: 0 }}
                    disabled={!passportSent || !fromAccount}
                />

                <Button
                    variant="contained"
                    onClick={handleTransfer}
                    disabled={!passportSent || !fromAccount || (!toAccount && !anotherAccount)}
                >
                    Перевести
                </Button>
            </Box>
        </ThemeProvider>
    );
};

export default TransferForm;