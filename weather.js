
//static first part of the url and my unique id from the website
	var MyWeatherMap = {id:'&units=metric&appid=c4368ccc5a6947f38b2734cf06758a03',url:'http://api.openweathermap.org/data/2.5/forecast/daily?q=',hm:'http://api.openweathermap.org/data/2.5/weather?q='};
	var degreeunit = "C&#176";
	var windunit = "km/h";
	var cityName;
	var toggle = 0;
//if user picks fahrenheit, changes the link to imperial
function makeRequestFahrenheit()
{
	degreeunit = "F&#176";
	windunit = "mph";
	MyWeatherMap.id ='&units=imperial&appid=c4368ccc5a6947f38b2734cf06758a03';
	console.log(MyWeatherMap.url);
	startreq();
	
}

//if user picks celsius, changes the link to metric
function makeRequestCelsius()
{
	degreeunit = "C&#176";
	windunit = "km/h";
	MyWeatherMap.id ='&units=metric&appid=c4368ccc5a6947f38b2734cf06758a03';
	console.log(MyWeatherMap.url);
	startreq();
}
function sevendayforecast(){
	MyWeatherMap.url='http://api.openweathermap.org/data/2.5/forecast/daily?q=';
	makeRequest();
}
function threehourforecast(){
	MyWeatherMap.url='http://api.openweathermap.org/data/2.5/forecast?q=';
	makeRequestHourly();
}
//the initial request
function startreq()
{
	cityName=document.getElementById("city").value;
	makeRequestNow();
	if (MyWeatherMap.url=='http://api.openweathermap.org/data/2.5/forecast/daily?q=')
	{
	makeRequest();
	}
	else{
	makeRequestHourly();
	}
}

//get raw data from openweathermap.org for right now
	function makeRequestNow(){
		if(window.XMLHttpRequest){
		var xhr = new XMLHttpRequest();
		}
		else {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		  xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
			  jsonResponse = xhr.responseText;
			  weatherNow(jsonResponse);
			}
			else if(xhr.status==429){
			alert("Openweathermap.org is throttling 1 or more of the 3 connection due to free account limit. Please try again in a minute.");
			}
		  };		  
		  xhr.open("GET",MyWeatherMap.hm+cityName+MyWeatherMap.id, true);
		  xhr.send();
	}
//get raw data from openweathermap.org for forcasting
	function makeRequest(){
		if(window.XMLHttpRequest){
		var xhr = new XMLHttpRequest();
		}
		else {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		  xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
			  jsonResponse = xhr.responseText;
			  weatherforecast(jsonResponse);
			}
			else if(xhr.status==429){
			alert("Openweathermap.org is throttling 1 or more of the 3 connection due to free account limit. Please try again in a minute.");
			}
		  };		  
		  xhr.open("GET",MyWeatherMap.url+cityName+MyWeatherMap.id, true);
		  xhr.send();
	}
	function makeRequestHourly(){
	
		if(window.XMLHttpRequest){
		var xhr = new XMLHttpRequest();
		}
		else {
		xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
		  xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
			  jsonResponse = xhr.responseText;
			  weatherhourly(jsonResponse);
			}
			else if(xhr.status==429){
			alert("Openweathermap.org is throttling 1 or more of the 3 connection due to free account limit. Please try again in a minute.");
			}
		  };		  
		  xhr.open("GET",MyWeatherMap.url+cityName+MyWeatherMap.id, true);
		  xhr.send();
	}
	
	
//process raw data into something readable for right now
	function weatherNow (response){
	var now = JSON.parse(response)
		//location
	document.getElementById("place").innerHTML = (now.name);
	document.getElementById("windspdnow").innerHTML = "Wind: "+ Math.round(now.wind.speed) + windunit  + "  <input type='submit' name='hourly' value='3-hourly forecast' onClick='threehourforecast()'/>";
	document.getElementById("tempnow").innerHTML = Math.round(now.main.temp)+degreeunit;
	document.getElementById("humiditynow").innerHTML = ("Humidity: "+now.main.humidity+"% <input type='submit' name='7days' value='7 days forecast' onClick='sevendayforecast()'/>");
	document.getElementById("weatherdescriptionnow").innerHTML = (now.weather[0].description);
	document.getElementById("weathericonnow").innerHTML = "<img src = 'image/"+(now.weather[0].icon)+".png'>";
	
	var date = new Date(now.dt*1000);
	date.toISOString();
	document.getElementById('timenow').innerHTML= "Last updated: " + date;
}
//process the raw data into something readable for 7 day forecasts
	function weatherforecast (response){
	var forecast = JSON.parse(response)
	for(i=0;i<8;i++){
	var date = new Date((forecast.list[i].dt)*1000);
	var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
	var dayOfWeek = days[date.getDay()];
	document.getElementById("temp"+i).innerHTML = "L:"+Math.round(forecast.list[i].temp.min) +degreeunit + "   H:"+Math.round(forecast.list[i].temp.max) +degreeunit;
	document.getElementById("day"+i).innerHTML = dayOfWeek;
	document.getElementById("weatherdescription"+i).innerHTML = (forecast.list[i].weather[0].description);
	document.getElementById("weathericon"+i).innerHTML = "<img src = 'image/"+(forecast.list[i].weather[0].icon)+".png'>";
	document.getElementById("windspd"+i).innerHTML = ("Wind: "+forecast.list[i].speed)+windunit;
	document.getElementById("humidity"+i).innerHTML = ("Humidity: "+forecast.list[i].humidity) +"%";
	}
	}
	//process the raw data into something readable for 3 HOURLY forecasts
	function weatherhourly (response){
	var hourlyforecast = JSON.parse(response)
	for(i=0;i<8;i++){

	document.getElementById("day"+i).innerHTML = (hourlyforecast.list[i].dt_txt).substr(0,16)+" GMT";
	
	document.getElementById("temp"+i).innerHTML = Math.round(hourlyforecast.list[i].main.temp)+degreeunit;
	document.getElementById("weatherdescription"+i).innerHTML = (hourlyforecast.list[i].weather[0].description);
	document.getElementById("weathericon"+i).innerHTML = "<img src = 'image/"+(hourlyforecast.list[i].weather[0].icon)+".png'>";
	document.getElementById("windspd"+i).innerHTML = ("Wind: "+hourlyforecast.list[i].wind.speed)+windunit;
	document.getElementById("humidity"+i).innerHTML = ("Humidity: "+hourlyforecast.list[i].main.humidity) +"%";
		}
	}
