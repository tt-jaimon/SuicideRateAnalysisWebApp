var test = d3.csv("../data/main.csv",function(data){
    

    function drawAgeWiseStackedAreaGraph(suicidesByAge){

        svgWidth = 500
        svgHeight = 500
        //Age Wise SVG Dimensions
        var margin = {top: 10, right: 20, bottom: 30, left: 50};
        width = svgWidth - margin.right - margin.left;
        height = svgHeight - margin.top -margin.bottom;
        
        d3.selectAll("#age-svg").remove()

        //SVG where The Age wise Stacked bar chart chart is going to be drawn
        var svg = d3.selectAll("#age-div").append("svg").attr("id","age-svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style("background-color", 'black')
            .attr("transform", `translate(${margin.left + 1},${margin.top})`)
            .append("g");

        ageGroups = []
        //Color range for showing different age groups
        ageColorsList = ["#2E3EEB","#2CFF00","#d82d13","#efe407","grey","cyan"]
        ageColor = {}
        count = 0
        //Loop used for extracting all the Age groups and storing it in variable ageGroups
        for(key in suicidesByAge[0]){
            if(key != "year"){
                ageGroups.push(key)
                ageColor[key] = ageColorsList[count]
                count = count+1
            }
        }
        var stack = d3.stack().keys(ageGroups);
        var stackedValues = stack(suicidesByAge);
        maxVal = 0

        var stackedData = [];
        stackedValues.forEach((layer, index) => {
            var currentStack = [];
            layer.forEach((d, i) => {
                tempMax = d3.max(d)
                if(tempMax > maxVal){
                    maxVal = tempMax
                }
                currentStack.push({
                    values: d,
                    year: d.data.year
                });
            });
            stackedData.push(currentStack);
        });

        //Scale for year (x axis Value)
        var x = d3.scaleLinear()
            .domain([1985,2016])
            .range([margin.left, width]);

        xAxis = g => g
            .attr("transform", `translate(0,${svgHeight - margin.bottom})`)
            .attr("stroke","white")
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

        //Scale for y axis Value
        var y = d3.scaleLinear()
            .domain([0,maxVal])
            .range([height,0]);

        yAxis = g => g
            .attr("transform", `translate(${svgWidth-50 - margin.right},0)`)
            .attr("stroke","white")
            .call(d3.axisRight(y))
            .call(d3.axisRight(y).ticks(null, "s"))
        
        var series = svg
            .selectAll(".series")
            .data(stackedData)
            .enter()
            .append("g")
            .attr("class", "series");

        var area = d3.area()
            .x(dataPoint => x(dataPoint.year))
            .y0(dataPoint => y(dataPoint.values[0]))
            .y1(dataPoint => y(dataPoint.values[1]));

        series.append("path")
            .attr("d", dataValue => area(dataValue))
            .attr("fill", function(d,i) { 
                return ageColor[ageGroups[i]]; })

        svg.append("g")
            .call(xAxis);
        
        svg.append("g")
            .call(yAxis);

        updateLegend(ageColor,"age-legend","Age Groups")
    }

    appliedFilter={
        "age":[],
        "gdp_block($1e9)":[]
    }
    isAvg = true

    //Applying Gender wise Filter
    function applyGenderFilter(){
        d3.selectAll("#sex_"+1)
            .on('click',function(){
                setGenderSelection("sex_1") //Function used to setting gender based filter buttons
                appliedFilter["sex"] = [document.getElementById("sex_"+1).value] //appending Filter
                // drawing new Plot(Age Wise Stacked graph
                drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter)) 
            })
        d3.selectAll("#sex_"+2)
            .on('click',function(){
                setGenderSelection("sex_2")
                appliedFilter["sex"] = [document.getElementById("sex_"+2).value]
                drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter))
            })
        d3.selectAll("#sex_"+0)
            .on('click',function(){
                setGenderSelection("sex_0")
                appliedFilter["sex"] = []
                drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter))
            })
            
        }

        //Applying GDP based filter
        function applyGDPFilter(){
            d3.selectAll("#gdp_"+0)
                .on('click',function(){
                    setGDPSelection("gdp_0") //Function used to setting GDP based filter buttons
                    appliedFilter["gdp_block($1e9)"] = [] //reseting the GDP based filter
                    drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter))
                })
                d3.selectAll("#gdp_"+1)
                .on('click',function(){
                    setGDPSelection("gdp_1")
                    appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+1).value)
                    drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter))
                })
                d3.selectAll("#gdp_"+2)
                .on('click',function(){
                    setGDPSelection("gdp_2")
                    appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+2).value)
                    drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter))
                })
                d3.selectAll("#gdp_"+3)
                .on('click',function(){
                    setGDPSelection("gdp_3")
                    appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+3).value)
                    drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter))
                })
                d3.selectAll("#gdp_"+4)
                .on('click',function(){
                    setGDPSelection("gdp_4")
                    appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+4).value)
                    drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter))
                })
    
        }
    

    function applyDataTypeFilters(){
        d3.selectAll('#dataType_1')
        .on('click',function(){
            setDataTypeSelection("dataType_1") //Function used to setting DataType based filter buttons
            appliedFilter[dataTypeFilterName] = document.getElementById("dataType_1").value  //Setting the GDP based filter
            drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter))
        })
        
        d3.selectAll('#dataType_2')
        .on('click',function(){
            setDataTypeSelection("dataType_2")
            appliedFilter[dataTypeFilterName] = document.getElementById("dataType_2").value
            drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter))
        })
    }
    function applyAggregateTypeFilters(){
        d3.selectAll('#agg_1')
        .on('click',function(){
            isAvg = true
            setAggregateSelection("agg_1")
            drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter))
        })
        
        d3.selectAll('#agg_2')
        .on('click',function(){
            isAvg = false
            setAggregateSelection("agg_2")
            drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter))
        })
    }
    applyGDPFilter()
    applyGenderFilter()
    applyDataTypeFilters()
    applyAggregateTypeFilters()
    drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter))
});
    


