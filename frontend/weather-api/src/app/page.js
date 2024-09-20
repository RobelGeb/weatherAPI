"use client"
import { useState, useEffect } from "react";
import Image from "next/image";
import { infinity } from "ldrs";

//infinity.register();

export default function Home() {
  const [fiveDayData, setfiveDayData] = useState([]);
  const [todayData, setTodayData] = useState([]);

  useEffect(() => {
    connect();
    
    //console.log(JSON.stringify(todayData));
  });

  const connect = async () => {
    await fetch("http://localhost:8000/", {mode: 'cors'})
      .then((res) => res.json())
      .then(data => {
        setTodayData(data.fiveDay[0]);
        setfiveDayData(data.fiveDay.splice(1));
      })
      .catch((err) => console.log(err));
  }

  const getDay = (dateStr) => {
    if (dateStr == '') {
      return (
        <l-infinity
          size="55"
          stroke="4"
          stroke-length="0.15"
          bg-opacity="0.1"
          speed="1.3"
          color="black" 
        ></l-infinity>
      );
    }
    console.log(dateStr);
    const yr = dateStr.substring(0, 4);
    const mo = dateStr.substring(5, 7);
    const day = dateStr.substring(8, 10);
    console.log(`day: ${day}`);
    var date = new Date(`${yr}-${mo}-${day}`);
    return date.toLocaleDateString(
      'en-US', 
      {
        weekday: 'long',
        timeZone: 'UTC'
      });
  }
  
  const getIcon = (conditionStr) => {
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
    <div className="flex flex-row h-dvh w-full bg-[url('./img/bg.png')] bg-center bg-cover bg-no-repeat text-black">        
      <div className="flex flex-row flex-direction justify-around h-auto w-full">
        <div className="flex flex-col justify-center items-center w-2/5">
          <h1 className="flex justify-center text-4xl"> SEATTLE </h1>  
          <ul 
            className="flex flex-col w-1/2 text-black backdrop-blur-[20px] p-6 my-10 rounded-lg text-2xl" 
            key={todayData.datetime}
          >
            <li className="mb-6 text-5xl">{getDay(todayData.datetime || '')}
            </li>
            <li className="mb-6 text-8xl">{todayData.temp} °F</li>
            <div className="flex flex-row items-center">
              <li className="text-4xl">{todayData.conditions}</li>
              <Image src={require(`./icons/${getIcon(todayData.icons || '')}`)} width={100} height={100}></Image>
            </div>
            
          </ul>        
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {
            fiveDayData?.map((weather) => {
              return(
                <ul 
                  className="flex items-start justify-center flex-col m-12 px-10 py-4 rounded-lg text-4xl backdrop-blur-[20px]" 
                  key={weather.datetime}
                >
                  <li className="mb-6">{getDay(weather.datetime)}</li>
                  <li className="mb-6 text-6xl">{weather.temp} °F</li>
                  <li>{weather.conditions}</li>
                  <Image src={require(`./icons/${getIcon(todayData.icons || '')}`)} width={100} height={100}></Image>
                </ul>          
              );
            })
          }
        </div>
      </div>
    </div>
  );
}
