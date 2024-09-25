const express = require("express");
const app =  express();
const cors = require("cors");
const superagent = require("superagent");
const dotenv = require("dotenv");
const rateLimit = require('express-rate-limit');

// const limiter = rateLimit({
// 	windowMs: 15 * 60 * 1000, // 15 minutes
// 	limit: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
// 	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
// 	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// })

//app.use(limiter);
app.use(
    cors({
        origin: '*',
    })
);
app.use(express.json({ extended: false }));

dotenv.config({path:"./config.env"});

const getWeather = async (city) => {
    console.log(city.body);
    try {
        const weatherLink = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city.body.data}?unitGroup=us&elements=datetime%2Cname%2Ctemp%2Cfeelslike%2Cconditions%2Cdescription%2Cicon&include=days&key=57LJX6N358BY9PX8H6TY5S7DN&contentType=json`
        const data = await superagent.get(weatherLink);
        //console.log(data.body);
        const report = data.body.days;
        return report;
    } catch (err) {
        console.log(err);
    }
}

app.post('/5day', async (req, res) => {
    console.log(`request = ${JSON.stringify(req.body.data)}`);
    const result = await getWeather(req);
    const fiveDay = result.splice(0,5);
    res
    .status(200)
    .json({
        fiveDay,
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}...`)
});