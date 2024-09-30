const express = require("express");
const app =  express();
const cors = require("cors");
const superagent = require("superagent");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const Redis = require("redis");

dotenv.config({path:"./config.env"});

const client = Redis.createClient(process.env.REDIS_PORT);

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

//app.use(limiter);

app.use(
    cors({
        origin: '*',
    })
);

app.use(express.json({ extended: false }));

client.on('error', err => console.log('Redis Client Error', err));

const getWeather = async (city) => {
    console.log("city: ", city.body)
    try {
        const weatherLink = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city.body.data}?unitGroup=us&elements=datetime%2Cname%2Ctemp%2Cfeelslike%2Cconditions%2Cdescription%2Cicon&include=days&key=${process.env.API_KEY}&contentType=json`
        const data = await superagent.get(weatherLink);
        const report = data.body.days;
        console.log("Resolved Address: ", data.body.resolvedAddress);
        return report;
    } catch (err) {
        console.log(err);
    }
}

app.post('/5day', async (req, res) => {
    //console.log(`request = ${JSON.stringify(req.body.data)}`);
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