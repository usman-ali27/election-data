import { useLocation, useNavigate } from 'react-router-dom';
import * as XLSX from 'xlsx';

const formatDate = (dateValue: any) => {
    if (!dateValue) return 'N/A';

    if (typeof dateValue === 'number' && dateValue > 10000) {
        try {
            const date = XLSX.SSF.parse_date_code(dateValue);
            if (date && date.y > 1900 && date.y < 2100) {
                const day = date.d.toString().padStart(2, '0');
                const month = date.m.toString().padStart(2, '0');
                return `${day}-${month}-${date.y}`;
            }
        } catch (e) {
            return dateValue.toString();
        }
    }
    
    if (typeof dateValue === 'string') {
        return dateValue;
    }

    return 'N/A'; 
};


const ResultsPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { filteredData } = location.state || { filteredData: [] };

    const handleBack = () => {
        navigate(-1);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="results-page">
            <div className="results-container">
                <h1 className="results-title">Search Results</h1>
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Sr No.</th>
                                <th>Emp Code</th>
                                <th>Name</th>
                                <th>Parentage</th>
                                <th>CNIC</th>
                                <th>DOB</th>
                                <th>Directorate</th>
                                <th>Designation</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((item: any, index: number) => (
                                    <tr key={index}>
                                        <td>{item['Sr No'] || 'N/A'}</td>
                                        <td>{item['Emp Code'] || 'N/A'}</td>
                                        <td>{item.Name || 'N/A'}</td>
                                        <td>{item.Parentage || 'N/A'}</td>
                                        <td>{item.CNIC || 'N/A'}</td>
                                        <td>{formatDate(item.DOB)}</td>
                                        <td>{item.Directorate || 'N/A'}</td>
                                        <td>{item.Designation || 'N/A'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="no-results">
                                    <td colSpan={8}>No matching records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="button-group">
                    <button onClick={handleBack} className="btn btn-secondary">Back to Search</button>
                    <button onClick={handlePrint} className="btn btn-primary">Print Results</button>
                </div>
            </div>
        </div>
    );
};

export default ResultsPage;
