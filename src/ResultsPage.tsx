import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { filteredData } = location.state || { filteredData: [] };

  const handlePrint = () => {
    window.print();
  };

  const handleBack = () => {
    navigate(-1);
  };

  const headers = filteredData.length > 0 ? Object.keys(filteredData[0]) : [];

  return (
    <div className="results-page">
        <div className="results-container print-container">
            <h1 className="results-title">Search Results</h1>
            <div className="table-container">
                <table>
                    <thead>
                        <tr>
                            {headers.map(key => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length > 0 ? filteredData.map((row, index) => (
                            <tr key={index}>
                                {headers.map(header => (
                                    <td key={header}>{row[header]}</td>
                                ))}
                            </tr>
                        )) : (
                            <tr className="no-results">
                                <td colSpan={headers.length || 1}>No Matching Records Found</td>
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
