document.addEventListener('DOMContentLoaded',function() {
    document.querySelector('select[#id = dataset]').onchange=chooseData;
},false);

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



        // ******* TODO: PART I *******


        // Create the x and y scales; make
        // sure to leave room for the axes

        var width = 640;
        var height = 480;

        var xScale = d3.scaleLinear().range([10, width]);
        var yScale = d3.scaleBand().rangeRound([0, height], .8, 0);

        // Create colorScale

        var colorScale  = d3.scaleSequential(d3.interpolateBlues).domain([0, 10000]);

        // Create the axes (hint: use #xAxis and #yAxis)

        // Create the bars (hint: use #bars)




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
        console.log(select.options[select.selectedIndex]);

    }
}