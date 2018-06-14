
d3.json("https://raw.githubusercontent.com/avt00/dvcourse/master/countries_1995_2012.json", function(error, data){
    
    var table = d3.select('body').append('table').attr("id", "mainTable");
    var thead = table.append('thead');
    var tbody = table.append('tbody');
    table.append("caption").html("World Countries Ranking");

    var colNames = ['Country', 'Continent', 'GDP, $B', 'Life expectacy, years', 
        'Population', 'Year'];

    // due to show sorting order
    var realColNames = {'Country' : 'Country', 
        'Continent' : 'Continent',
        'GDP, $B' : 'GDP, $B',
        'Life expectacy, years' : 'Life expectacy, years',
        'Year' : 'Year',
        'Population' : 'Population'
    };

    var canonicalColNames = colNames; 
    
    d3.selectAll("input").on("change",update);
    d3.select('.range').on("change", update);
    d3.selectAll(".clickable").on("click", (e, i) => update(i));


    var sortOrder = 1;
    var lastIndex = -1;

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
    };

    

    function update(index = -1)
    {
        
        data = tmp_data;
        d3.select("tbody").remove();
        d3.select("thead").remove();
        var thead = table.append('thead');
        var tbody = table.append('tbody');

        var year = d3.select('.range').node().value;


        var filteredContinents = [];
        d3.selectAll("input").each(function(d){
          cb = d3.select(this);
          if(cb.property("checked")){
            filteredContinents.push(cb.property("value"));
          }
        }); 

        // delete all undesirable
        data = data.filter(function(d, i) {return filteredContinents.includes(d['Continent']) && d['Year'] == year });
        
        
        // agg if there is that need    
        if (filteredContinents.includes("Agg")){
            aggData = [];
            for (i = 0; i < filteredContinents.length - 1; i++) aggData.push({
                'Country' : filteredContinents[i],
                'Continent' : filteredContinents[i],
                'GDP, $B' : d3.sum(data.filter(function(d, j) { return d["Continent"] == filteredContinents[i]})
                    .map(function (d, j) {return d['GDP, $B']})),
                'Life expectacy, years' : d3.mean(data.filter(function(d, j) { return d["Continent"] == filteredContinents[i]})
                    .map(function (d, j) {return d['Life expectacy, years']})),
                'Population' : d3.sum(data.filter(function(d, j) { return d["Continent"] == filteredContinents[i]})
                    .map(function (d, j) {return d['Population']})),
                'Year' : year
            });
            data = aggData;    
        };

        // sort
        if (index >= 0){
            if (lastIndex == index) sortOrder = -sortOrder
            else sortOrder = 1; 
            data.sort(function(a, b) {
                return (index >= 2 ? 
                    Math.sign(sortOrder * (parseFloat(a[colNames[index]]) - parseFloat(b[colNames[index]]))) :
                    sortOrder * (a[colNames[index]] > b[colNames[index]]) );
            });
            if (lastIndex >= 0)
                realColNames[colNames[lastIndex]] = colNames[lastIndex];
            lastIndex = index;
            realColNames[colNames[index]] += sortOrder > 0 ? '&uarr;' : '&darr;';
        };


        // append the header row
        thead.append('tr')
          .selectAll('th')
          .data(colNames).enter()
          .append('th')
          .html(function (colNames) { return realColNames[colNames]; })
          .attr("class", "clickable");


        d3.selectAll(".clickable").on("click", (e, i) => update(i));



        // create a row for each object in the data
         var rows = tbody.selectAll('tr')
          .data(data)
          .enter()
          .append('tr')
          .attr('gray', function (d, i) {return i % 2 == 0});
        


        // create a cell in each row for each column
        var cells = rows.selectAll('td')
          .data(function (row) {
            return colNames.map(function (column) {
              return {column: column, value: row[column]};
            });
          })
          .enter()
          .append('td')
            .text(function (d, i) {return i >= 2 && i < 5 ? d3.format(",.1f")(d.value) : d.value});
            
    };

  
    update();
   
});

