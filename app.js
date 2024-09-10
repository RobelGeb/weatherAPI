const express = require('express');
const app =  express();
const fs = require("fs");
const superagent = require("superagent");

app.use(express.json());

const key = 'PB5QAB2GJQQV4XMVM2TLDE2BN';
const weatherLink = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Seattle,WA/?key=PB5QAB2GJQQV4XMVM2TLDE2BN`;

//const weatherLink = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Seattle,WA/?key=${key}`;

// const writeFilePro = (file, data) => {
//     return new Promise((resolve, reject) => {
//         fs.writeFile(file, data, err => {
//             if (err) reject("Could not write file 🥲");
//             resolve("success");
//         })
//     })
// }

const getWeather = async () => {
    try {
        const weather = await superagent.get('https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/Seattle,WA/?key=PB5QAB2GJQQV4XMVM2TLDE2BN');
        const stringIt = JSON.stringify(weather.body.days[0].tempmax);

        console.log(`MAX TEMP FOR TODAY: \n${stringIt}`);
    } catch (err) {
        console.log(err);
    }
    
}

getWeather();

app.get('/', (req, res) => {
    //res.status(200).json({ message: 'Hello World', app: 'WeatherAPI'})
    console.log(weather.days);
    res.status(200).json({
        status: 'success',
        message: weather
    })
});

const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}...`)
});