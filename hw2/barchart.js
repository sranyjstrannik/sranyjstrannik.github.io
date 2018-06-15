d3.json("https://raw.githubusercontent.com/avt00/dvcourse/master/countries_1995_2012.json", function(error, data){
	
	var tmp_data = [];
    
    for (i=0; i< data.length; i++) {
        for (j=0; j<data[i]['years'].length; j++) {
            obj = {
                'Country': data[i]['name'],
                'Continent': data[i]['continent'],
                'GDP': data[i]['years'][j]['gdp'] / 100000000,
                 'Population': data[i]['years'][j]['population'],
                'Year': data[i]['years'][j]['year']
            }
            tmp_data.push(obj);
        }
    };

    var continents = ["Asia", "Africa", "Americas", "Europe", "Oceania"];


    var colors = {
        "Africa" : 'orange',
        "Americas" : "lightblue",
        "Europe" : "gray",
        "Asia" : "red", 
        'Oceania' : "green"
    };


    d3.selectAll("input").on("change", update);
    d3.select("[type=range]").on("mousemove", update);

	function update()
    {

        // *****
        // DATA PREPARATION

    	var year = d3.select("[type=range]").node().value;
    	var encoder = d3.select("[name=encoded]:checked").node().value;
    	
        var filter = [];
        d3.selectAll("[type=checkbox]").each(function(d){
          cb = d3.select(this);
          if(cb.property("checked")){
            filter.push(cb.property("value"));
          }
        }); 

    	var aggregated = d3.select("[name=aggregated]:checked").node().value;
    	var sorted = d3.select("[name=sorted]:checked").node().value;

        console.log("Выбранный год", year);
        console.log("Размер столбца", encoder);
        console.log("Выбранный фильтр", filter);
        console.log("Сагригированно через", aggregated);
        console.log("Отсортированно по", sorted);

        data = tmp_data;


        data = data.filter(function(d, i) { return d['Year'] == year 
            && filter.includes(d["Continent"]);});

        aggData = [];
        for (i = 0; i < filter.length; i++) aggData.push({
                'Country' : filter[i],
                'Continent' : filter[i],
                'GDP' : d3.sum(data.filter(function(d, j) { return d["Continent"] == filter[i]})
                    .map(function (d, j) {return d['GDP']})),
                'Population' : d3.sum(data.filter(function(d, j) { return d["Continent"] == filter[i]})
                    .map(function (d, j) {return d['Population']})),
                'Year' : year
            });

        if (aggregated == "Continent") data = aggData; 


        data.sort(function (x, y) {
            if (sorted == "Name")
                return d3.descending(x[sorted], y[sorted])
            else if (sorted == "GPD") return d3.descending(parseFloat(x[sorted]), parseFloat(y[sorted]))
            else return d3.descending(parseInt(x[sorted]), parseInt(y[sorted]));
        });



        // ****
        // DATA VISUALIZATION

        var margin = {top: 50, bottom: 10, left:200, right: 40};
        var width = 900 - margin.left - margin.right;
        var height = 30 * data.length;

        var xScale = d3.scaleLinear().range([10, width]);
        var yScale = d3.scaleBand().rangeRound([0, height], .8, 0);
    
        var max = d3.max(data, function(d) { return d[encoder]; } );
        var min_ = 10;

        xScale.domain([min_, max]);
        yScale.domain(data.map(function(d) { return d['Country']; }));

        d3.selectAll('svg').remove();

        var svg = d3.select("body").append("svg")
                        .attr("width", width+margin.left+margin.right)
                        .attr("height", height+margin.top+margin.bottom);
                

        var g = svg.append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var groups = g.append("g")
                    .selectAll("text")
                    .data(data)
                    .enter()
                    .append("g");

        
        groups.append('text')
                    .text(function(d) {return d['Country']})
                    .attr("x", margin.left - 10)
                    .attr("y", function(d) {return yScale(d['Country']) + 20} )
                    .attr("text-anchor", "end")
                    .attr('alignment-baseline', "middle");
 
        groups.append("rect")
                    .attr("width", function(d) { return xScale(d[encoder]); })
                    .attr("height", 28)
                    .attr("x", margin.left)
                    .attr("y", function(d) { return yScale(d['Country']); })
                    .attr("fill", function(d) {return colors[d["Continent"]]});

        
    };

  
    update();

});