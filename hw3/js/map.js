/** Class implementing the map view. */
class Map {
    /**
     * Creates a Map Object
     */
    constructor() {
        this.projection = d3.geoConicConformal().scale(150).translate([400, 350]);

    }

    /**
     * Function that clears the map
     */
    clearMap() {

        // ******* TODO: PART V*******
        // Clear the map of any colors/markers; You can do this with inline styling or by
        // defining a class style in styles.css

        // Hint: If you followed our suggestion of using classes to style
        // the colors and markers for hosts/teams/winners, you can use
        // d3 selection and .classed to set these classes on and off here.

        d3.select("#points").selectAll('circle').remove();
        d3.select("#map").selectAll('.team').classed('team', false);
        d3.select("#map").selectAll('.host').classed('host', false);

    }

    /**
     * Update Map with info for a specific FIFA World Cup
     * @param wordcupData the data for one specific world cup
     */
    updateMap(worldcupData) {

        //Clear any previous selections;
        this.clearMap();

        // ******* TODO: PART V *******

        // Add a marker for the winner and runner up to the map.

        // Hint: remember we have a conveniently labeled class called .winner
        // as well as a .silver. These have styling attributes for the two
        // markers.


        // Select the host country and change it's color accordingly.

        // Iterate through all participating teams and change their color as well.

        // We strongly suggest using CSS classes to style the selected countries.


        // Add a marker for gold/silver medalists

        var isoNames = worldcupData.teams_iso;

        for (var i in isoNames){
            console.log(isoNames[i]);
            d3.select("[id=cntr_"+isoNames[i]+"]").classed("team", true); 
        }
        
        d3.select("#cntr_" + worldcupData['host_country_code']).classed('host', true);
        
        d3.select("#points")
            .data([worldcupData.win_pos])
            .append('circle')        
            .attr("cx",  d => this.projection(d)[0])
            .attr("cy", d =>  this.projection(d)[1])
            .attr("r", "8px")
            .classed("gold", true);

        d3.select("#points")
            .data([worldcupData.ru_pos])
            .append('circle')
            .attr("cx", d => this.projection(d)[0])
            .attr("cy", d => this.projection(d)[1])
            .attr("r", "8px")
            .classed("silver", true);

    }

    /**
     * Renders the actual map
     * @param the json data with the shape of all countries
     */
    drawMap(world) {

        var path = d3.geoPath().projection(this.projection);
        
        d3.select("#map").selectAll("path")
            .data(topojson.feature(world, world.objects.countries).features)
            .enter()
            .append("path")
            .attr('id', d => 'cntr_' + d.id)
            .classed("countries", true)
            .attr("d", path);

        var graticule = d3.geoGraticule();

        d3.select("#map").append("path")
            .datum(graticule)
            .style("fill", "none")
            .style("stroke", '#777')
            .style("stroke-width", '.5px')
            .style("stroke-opacity", 0.7)
            .attr("d", path);

    }


}
