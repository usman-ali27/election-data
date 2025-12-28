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
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);
        setData(jsonData);
      } catch (error) {
        console.error("Error reading the Excel file:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const term = searchTerm.trim().toLowerCase();

    // If the search term is empty after trimming, show no results.
    if (!term) {
        navigate('/results', { state: { filteredData: [] } });
        return;
    }

    const filteredData = data.filter(item => {
        // Search through all values of the item
        return Object.values(item).some(value =>
            // Ensure value is not null/undefined, convert to string, trim, and then compare
            value?.toString().trim().toLowerCase().includes(term)
        );
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
