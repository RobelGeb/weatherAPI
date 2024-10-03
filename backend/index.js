const express = require("express");
const app =  express();
const cors = require("cors");
const superagent = require("superagent");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const Redis = require("redis");

dotenv.config({path:"./config.env"});

const redisClient = Redis.createClient(process.env.REDIS_PORT);

(async () => {
    redisClient.on('error', err => console.log('Redis Client Error', err));
    redisClient.on('ready', () => console.log('Redis is ready.'));

    await redisClient.connect();
    await redisClient.ping();
})();



const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 30, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter);

app.use(
    cors({
        origin: '*',
    })
);

app.use(express.json({ extended: false }));


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
    const value = await redisClient.get(req.body.data);
    var result;
    if (value) {
        result = JSON.parse(value);
        console.log("Cache hit for ", req.body.data);
    } else {
        console.log("Cache miss for ", req.body.data);
        result = await getWeather(req);
        redisClient.setEx(req.body.data, 3600, JSON.stringify(result.splice(0,5)));
    }
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