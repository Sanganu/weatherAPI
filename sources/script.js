//Local Storage


// var history = JSON.parse(window.localStorage.getItem("history")) || [];
var len = []
var previouscities = JSON.parse(localStorage.getItem("weatherAPI"))|| [];

console.log("SearchList",localStorage.weatherAPI);

function displayRecentSearch(){
    var previouscities = JSON.parse(localStorage.getItem("weatherAPI"))|| [];
    $("#list").empty();
    for(let i=0;i<previouscities.length;i++){
        $("#list").append("<li class='previoussearch'>"+previouscities[i]+"</li>")
    }
}

displayRecentSearch();

$("#list").on("click",".previoussearch",function(event){
    var city = $(this).text();
    getCurrentWeather(city);
    getforecast(city);
})


//SEarch weather
$("#searchweather").on("click",function(event){
    event.preventDefault();
    var city = $("#entercity").val().trim() || "Denver";

         getCurrentWeather(city);
         getforecast(city);
        $("#entercity").val("");
});

function getforecast(cityname){

    $.ajax({
        type: "GET",
        url:`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=3d1a8b5789767e359e88b92160cb58fe&units=imperial`,
        datatype:"JSON",
        success: function(data){
              console.log(data)
              $("#forecast").html("<div class='row'>");
              for(let i=0;i< data.list.length;i++){
                  if(data.list[i].dt_txt.endsWith("06:00:00")){
                      $("#forecast").append(`<div class="col s6 m3"><div class="card cyan darken-1"><h5>${data.list[i].dt_txt}</h5>
                      <img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png"/>
                      <p>${data.list[i].wind.speed}mph</p>
                      <p>${data.list[i].main.humidity}%</p><p>${data.list[i].main.temp}°F</p></div></div>`)
                  }
              }
              $("#forecast").append("</div>");
                if (previouscities.indexOf(cityname.toLowerCase())=== -1)
                    {
                        previouscities.push(cityname.toLowerCase());
                        localStorage.setItem("weatherAPI",JSON.stringify(previouscities));
                        displayRecentSearch();
                    }
                   console.log(localStorage.getItem("weatherAPI"))
        }, 
        error: function(error){
            console.log("API to fetch for the city failed. Try another city",error)
            alert("Unable to fetch forecast. Please enter city name. Example: Chicago / Denver / Dallas");
            
        }
    });
}

function getCurrentWeather(city){

    $.ajax({
        type:"GET",
        url:"https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=39e91c48d1b4f937beac8b5748619871&units=imperial",
        datatype:"json",
        success: function(data){
            console.log(data);
            $("#weathercontainer").empty();
            var todate = new Date().toLocaleDateString()
            $("#weathercontainer").append(`
            <div class=""><h5>${data.name}</h5><p>${todate}</p>
            <h6>${data.wind.speed}MPH</h6><h6>${data.main.humidity}%</h6>
            <h6>${data.main.temp}°F</h6><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png"/></div>`)
        }});
}

