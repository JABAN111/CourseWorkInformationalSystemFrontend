import { useState } from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './ExportTabv0.scss'; // Импортируем стили

const ExportTabv0 = () => {
    const [exportType, setExportType] = useState('bank');
    const [format, setFormat] = useState('csv');
    const [passport, setPassport] = useState('');
    const [operationType, setOperationType] = useState('');
    const [includeTime, setIncludeTime] = useState(false);
    const [dollarOnly, setDollarOnly] = useState(false);
    const [accounts, setAccounts] = useState([]);

    const handleExport = () => {
        let dataToExport = generateMockData();

        if (exportType === 'bank') {
            if (!passport) {
                alert('Пожалуйста, введите паспортные данные.');
                return;
            }
            //Фильтрация данных по паспорту(в данном случае имитация)
            dataToExport = dataToExport.filter(item => item.passport === passport);
            if (operationType) {
                dataToExport = dataToExport.filter(item => item.operationType === operationType);
            }
            if (dollarOnly) {
                dataToExport = dataToExport.filter(item => item.currency === 'USD');
            }
        }

        if (format === 'csv') {
            exportToCSV(dataToExport);
        } else if (format === 'xlsx') {
            exportToXLSX(dataToExport);
        } else if (format === 'pdf') {
            exportToPDF(dataToExport);
        }
    };
    const generateMockData = () => {
        return [
            { passport: '123456', account: '1111', operationType: 'withdrawal', amount: 100, currency: 'USD', time: '10:00', artifact:'artifact1'},
            { passport: '123456', account: '1111', operationType: 'deposit', amount: 200, currency: 'RUB', time: '11:00', artifact:'artifact2'},
            { passport: '789012', account: '2222', operationType: 'transfer', amount: 50, currency: 'USD', time: '12:00', artifact:'artifact3'},
            { passport: '123456', account: '1111', operationType: 'withdrawal', amount: 100, currency: 'USD', time: '10:00', artifact:'artifact4'},
        ];
    }
    const exportToCSV = (data) => {
        const csvRows = [];
        const headers = Object.keys(data[0] || {}).filter(key => includeTime || key !== 'time');
        csvRows.push(headers.join(','));

        for (const row of data) {
            const values = headers.map(header => row[header]);
            csvRows.push(values.join(','));
        }

        const csvData = csvRows.join('\n');
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
        FileSaver.saveAs(blob, 'export.csv');
    };

    const exportToXLSX = (data) => {
        const headers = Object.keys(data[0] || {}).filter(key => includeTime || key !== 'time');
        const dataToExport = data.map(obj => headers.map(header => obj[header]))
        const worksheet = XLSX.utils.aoa_to_sheet([headers, ...dataToExport]);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Export Data');
        const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        FileSaver.saveAs(blob, 'export.xlsx');
    };

    const exportToPDF = (data) => {
        const headers = Object.keys(data[0] || {}).filter(key => includeTime || key !== 'time');
        const dataToExport = data.map(obj => headers.map(header => obj[header]))
        const doc = new jsPDF();
        doc.autoTable({ head: [headers], body: dataToExport });
        doc.save('export.pdf');
    };

    return (
        <div className="export-tab">
            <h2>Экспорт данных</h2>

            <div className="export-options">
                <label>
                    <input type="radio" value="bank" checked={exportType === 'bank'} onChange={(e) => setExportType(e.target.value)} />
                    Банковские операции
                </label>
                <label>
                    <input type="radio" value="artifact" checked={exportType === 'artifact'} onChange={(e) => setExportType(e.target.value)} />
                    Операции по артефакту
                </label>
            </div>

            {exportType === 'bank' && (
                <div className="bank-options">
                    <input type="text" placeholder="Паспорт" value={passport} onChange={(e) => setPassport(e.target.value)} />
                    <select value={operationType} onChange={(e) => setOperationType(e.target.value)}>
                        <option value="">Все типы</option>
                        <option value="withdrawal">Снятие</option>
                        <option value="deposit">Внесение</option>
                        <option value="transfer">Перевод</option>
                    </select>
                </div>
            )}

            <div className="additional-options">
                <label>
                    <input type="checkbox" checked={includeTime} onChange={(e) => setIncludeTime(e.target.checked)} />
                    Время операции
                </label>
                <label>
                    <input type="checkbox" checked={dollarOnly} onChange={(e) => setDollarOnly(e.target.checked)} />
                    Только доллары
                </label>
            </div>

            <div className="format-options">
                <button className={format === 'csv' ? 'active' : ''} onClick={() => setFormat('csv')}>CSV</button>
                <button className={format === 'xlsx' ? 'active' : ''} onClick={() => setFormat('xlsx')}>XLSX</button>
                <button className={format === 'pdf' ? 'active' : ''} onClick={() => setFormat('pdf')}>PDF</button>
            </div>

            <button className="export-button" onClick={handleExport}>Экспорт</button>
        </div>
    );
};

export default ExportTabv0;