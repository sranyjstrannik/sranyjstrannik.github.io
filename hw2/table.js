
d3.json("https://raw.githubusercontent.com/avt00/dvcourse/master/countries_1995_2012.json", function(error, data){
    
    var table = d3.select('body').append('table').attr("id", "mainTable");
    var thead = table.append('thead');
    var tbody = table.append('tbody');
    table.append("caption").html("World Countries Ranking");

    var colNames = ['Country', 'Continent', 'GDP, $B', 'Life expectacy, years', 
        'Population', 'Year'];


    var tmp_data = [];
    
    for (i=0; i< data.length; i++) {
        for (j=0; j<data[i]['years'].length; j++) {
            obj = {
                'Country': data[i]['name'],
                'Continent': data[i]['continent'],
                'GDP, $B': data[i]['years'][j]['gdp'] / 100000000,
                'Life expectacy, years': data[i]['years'][j]['life_expectancy'],
                'Population': data[i]['years'][j]['population'],
                'Year': data[i]['years'][j]['year']
            }
            tmp_data.push(obj);
        }
    }
    
    data = tmp_data;

    // append the header row
    thead.append('tr')
          .selectAll('th')
          .data(colNames).enter()
          .append('th')
          .text(function (colNames) { return colNames; })
          .attr("class", "clickable");



    // create a row for each object in the data
    var rows = tbody.selectAll('tr')
          .data(data)
          .enter()
          .append('tr');
  

        // create a cell in each row for each column
        var cells = rows.selectAll('td')
          .data(function (row) {
            return colNames.map(function (column) {
              return {column: column, value: row[column]};
            });
          })
          .enter()
          .append('td')
            .text(function (d) { return d.value; });
  

    d3.selectAll("input").on("change",update);
    d3.select('.range').on("change", update);
    d3.selectAll(".clickable").on("click", (e, i) => sorting(i));



    function sorting(index){
        console.log("need some sort");
    };
    

    function update()
    {

        var year = d3.select('.range').node().value;

        var filteredContinents = [];
        d3.selectAll("input").each(function(d){
          cb = d3.select(this);
          if(cb.property("checked")){
            filteredContinents.push(cb.property("value"));
          }
        }); 

        //hide undesirable
        var count = 0;

        tbody.selectAll('tr').each(function (d, i){
            if (!filteredContinents.includes(d3.select(this).select('td:nth-child(2)').html()) || 
                d3.select(this).select("td:nth-child(6)").html() != year) d3.select(this).style("display", "none").attr("show", "false")
            else {
             count += 1;
             if (count % 2) d3.select(this).style("display", "table-row").attr("show","gray")
             else d3.select(this).style("display", "table-row").attr("show","true");
         }

        });
    };


  
    update();
   
});

