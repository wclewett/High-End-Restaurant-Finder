d3.json("http://localhost:5000/retrieve/locations/all/")
  .then(function(error, data) {
    console.log(data);
});


// Creating map object
var myMap = L.map("map", {
  center: [39.9526, -75.1652],
  zoom: 11
});

// Adding tile layer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
}).addTo(myMap);

// Create 1st dropdown
var stateMenu = d3.select("#stateDropdown")

stateMenu
.append("select")
.selectAll("option")
    .data("test")
    .enter()
    .append("option")
    .attr("value", function(d){
        return d.key;
    })
    .text(function(d){
        return d.key;
    })

// Create 2nd dropdown
var cityMenu = d3.select("#cityDropdown")

cityMenu
.append("select")
.selectAll("option")
    .data("test")
    .enter()
    .append("option")
    .attr("value", function(d){
        return d.key;
    })
    .text(function(d){
        return d.key;
    })

function handleStateMenu() {
  // d3.json() for heroku app to access locationsDB from atlas
  console.log("Load cities for selected state")
  // console.log(data)
  // create the drop down menu of cities
	var cityLoader = d3.select("#cityDropdown")
  .selectAll("option")
  .data()
  .enter().append("option")
  .text(function(d) { return d.city; })
  .attr("value", function (d, i) {
    return i;
  });
};

function handleSubmit() {
  console.log("Submit map location and call heroku app")
};

// Attach an event to listen for the search recipes button
d3. select("#stateDropdown").on("change", handleStateMenu);

// Attach an event to listen for the generate random recipe button
d3.select("#submit").on("click", handleSubmit);