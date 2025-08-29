//imports 
const express = require('express');
const app = express()
const port = 3000

//add static files 
app.use(express.static('public'));
app.use(express.static('/css',express.static(__dirname+'public/css')));
app.use(express.static('/js',express.static(__dirname+'public/js')));
app.use(express.static('/img',express.static(__dirname+'public/img')));

app.set('views','./views');
app.set('view engine','ejs');
app.use(express.json());

//read API file 

const fs = require('fs');

//read in API key 
var API_KEY = "";
const apiFileName = 'api_key.txt';

  try{
    const data = fs.readFileSync(apiFileName,'utf8');
    API_KEY = data;
  }
  catch (err){
    console.error(err);
    throw err;
  }

app.get('',(rec,res) => {
    res.render('index')
})

/**
 * Uses OpenWeather's API To get Live Time Information About the
 * Weather 
 */
async function fetchWeatherInfo(townName,API_KEY){

  const WEATHER_URL=`http://api.openweathermap.org/data/2.5/weather?appid=${API_KEY}&q=${townName}`;

  try{
    const response = await fetch(WEATHER_URL);
    const data = await response.json();
    return data; 
  }
  catch (error)
  {
    console.error(error);
    return null; 
  }

}

app.post('/update',(req,res) =>{

  const townName = req.body['cityName']; 
  console.log(`Town name received: ${townName}`);

  fetchWeatherInfo(townName,API_KEY).then(weatherInfo => {
   res.send(weatherInfo);
  }); 

});

//listen on port 3000
app.listen(port,() => console.log(`Listening on port ${port}`));
