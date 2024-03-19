import React, { useState, useEffect } from 'react';

const WeatherDashboard = () => {
  const [city, setCity] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [sCity, setSCity] = useState([]);

  const [currentCity, setCurrentCity] = useState('');
  const [currentTemperature, setCurrentTemperature] = useState('');
  const [currentHumidity, setCurrentHumidity] = useState('');
  const [currentWSpeed, setCurrentWSpeed] = useState('');
  const [currentUvindex, setCurrentUvindex] = useState('');
  const [forecastData, setForecastData] = useState([]);

  useEffect(() => {
    loadLastCity();
  }, []);

  useEffect(() => {
    localStorage.setItem('cityname', JSON.stringify(sCity));
  }, [sCity]);

  const find = (c) => {
    return sCity.includes(c.toUpperCase());
  };

  const displayWeather = (event) => {
    event.preventDefault();
    if (searchCity.trim() !== '') {
      setCity(searchCity.trim());
      currentWeather(searchCity.trim());
    }
  };

  const currentWeather = (city) => {
    const APIKey = "a0aca8a89948154a4182dcecc780b513";
    const queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${APIKey}`;
    fetch(queryURL)
      .then((response) => response.json())
      .then((data) => {
        setCurrentCity(data.name);
        setCurrentTemperature(convertToFahrenheit(data.main.temp));
        setCurrentHumidity(data.main.humidity);
        setCurrentWSpeed((data.wind.speed * 2.237).toFixed(1));
        UVIndex(data.coord.lon, data.coord.lat);
        forecast(data.id);
        if (!find(city)) {
          setSCity([...sCity, city.toUpperCase()]);
        }
      })
      .catch((error) => console.error('Error fetching current weather:', error));
  };

  const convertToFahrenheit = (tempK) => {
    return ((tempK - 273.15) * 1.8 + 32).toFixed(2) + '°F';
  };

  const UVIndex = (ln, lt) => {
    const APIKey = "a0aca8a89948154a4182dcecc780b513";
    const uvqURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${APIKey}&lat=${lt}&lon=${ln}`;
    fetch(uvqURL)
      .then((response) => response.json())
      .then((data) => {
        setCurrentUvindex(data.value);
      })
      .catch((error) => console.error('Error fetching UV Index:', error));
  };

  const forecast = (cityId) => {
    const APIKey = "a0aca8a89948154a4182dcecc780b513";
    const queryForecastURL = `https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&appid=${APIKey}`;
    fetch(queryForecastURL)
      .then((response) => response.json())
      .then((data) => {
        // Get forecast data for the next 5 days
        const forecastData = data.list.slice(0, 5);
        setForecastData(forecastData);
      })
      .catch((error) => console.error('Error fetching forecast:', error));
  };

  const loadLastCity = () => {
    const storedCity = JSON.parse(localStorage.getItem('cityname'));
    if (storedCity !== null && storedCity.length > 0) {
      setSCity(storedCity);
      setCity(storedCity[storedCity.length - 1]);
      currentWeather(storedCity[storedCity.length - 1]);
    }
  };

  const clearHistory = () => {
    setSCity([]);
    localStorage.removeItem('cityname');
  };

  return (
    <div>
      <div className="bg-gray-900 text-white py-4 text-center">
        <h1 className="text-3xl font-bold">Weather Dashboard</h1>
      </div>
      <div className="container mx-auto">
        <div className="flex">
          <div className="w-1/3 bg-gray-100 p-4">
            <h2 className="text-lg font-semibold mb-4">Search for a City:</h2>
            <div className="flex">
              <input type="text" className="flex-1 border border-gray-300 rounded-l py-2 px-4 focus:outline-none" placeholder="Enter city name" value={searchCity} onChange={(e) => setSearchCity(e.target.value)} />
              <button className="bg-blue-500 text-white rounded-r py-2 px-4 hover:bg-blue-600" onClick={displayWeather}>Search</button>
            </div>
            <button className="bg-red-500 text-white mt-4 py-2 px-4 rounded hover:bg-red-600" onClick={clearHistory}>Clear History</button>
            <ul className="mt-4">
              {sCity.map((c, index) => (
                <li key={index} className="border border-gray-300 p-2 mb-2 rounded">{c}</li>
              ))}
            </ul>
          </div>
          <div className="w-2/3 p-4">
            <div className="bg-gray-100 border border-gray-300 rounded p-4">
              <h2 className="text-lg font-semibold mb-4" id="current-city">{currentCity}</h2>
              <p>Temperature: <span id="temperature">{currentTemperature}</span></p>
              <p>Humidity: <span id="humidity">{currentHumidity}</span></p>
              <p>Wind Speed: <span id="wind-speed">{currentWSpeed}</span></p>
              <p>UV index: <span id="uv-index">{currentUvindex}</span></p>
            </div>
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-4">5-Day Forecast:</h2>
              <div className="flex">
                {forecastData.map((dayData, index) => (
                  <div key={index} className="w-1/5 bg-blue-500  border border-gray-300 rounded p-4 mr-2">
                    <p>Date: <span>{new Date(dayData.dt * 1000).toLocaleDateString()}</span></p>
                    <p>Temp: <span>{convertToFahrenheit(dayData.main.temp)}</span></p>
                    <p>Humidity: <span>{dayData.main.humidity}</span></p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-100 text-center py-4">
        Weather Dashboard &copy; 2024
        <div className="text-sm">
          Made with <i className="icon ion-heart text-red-500"></i> By <a href="" target="_blank" className="text-blue-500">Tanamay</a>
        </div>
      </footer>
    </div>
  );
};

export default WeatherDashboard;
