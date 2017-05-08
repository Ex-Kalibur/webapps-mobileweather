appid = "10d8a1c131bee53688d5fc76f908185c";
shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
tempUnit = "C";
windUnit = "m/s";
humUnit = "%";
pressUnit = "kPa";

function checkSubmit(event){
    if(event.keyCode == 13){
        validateInput();
    }
}

function validateInput(){
	var str = document.getElementById("search").value;
	if(str){
		console.log(">" + document.getElementById("search").value + "<");

		update();
	}
}

function update() {
    //Get city
    var city = document.getElementById("search").value;
    //Get unit
    var radioButtons = document.getElementsByName("units");
    var unit = "";
    for(i = 0; i < radioButtons.length; i++){
        if(radioButtons[i].checked){
            unit = radioButtons[i].value;
            break;
        }
    }

    initUnits(unit);

    //Get current weather
    var xhttp1 = new XMLHttpRequest();
    xhttp1.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            getWeather( this.responseText, unit);
        }
    };
    xhttp1.open("GET", "http://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=" + unit + "&APPID=" + appid, true);
    xhttp1.send();

    //Get hourly weather
    var xhttp2 = new XMLHttpRequest();
    xhttp2.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            getForecast( this.responseText, unit);
        }
    };
    xhttp2.open("GET", "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=" + unit + "&APPID=" + appid, true);
    xhttp2.send();

    //Show weather
    document.getElementById("section-weather").style.display = "flex";
    document.getElementById("section-notice").style.display = "block";
}

function initUnits(unit){
    switch (unit) {
        case "metric":
            tempUnit = "C";
            windUnit = "m/s";
            break;
        case "imperial":
            tempUnit = "F";
            windUnit = "mi/h";
            break;
    }
}

function getWeather(string, unit) {
    var json = JSON.parse(string);

    //Get city
    document.getElementById("location").textContent = json.name + ", " + json.sys.country;

    //Get weather
    var weatherTemp = Math.round(parseFloat(json.main.temp));
    document.getElementById("weather-temperature").textContent = weatherTemp;
    document.getElementById("weather-temperature-unit").textContent = tempUnit;

    //Get weather description
    var weatherCode = parseInt(json.weather[0].id);
    document.getElementById("weather-description").textContent = json.weather[0].description;
    document.getElementById("weather-detail-icon").classList.add(getWeatherIcon(weatherCode));

    //Get wind
    var windVal = parseFloat(json.wind.speed);
    document.getElementById("details-wind-value").textContent = windVal + windUnit;
    var windDir = parseFloat(json.wind.deg);
    document.getElementById("details-wind-icon").classList.add(getWindDirIcon(windDir));

    //Get humidity
    var humVal = parseFloat(json.main.humidity);
    document.getElementById("details-humidity-value").textContent = humVal + humUnit;

    //Get pressure
    var pressVal = parseInt(json.main.pressure);
    document.getElementById("details-pressure-value").textContent = pressVal + pressUnit;
}

function getForecast(string, unit){
    var json = JSON.parse(string);
    var forecasts = json.list;

    //Get hourly
    for(i = 0; i < 8; i++){
        var hourlyElement = document.getElementsByClassName("forecast-hourly")[i];
        var hourlyData = forecasts[i];

        //set time
        var hourlyTime = getTimeFromDate(parseInt(hourlyData.dt));
        hourlyElement.getElementsByClassName("forecast-hour")[0].textContent = hourlyTime + ":00";

        var hourlyTemp = Math.round(parseFloat(hourlyData.main.temp));
        hourlyElement.getElementsByClassName("hourly-temperature-value")[0].textContent = hourlyTemp;
        hourlyElement.getElementsByClassName("hourly-temperature-unit")[0].textContent = tempUnit;

        hourlyElement.getElementsByClassName("hourly-detail-icon")[0].classList.add(getWeatherIcon(hourlyData.weather[0].id));
        hourlyElement.getElementsByClassName("hourly-description")[0].textContent = hourlyData.weather[0].description;
    }

    //Get forecast
    for(j = 0; j < 5; j++){
        var dailyElement = document.getElementsByClassName("forecast-day")[j];
        var dailyData = forecasts[j*8];

        //set date
        dailyElement.getElementsByClassName("forecast-date")[0].textContent = getDayFromDate(parseInt(dailyData.dt));

        var dailyTemp = Math.round(parseFloat(dailyData.main.temp));
        dailyElement.getElementsByClassName("forecast-temperature-value")[0].textContent = dailyTemp;
        dailyElement.getElementsByClassName("forecast-temperature-unit")[0].textContent = tempUnit;

        dailyElement.getElementsByClassName("forecast-detail-icon")[0].classList.add(getWeatherIcon(dailyData.weather[0].id));
        dailyElement.getElementsByClassName("weather-description")[0].textContent = dailyData.weather[0].description;
    }
}

