var test = d3.csv("../data/Combined.csv",function(data){

    function drawGenderBasedDonut(suicidesBySex){
        
        height = 300
        width = 300
        svgWidth = 500
        svgHeight = 350
        radius = Math.min(height,width)/2

        totalSuicides = 0
        for(i=0;i<suicidesBySex.length;i++){
            totalSuicides +=suicidesBySex[i].value
        }
        
        var suicidesBySexScale = d3.scaleLinear()
            .domain([0,totalSuicides])
            .range([0,100])

        var pie = d3.pie()
            .padAngle(0.005)
            .sort(null)
            .value(function(d) { return d.value; });
        
        d3.selectAll("#gender-svg").remove()

        var svg = d3.selectAll("#gender-div").append("svg").attr("id","gender-svg")
            .attr("class","text-center")
            .attr("width",svgWidth)
            .attr("height",svgHeight)
            .style("background-color", 'black')

        g = svg.append("g").attr("transform", "translate(" + svgWidth / 2 + "," + height / 2 + ")");

        var path = d3.arc()
            .outerRadius(radius - 10)
            .innerRadius(radius*0.67);
    
         var arc = g.selectAll(".arc")
            .data(pie(suicidesBySex))
            .enter().append("g")
            .attr("class", "arc");
    
        arc.append("path")
            .attr("d", path)
            .attr("id", function(d,i) { return "sexArc_"+i; })
            .attr("fill", function(d) { return genderColor(d.data.key); })
            .append("title")
            .text(d => `${formatName(d.data.key)} suicides : ${(Math.round(d.value*100)/100)}`);
    
        var text = arc.append("text")
            .attr("x", 30) 
            .attr("dy", 25)
            .attr("fill",function(d){return getStokeColor(d.data.key)})
            .style("font-size", "20")
            .style("font-weight", "bold")
            .append("textPath")
            .attr("xlink:href",function(d,i){return "#sexArc_"+i;})
            .text(function(d){
                return formatName(d.data.key) + " - "+
                Math.round(suicidesBySexScale(d.value)*100)/100 + "%";
            });
    }
    drawGenderBasedDonut(getGenderBasedData(data))
    appliedFilter={
        "age":[],
        "gdp_block($1e9)":[]
    }
    isAvg = true

    function applyGDPFilter(){
        d3.selectAll("#gdp_"+0)
            .on('click',function(){
                setGDPSelection("gdp_0")
                appliedFilter["gdp_block($1e9)"] = []
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#gdp_"+1)
            .on('click',function(){
                setGDPSelection("gdp_1")
                appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+1).value)
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#gdp_"+2)
            .on('click',function(){
                setGDPSelection("gdp_2")
                appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+2).value)
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#gdp_"+3)
            .on('click',function(){
                setGDPSelection("gdp_3")
                appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+3).value)
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#gdp_"+4)
            .on('click',function(){
                setGDPSelection("gdp_4")
                appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+4).value)
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })

    }

    function applyAgeFilter(){
        d3.selectAll("#age_"+1)
            .on('click',function(){
                setAgeSelection("age_1")
                appliedFilter["age"].push(document.getElementById("age_"+1).value)
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })
        d3.selectAll("#age_"+2)
            .on('click',function(){
                setAgeSelection("age_2")
                appliedFilter["age"].push(document.getElementById("age_"+2).value)
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })
        d3.selectAll("#age_"+3)
            .on('click',function(){
                setAgeSelection("age_3")
                appliedFilter["age"].push(document.getElementById("age_"+3).value)
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#age_"+4)
            .on('click',function(){
                setAgeSelection("age_4")
                appliedFilter["age"].push(document.getElementById("age_"+4).value)
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#age_"+5)
            .on('click',function(){
                setAgeSelection("age_5")
                appliedFilter["age"].push(document.getElementById("age_"+5).value)
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })
        d3.selectAll("#age_"+6)
            .on('click',function(){
                setAgeSelection("age_6")
                appliedFilter["age"].push(document.getElementById("age_"+6).value)
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })
        d3.selectAll("#age_"+0)
            .on('click',function(){
                setAgeSelection("age_0")
                appliedFilter["age"] = []
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })
            
        }
    function applyAggregateTypeFilters(){
            d3.selectAll('#agg_1')
            .on('click',function(){
                isAvg = true
                setAggregateSelection("agg_1")
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })
            
            d3.selectAll('#agg_2')
            .on('click',function(){
                isAvg = false
                setAggregateSelection("agg_2")
                drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
            })
        }
    function applyDataTypeFilters(){
        d3.selectAll('#dataType_1')
        .on('click',function(){
            setDataTypeSelection("dataType_1")
            appliedFilter[dataTypeFilterName] = document.getElementById("dataType_1").value
            drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
        })
        
        d3.selectAll('#dataType_2')
        .on('click',function(){
            setDataTypeSelection("dataType_2")
            appliedFilter[dataTypeFilterName] = document.getElementById("dataType_2").value
            drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
        })
    }
    applyGDPFilter()
    applyAggregateTypeFilters()
    applyAgeFilter()
    applyDataTypeFilters()
    drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
});
    


