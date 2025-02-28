import React, { useState } from 'react';
import topNYSECompanies from '../components/NYSECompanies';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const CoveredCall = () => {
  const [stockPrice, setStockPrice] = useState('');
  const [strikePrice, setStrikePrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCompanies, setFilteredCompanies] = useState(topNYSECompanies);
  const [companyName, setCompanyName] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [stockCurrentPrice, setStockCurrentPrice] = useState('');

  const location = useLocation();
  const { username } = location.state || { username: 'User' };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    updateFilteredCompanies(e.target.value);
  };

  const updateFilteredCompanies = (searchTerm) => {
    const filtered = topNYSECompanies.filter(company => {
      if (!company || !company.symbol) return false;
      const searchLetters = searchTerm.toLowerCase().split('');
      const symbolLetters = company.symbol.toLowerCase().split('');
      return searchLetters.every(letter => symbolLetters.includes(letter));
    });
    setFilteredCompanies(filtered);
  };

  const handleSelectChange = (e) => {
    const selectedSymbol = e.target.value;
    setSelectedCompany(selectedSymbol);

    const company = topNYSECompanies.find(c => c.symbol === selectedSymbol);
    setCompanyName(company ? company.name : '');
  };

  const getCurrPrice = async () => {
    console.log("selectedCompany:", selectedCompany);
    console.log("companyName:", companyName);

    try {
      const url = 'https://api.twelvedata.com/time_series';
      const params = {
        symbol: selectedCompany,
        interval: '1min',
        outputsize: '1',
        apikey: '23ba00821f554f1483efe54897bedd08',
      };

      const response = await axios.get(url, { params });
      const data = response.data;

      if (data && data.values && data.values.length > 0) {
        const latestPrice = parseFloat(data.values[0].open).toFixed(2);
        console.log("Current Price from married put:", latestPrice);
        return latestPrice;
      } else {
        console.error('No data found in the response from Twelve Data:', data);
        return null;
      }
    } catch (error) {
      console.error('Error fetching current price:', error);
      return null;
    }
  };

  const sendCoveredCall = async () => {
    const curPrice = await getCurrPrice();  // Ensure we have the latest stock price before sending the request

    if (curPrice) {
      setStockCurrentPrice(curPrice);

      try {
        const response = await axios.patch('http://localhost:8080/addMarriedPut', null, {
          params: {
            username: username,
            symbol: selectedCompany,
            strikePrice: stockPrice,
            basePrice: curPrice,  // Use curPrice here directly
            time: strikePrice,
          }
        });

        if (response.status === 200) {
          console.log('Covered call added successfully:', response.data);
        } else {
          console.error('Error adding covered call:', response.data);
        }
      } catch (error) {
        console.error('Error sending request:', error);
      }
    }
  };

  return (
    <div style={{ display: 'flex' }}>
      <div>
        <h1 style={{ marginRight: '-500px' }}>Married Put (Protective Put) Strategy</h1>
      </div>
      <div style={{ padding: '20px' }}>
        <div style={{
          marginTop: '-20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          maxWidth: '1200px',
          gap: '20px',
        }}>
          <div style={{ flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2 style={{ color: 'black' }}>Select a Company:</h2>
            <input
              type="text"
              placeholder="Search by symbol..."
              value={searchTerm}
              onChange={handleSearchChange}
              style={{ padding: '10px', marginBottom: '20px', borderColor: 'black' }}
            />
            <select
              value={selectedCompany}
              onChange={handleSelectChange}
              size="10"
              style={{ padding: '10px', width: '300px', fontSize: '16px' }}
            >
              {filteredCompanies.map(company => (
                <option key={company.symbol} value={company.symbol}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div>
        <h4>Enter your Put (lower) price</h4>
        <input
          type="number"
          placeholder="Stock Price..."
          value={stockPrice}
          style={{ borderColor: 'black' }}
          onChange={(e) => setStockPrice(e.target.value)}
        />
        <h4>Enter the time to expiry (yrs)</h4>
        <input
          type="number"
          placeholder="Time..."
          value={strikePrice}
          style={{ borderColor: 'black' }}
          onChange={(e) => setStrikePrice(e.target.value)}
        />
        <div>
          <button
            onClick={sendCoveredCall}
            style={{ padding: '10px', fontSize: '16px', backgroundColor: '#65ed55', borderRadius: '15px', marginTop: '20px' }}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoveredCall;
