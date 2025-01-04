import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'; // Импортируем индикатор загрузки
import { createTheme, ThemeProvider } from '@mui/material/styles';

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

const WithdrawForm = () => {
    const [passport, setPassport] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [selectedAccount, setSelectedAccount] = useState('');
    const [passportSent, setPassportSent] = useState(false);
    const [loading, setLoading] = useState(false); // Состояние загрузки

    const handlePassportChange = (event) => {
        setPassport(event.target.value);
    };

    const handleAccountChange = (event) => {
        setSelectedAccount(event.target.value);
    };

    const handleSendPassport = () => {
        if (!passport) {
            alert('Пожалуйста, введите паспортные данные.');
            return;
        }

        setLoading(true); // Начинаем загрузку

        // Имитация запроса на сервер с задержкой
        setTimeout(() => {
            // Здесь должна быть логика запроса к API для получения счетов
            // После успешного получения данных:
            setAccounts([
                { id: 1, name: 'Основной счет (RUB)', balance: 10000 },
                { id: 2, name: 'Депозитный счет (USD)', balance: 500 },
                { id: 3, name: 'Накопительный счет (EUR)', balance: 2000 },
            ]);
            setPassportSent(true);
            setLoading(false); // Заканчиваем загрузку
        }, 1000); // Задержка в 1 секунду
    };

    const handleWithdraw = () => {
        if (!selectedAccount) {
            alert('Пожалуйста, выберите счет.');
            return;
        }
        console.log('Снятие средств:', 'Паспорт:', passport, 'Счет:', selectedAccount);
        // Здесь должна быть логика снятия средств
        setSelectedAccount('');
        setPassport('');
        setPassportSent(false);
        setAccounts([]);
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
                <Typography variant="h5" component="h2" gutterBottom>
                    Снятие средств
                </Typography>
                <TextField
                    id="passport"
                    label="Паспортные данные"
                    variant="outlined"
                    value={passport}
                    onChange={handlePassportChange}
                    fullWidth
                    disabled={passportSent || loading} // Блокируем поле после отправки или во время загрузки
                />
                <Button variant="contained" onClick={handleSendPassport} disabled={passportSent || loading}>
                    {loading ? <CircularProgress size={24} /> : 'Отправить паспорт'} {/* Отображаем индикатор загрузки */}
                </Button>
                <FormControl fullWidth disabled={!passportSent}> {/* Блокируем, пока не отправлен паспорт */}
                    <InputLabel id="account-label">Счет</InputLabel>
                    <Select
                        labelId="account-label"
                        id="account"
                        value={selectedAccount}
                        label="Счет"
                        onChange={handleAccountChange}
                    >
                        {accounts.map((acc) => (
                            <MenuItem key={acc.id} value={acc.id}>
                                {acc.name} (Баланс: {acc.balance})
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleWithdraw} disabled={!selectedAccount}>
                    Снять
                </Button>
            </Box>
        </ThemeProvider>
    );
};

export default WithdrawForm;