// Creating map object
var myMap = L.map("map", {
  center: [40.7128, -74.0059],
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

// Create 1st dropdown
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