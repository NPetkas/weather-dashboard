

$(document).ready(function () {

    // Global variables
    var timeDisplay = $('#time-display');
    var date = dayjs().format("MM/DD/YYYY"); 
    var searchBtn = $(".search-button");
    var cities = $("#cities");
    var currentDay = $("#current-day");
    var forecastContainer = $("#forecast-container")
    var city = ""; 
    var location = [];


    // Current time and date display 
    function displayTime() {
      var rightNow = dayjs().format('MMM DD, YYYY [at] hh:mm:ss a');
      timeDisplay.text(rightNow);
    }
    displayTime();
    setInterval(displayTime, 1000);



    // Search button event listener 
    searchBtn.on("click", displayWeather);


    // Display weather function
    function displayWeather(e) {
      currentDay.empty();
        city = $("#search-input").val() || city; 

    // // Current weather fetch and current weather card display
    var weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=b89302ba1507bbb92078885c44cd370f`;
        fetch(weatherURL)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
              console.log(data)
              var currentWeather = data.weather[0].icon;
                var currentLocation = $("<h2>").text(`${city} (${date})`);
                var currentIcon = $("<img>").attr("src", `https://openweathermap.org/img/wn/${currentWeather}@2x.png`);
                var currentTemp = $("<p>").text(`Temp: ${data.main.temp} ˚F`);
                var currentWind = $("<p>").text(`Wind: ${data.wind.speed} MPH`);
                var currentHumidity = $("<p>").text(`Humidity: ${data.main.humidity}%`);
                
                currentIcon.addClass("icon");
                currentDay.append(currentLocation, currentTemp, currentWind, currentHumidity);
                currentLocation.append(currentIcon);
            });

            
    // 5 day forecast fetch and forecast card display
    var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=b89302ba1507bbb92078885c44cd370f`;
        forecastContainer.empty();

        fetch(forecastURL)
            .then(function (response) {
              console.log(response)
                return response.json();
            })
            .then(function (forecastData) {
                console.log(forecastData)
                var forecasts = forecastData.list;

                for (let i = 7; i < forecasts.length; i += 8) {
                    var day = new Date(forecastData.list[i].dt_txt);
                    var fiveDay = dayjs(day).format("MM/DD/YY");
                    var weather = forecasts[i].weather[0].icon;
                    var dayTime = $("<h3>").text(fiveDay);
                    var icon = $("<img>").attr("src",`https://openweathermap.org/img/wn/${weather}@2x.png`);
                    var temp = $("<p>").text(`Temp: ${forecasts[i].main.temp} ˚F`);
                    var wind = $("<p>").text(`Wind: ${forecasts[i].wind.speed} MPH`);
                    var humidity = $("<p>").text(`Humidity: ${forecasts[i].main.humidity}%`);

                    icon.addClass("icon");
                    dayTime.append(icon, temp, wind, humidity);
                    forecastContainer.append(dayTime);
                }
            });
    };
    

    // Search input field event listener and set to local storage
    searchBtn.on("click", function (event) {
         event.preventDefault();
         var cityName = $("#search-input").val().trim();
         location.push(cityName)
         var locations = JSON.stringify(location);
         $("#search-input").val("");
         localStorage.setItem("city", locations);
         cityButtons();
  });

    // City buttons creation function and retrieve from local storage
    function cityButtons() {
         cities.empty();

         var loadCity = localStorage.getItem("city");
         if (loadCity == null || loadCity == "") {
            return;
        }

    // Cities button creation 
    var cityBtn = JSON.parse(loadCity);
        for (let i = 0; i < cityBtn.length; i++) {
            var newBtn = $("<button>");
            newBtn.addClass("btn btn-secondary w-100 mb-3 cityBtn");
            newBtn.attr("data-city", cityBtn[i]);
            newBtn.text(cityBtn[i])
            cities.append(newBtn);
        }
    }

    // Cities button current weather and forecast display
    cities.on("click", ".cityBtn", function (e) {
        city = e.target.firstChild.data;
        displayWeather()
        
    })

    // Clear search button
        var clearSearch = $("<div>");
        var deleteBtn = $("<button>");
        clearSearch.addClass("clearSearch mt-3");
        deleteBtn.addClass("btn w-100 btn bg-dark text-light mb-3 delete");
        deleteBtn.attr("id", "delete")
        deleteBtn.text("Clear Search");
        clearSearch.append(deleteBtn);
        clearSearch.insertBefore(".hr");
    

    // Delete search history event listener
    $(".delete").on("click", function (e) {
        localStorage.clear();
    });
});