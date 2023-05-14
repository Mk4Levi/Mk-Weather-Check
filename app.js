// const { json } = require("express");

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {
  const query = req.body.cityName;
  const apiKey = "f52282f652794e67225658809144338e";
  const unit = "metric";
  const url =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    query +
    "&appid=" +
    apiKey +
    "&units=" +
    unit;

  https.get(url, function (response) {
    // console.log(response);
    console.log("Status-Code = " + response.statusCode);
    response.on("data", function (data) {
      // console.log(data);
      let weatherData = JSON.parse(data);
      // console.log(weatherData);
      let temp = weatherData.main.temp;
      console.log("Temperature of " + query + " = " + temp);

      let pressure = weatherData.main.pressure;
      console.log(`Pressure of ${query} = ${pressure}`);

      let weatherDescription = weatherData.weather[0].description;
      console.log(`Description of ${query} Weather = ${weatherDescription}`);

      console.log("");

      let icon = weatherData.weather[0].icon;
      let imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      const temperatureColor = getTemperatureColor(temp);

      res.write(`<!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="utf-8">
                        <title>Weather Report</title>
                        <style>
                            body {
                                margin: 0;
                                font-family: Arial, sans-serif;
                                background-color: #F5EBEB;
                                background-image: url("https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxNDI0NzB8MHwxfHJhbmRvbXx8fHx8fHx8fDE2ODQwODc1ODd8&ixlib=rb-4.0.3&q=80&w=1080");
                                background-size: cover;
                                background-position: center center;
                                background-repeat: no-repeat;
                            }
                            .container {
                                display: flex;
                                flex-direction: column;
                                justify-content: center;
                                align-items: center;
                                min-height: 100vh;
                            }
                            .weather-card {
                                display: flex;
                                flex-direction: column;
                                width: 500px;
                                background-color: white;
                                border-radius: 10px;
                                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                                overflow: hidden;
                            }
                            .location {
                                padding: 20px;
                                background-color: ${temperatureColor};
                            }
                            .location h1 {
                                font-size: 48px;
                                color: white;
                                margin: 0;
                            }
                            .temperature {
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 96px;
                                font-weight: bold;
                                margin: 20px;
                                color: ${temperatureColor};
                            }
                            .description {
                                text-align: center;
                                font-size: 24px;
                                margin: 20px;
                            }
                            .icon {
                                align-self: center;
                                margin: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="weather-card">
                                <div class="location">
                                    <h1>${query}</h1>
                                </div>
                                <div class="temperature">${temp}&deg;C</div>
                                <div class="description"> The weather is currently : ${weatherDescription}</div>
                                <img src="${imageURL}" alt="Weather Icon" class="icon" >
                            </div>
                        </div>
                    </body>
                    </html>`);
      res.send();
    });
  });
});

function getTemperatureColor(temp) {
  const temperature = parseFloat(temp);
  if (temperature >= 35) {
    return "#cf0000";
  } else if (temperature >= 25) {
    return "#ff8c00";
  } else if (temperature >= 15) {
    return "#ffd700";
  } else if (temperature >= 5) {
    return "#87cefa";
  } else {
    return "#add8e6";
  }
}

app.listen(port, function () {
  console.log(`Server is running on port ${port}`);
});
