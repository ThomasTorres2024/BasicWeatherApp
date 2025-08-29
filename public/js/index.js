/**
 * Sleep function, updates info after every x ms 
 */
function sleep(ms){
    return new Promise(resolve => setTimeout(resolve, ms));
}
function updateWeatherDescInfo(weatherMap,visibility){
    const weatherName = weatherMap["main"]
    const weatherDesc = weatherMap["description"]
    const visibilityPercent = Math.floor(visibility/10000 * 100); 
    const newIconLink = `https://openweathermap.org/img/wn/${weatherMap['icon']}@2x.png`;
                         //https://openweathermap.org/img/wn/10d@2x.png

    document.getElementById("weatherName").textContent=`Weather: ${weatherName}`;
    document.getElementById("weatherDesc").textContent=`Desc: ${weatherDesc}`;
    document.getElementById("visibility").textContent=`Visibility: ${visibilityPercent}%`;

    //configure icon 
    document.getElementById("weatherImg").src = newIconLink;

}

function kelvinToF(temp){
    return Math.ceil((temp- 273.15)*(9/5) + 32); 
}

function updateTemperature(temperatureInfo){
    document.getElementById("feelsLikeTemp").textContent=`Feels Like: ${kelvinToF(temperatureInfo['feels_like'])}º`;
    document.getElementById("lowTemp").textContent=`Low Temp: ${kelvinToF(temperatureInfo['temp_min'])}º`;
    document.getElementById("highTemp").textContent=`High Temp: ${kelvinToF(temperatureInfo['temp_max'])}º`;
    document.getElementById("avgTemp").textContent=`Average Temp: ${kelvinToF(temperatureInfo['temp'])}º`;
}

/**
 * Gives a request to the server for the town name, and 
 * gets info about the weather in the town
 * @param {string} cityName - the name of the town  
 */
async function getWeatherInfo(cityName){

    const options = {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body : JSON.stringify({cityName})};

    const res = await fetch("/update",options);

    const result = await res.json()

    //put info into respective maps 

    const temperatureInfo = result["main"];
    const weatherDesc = result["weather"][0];
    const visibility = result["visibility"];

    updateWeatherDescInfo(weatherDesc,visibility);
    updateTemperature(temperatureInfo);

    //update time 
    document.getElementById("time").textContent=new Date();
    document.getElementById("weatherHeader").textContent=`Weather in: ${cityName}`;
}

async function main(){

    //update weather every minute
    const timeIntervalMS = 60 * 1000;

    while(true){
        await getWeatherInfo("Warwick");
        console.log("Updated");
        await sleep(timeIntervalMS);
    }
}

main();

