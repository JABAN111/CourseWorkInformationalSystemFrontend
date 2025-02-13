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
import authFetch from "../../../hooks/authFetch.jsx";
import '../../../i18n.js'
import {CREATE_DEPOSIT} from "../../../config.js";
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


const NewAccountForm = (
    {onClose, onSubmit}
) => {
    const [t] = useTranslation();



    const [currency, setCurrency] = useState('RULEON');
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


            console.log('новый счет')
            authFetch(
                CREATE_DEPOSIT,
                {
                    method: 'POST',
                    headers: {
                        "content-type": "application/json",
                    },
                    body: JSON.stringify(body)
                }
            ).then((response) => {
                onSubmit(t("notifications.operationSucceeded"), 'success')
                console.log(response)
            }).catch(() =>
                onSubmit(t('notifications.operationFailed'), 'error'))
        } catch (error) {
            onSubmit(t('notifications.operationFailed'), 'error')
            console.error('Error creating account:', error);
        }
        onClose()

    };

    return (
        <>
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
                        margin: '0 auto'
                    }}
                >
                    <Typography variant="h5" component="h2" gutterBottom>
                        {t("depositMain.creating.newVault")}
                    </Typography>

                    <TextField
                        id="account-name"
                        label={t("depositMain.creating.vaultName")}
                        value={accountName}
                        onChange={handleAccountNameChange}
                        fullWidth
                    />

                    <TextField
                        id={"user-passport"}
                        label={t("depositMain.creating.accountId")}
                        variant={"outlined"}
                        value={userPassport}
                        onChange={(event) => setUserPassport(event.target.value)}
                        fullWidth
                    />

                    <FormControl fullWidth>


                        <InputLabel id="currency-label">
                            {t("depositMain.creating.currency")}
                        </InputLabel>

                        <Select
                            labelId="currency-label"
                            id="currency"
                            value={currency}
                            label={t("depositMain.creating.currency")}
                            onChange={handleChange}
                        >
                            <MenuItem value={'RULEON'}>{t("depositMain.creating.currencyType.RULEON")}</MenuItem>
                            <MenuItem value={'GALEON'}>{t("depositMain.creating.currencyType.GALEON")}</MenuItem>
                            <MenuItem value={'EULEON'}>{t("depositMain.creating.currencyType.EULEON")}</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" onClick={handleSubmit}>
                        {t("depositMain.creating.create")}
                    </Button>
                </Box>
            </ThemeProvider>

        </>

    );
};

export default NewAccountForm;