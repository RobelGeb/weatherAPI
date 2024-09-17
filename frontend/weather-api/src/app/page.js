"use client"
import { useState, useEffect } from "react";
//import data from './data.json';

//const wetha = data.weathers;
//console.log(`weather: ${JSON.stringify(wetha)}`);

export default function Home() {
  const [weatherData, setWeatherData] = useState([]);

  const connect = async () => {
    await fetch("http://localhost:8000/", {mode: 'cors'})
      .then((res) => res.json())
      .then(data => {
        setWeatherData(data.reduced);
        //console.log(data.reduced);
      })
      .catch((err) => console.log(err));
  }

  const getDay = (dateStr) => {
    const yr = dateStr.substring(0, 4);
    const mo = dateStr.substring(5, 7);
    const day = dateStr.substring(8, 10);
    var date = new Date(Date.UTC(yr, mo, day));
    return date.toLocaleDateString('en-US', {weekday: 'long'});
  } 

  return (
    <div className="flex flex-col">    
      <div>
        <h1> Hello world! </h1>
        <button onClick={connect} className="bg-slate-50 text-black w-auto hover:bg-sky-300 my-5">
            5 day forecast!
        </button>
        <br />
      </div>
      <div className="w-full bg-cyan-800 flex flex-row justify-around">
        {
          weatherData.map((weather) => {
            return(
              <ul className="inline-block py-4 pr-2 text-white" key={weather.datetime}>
                <li>Date: {getDay(weather.datetime)}</li>
                <li>Temp: {weather.temp}</li>
                <li>Weather: {weather.conditions}</li>
              </ul>          
            );
          })
        }
      </div>
    </div>
  );
}
