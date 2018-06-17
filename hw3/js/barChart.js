class BarChart{

    /**
     * Create a bar chart instance and pass the other views in.
     * @param worldMap
     * @param infoPanel
     * @param allData
     */
    constructor(worldMap, infoPanel, allData) {
        this.worldMap = worldMap;
        this.infoPanel = infoPanel;
        this.allData = allData;
        console.log(this.worldMap);
        console.log(this.infoPanel);
    }

    /**
     * Render and update the bar chart based on the selection of the data type in the drop-down box
     */
    updateBarChart(selectedDimension) {


        console.log("UpdateBarChart:", selectedDimension);

        // ******* TODO: PART I *******


        // Create the x and y scales; make
        // sure to leave room for the axes

        var svg = d3.select("#barChart");

        // SVG width = 500
        // SVG height = 480

        var margin = { top: 30, right: 30, bottom: 50, left: 60 };
        
        var width = parseInt(svg.attr("width")) - margin.left - margin.right;
        var height = parseInt(svg.attr("height")) - margin.top - margin.bottom;

        console.log("width", width);
        console.log("height", height);
        
        var xScale = d3.scaleBand()
                        .range([0, width])
                        .domain([1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 
                            1974, 1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014]);
        
        var maxDataValue = d3.max(this.allData.map(d => d[selectedDimension]));
        
        var yScale = d3.scaleLinear()
                        .rangeRound([height, 0])
                        .domain([0, maxDataValue]);

        // Create colorScale

        var colorScale  = d3.scaleLinear()
            .domain([0, maxDataValue])
            .range(["lightblue", "darkblue"]);

        // Create the axes (hint: use #xAxis and #yAxis)


        svg.select("#xAxis")
            .attr("transform", "translate(" + (margin.left) + "," + (height + margin.top) + ")")
            .call(d3.axisBottom(xScale))
            .selectAll("text")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "end")
            .attr('dy', -1);

        svg.select("#yAxis")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
            .transition()
            //.ease(d3.easeSin)
            .duration(3000)
            .call(d3.axisLeft(yScale));

          
        // Create the bars (hint: use #bars)

        var g = svg.select("#bars").attr("transform", "translate(" + margin.left + "," + ( margin.top ) + " )"); 

        var bars = g.selectAll(".bar").data(this.allData);


        bars.transition()
            .duration(3000)
            .attr("height", d => height - yScale(d[selectedDimension]))
            .attr("y", d =>  yScale(d[selectedDimension]))
            .attr("x", d => xScale(d['YEAR']) + xScale.bandwidth()/2)
            .attr("fill", d => colorScale(d[selectedDimension]));
            //.attr("onmousemove", 'function(d) { d3.select(this).attr("fill", "silver");}')


        bars.enter()
            .append("rect")
            .attr("class", "bar")
            .attr("fill", d => colorScale(d[selectedDimension]))
            .attr("x", d => xScale(d['year']) + xScale.bandwidth()/2 )
            .attr("width", xScale.bandwidth()-2)
            .attr("height", d => height - yScale(d[selectedDimension]))
            .attr("y", d=> yScale(d[selectedDimension]))
            // ******* TODO: PART II *******
            // Implement how the bars respond to click events
            // Color the selected bar to indicate is has been selected.
           // Make sure only the selected bar has this new color.
            .on("click", function(d, i) {
                d3.selectAll(".bar").attr("fill", d => colorScale(d[selectedDimension]));
                d3.select(this).attr("fill","red");
                // Call the necessary update functions for when a user clicks on a bar.
                // Note: think about what you want to update when a different bar is selected.
                window.barChart.worldMap.updateMap(d);
                window.barChart.infoPanel.updateInfo(d);
            })

    }


    chooseData(select) {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
        this.updateBarChart(select.options[select.selectedIndex].value);

    }
}