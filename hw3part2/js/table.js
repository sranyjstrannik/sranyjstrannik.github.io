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
        this.tableElements = teamData.slice(); // 

        ///** Store all match data for the 2014 Fifa cup */
        this.teamData = teamData;

        //Default values for the Table Headers
        this.tableHeaders = ["Delta Goals", "Result", "Wins", "Losses", "TotalGames"];

        this.lastSortIndex = -1;


        /** To be used when sizing the svgs in the table cells.*/
        this.cell = {
            "width": 70,
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
        this.goalScale = d3.scaleLinear()
            .domain([d3.min(this.tableElements.map(d => d.value[this.goalsMadeHeader])),
                d3.max(this.tableElements.map(d => d.value[this.goalsMadeHeader]))])
            .range([this.cell.buffer, this.cell.width]); 

        /** Used for games/wins/losses*/
        this.gameScale =  d3.scaleLinear()
            .domain([d3.min(this.tableElements.map(d => d.value["TotalGames"])),
                d3.max(this.tableElements.map(d => d.value["TotalGames"]))])
            .range([this.cell.buffer, this.cell.width + this.cell.buffer]); 


        /**Color scales*/
        /**For aggregate columns  Use colors '#ece2f0','#016450' for the range.*/
        this.goalColorScale = d3.scaleLinear() 
            .domain([0,
                d3.max(this.tableElements.map(d => d.value["TotalGames"]))])
            //.range(['#cb181d','#034e7b']); 
            .range(['#ece2f0' , '#016450']);

        /**For goal Column. Use colors '#cb181d', '#0\34e7b'  for the range.*/
        this.aggregateColorScale = d3.scaleLinear()
            .domain([4,-6])
            .range(['#cb181d','#034e7b']); 
    }


    /**
     * Creates a table skeleton including headers that when clicked allow you to sort the table by the chosen attribute.
     * Also calculates aggregate values of goals, wins, losses and total games as a function of country.
     *
     */
    createTable() {

        // ******* TODO: PART II *******

        //Update Scale Domains

        // Create the x axes for the goalScale.

        var xAxis = d3.axisTop()
            .tickValues(d3.range(0, 19, 3))
            .scale(this.goalScale);


        d3.select("#goalHeader")
            .append("svg")
            .attr("height", this.cell.height + this.cell.buffer)
            .attr("width", this.cell.width + this.cell.buffer)
            .append("g")
            .attr("transform", "translate(" + 0 + ", " + (this.cell.height) + ")")
            .attr("width", this.cell.width  + this.cell.buffer)
            .attr("height", this.cell.height)
            .call(xAxis);

        
        // adding rows

        d3.select("tbody")
            .selectAll("tr")
            .data(this.tableElements)
            .enter()
            .append("tr")
            //.style("line-height", "50px")
            .append("th");

        var x = this;

        // Set sorting callback for clicking on headers
        
        d3.select("thead")
            .selectAll("td").on("click", (d, i) => x.updateTable(i + 1));

        d3.select("thead")
            .select("th").on("click", (d, i) => x.updateTable(0));

        d3.select("tbody")
            .selectAll("th").on("click", function(d, i){
                 x.updateTable(); x.collapseList(i);});
            //.on("mouseover", function(d, i) x.tree.updateTree(i));


        // Clicking on headers should also trigger collapseList() and updateTable(). 


        for (var i in this.tableHeaders){

            var header = this.tableHeaders[i];

            d3.selectAll("tbody tr")
                .data(this.tableElements.map(function (d, i){
                    return d.value[header];
                }))
                .append("td")
                .enter();

            d3.select("tbody")
                .selectAll("tr")
                .selectAll("td:nth-child(" + (2 + +i) + ")").classed(header, true);
       }
    }



    /**
     * Updates the table contents with a row for each element in the global variable tableElements.
     */
    updateTable(sortIndex = -1) {

        
        d3.selectAll("tbody td")
            .selectAll("*").remove();

        
        var headers = this.tableHeaders;

        if (sortIndex != -1){

        if (this.lastSortIndex == sortIndex){
            if (sortIndex == 0)
                var data = this.tableElements.sort((x,y) => d3.ascending(x.key, y.key));
            else if (sortIndex == 2)
                var data = this.tableElements.sort(
                (x,y) => d3.ascending(x.value[headers[sortIndex - 1]].ranking, y.value[headers[sortIndex - 1]].ranking));
            else var data = this.tableElements.sort(
                (x,y) => d3.ascending(x.value[headers[sortIndex - 1]], y.value[headers[sortIndex - 1]]));
            

            if (sortIndex == 0) {
                var colName = d3.select("thead").select("th").html();    
                d3.select("thead")
                    .select("th").html("&darr;" + colName.slice(1));   
            } else {
            var colName = d3.select("thead").select("td:nth-child(" + (sortIndex+1) + ")").html();    
            d3.select("thead")
             .select("td:nth-child(" + (sortIndex+1) + ")").html("&darr;" + colName.slice(1));
         }
        } else {
            if (sortIndex == 0)
                var data = this.tableElements.sort((x,y) => d3.descending(x.key, y.key));
            else if (sortIndex == 2)
                var data = this.tableElements.sort(
                (x,y) => d3.descending(x.value[headers[sortIndex - 1]].ranking, y.value[headers[sortIndex - 1]].ranking));
            else var data = this.tableElements.sort(
                (x,y) => d3.descending(x.value[headers[sortIndex - 1]], y.value[headers[sortIndex - 1]]));
            if (sortIndex == 0){
                var colName = d3.select("thead").select("th").html();    
                d3.select("thead")
                .select("th").html("&uarr;" + colName);
            } else {
            var colName = d3.select("thead").select("td:nth-child(" + (sortIndex+1) + ")").html();    
            d3.select("thead")
             .select("td:nth-child(" + (sortIndex+1) + ")").html("&uarr;" + colName);

            };

            if (this.lastSortIndex != -1){

                if (this.lastSortIndex == 0){
                    var colName = d3.select("thead").select("th").html();
                    d3.select("thead").select("th").html(colName.slice(1));
                }
                else {var colName = d3.select("thead").select("td:nth-child(" + (this.lastSortIndex+1) + ")").html();     
                d3.select("thead").select("td:nth-child(" + (this.lastSortIndex+1) + ")").html(colName.slice(1));
                }
            };

            this.lastSortIndex = sortIndex;
        }} else var data = this.tableElements;

        d3.selectAll("tbody th")
            .data(data.map(d => d.key))
            .html(d => d);

        d3.selectAll("[class=Result]")
            .data(data.map(d => d.value["Result"].label))
            .html(d => d);


        var x = d3.select("tbody")
            .selectAll("[class='Delta Goals']")
            .data(data.map(d => [d.value["Delta Goals"], d.value["Goals Made"], d.value["Goals Conceded"]]))
            .append("svg")
            .attr("height", this.cell.height)
            .attr("width", this.cell.width)
            .append("g")
            .attr("height", this.cell.height)
            .attr("width", this.cell.width)
            .append("rect")
            .attr("height", 5)
            .attr("width", d => this.goalScale(Math.abs(d[0])))
            .attr("fill", d => this.aggregateColorScale(d[0]))
            .attr("x", d => this.goalScale(Math.min(Math.abs(d[1]), Math.abs(d[2]))))
            .attr("y", 10)
            .enter();

        x.append("cirle")
            .attr("x", d => this.goalScale(d[1]))
            .attr("y", this.cell.buffer)
            .attr("size", this.cell.buffer)
            .attr("fill", d => this.aggregateColorScale(d[1]));

        x.append("cirle")
            .attr("x", d => this.goalScale(d[2]))
            .attr("y", this.cell.buffer)
            .attr("size", this.cell.buffer)
            .attr("fill", d => this.aggregateColorScale(d[2]));


        d3.select("tbody")
            .selectAll("[class=Losses]")
            .data(data.map(d => d.value["Losses"]))
            .append("svg")
            .attr("height", this.cell.height)
            .attr("width", this.cell.width)
            .append("g")
            .attr("height", this.cell.height)
            .attr("width", this.cell.width)
            .append("rect")
            .attr("height", this.cell.height)
            .attr("width", d => this.goalScale(d))
            .attr("fill", d => this.goalColorScale(d))
            .enter();

        d3.selectAll("[class=Losses]")
            .selectAll("g")
            .append("text")
            .attr("height", this.cell.height)
            .attr("width", d => this.goalScale(d))
            .attr("x", 0)
            .attr("y", this.cell.buffer)
            .attr("fill", "white")
            .text(d => d);

        d3.select("tbody")
            .selectAll("[class=Wins]")
            .data(data.map(d => d.value["Wins"]))
            .append("svg")
            .attr("height", this.cell.height)
            .attr("width", this.cell.width)
            .append("g")
            .attr("height", this.cell.height)
            .attr("width", this.cell.width)
            .append("rect")
            .attr("height", this.cell.height)
            .attr("width", d => this.goalScale(d))
            .attr("fill", d => this.goalColorScale(d))
            .enter();

        d3.selectAll("[class=Wins]")
            .selectAll("g")
            .append("text")
            .attr("height", this.cell.height)
            .attr("width", d => this.goalScale(d))
            .attr("x", 0)
            .attr("y", this.cell.buffer)
            .attr("fill", "white")
            .text(d => d);

        d3.select("tbody")
            .selectAll("[class=TotalGames]")
            .data(data.map(d => d.value["TotalGames"]))
            .append("svg")
            .attr("height", this.cell.height)
            .attr("width", this.cell.width)
            .append("g")
            .attr("height", this.cell.height)
            .attr("width", this.cell.width)
            .append("rect")
            .attr("height", this.cell.height)
            .attr("width", d => this.goalScale(d))
            .attr("fill", d => this.goalColorScale(d))
            .enter();

        d3.selectAll("[class=TotalGames]")
            .selectAll("g")
            .append("text")
            .attr("height", this.cell.height)
            .attr("width", d => this.goalScale(d))
            .attr("x", 0)
            .attr("y", this.cell.buffer)
            .attr("fill", "white")
            .text(d => d);
    }

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
    collapseList(index = -1) {
        console.log("collapseList", index);
        
        // ******* TODO: PART IV *******

    }


}
