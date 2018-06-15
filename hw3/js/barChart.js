class BarChart {

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

        var margin = { top: 20, right: 20, bottom: 40, left: 80 };
        var width = parseInt(svg.attr("width")) - margin.left - margin.right;
        var height = parseInt(svg.attr("height")) - margin.top - margin.bottom;
        var max_data = d3.max(this.allData.map(function(d) {return d[selectedDimension]}));

        console.log("max_data", max_data); 

        var xScale = d3.scaleBand().rangeRound([0, width]);
        var yScale = d3.scaleLinear().rangeRound([0, max_data]);

        xScale.domain(this.allData.sort(function(a, b) {
            return d3.ascending(a['year'], b['year'])
            }).map(function (d) { return d['year']; }));

        console.log(xScale.domain());

        yScale.domain([0, max_data]);

        // Create colorScale

        var colorScale  = d3.scaleLinear()
            .domain([0, max_data])
            .interpolate(d3.interpolateBlues)
            .range("lightblue", "blue");

        // Create the axes (hint: use #xAxis and #yAxis)

        svg.select("#xAxis")
            .attr("transform", "translate(" + height + "," + width + ")")
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr("class", "axis axis--x")
            .attr("transform", "rotate(-90)")
            .style("text-anchor", "end")
            .attr('dy', -1);

        svg.select("#yAxis")
            .attr("transform", "translate(" + margin.left + ", 0)")
            .attr("class", "axis axis--y")
            .transition()
            .ease(d3.easeSin)
            .duration(300)
            .call(d3.axisLeft(yScale));

          
        // Create the bars (hint: use #bars)

        var g = svg.select("#bars").attr("transform", "translate(" + margin.left + ", 0)"); 

        var bars = g.selectAll(".bar").data(this.allData);

        console.log("here we go");

        bars.transition()
            .duration(1000)
            .attr("height", d =>  max_data - yScale(d[selectedDimension]))
            .attr("y", d => yScale(d[selectedDimension]))
            .attr("fill", d => 'blue');
            //.attr("fill", d => colorScale(d[selectedDimension]));


        bars.enter()
            .append("rect")
            .attr("class", "bar")
            //.attr("fill", d => colorScale(d[selectedDimension]))
            .attr("x", d => xScale(d['year']))
            .attr("width", xScale.bandwidth())
            .attr("height", d => max_data - yScale(d[selectedDimension]))
            .attr("fill", d => 'blue')
            .attr("y", d => yScale(d[selectedDimension]));


        // ******* TODO: PART II *******

        // Implement how the bars respond to click events
        // Color the selected bar to indicate is has been selected.
        // Make sure only the selected bar has this new color.

        // Call the necessary update functions for when a user clicks on a bar.
        // Note: think about what you want to update when a different bar is selected.

    }

    /**
     *  Check the drop-down box for the currently selected data type and update the bar chart accordingly.
     *
     *  There are 4 attributes that can be selected:
     *  goals, matches, attendance and teams.
     */
    chooseData(select) {
        // ******* TODO: PART I *******
        //Changed the selected data when a user selects a different
        // menu item from the drop down.
        this.updateBarChart(select.options[select.selectedIndex].value);

    }
}