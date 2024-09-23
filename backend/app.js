const express = require("express");
const app =  express();
const fs = require("fs");
const cors = require("cors");
const superagent = require("superagent");
const dotenv = require("dotenv");
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter);
app.use(cors());
app.use(express.json());

dotenv.config({path:"./config.env"});



const getWeather = async (req) => {
    try {
        const weatherLink = (`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/`+
            `${req}?unitGroup=us&elements=datetime%2Cname%2Ctempmax%2Ctemp%2Cconditions%2Cdescription%2Cicon&include=days%2Cfcst&key=`+
            `${process.env.API_KEY}&contentType=json`);
        const data = await superagent.get(weatherLink);
        const report = data.body.days;
        //console.log(`Weather report: ${JSON.stringify(days)}`)
        return report;
    } catch (err) {
        console.log(err);
    }
}

getWeather();

app.get('/', async (req, res) => {
    const result = await getWeather(req.city);
    const fiveDay = result.splice(0,5);
    console.log(fiveDay);
    res
    .status(200)
    .json({fiveDay});
});

// app.post('/', (req, res) => {
//     console.log('Connected to front end!');
//     res.status(200);
// });

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}...`)
});