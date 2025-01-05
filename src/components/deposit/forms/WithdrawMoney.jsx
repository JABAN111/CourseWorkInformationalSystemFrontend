import { useState } from 'react';
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
import authFetch from "../../../hooks/authFetch.jsx";
import {GET_DEPOSITS, WITHDRAW_DEPOSIT} from "../../../config.js";

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
    const [amount, setAmount] = useState(''); // Состояние для суммы
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

    const handleAmountChange = (event) => {
        setAmount(event.target.value);
    };

    const handleSendPassport = () => {
        if (!passport) {
            alert('Пожалуйста, введите паспортные данные.');
            return;
        }

        setLoading(true);


        authFetch(
            `${GET_DEPOSITS}/${passport}`,
            {
                method: 'GET',
            }
        ).then(r  => r.json()).then(
            data => {
                console.log(data)
                setAccounts(data)
                setPassportSent(true)
                setLoading(false)
            }
        ).catch(r => {
            console.error("Невалидный паспорт, ошибка:", r)
            alert("Невалидный паспорт")
        })

    };

    const handleWithdraw = () => {
        if (!selectedAccount) {
            alert('Пожалуйста, выберите счет.');
            return;
        }
        authFetch(
            WITHDRAW_DEPOSIT, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                fromAccount: selectedAccount,
                amount: amount,
                toAccount: selectedAccount
            }),

        }).then((response) => {
            if (response.status === 200) {
                alert('Средства успешно сняты.');
            } else {
                alert('Ошибка снятия средств.');
            }
        })
        console.log(`url: ${WITHDRAW_DEPOSIT}`)

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
                <Button
                    variant="contained"
                    onClick={handleSendPassport}
                        disabled={passportSent || loading}>
                    {loading ? <CircularProgress size={24} /> : 'Отправить паспорт'}
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
                                {acc.depositAccountName} (Баланс: {acc.balance}) (Валюта: {acc.moneyType})
                            </MenuItem>
                        ))}
                    </Select>

                </FormControl>
                <TextField
                    id="amount"
                    label="Сумма снятия"
                    variant="outlined"
                    type="number" // Указываем тип number для ввода чисел
                    value={amount}
                    onChange={handleAmountChange}
                    fullWidth
                    inputProps={{ min: 0 }} // Устанавливаем минимальное значение
                    disabled={!passportSent || !selectedAccount}
                />
                <Button variant="contained" onClick={handleWithdraw} disabled={!selectedAccount}>
                    Снять
                </Button>
            </Box>
        </ThemeProvider>
    );
};

export default WithdrawForm;