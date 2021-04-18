import React, { useState } from "react";
// import DisplayWeather from "./DisplayWeather";
import "./weather.css";
import { WeatherIcon } from './WeatherIcon';
import moment from 'moment';
import WeatherCard from './WeatherCard';

require('dotenv').config()

function Weather() {
  const [weather, setWeather] = useState([]);
  const [form, setForm] = useState({
    zip: ""
  });

console.log(form);
console.log(weather);

  // const APIKEY = "Enter Your APIKEY here";
  async function weatherData(e) {
    e.preventDefault();
    if (form.zip === "") {
      alert("Add values");
    } else {
      const data = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(form.zip)}.json?access_token=${process.env.REACT_APP_API_KEY_MAPBOX}&limit=1`
        // `https://api.openweathermap.org/data/2.5/weather?q=${form.city},${form.country}&APPID=${APIKEY}`
      )
      .then((res) => res.json())
      .then((location) => {
        console.log(location);
        const latitude = location.features[0].center[1];
        const longitude = location.features[0].center[0];
        // console.log(latitude);
        // console.log(longitude);
        const data2 = fetch(
          `http://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${process.env.REACT_APP_API_KEY_OPEN_WEATHER_MAP}&units=imperial`
        )
        .then((res2) => res2.json())
        .then((weatherData) => {
          console.log(weatherData.daily);
          const days = weatherData.daily;
          
          let weatherCards = []

          days.forEach(day => {
            console.log(day);
            const time = day.dt * 1000;
            console.log(time);
            const dayOfWeek = moment(time).format('dddd');
            console.log(dayOfWeek);
            const temp = day.temp.day;
            const rain = `${Math.floor(day.pop * 100)}%`;
            console.log(rain)
            const weatherId = day.weather[0].id;
            const weatherIcon = day.weather[0].icon;
            const weatherImage = WeatherIcon(weatherId, weatherIcon);

            const weatherCard = <WeatherCard key={time} weekDay={dayOfWeek} tempeture={temp} raining={rain} image={weatherImage} />
            weatherCards.push(weatherCard)

          });

          setWeather({ data: weatherCards })
        })
      })
      //   .then((res) => res.json())
      //   .then((data) => data);

      // setWeather({ data: data });
    }
  }

  const handleChange = (e) => {
    let name = e.target.name;
    let value = e.target.value;

    if (name === "zip") {
      setForm({ ...form, zip: value });
    }
  };
  return (
    <div>
    <div className="weather">
      <span className="title">Weather</span>
      <br />
      <form>
        <input
          type="text"
          placeholder="ZIP"
          name="zip"
          onChange={(e) => handleChange(e)}
        />
        &nbsp; &nbsp; &nbsp;&nbsp;
        <button className="getweather" onClick={(e) => weatherData(e)}>
          Search
        </button>
      </form>
    </div>
     
      <div className="weatherCardContainer">
          {/* {console.log(weather)} */}
        {weather.data !== undefined ? (
          <div>
            {weather.data}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Weather;