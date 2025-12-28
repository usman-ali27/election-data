import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import excelFile from './assets/DPL Vote Election25-27.xlsx';

const SearchPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(excelFile);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });

        // The main data is in the "Master" sheet.
        const sheetName = "Master";
        const worksheet = workbook.Sheets[sheetName];

        if (!worksheet) {
            console.error(`Sheet "${sheetName}" not found in the Excel file.`);
            return;
        }

        // Since there are no headers, read the data as an array of arrays.
        const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Manually define the headers in the correct order.
        const headers = ['Sr No', 'CNIC NO.', 'D.O.B', 'Name\'s', 'Parentage', 'Directorate'];

        // Convert the array of arrays into an array of objects.
        const jsonData = rows.map(row => {
            const rowData: { [key: string]: any } = {};
            headers.forEach((header, index) => {
                rowData[header] = row[index];
            });
            return rowData;
        });

        setData(jsonData);
      } catch (error) {
        console.error("Error reading the Excel file:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    // Normalize search term to be lowercase and without dashes.
    const normalizedTerm = searchTerm.trim().toLowerCase().replace(/-/g, '');

    if (!normalizedTerm) {
        navigate('/results', { state: { filteredData: [] } });
        return;
    }

    const filteredData = data.filter(item => {
        // For each item, check if any of its values match the normalized search term.
        return Object.values(item).some(value => {
            if (value === null || value === undefined) {
                return false;
            }
            // Normalize the data value in the same way as the search term.
            const normalizedValue = value.toString().trim().toLowerCase().replace(/-/g, '');
            return normalizedValue.includes(normalizedTerm);
        });
    });
    
    navigate('/results', { state: { filteredData } });
  };

  return (
    <div className="search-page">
        <div className="search-container">
            <h1 className="search-title">Search Records</h1>
            <div className="input-group">
                <label className="input-label">Search by CNIC or Name</label>
                <input
                    type="text"
                    placeholder="Enter CNIC or Name..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>
            <button onClick={handleSearch} className="search-button">Search</button>
        </div>
    </div>
  );
};

export default SearchPage;
