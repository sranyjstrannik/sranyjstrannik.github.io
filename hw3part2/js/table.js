/** Class implementing the table. */
class Table {
    /**
     * Creates a Table Object
     */
    constructor(teamData, treeObject) {

        //Maintain reference to the tree Object; 
        this.tree = treeObject; 

        // Create list of all elements that will populate the table
        // Initially, the tableElements will be identical to the teamData
        this.tableElements = teamData; // 

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 90,
            "height": 20,
            "buffer": 15
        };

        this.bar = {
            "height": 20
        };

        /** Set variables for commonly accessed data columns*/
        this.goalsMadeHeader = 'Goals Made';
        this.goalsConcededHeader = 'Goals Conceded';

        /** Setup the scales*/
        this.goalScale = null; 

        /** Used for games/wins/losses*/
        this.gameScale = null; 

        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0', '#016450' for the range.*/
        this.aggregateColorScale = null; 

        /**For goal Column. Use colors '#cb181d', '#034e7b'  for the range.*/
        this.goalColorScale = null; 
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains
        this.goalScale = d3.scaleLinear()
            .domain([0, 18])
            .range([this.cell.buffer, this.cell.width + this.cell.buffer]);

        this.gameScale = d3.scaleLinear()
            .domain([1, 7])
            .range([this.cell.buffer, this.cell.width + this.cell.width]);

        this.goalColorScale = d3.scaleLinear()
            .domain([0, 6])
            .range(['#ece2f0', '#016450']);


        // Create the x axes for the goalScale.

        var goalAxis = d3.axisBottom()
            .tickValues(d3.range(0, 20, 2))
            .scale(this.goalScale);


        d3.select("#goalHeader")
            .append("svg")
            .attr("height", this.cell.height)
            .attr("width", this.cell.width + 2 * this.cell.buffer)
            .append("g")
            .attr("height", this.cell.height)
            .attr("width", this.cell.width + 2 * this.cell.buffer)
            //.attr("transform", "translate(" + -this.cell.buffer + "," + 0 + ")")
            .call(goalAxis);
            
        //add GoalAxis to header of col 1.

        // ******* TODO: PART V *******

        // Set sorting callback for clicking on headers

        // Clicking on headers should also trigger collapseList() and updateTable(). 

       
    }


    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable() {
        // ******* TODO: PART III *******
        //Create table rows
        var rows = d3.select("tbody")
            .selectAll("tr")
            .data(this.teamData)
            .enter()
            .append("tr");


        var tableHeaders = this.tableHeaders;
        var teamData = this.teamData;
        var cell = this.cell;
        var scales = [this.goalScale,this.goalScale, this.gameScale];
        scales[1488] = this.goalColorScale;


        var cells = rows.selectAll("td")
            .data(function (row) {
            return [row.key].concat(tableHeaders.map(function (columnHeader) {
              return row.value[columnHeader];
            }));
          })
          .enter()
          .append('td');


        cells.filter((d, i) => i<=2)
            .text(function(d, i){
            return  i!= 2 ? d : d.label;
          });

        cells.filter((d, i) => i>2)
          .append("div")
          .style("height", cell.height + "px")
          .style("width", (d, i) => scales[i](d) + "px")
          .style("background-color", (d, i) => scales[1488](d))
          .style("color", "white")
          .style("text-align","right")
          .text(function(d, i){
            return d;
          });

        //Append th elements for the Team Names

        //rows.append("td")

        //Append td elements for the remaining columns. 
        //Data for each cell is of the type: {'type':<'game' or 'aggregate'>, 'value':<[array of 1 or two elements]>}
        
        //Add scores as title property to appear on hover

        //Populate cells (do one type of cell at a time )

        //Create diagrams in the goals column

        //Set the color of all games that tied to light gray

    };

    /**
     * Updates the global tableElements variable, with a row for each row to be rendered in the table.
     *
     */
    updateList(i) {
        // ******* TODO: PART IV *******
       
        //Only update list for aggregate clicks, not game clicks
        
    }

    /**
     * Collapses all expanded countries, leaving only rows for aggregate values per country.
     *
     */
    collapseList() {
        
        // ******* TODO: PART IV *******

    }


}
