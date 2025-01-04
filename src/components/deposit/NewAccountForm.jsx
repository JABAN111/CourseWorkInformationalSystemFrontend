import {useState} from 'react';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import authFetch from "../../hooks/authFetch.jsx";
import {CREATE_DEPOSIT} from "../../config.js";
// import authFetch from "../../hooks/authFetch.jsx";

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



const NewAccountForm = (
    {onClose}
) => {
    const [currency, setCurrency] = useState('RUB');
    const [accountName, setAccountName] = useState('');
    const [userPassport, setUserPassport] = useState('');

    const handleChange = (event) => {
        setCurrency(event.target.value);
    };

    const handleAccountNameChange = (event) => {
        setAccountName(event.target.value)
    }

    const getUserData = () => {
        const userInfo = sessionStorage.getItem('userInfo');

        if (!userInfo) {
            console.error("user info not found")
            return
        }
        return JSON.parse(userInfo);
    }

    const getUserEmail = () => {
        const data = getUserData()
        return `${data.email}`
    }

    const handleSubmit = () => {
        try {
            const body = {

                depositAccountName: accountName,
                owner: {
                    email: getUserEmail(),
                    passportID: userPassport
                },
                balance: 0,
                moneyType: currency
            }
            console.log(body)

            authFetch(
                CREATE_DEPOSIT,
                {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(body)
                }
            ).then(r => r.json()).then(data => console.log(data))
            console.log(body)
        }catch (error) {
            console.error('Error creating account:', error);
        }

        onClose()
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
                    maxWidth: 400, // Ограничение ширины для лучшей читаемости
                    margin: '0 auto'
                }}
            >
                <Typography variant="h5" component="h2" gutterBottom>
                    Новый счет
                </Typography>

                <TextField
                    id="account-name"
                    label="Название счета"
                    // variant="outlined"
                    value={accountName}
                    onChange={handleAccountNameChange}
                    fullWidth
                />

                <TextField
                    id={"user-passport"}
                    label={"Паспорт пользователя"}
                    variant={"outlined"}
                    value={userPassport}
                    onChange={(event) => setUserPassport(event.target.value)}
                    fullWidth
                />

                <FormControl fullWidth>



                    <InputLabel id="currency-label">Валюта</InputLabel>

                    <Select
                        labelId="currency-label"
                        id="currency"
                        value={currency}
                        label="Валюта"
                        onChange={handleChange}
                    >
                        <MenuItem value={'RULEON'}>Рулеоны</MenuItem>
                        <MenuItem value={'GALEON'}>Галеоны</MenuItem>
                        <MenuItem value={'EULEON'}>Евролеоны</MenuItem>

                    </Select>


                </FormControl>
                <Button variant="contained" onClick={handleSubmit}>
                    Создать счет
                </Button>
            </Box>
        </ThemeProvider>
    );
};

export default NewAccountForm;