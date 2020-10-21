// data parse functions
function locationPull(data) {
  var locations = data.locations;
  return locations
};

function businessesPull(data) {
  var businesses = data.businesses;
  return businesses
};

function coordinatesPull(data) {
  var coordinates = data.coordinates.loc;
  return coordinates
};

// bar chart functions
// Define SVG area dimensions
var svgWidth = 900;
var svgHeight = 500;

// Define the chart's margins as an object
var margin = {
    top: 40,
    right: 40,
    bottom: 200,
    left: 150
  };

// Define dimensions of the chart area
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

var svg = d3
  .select("#bar-container")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);


function createBars(method) {
  d3.json(window.location.href + '/graph', function (data) {
    // store data
    var businesses = data.businesses;
    // initialize new array
    var businessArray = []
    // create keys
    var keys = ["name", "rating", "popularity", "score", "url"]
    for (var index = 0; index < businesses.length; index ++) {
      // sort data
      var name = businesses[index].restaurant_name;
      var rating = businesses[index].rating;
      var popularity = businesses[index].popularity;
      var score = rating * popularity;
      var url = businesses[index].url;
      var obj = {};
      obj[keys[0]] = name;
      obj[keys[1]] = rating;
      obj[keys[2]] = popularity;
      obj[keys[3]] = score;
      obj[keys[4]] = url;
      businessArray.push(obj);
    };
    console.log(businessArray);
    // Remove previous graph
    svg.selectAll("g").remove();
    d3.select(".d3-tip").remove();
    // Append a group area, then set its margins
    var chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    if (method === 'popularity') {
      businessArray.sort(function(a, b) {
        return b.popularity - a.popularity; 
      });
    } else if (method === 'score') {
      businessArray.sort(function(a,b) {
        return b.score - a.score;
      });
    } else {
      businessArray.sort(function(a,b) {
        return b.rating - a.rating;
      });
    }

    yValues = []
    graphData = [];
    for (i = 0; i < businessArray.length; i++) {
      if (i === 20) { break; }
      graphData.push(businessArray[i])
      yValues.push(businessArray[i].popularity)
    };

    console.log(graphData);
    
    var xBandScale = d3.scaleBand()
      .range([0, chartWidth])
      .domain(graphData.map(function(d) {
        return d.name;
      }))
      .padding(0.1);

    var yLinearScale = d3.scaleLinear()
      .range([chartHeight, 0])
      .domain([0, d3.max(graphData, function(d) {
        return d[method];
      })]);

    // Initialize axis functions
    var bottomAxis = d3.axisBottom(xBandScale);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);

    // Append x and y axes to the chart
    var xAxis = chart.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    var yAxis = chart.append("g")
      .call(leftAxis);
    
    var toolTip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([40, -10])
      .html(function(d) {
        return "Yelp Site: <a target='_blank' href=" + d.url + " style='color: #266bff;'>" + d.name + "</a>";
      });
    chart.selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-25)");

    // append Y Axis Label
    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (chartHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text(method);

    chart.selectAll()
      .data(graphData)
      .enter()
      .append('rect')
      .attr('x', function(data) {
        return xBandScale(data.name);
      })
      .attr('y', function(data) {
        return yLinearScale(0);
      })
      .attr('height', function(data) {
        return chartHeight - yLinearScale(0);
      })
      .attr('width', xBandScale.bandwidth())
      .attr("class", "bar");
    
    chart.selectAll("rect")
      .transition()
      .duration(1000)
      .attr("y", function(data) { 
        return yLinearScale(data[method]);
      })
      .attr('height', function(data) {
        return chartHeight - yLinearScale(data[method]);
      })
      .delay(function(d,i){console.log(i) ; return(i*100)})
    
    chart.call(toolTip);

    chart.selectAll("rect")
      .on('mouseover', toolTip.hide)
      .on('click', toolTip.show)
    });
  };

// dropdown functions
function stateDropdown(locations) {
  var states = Object.keys(locations);
  var stateMenu = d3.select("#stateDropdown");
  stateMenu
      .selectAll("option")
      .enter()
      .data(states)
      .enter()
      .append("option")
      .attr("value", function(d){
          return d;
      })
      .text(function(d){
          return d;
      });
  return stateMenu
};

function cityDropdown() {
  var state = this.options[this.selectedIndex].value;
  var cityMenu = d3.select("#cityDropdown");
  cityMenu.selectAll("option")
     .remove();
  cityMenu.selectAll("option")
     .data(locations[state])
     .enter()
     .append("option")
     .attr("value", function(d){
          return d.name;
      })
     .text(function(d){
          return d.name;
      });
  return cityMenu
};
// map functions
function renderMap(coordinates, globalMarkers){
  // Creating map object
  var myMap = L.map("map", {
    center: coordinates,
    zoom: 11,
    layers: globalMarkers
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
  return myMap
};

function createMarkers(coordinates, businesses) {
  // initialize array
  var businessMarkers = [];
  for (var index = 0; index < businesses.length; index ++) {
    // store all business info
    var business = businesses[index];
    // store latlng for null testing
    var locArray = [business.location[0], business.location[1]];

    // check for nulls
    if (locArray[0] !== null) {
      var businessMarker = L.marker(L.latLng([business.location[0], business.location[1]]))
      .bindPopup("<h3>" + business.restaurant_name + "</h3><h4>Popularity: " + business.popularity + " ratings</h4><h4>Rating: "
      + business.rating + " stars</h4><h5>Tags: " + business.tags + "</h5><h5><a target='_blank' href=" + business.url + ">Yelp Site</a></h5><h5>Phone: "
      + business.phone + "</h5><h5>Street Address: " + business.address + "</h5>");
    
    businessMarkers.push(businessMarker);
    } else {
      console.log("No Lat/Lng for " + business.restaurant_name)
    };
  };
  return renderMap(coordinates, businessMarkers)
};

function handleSubmit() {
  // pull location
  var stateValue = document.getElementById("stateDropdown");
  var state =  stateValue.options[stateValue.selectedIndex].value;
  console.log(state);
  var cityValue = document.getElementById("cityDropdown");
  var city =  cityValue.options[cityValue.selectedIndex].value;
  console.log(city);
  window.open("https://high-end-restaurant-finder.herokuapp.com/businesses/" + state + "/" + city)
};

function alterGraph() {
  var methodValue = document.getElementById("resultsDropdown");
  var method =  methodValue.options[methodValue.selectedIndex].value;
  console.log(method);
  createBars(method);
}