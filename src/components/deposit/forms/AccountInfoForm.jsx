import {useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import {DataGrid} from '@mui/x-data-grid';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import authFetch from "../../../hooks/authFetch.jsx";
import {GET_DEPOSITS} from "../../../config.js";

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

const AccountInfoForm = () => {
    const [passport, setPassport] = useState('');
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [passportSent, setPassportSent] = useState(false);
    const [error, setError] = useState(null);

    const handlePassportChange = (event) => {
        setPassport(event.target.value);
    };

    const handleGetAccounts = () => {
        if (!passport) {
            alert('Пожалуйста, введите паспортные данные.');
            return;
        }

        setLoading(true);
        setError(null); // Сбрасываем ошибку

        authFetch(
            `${GET_DEPOSITS}/${passport}`,
            {
                method: 'GET',
            }
        ).then(r => r.json()).then(data => {
            setAccounts(data)
        }).catch((error) => {
            setError("Пользователь не найден")
            console.error(error)
            setAccounts([]); // Очищаем список счетов
        })
        setLoading(false);
        setPassportSent(true);

    };

    const columns = [
        {field: 'id', headerName: 'ID', width: 70},
        {field: 'depositAccountName', headerName: 'Название счета', width: 200},
        {field: 'balance', headerName: 'Баланс', width: 130},
        {field: 'moneyType', headerName: 'Валюта', width: 90}
    ];

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
                    maxWidth: 600, // Увеличил ширину для таблицы
                    margin: '0 auto',
                }}
            >
                <Typography variant="h5" component="h2" gutterBottom>
                    Информация о счетах
                </Typography>
                <TextField
                    id="passport"
                    label="Паспортные данные"
                    variant="outlined"
                    value={passport}
                    onChange={handlePassportChange}
                    fullWidth
                    disabled={loading || passportSent}
                />
                <Button
                    variant="contained"
                    onClick={handleGetAccounts}
                    disabled={loading || passportSent}
                >
                    {loading ? <CircularProgress size={24}/> : 'Получить информацию'}
                </Button>
                {error && (
                    <Typography color="error" mt={2}>
                        {error}
                    </Typography>
                )}

                {/* Таблица с информацией о счетах */}
                {passportSent && accounts.length > 0 && (
                    <div style={{height: 300, width: '100%', marginTop: '1rem'}}>
                        <DataGrid
                            rows={accounts}
                            columns={columns}
                            pageSize={5} // Начальное количество строк на странице
                            rowsPerPageOptions={[5, 10, 20]} // Доступные опции количества строк на странице
                            paginationMode="client" // Или "server", если пагинация на сервере
                            hideFooterPagination // Скрывает пагинатор (кнопки переключения страниц)
                            disableColumnMenu // Скрывает меню столбца (сортировка, фильтрация)
                            disableSelectionOnClick // Отключает выделение строки при клике
                            density="compact" // Уменьшает высоту строк для более компактного вида
                        />
                    </div>
                )}
                {passportSent && accounts.length === 0 && !error && (
                    <Typography mt={2}>
                        У пользователя нет счетов.
                    </Typography>
                )}
            </Box>
        </ThemeProvider>
    );
};

export default AccountInfoForm;