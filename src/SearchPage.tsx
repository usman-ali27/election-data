import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';
import electionFile from './assets/DPL Vote Election25-27.xlsx';
import regularEmployeesFile from './assets/Main File of Regular Employees PHA.xlsx';
import swordGif from './assets/sword.gif';

const SearchPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [electionResponse, regularResponse] = await Promise.all([
          fetch(electionFile),
          fetch(regularEmployeesFile)
        ]);

        const electionBuffer = await electionResponse.arrayBuffer();
        const regularBuffer = await regularResponse.arrayBuffer();

        // --- Process First File: DPL Vote Election25-27.xlsx ---
        const workbook1 = XLSX.read(electionBuffer, { type: 'buffer' });
        const sheetName1 = "Master";
        const worksheet1 = workbook1.Sheets[sheetName1];
        const rows1: any[][] = XLSX.utils.sheet_to_json(worksheet1, { header: 1 });
        console.log(rows1)
        const jsonData1 = rows1.slice(1).map(row => ({
          'Sr No': row[0],
          'CNIC': row[1],
          'DOB': row[2],
          'Name': row[3],
          'Parentage': row[4],
          'Directorate': row[7],
          'Designation': 'N/A',
          'Emp Code': 'N/A',
        }));

        // --- Process Second File: Main File of Regular Employees PHA.xlsx ---
        const workbook2 = XLSX.read(regularBuffer, { type: 'buffer' });
        const sheetName2 = "P workman";
        const worksheet2 = workbook2.Sheets[sheetName2];
        const rows2: any[][] = XLSX.utils.sheet_to_json(worksheet2, { header: 1 });
        console.log(rows2)

        const jsonData2 = rows2.slice(1).map(row => ({
          'Sr No': row[0],
          'Emp Code': row[1],
          'Name': row[2],
          'Parentage': row[3],
          'Designation': row[4],
          'DOB': row[5],
          'Directorate': row[7],
          'CNIC': row[8],
        }));
        console.log(jsonData2)
        const combinedData = [...jsonData1, ...jsonData2];
        setData(combinedData);

      } catch (error) {
        console.error("Error reading or processing Excel files:", error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = () => {
    const normalizedTerm = searchTerm.trim().toLowerCase().replace(/-/g, '');

    if (!normalizedTerm) {
      navigate('/results', { state: { filteredData: [] } });
      return;
    }

    const filteredData = data.filter(item => {
      return Object.values(item).some(value => {
        if (value === null || value === undefined) {
          return false;
        }

        if (typeof value === 'number' && value > 10000) { 
            try {
                const date = XLSX.SSF.parse_date_code(value);
                if (date && date.y > 1900 && date.y < 2100) {
                    const dateString = `${date.m}/${date.d}/${date.y}`;
                    const normalizedValue = dateString.toLowerCase().replace(/-/g, '');
                    if (normalizedValue.includes(normalizedTerm)) return true;
                }
            } catch (e) {
              console.log(e)
                // Not a date, handled as regular number below
            }
        }

        const normalizedValue = value.toString().trim().toLowerCase().replace(/-/g, '');
        return normalizedValue.includes(normalizedTerm);
      });
    });
    
    navigate('/results', { state: { filteredData } });
  };

  return (
    <div className="search-page">
        <div className="search-container">
            <img src={swordGif} alt="Sword Animation" style={{ width: 150, height: 150, marginBottom: 20 }} />
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
            <div className="signature-container">
                <p className="built-by">Built By:</p>
                <p className="signature">Usman Bhatti</p>
            </div>
        </div>
    </div>
  );
};

export default SearchPage;
