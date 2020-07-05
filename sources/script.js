//Local Storage


// var history = JSON.parse(window.localStorage.getItem("history")) || [];
let len = []
let previouscities = JSON.parse(localStorage.getItem("weatherAPI"))|| [];

// console.log("SearchList",localStorage.weatherAPI);

function displayRecentSearch(){
     previouscities = JSON.parse(localStorage.getItem("weatherAPI"))|| [];
    $("#list").empty();
    for(let i=0;i<previouscities.length;i++){
        $("#list").append("<li><span class='previoussearch'>"+
        previouscities[i].slice(0,1).toUpperCase()+previouscities[i].slice(1)+
        "</span><i class='deletecity material-icons'>delete</i></li>")
    }
}

displayRecentSearch();

$("#list").on("click",".deletecity",function(event){
   let citydelete = $(this).siblings("span").text().toLowerCase();
//    console.log("CD",citydelete)
  let previous= previouscities.filter(city =>city!= citydelete);
   console.log(previous);
   localStorage.setItem("weatherAPI", JSON.stringify(previous))
   displayRecentSearch();
})

$("#list").on("click",".previoussearch",function(event){
    let city = $(this).text();
    getCurrentWeather(city);
    getforecast(city);
})

if(previouscities.length > 0){
    console.log("Previou",previouscities.length)
    let recentsearch= previouscities[previouscities.length-1];
    getforecast(recentsearch);
    getCurrentWeather(recentsearch);
}
//SEarch weather
$("#searchweather").on("click",function(event){
    event.preventDefault();
    let city = $("#entercity").val().trim() || "Denver";

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
                      $("#forecast").append(`<div class="col s6 m3"><div class="card #00acc1 cyan darken-1"><h5 class="flow-text">${moment(data.list[i].dt_txt).format('dddd')}</h5>
                      <p>${moment(data.list[i].dt_txt).format('l')}</p><p>${moment(data.list[i].dt_txt).format('LT')}</p>
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

async function displayUVIndex(lon,lat){
    let uvstring;
   await  $.ajax({
        type:"GET",
        url:`https://api.openweathermap.org/data/2.5/uvi?appid=39e91c48d1b4f937beac8b5748619871&lat=${lat}&lon=${lon}`,
        datatype:"json",
        success: function(data){
            console.log(data);
         
            if(data.value < 3){
              uvstring = `<span><button class="btn-small #ffff00 yellow accent-2 disable">${dta.value}</button></span>`
            }else if(data.value < 7){
                 uvstring =`<span><button class="btn-small #e65100 orange darken-4 disable">${data.value}</button></span>`     
            }else{
                 uvstring = `<span><button class="btn-small #b71c1c red darken-4 disable">${data.value}</button></span>`          
            }
            console.log(uvstring)
        
        }
    });
    return uvstring;
}


function getCurrentWeather(city){

    $.ajax({
        type:"GET",
        url:"https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=39e91c48d1b4f937beac8b5748619871&units=imperial",
        datatype:"json",
        success: function(data){
            console.log(data);
            $("#weathercontainer").empty();
            let todate = new Date().toLocaleDateString();
            displayUVIndex(data.coord.lon,data.coord.lat)
            .then(function(uvindex){
                console.log(uvindex)
                $("#weathercontainer").append(`
                <div class="row">
                <div class="col s12 m10">
                <div class="card-panel #00838f cyan darken-3 z-dept-2">
                    <h5 class="card-title">${data.name}</h5>
                  <div class="card-content"><p>${todate}</p>
                     <img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png"/>
                     <h6>${data.wind.speed}MPH</h6><h6>${data.main.humidity}%</h6>
                     <h6>${data.main.temp}°F</h6>
                     <h6>UV:  ${uvindex}</h6>
                  </div>
                </div>
                </div>
                </div>
               `)
            })
           
        
        }});
}

