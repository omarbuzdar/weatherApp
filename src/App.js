import './App.css';
import React, { useState } from 'react';


const api = {
  key: "d07bd717416fa73038e6aaf6c7680f06", 
  base: "https://api.openweathermap.org/" // or https://api.openweathermap.org/data/2.5/
}
function App() {
  const [query, setQuery] = useState([]); // comtains location as array from split function in form: city state country
  const [weather, setWeather] = useState({});
  const [location, setLocation] = useState({});
  const limit = 1;
  const [hourly, setHourly] = useState([])
  const [daily, setDaily] = useState([])

  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const search = evt => {
    if (evt.key === "Enter") {
      fetch(`${api.base}geo/1.0/direct?q=${query[0]},${query[1]},${query[-1]}&limit=${limit}&appid=${api.key}`)
        .then(res => res.json())
        .then(resultGeo => {
          setLocation(resultGeo);
          setQuery('');
          console.log(resultGeo[0]);
          fetch(`http://api.openweathermap.org/data/2.5/onecall?lat=${resultGeo[0].lat}&lon=${resultGeo[0].lon}&appid=${api.key}`)
            .then(res => res.json())
            .then(result => {
              setWeather(result);
              setQuery('');
              setHourly(result.hourly)
              setDaily(result.daily);
              console.log(result);
            });
        });
      
    }
  }

  const dateBuilder = (d) => {
    let months = ["January","February","March","April","May","June","July",
    "August","September","October","November","December"];
  
    // let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();
    
    return `${day} ${date} ${month} ${year}`;
  }
  return (
    <div className={(typeof weather.main != "undefined" && weather.current.temp > 15) ? 'App warm': 'App'}>
      <main>
        <div className="search-box">
          <input 
            type="text" className="search-bar" placeholder="Search Weather By City, State (optional), Country..." 
            onChange={(e => setQuery(e.target.value.split(',')))}
            value={query}
            onKeyPress={search}
          />
          {/* <div>{query}</div> */}
        </div>
        {(typeof weather.current != "undefined") ? (
        <div>
          <div className='location-box'>
            <div className='location'>{location[0].name}</div>
            <div className='date'>{dateBuilder(new Date())}</div>
          </div>
          <div className='weather-box'>
            <div className='temp'>{Math.round((weather.current.temp -273.15)*9/5 + 32)}°</div>
            <div className='weather'>{weather.current.name}</div>
          </div>
          <div className = 'hourly-bar'>
            {hourly && hourly.map(hour => (
              <div className='hourly-item' key = {hour.dt}>
                <div>{Math.round((hour.temp -273.15)*9/5 + 32)}°</div>
                <div className='date-hourly'>{new Date(hour.dt*1000).toLocaleString().split(',')[1]}</div>
              </div>
                 
            ))}
            Hourly temps throughout two-day period
          </div>
          <div className = "daily-temps">
            <table>
              <tbody>
                {daily.slice(1).map(day => (
                    <tr className='daily-item' key={day.dt}>
                      <td>{days[new Date(day.dt*1000).getDay()]}</td>
                      <td>{day.weather[0].description}</td>
                      <td> {Math.round((day.temp.day -273.15)*9/5 + 32)}°</td>

                      {/* <div className='date-daily'></div> */}
                    </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <div> Another div </div> */}
          
        </div>
        ) : ('')}
        
      </main>
    </div>
  );
}

export default App;