function getWeatherIcon(code){
    switch (true) {
        case 200 <= code && code <= 232:
            return "wi-thunderstorm"; //Thunderstorm
        case 300 <= code && code <= 321:
            return "wi-sprinkle"; //Drizzle
        case 500 <= code && code <= 504:
            return "wi-rain"; //Rain
        case code == 511:
            return "wi-rain-mix"; //Mix
        case 520 <= code && code <= 531:
            return "wi-showers"; //Showers
        case 600 <= code && code <= 602:
            return "wi-snow"; //Snow
        case code == 611 || code == 612:
            return "wi-sleet"; //Sleet
        case 615 <= code && code <= 622:
            return "wi-rain-mix"; //Mix
        case code == 701 || code == 741:
            return "wi-fog";
        case code == 711:
            return "wi-smoke";
        case code == 721:
            return "wi-day-haze";
        case code == 721 || code == 751 || code == 761:
            return "wi-dust"
        case code == 762:
            return "wi-volcano";
        case code == 711:
            return "wi-strong-wind";
        case code == 781:
            return "wi-tornado";
        case code == 800:
            return "wi-day-sunny";
        case code == 801:
            return "wi-day-cloudy";
        case code == 802:
            return "wi-cloud";
        case code == 803 || code == 804:
            return "wi-cloudy";
        case 900 <= code && code <= 902:
            return "wi-tornado";
        case code == 903:
            return "wi-snowflake-cold";
        case code == 904:
            return "wi-hot";
        case code == 905:
            return "wi-strong-wind";
        case code == 906:
            return "wi-hail";
        case code == 951:
            return "wi-day-sunny";
        case 952 <= code && code <= 956:
            return "wi-windy";
        case 957 <= code && code <= 961:
            return "wi-strong-wind";
        case code == 962:
            return "wi-tornado";
        default:
            return "wi-na"; //N/A
    }
}

function getWindDirIcon(deg){
    switch (true) {
        case 337.5 <= deg || deg < 22.5:
            return "wi-towards-n"; //N
        case 22.5 <= deg && deg < 67.5:
            return "wi-towards-ne"; //NE
        case 67.5 <= deg && deg < 112.5:
            return "wi-towards-e"; //E
        case 112.5 <= deg && deg < 157.5:
            return "wi-towards-se"; //SE
        case 157.5 <= deg && deg < 202.5:
            return "wi-towards-s"; //S
        case 202.5 <= deg && deg < 247.5:
            return "wi-towards-sw"; //SW
        case 247.5 <= deg && deg < 292.5:
            return "wi-towards-w"; //W
        case 292.5 <= deg && deg < 337.5:
            return "wi-towards-nw"; //NW
    }
}

function getDayFromDate(epoch){
    var date = new Date(0);
    date.setUTCSeconds(epoch);
    return shortMonths[date.getMonth()] + " " + date.getDate();
}

function getTimeFromDate(epoch){
    var date = new Date(0);
    date.setUTCSeconds(epoch);
    return date.getHours();
}
