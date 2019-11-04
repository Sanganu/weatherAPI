//Local Storage
var history = []
history = JSON.parse(window.localStorage.getItem("history")) || [];
for(let i=0;i<history.length;i++){
    $("#list").append("<li>"+history[i]+"</li>")
}
$("#list").append(localStorage.getItem("recentweathersearch"))

//SEarch
$("#searchweather").on("click",function(event){
    event.preventDefault();
    var city = $("#entercity").val().trim() || "Denver"

    $.ajax({
        type:"GET",
        url:"https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=39e91c48d1b4f937beac8b5748619871&units=imperial",
        datatype:"json",
        success: function(data){
            console.log(data);
            console.log(history)
            localStorage.setItem("recentweathersearch",city);
            // if(history.length > 1){
            //     if(history.indexOf(city) === -1){
            //         history.push(city);
            //         window.localStorage.setItem("history",JSON.stringify(history))
            //     }
            // }
            // else{
            //     history.push(city);
            //     window.localStorage.setItem("history",JSON.stringify(history))
            // }
            var todate = new Date().toLocaleDateString()
            console.log(data.weather);
            console.log(data.main)
            $("#weathercontainer").append(`
            <div class=""><h3>${data.name}</h3><p>${todate}</p>
            <h4>${data.wind.speed}MPH</h4><h5>${data.main.humidity}%</h5>
            <h6>${data.main.temp}°F</h6><img src="http://openweathermap.org/img/w/${data.weather[0].icon}.png"/></div>`)
        }});
        getforecast(city);
   
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
                      $("#forecast").append(`<div class="col s6 m3"><div class="card cyan accent-1 darken-1"><h5>${data.list[i].dt_txt}</h5>
                      <img src="http://openweathermap.org/img/w/${data.list[i].weather[0].icon}.png"/>
                      <p>${data.list[i].wind.speed}mph</p>
                      <p>${data.list[i].main.humidity}%</p><p>${data.list[i].main.temp}°F</p></div></div>`)
                  }
              }
              $("#forecast").append("</div>")
        }
    })
}