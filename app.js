// const { json } = require("express");

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html"); 
});

app.post("/", function(req, res) {
  const query = req.body.cityName;
  const apiKey = "f52282f652794e67225658809144338e";
  const unit = "metric";
  const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit ;

  https.get(url, function(response) {
    // console.log(response);
    console.log("Status-Code = " + response.statusCode);
    response.on("data", function(data) {
      // console.log(data);
      let weatherData = JSON.parse(data);
      // console.log(weatherData);
      let temp = weatherData.main.temp;
      console.log("Temperature of " + query + " = " + temp);
      let pressure = weatherData.main.pressure;
      console.log("Pressure of " + query + " = " + pressure);
      let weatherDescription = weatherData.weather[0].description;
      console.log(
        "Description of " + query + " Weather = " + weatherDescription
      );
      
      console.log("");

      let icon = weatherData.weather[0].icon;
      let imageURL = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
      res.write(
        "<h1>The Temperature of " + query + " is " + temp + " degree celcius.</h1>"
      );
      res.write("The weather is currently : " + weatherDescription);
      res.write("<img src=" + imageURL + ">");
      res.send();
    });
  });
});



app.listen(port, function() {
  console.log("Server is running on port " + port);
});
