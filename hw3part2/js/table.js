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
        this.collapseIndex = -1;
        this.lastCollapseIndex = -1;


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
            .domain([1,  20])
            .range([this.cell.buffer, this.cell.width + this.cell.buffer]); 

        /** Used for games/wins/losses*/
        this.gameScale =  d3.scaleLinear()
            .domain([0, 7])
            .range([this.cell.buffer, this.cell.width]); 


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
            .tickValues(d3.range(1, 20, 3))
            .scale(this.goalScale);


        d3.select("#goalHeader")
            .append("svg")
            .attr("height", this.cell.height + this.cell.buffer)
            .attr("width", this.cell.width + this.cell.buffer)
            .append("g")
            .attr("transform", "translate(" + (3) + ", " + (this.cell.height) + ")")
            .attr("width", this.cell.width + this.cell.buffer)
            .attr("height", this.cell.height)
            .call(xAxis);

        
        // adding rows

        d3.select("tbody")
            .selectAll("tr")
            .data(this.tableElements)
            .enter()
            .append("tr")
            .append("th");

        var x = this;

        // Set sorting callback for clicking on headers
        
        d3.select("thead")
            .selectAll("td").on("click", (d, i) => x.updateTable(i + 1));

        d3.select("thead")
            .select("th").on("click", (d, i) => x.updateTable(0));



        // Clicking on headers should also trigger collapseList() and updateTable(). 


        for (var i in this.tableHeaders){

            var header = this.tableHeaders[i];

            d3.selectAll("tbody tr")
                .data(d3.range(1, 39,1))
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

        
        // delete all the inserted
        d3.selectAll("tbody td")
            .selectAll("*").remove();

        
        var headers = this.tableHeaders;

        //console.log("updateTable", this.tableElements.length);

        var data = this.tableElements.slice();

        // sort data if there is such a need
        if (sortIndex != -1 && this.collapseIndex == -1){

        if (this.lastSortIndex == sortIndex){
            if (sortIndex == 0)
                var data = data.sort((x,y) => d3.ascending(x.key, y.key));
            else if (sortIndex == 2)
                var data = data.sort(
                (x,y) => d3.ascending(x.value[headers[sortIndex - 1]].ranking, y.value[headers[sortIndex - 1]].ranking));
            else var data = data.sort(
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
                var data = data.sort((x,y) => d3.descending(x.key, y.key));
            else if (sortIndex == 2)
                var data = data.sort(
                (x,y) => d3.descending(x.value[headers[sortIndex - 1]].ranking, y.value[headers[sortIndex - 1]].ranking));
            else var data = data.sort(
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
        }};


        if (this.collapseIndex > -1)
        {
            var needToInsert = data[this.collapseIndex].value["games"];
            for (var k in needToInsert)
                data.splice(this.collapseIndex + 1, 0, needToInsert[k]);
            //console.log(data);
        }


        // insert team names
        d3.selectAll("tbody th")
            .data(data)
            .html(d => d.key)
            .classed("game", d => d.value["Losses"].length == 0)
            .classed("aggregate", d => (d.value["Losses"].length != 0));



        // Goals Conceded range -- 2-14
        // Goals Made range -- 1-18
        // Math.abs(Delta Goals) range -- 0 -- 14 

        d3.selectAll("[class = 'Delta Goals']")
            .data(data.map(d => [d.value["Delta Goals"], d.value["Goals Made"],
             d.value["Goals Conceded"], d.value["Losses"]]))
            .append("svg")
            .attr("height", this.cell.height)
            .attr("width", this.cell.width + this.cell.buffer)
            .attr("fill", d => d[3].length == 0? "#f0f0f0" : "white")
            .append("rect")
            .attr("x", d => d[1] < Math.abs(d[2]) ? this.goalScale(d[1]) : this.goalScale(Math.abs(d[2])))
            .attr("y", 13)
            .attr("width", d => this.goalScale(Math.abs(d[0])) - this.cell.buffer)
            .attr("height", 5)
            .attr("fill", d =>  d[0] > 0 ? '#034e7b' : "#cb181d" )
            .classed("goalBar", true)
            .enter();

        d3.selectAll("[class='Delta Goals']")
            .data(data.map(d => [d.value["Delta Goals"], d.value["Goals Made"], d.value["Goals Conceded"]]))
            .selectAll("svg")
            .append("circle")
            .attr("cx", d => this.goalScale(d[1]))
            .attr("cy", this.cell.buffer)
            .attr("fill", "#034e7b")
            .classed("goalCircle", true)
            .enter();


        d3.selectAll("[class='Delta Goals']")
            .data(data.map(d => [d.value["Delta Goals"], d.value["Goals Made"], d.value["Goals Conceded"]]))
            .selectAll("svg")
            .append("circle")
            .attr("cx", d => this.goalScale(d[2]))
            .attr("cy", this.cell.buffer)
            .attr("fill", "#cb181d")
            .classed("goalCircle", true)
            .enter();


          // insert text representations of results
        d3.selectAll("[class=Result]")
            .data(data.map(d => d))
            .html(d => d.value["Losses"].length == 0 ? "" : d.value["Result"].label);


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
            .attr("width", d => this.gameScale(d))
            .attr("fill", d => this.goalColorScale(d))
            .enter();

        d3.selectAll("[class=Losses]")
            .selectAll("g")
            .append("text")
            .attr("height", this.cell.height)
            .attr("width", d => this.gameScale(d))
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
            .attr("width", d => this.gameScale(d))
            .attr("fill", d => this.goalColorScale(d))
            .enter();

        d3.selectAll("[class=Wins]")
            .selectAll("g")
            .append("text")
            .attr("height", this.cell.height)
            .attr("width", d => this.gameScale(d))
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
            .attr("width", d => this.gameScale(d))
            .attr("fill", d => this.goalColorScale(d))
            .enter();

        d3.selectAll("[class=TotalGames]")
            .selectAll("g")
            .append("text")
            .attr("height", this.cell.height)
            .attr("width", d => this.gameScale(d))
            .attr("x", 0)
            .attr("y", this.cell.buffer)
            .attr("fill", "white")
            .text(d => d);

        var x = this;

        d3.select("tbody")
            .selectAll("[class=aggregate]").on("click", function(d, i){
                 x.collapseList(i);  x.updateTable();});

         d3.select("tbody")
            .selectAll("[class=game]").on("click", function(d, i){
                 });

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
        if (index == this.collapseIndex){
            this.collapseIndex = -1;
            return;
        };
        this.collapseIndex = index;
        // ******* TODO: PART IV *******

    }


}
