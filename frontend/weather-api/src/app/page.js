"use client"
import { useState } from "react";
import Image from "next/image";
import Head from "next/head";

export default function Home() {
  const [fiveDayData, setfiveDayData] = useState([]);
  const [todayData, setTodayData] = useState([]);
  const [city, setCity] = useState("");

  const connect = async (e) => {
    e.preventDefault();
    console.log('CONNECTED');
    await fetch("http://localhost:8000/5day", 
      {
        mode: 'cors',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          data: city
        }),
        method: 'POST'
      })
      .then((res) => res.json())
      .then(data => {
        setTodayData(data.fiveDay[0]);
        setfiveDayData(data.fiveDay.splice(1));
      })
      .catch((err) => console.log(err));
  }

  const getDay = (dateStr) => {
    //console.log(dateStr);
    const yr = dateStr.substring(0, 4);
    const mo = dateStr.substring(5, 7);
    const day = dateStr.substring(8, 10);
    //console.log(`day: ${day}`);
    var date = new Date(`${yr}-${mo}-${day}`);
    return date.toLocaleDateString(
      'en-US', 
      {
        weekday: 'long',
        timeZone: 'UTC'
      });
  }
  
  const getIcon = (conditionStr) => {
    //console.log(conditionStr);
    if (conditionStr.includes("rain")) {
      return "rain.svg";
    } else if (conditionStr.includes("clear")) {
      return "sun.svg";
    } else if (conditionStr.includes("snow")) {
      return "snow-svgrepo.svg";
    } else {
      return "partly-sunny.svg"
    }
  }

  return (
    <div className="flex flex-col h-full w-full bg-gradient-to-r from-slate-800 via-blue-950 to-slate-900"> 
    <Head>
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
    </Head>
      <h1 className="flex mt-4 justify-center text-white text-3xl">Get your 5-day forecast</h1>       
      <h2 className="flex justify-center mt-4 text-white text-2xl">
        <form onSubmit={connect}>
          <input 
            type="text" 
            name="city"
            placeholder="City, State / ZIP" 
            className="ml-3 px-1 w-96 bg-black/10 border-slate-800/10 border-2 backdrop-blur-[400px] hover:bg-black/30"
            onChange={(e) => setCity(e.target.value)}
          />
          <button type="submit" className="text-white px-2 mx-2 rounded-sm hover:bg-slate-900/30">Search</button>
        </form>
      </h2>
      {
        city &&
        <div className="flex flex-row flex-direction justify-around h-full w-full">
          <div className="flex flex-col justify-center items-center w-2/5">
              <ul 
                className="flex flex-col w-3/5 text-white backdrop-blur-[20px] p-6 my-10 rounded-md bg-slate-950/5 hover:bg-slate-100/5" 
                key={todayData.datetime}
              >
                <li className="mb-6 text-7xl">Today</li>
                <li className="mb-6 text-9xl">{todayData.temp} °F</li>
                <li className="text-3xl">Feels like {todayData.feelslike} °F</li>
                <div className="flex flex-row items-center">
                  <li className="text-5xl">{todayData.conditions}</li>
                  <Image 
                    src={require(`./icons/${getIcon(todayData.icon || '')}`)} 
                    width={100} 
                    height={100}
                    alt={todayData.icon || 'icon'}
                    ></Image>
                </div>
                
              </ul>        
          </div>
          <div className="grid grid-cols-2 ">
            {
              fiveDayData?.map((weather) => {
                return(
                  <ul 
                    className="flex items-start justify-center flex-col m-10 px-12 py-2 rounded-lg text-4xl text-white backdrop-blur-[400px] hover:bg-slate-100/5" 
                    key={weather.datetime}
                  >
                    <li className="mb-6">{getDay(weather.datetime)}</li>
                    <li className="mb-6 text-6xl">{weather.temp} °F</li>
                    <li>{weather.conditions}</li>
                    <Image 
                      src={require(`./icons/${getIcon(weather.icon || '')}`)} 
                      width={100} 
                      height={100}
                      alt={weather.icon || 'icon'}
                      >
                    </Image>
                  </ul>          
                );
              })
            }
          </div>
        </div>
      }
    </div>
  );
}
