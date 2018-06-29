var graphData = null;
var graph = {nodes: [], links: []};
var nodeCount = 119;
var width = 800;
var height = 1200;
var margin = 50;
var force = d3.layout.force()
	.size([width, height]);

var groups = [];


d3.json('data/countries_2012.json',
	function(error, data){
		// alpha2_code
		// continent
		// gdp
		// latitude
		// life_expectancy
		// longitude
		// name
		// population
		// year
		graphData = data;
		initialize();
		vertical_layout();
	});


initialize = function(){

	graph.nodes = d3.range(nodeCount).map(function(d, i) {return {
			cat : graphData[i]["continent"],
			name : graphData[i]["name"],
			population : graphData[i]["population"],
			gdp : graphData[i]["gdp"],
			life: graphData[i]["life_expectancy"],
			code : graphData[i]['alpha2_code'],
			long : graphData[i]['longitude'],
			lat : graphData[i]['latitude']			
		}}); // map nodes data

	groups = d3.select("svg")
		.attr("height", height)
		.attr("width", width)
		.selectAll("g")
		.data(graph.nodes)
		.enter()
		.append("g")
		.attr("width", 100)
		.attr("height", (height - margin)/nodeCount);

	groups
		.append("circle")
		.attr("r", 5)
		.attr("cx", width/2)
		.attr("cy", (d, i) => margin + (height - margin)/nodeCount * i)
		.classed("node", true);

	groups
		.append("text")
		.text(d => d.name)
		.attr("x", width/2 + 10)
		.attr("y", (d, i) => margin + (height - margin)/nodeCount * i);

};

vertical_layout = function(){
	
	console.log("vertical_layout");

	d3.select("#by").attr("disabled", null); //  turn on sorting parameter


	var sorting_key = document.getElementById("by");
	sorting_key = sorting_key.options[sorting_key.selectedIndex].value; 
	graph.nodes.sort((x, y) => d3.descending(+x[sorting_key], +y[sorting_key]));

	var newXCoords = {};
	var newYCoords = {};

	graph.nodes.forEach(function(d, i) {
		newXCoords[d.code] = width / 2;
		newYCoords[d.code] = margin + i * (height - margin)/nodeCount;
	});
	

	groups.selectAll(".node").transition()
		.duration(1000)
		.attr("cx", d => newXCoords[d.code])
		.attr("cy", d => newYCoords[d.code]);


	groups.selectAll("text").transition()
		.duration(1000)
		.attr("x", d => newXCoords[d.code] + 10)
		.attr("y", d => newYCoords[d.code] + 5);
};


verticalLS_layout = function(){
	console.log("verticalLS_layout");
	d3.select("#by").attr("disabled", null);

	var sorting_key = document.getElementById("by");
	sorting_key = sorting_key.options[sorting_key.selectedIndex].value; 
	graph.nodes.sort((x, y) => d3.descending(+x[sorting_key], +y[sorting_key]));

	var newXCoords = {};
	var newYCoords = {};
	var before_ = margin;

	graph.nodes.forEach(function(d, i) {
		newXCoords[d.code] = width / 2;
		newYCoords[d.code] = before_ + d[sorting_key] * (height - margin)/d3.sum(graph.nodes.map(d_ => d_[sorting_key]));
		before_ += d[sorting_key] * (height - margin)/d3.sum(graph.nodes.map(d_ => d_[sorting_key])); 
	});
	

	groups.selectAll(".node").transition()
		.duration(1000)
		.attr("cx", d => newXCoords[d.code])
		.attr("cy", d => newYCoords[d.code]);


	groups.selectAll("text").transition()
		.duration(1000)
		.attr("x", d => newXCoords[d.code] + 10)
		.attr("y", d => newYCoords[d.code] + 5);


};

byChanged = function(){
	console.log("byChanged"); 
	if (document.querySelector('input[name="layout1"]:checked').value == 'vertical') vertical_layout()
		else verticalLS_layout();
};


spGDP_layout = function(){
	console.log("scatterplotGDP_layout");
	d3.select("#by").attr("disabled", true);

	var newXCoords = {};
	var newYCoords = {};

	graph.nodes.forEach(function(d, i) {
		newXCoords[d.code] = margin + d["gdp"]*(width - 2*margin)/d3.max(graph.nodes.map(d_ => d_["gdp"]));
		newYCoords[d.code] = -margin + height - d["population"]*(height - 2*margin)/d3.max(graph.nodes.map(d_ => d_["population"]));
	});
	

	groups.selectAll(".node").transition()
		.duration(1000)
		.attr("cx", d => newXCoords[d.code])
		.attr("cy", d => newYCoords[d.code]);


	groups.selectAll("text").transition()
		.duration(1000)
		.attr("x", d => newXCoords[d.code] + 10)
		.attr("y", d => newYCoords[d.code] + 5);
};

scatterplotLL_layout = function(){
	console.log("scatterplotLL_layout");
	d3.select("#by").attr("disabled", true);

	var newXCoords = {};
	var newYCoords = {};

	graph.nodes.forEach(function(d, i) {
		newXCoords[d.code] = width/2 + d["long"]*(width - 2*margin)/360;
		newYCoords[d.code] = height/2 - d["lat"]*(height - 2*margin)/180;
	});
	

	groups.selectAll(".node").transition()
		.duration(1000)
		.attr("cx", d => newXCoords[d.code])
		.attr("cy", d => newYCoords[d.code]);


	groups.selectAll("text").transition()
		.duration(1000)
		.attr("x", d => newXCoords[d.code] + 10)
		.attr("y", d => newYCoords[d.code] + 5);
};


circularP_layout = function(){
	console.log("circularP_layout");
	d3.select("#by").attr("disabled", true);
};

circularG_layout = function(){
	console.log("circularG_layout");
	d3.select("#by").attr("disabled", true);
};

grouped = function(){
	console.log("grouped");
	d3.select("#by").attr("disabled", true);
};

grouped2 = function(){
	console.log("grouped2");
	d3.select("#by").attr("disabled", true);
};


update = function(){
  	  d3.selectAll(".node")
  	  .data(graph.nodes)
  	  .transition().duration(1000)
      .attr("transform", function(d) { 
        return "translate("+d.x+","+d.y+")"; 
      });
};



d3.select("input[value=\"vertical\"]").on("click", vertical_layout);
d3.select("input[value=\"verticalLS\"]").on("click", verticalLS_layout);
d3.select("input[value=\"GDP\"]").on("click", spGDP_layout);
d3.select("input[value=\"ll\"]").on("click", scatterplotLL_layout);
d3.select("input[value=\"circularP\"]").on("click", circularP_layout);
d3.select("input[value=\"circularG\"]").on("click", circularG_layout);
d3.select("input[value=\"grouped\"]").on("click", grouped);
d3.select("input[value=\"grouped2\"]").on("click", grouped2);
d3.select("#by").on("change", byChanged);

