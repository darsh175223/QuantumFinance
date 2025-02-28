import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jStat } from 'jstat';
import { Heatmap } from '.././components/Heatmap';

function EDU_BS() {
  const location = useLocation();
  const navigate = useNavigate();
  const { username } = location.state || { username: 'User' };

  const [stockPrice, setStockPrice] = useState(120);
  const [strikePrice, setStrikePrice] = useState(100);
  const [timeToMaturity, setTimeToMaturity] = useState(0.5);
  const [riskFreeRate, setRiskFreeRate] = useState(5);
  const [volatility, setVolatility] = useState(20);
  const [callPrice, setCallPrice] = useState('');
  const [putPrice, setPutPrice] = useState('');
  const [inputs, setInputs] = useState({
    currentPrice: stockPrice,
    strike: strikePrice,
    timeToMaturity: timeToMaturity,
    volatility: volatility,
    interestRate: riskFreeRate,
  });
  const [heatmapParams, setHeatmapParams] = useState({
    spotMin: stockPrice * 0.8,
    spotMax: stockPrice * 1.2,
    volMin: volatility * 0.5,
    volMax: volatility * 1.5,
  });

  const calculateBlackScholes = () => {
    const S = parseFloat(stockPrice);
    const K = parseFloat(strikePrice);
    const T = parseFloat(timeToMaturity);
    const r = parseFloat(riskFreeRate) / 100;
    const sigma = parseFloat(volatility) / 100;

    const d1 = (Math.log(S / K) + (r + (sigma * sigma) / 2) * T) / (sigma * Math.sqrt(T));
    const d2 = d1 - sigma * Math.sqrt(T);

    const call = S * jStat.normal.cdf(d1, 0, 1) - K * Math.exp(-r * T) * jStat.normal.cdf(d2, 0, 1);
    const put = K * Math.exp(-r * T) * jStat.normal.cdf(-d2, 0, 1) - S * jStat.normal.cdf(-d1, 0, 1);

    setCallPrice(call.toFixed(2));
    setPutPrice(put.toFixed(2));

    // Update inputs and heatmapParams
    setInputs({
      currentPrice: stockPrice,
      strike: strikePrice,
      timeToMaturity: timeToMaturity,
      volatility: volatility,
      interestRate: riskFreeRate,
    });

    setHeatmapParams({
      spotMin: stockPrice * 0.8,
      spotMax: stockPrice * 1.2,
      volMin: volatility * 0.5,
      volMax: volatility * 1.5,
    });
  };

  const dashboardStyle = {
    marginTop: '-25px',
    backgroundImage: `url(${require('.././pics/Background_EDU_BS.png')})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    height: '300vh',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const formContainerStyle = {
    backgroundColor: '#22272e',
    borderRadius: '15px',
    padding: '20px',
    width: '300px',
    height: '780px',
    marginLeft: '30px',
    position: 'absolute',
    top: '140px',
    left: '20px',
    boxShadow: '0px 8px 8px rgba(0, 0, 0, 0.5)',
  };

  const inputStyle = {
    width: '100%',
    marginBottom: '20px',
    backgroundColor: 'black',
    color: '#c5d1de',
    fontSize: '25px',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#c5d1de',
    fontSize: '20px',
  };

  const buttonStyle = {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '15px',
  };

  const infoBoxStyle = {
    backgroundColor: '#22272e',
    borderRadius: '10px',
    padding: '20px',
    width: '1000px',
    height: '1100px',
    position: 'absolute',
    top: '650px',
    left: '450px',
    color: '#c5d1de',
    fontSize: '16px',
    lineHeight: '1.5',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
  };

  return (
    <div style={dashboardStyle}>
      <div>
        <div
          style={{
            backgroundColor: '#22272e',
            padding: '5px',
            width: '700px',
            height: '100px',
            marginLeft: '300px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '25px',
            position: 'absolute',
            top: '20px',
            left: '200px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)',
          }}
        >
          <h2 style={{ marginTop: '-40px', marginBottom: '-30px', color: 'white', marginLeft: '110px', fontSize: '50px' }}>
            Black Scholes Model
          </h2>
        </div>

        <img
          src={require('.././pics/goBacktoDashfromTradingSim.png')}
          alt="Go back to dashboard"
          style={{ position: 'absolute', top: '20px', right: '1460px', cursor: 'pointer', width: '50px', height: '50px' }}
          onClick={() => navigate('/BS_Dash', { state: { username } })}
        />

        <div style={formContainerStyle}>
          <label style={labelStyle}>Stock Price (S):</label>
          <input
            type="text"
            value={stockPrice}
            onChange={(e) => setStockPrice(e.target.value)}
            style={inputStyle}
          />
          <label style={labelStyle}>Strike Price (K):</label>
          <input
            type="text"
            value={strikePrice}
            onChange={(e) => setStrikePrice(e.target.value)}
            style={inputStyle}
          />
          <label style={labelStyle}>Time to Maturity (T in years):</label>
          <input
            type="text"
            value={timeToMaturity}
            onChange={(e) => setTimeToMaturity(e.target.value)}
            style={inputStyle}
          />
          <label style={labelStyle}>Risk-Free Rate (r in %):</label>
          <input
            type="text"
            value={riskFreeRate}
            onChange={(e) => setRiskFreeRate(e.target.value)}
            style={inputStyle}
          />
          <label style={labelStyle}>Volatility (σ in %):</label>
          <input
            type="text"
            value={volatility}
            onChange={(e) => setVolatility(e.target.value)}
            style={inputStyle}
          />
          <button onClick={calculateBlackScholes} style={buttonStyle}>Calculate</button>
          <ul style={{ color: '#c5d1de', marginLeft: '-30px', listStyleType: 'none' }}>
          <li style={{ marginBottom: '10px', fontSize:'5px' }}><strong>•</strong></li>

    <li style={{ marginBottom: '10px' }}><strong>Stock Price (S):</strong> The current price of the stock.<br></br></li>
    <li style={{ marginBottom: '10px', fontSize:'1px' }}><strong>•</strong></li>

    <li style={{ marginBottom: '10px' }}><strong>Strike Price (K):</strong> The price at which you can buy (for a call) or sell (for a put) the stock.</li>
    <li style={{ marginBottom: '10px', fontSize:'1px'  }}><strong>•</strong></li>

    <li style={{ marginBottom: '10px' }}><strong>Time to Maturity (T):</strong> How much time you have before the option expires.</li>
    <li style={{ marginBottom: '10px', fontSize:'1px'  }}><strong>•</strong></li>

    <li style={{ marginBottom: '10px' }}><strong>Risk-Free Rate (r):</strong> The return you could earn on a risk-free investment, like a government bond.</li>
    <li style={{ marginBottom: '10px' , fontSize:'1px' }}><strong>•</strong></li>

    <li style={{ marginBottom: '10px' }}><strong>Volatility (σ):</strong> How much the stock price is expected to move around.</li>
</ul>
        </div>

        <div
          className="heatmaps"
          style={{
            display: 'flex',
            position: 'absolute',
            top: '250px',
            left: '500px',
            backgroundColor: 'transparent',
          }}
        >
          <Heatmap
            title="Call Price Heatmap"
            inputs={inputs}
            heatmapParams={heatmapParams}
            type="call"
          />
          <Heatmap
            title="Put Price Heatmap"
            inputs={inputs}
            heatmapParams={heatmapParams}
            type="put"
          />
        </div>

        <div style={infoBoxStyle}>
          <h3>Understanding the Black-Scholes Model</h3>
          <p style={{ color: '#c5d1de' }}>
            Imagine you're at a carnival. You see a game where you have to guess if a coin will land heads or tails. If you guess right, you win a prize. But what if you could somehow know exactly what the chances of it landing heads were? That's kind of what the Black-Scholes model does for the stock market.
          </p>
          <h4>What is the Black-Scholes Model?</h4>
          <p style={{ color: '#c5d1de' }}>
            It's a mathematical formula that helps us figure out the fair price of an option. An option is like a bet on a stock. You can buy a "call" option, which means you have the right to buy a stock at a certain price before a certain time. Or you can buy a "put" option, which means you have the right to sell a stock at a certain price before a certain time.
          </p>
          <h4>How Does It Work?</h4>
          <p style={{ color: '#c5d1de' }}>
            The Black-Scholes model uses a few pieces of information to figure out the option's price:
          </p>
          <ul style={{ color: '#c5d1de' }}>
            <li><strong>Stock Price (S):</strong> The current price of the stock.</li>
            <li><strong>Strike Price (K):</strong> The price at which you can buy (for a call) or sell (for a put) the stock.</li>
            <li><strong>Time to Maturity (T):</strong> How much time you have before the option expires.</li>
            <li><strong>Risk-Free Rate (r):</strong> The return you could earn on a risk-free investment, like a government bond.</li>
            <li><strong>Volatility (σ):</strong> How much the stock price is expected to move around.</li>
          </ul>
          <h3 style={{ color: '#c5d1de' }}>Understanding the Black-Scholes Model:</h3>
          <p style={{ color: '#c5d1de' }}>The Black-Scholes Model is used to calculate the theoretical price of options. It assumes that the market is efficient, and prices follow a geometric Brownian motion. The model considers various factors like stock price, strike price, time to maturity, risk-free rate, and volatility.</p>
          <p style={{ color: '#c5d1de' }}><strong>Call Price:</strong> The price at which a call option can be purchased, calculated based on the current stock price, strike price, time to maturity, risk-free rate, and volatility.</p>
          <p style={{ color: '#c5d1de' }}><strong>Put Price:</strong> The price at which a put option can be purchased, also calculated using the same parameters as the call price.</p>
          <p style={{ color: '#c5d1de' }}><strong>Volatility:</strong> A measure of the stock's price fluctuations. Higher volatility increases the option price because there's a greater chance of the stock price reaching the strike price.</p>
          <p style={{ color: '#c5d1de' }}><strong>Time to Maturity:</strong> The time remaining until the option expires. The longer the time, the higher the option price, as there's more opportunity for the stock price to move.</p>
          <p style={{ color: '#c5d1de' }}><strong>Risk-Free Rate:</strong> The return on a risk-free investment, typically a government bond. This affects the option price by impacting the present value of the strike price.</p>
          <p style={{ color: '#c5d1de' }}><strong>Heatmaps:</strong> Visual representations of how the option prices vary with different stock prices and volatilities, providing insights into how these factors affect the option prices.</p>
        </div>
      </div>
      <div style={{ color: 'black', position: 'absolute', top: '150px', right: '700px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)', }}>
        <div style={{
          backgroundColor: '#86ff86',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
        }}>
          <p style={{ color: 'black', fontSize: '30px', paddingRight: '15px' }}>Call Price: ${callPrice}</p>
        </div>
      </div>


      <div style={{ color: 'black', position: 'absolute', top: '150px', right: '330px', boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.5)', }}>
        <div style={{
          backgroundColor: '#ff7e7e',
          borderRadius: '5px',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '10px',
        }}>
          <p style={{ color: 'black', fontSize: '30px', paddingLeft: '15px' }}>Put Price: ${putPrice}</p>
        </div>
      </div>
    </div>
  );
}

export default EDU_BS;
