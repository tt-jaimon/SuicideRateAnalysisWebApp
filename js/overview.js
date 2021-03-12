var test = d3.csv("../data/main.csv",function(mainData){
    var div = d3.select("body").append("div").attr("class","tooltip").style("opacity",0);

    function drawSocioEconomicFatcors(suicidesData){
        const width = 500,
        height = 500,
        chartRadius = height / 2 - 40;

        const socioColor = d3.scaleOrdinal(d3.schemeCategory10);

        d3.selectAll('#socio-svg').remove()
        let svg = d3.selectAll('#socio-div').append("svg").attr("id","socio-svg")
            .attr('width', width)
            .attr('height', height)

        svg = svg.append('g')
            .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

        let tooltip = d3.select('body').append('div')
            .attr('class', 'tooltip').style("opacity",0);

        const PI = Math.PI,
        arcMinRadius = 10,
        arcPadding = 10,
        labelPadding = -5,
        numTicks = 10;

        max = -1
        for(i in suicidesData){
            if(max == -1 || suicidesData[i].value > max){
                max = suicidesData[i].value
            }
        }

        let scale = d3.scaleLinear()
            .domain([0, max * 1.1])
            .range([0, 2 * PI]);

        let ticks = scale.ticks(numTicks).slice(0, -1);
        const numArcs = suicidesData.length;
        const arcWidth = (chartRadius - arcMinRadius - numArcs * arcPadding) / numArcs;

        let arc = d3.arc()
            .innerRadius((d, i) => getInnerRadius(i))
            .outerRadius((d, i) => getOuterRadius(i))
            .startAngle(0)
            .endAngle((d, i) => scale(d))

        let radialAxis = svg.append('g')
            .attr('class', 'r axis')
            .selectAll('g')
            .data(suicidesData)
            .enter().append('g');

        radialAxis.append('circle')
            .attr("stroke","white")
            .attr('r', (d, i) => getOuterRadius(i) + arcPadding);

        let axialAxis = svg.append('g')
            .attr('class', 'a axis')
            .selectAll('g')
            .data(ticks)
            .enter().append('g')
            .attr('transform', d => 'rotate(' + (rad2deg(scale(d)) - 90) + ')');

        axialAxis.append('line')
            .attr('x2', chartRadius)
            .attr("stroke","white");

        axialAxis.append('text')
            .attr('x', chartRadius + 10)
            .style('text-anchor', d => (scale(d) >= PI && scale(d) < 2 * PI ? 'end' : null))
            .attr('transform', d => 'rotate(' + (90 - rad2deg(scale(d))) + ',' + (chartRadius + 10) + ',0)')
            .attr("stroke","white")
            .text(d => d);

        let arcs = svg.append('g')
            .attr('class', 'data')
            .selectAll('path')
            .data(suicidesData)
            .enter().append('path')
            .attr('class', 'arc')
            .style('fill', (d, i) => socioColor(i))

        arcs.transition()
            .delay((d, i) => i * 200)
            .duration(1000)
            .attrTween('d', arcTween);

        arcs.on('mouseover', showTooltip)
        arcs.on('mouseout', hideTooltip)

        function arcTween(d, i) {
            let interpolate = d3.interpolate(0, d.value);
            return t => arc(interpolate(t), i);
        }

        function showTooltip(d) {
            tooltip.transition().duration(200).style("opacity",.9);
                    cx = d3.select(this).attr("cx");
                    cy = d3.select(this).attr("cy");
                    tooltip.html(Math.round(d.value))
                    .style("left",d3.event.pageX+25+"px")
                    .style("top",d3.event.pageY-28+"px")
                    .style("box-shadow", "0px 0px 8px 4px" + this.getAttribute("stroke"));
        }

        function hideTooltip() {
            tooltip.transition().duration(200).style("opacity",0);
        }

        function rad2deg(angle) {
            return angle * 180 / PI;
        }

        function getInnerRadius(index) {
            return arcMinRadius + (numArcs - (index + 1)) * (arcWidth + arcPadding);
        }

        function getOuterRadius(index) {
            return getInnerRadius(index) + arcWidth;
        }
        socioColorDict = {}
        for(i in suicidesData){
            socioColorDict[suicidesData[i].key] = socioColor(i)
        }
        factorName = ""
        updateLegend(socioColorDict,"socio-legend",getFactorName(socioFactor)+" Value Range")
    }

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

        d3.selectAll('#gender-svg').remove()
        var svg = d3.selectAll('#gender-div').append("svg").attr("id","gender-svg")
            .attr("class","text-center")
            .attr("width",svgWidth)
            .attr("height",svgHeight)
            .style("background-color", 'black')
        
        svg.append("rect")
            .attr("x", 0) 
            .attr("y", 0)
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style("fill", "black"); 

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

    function drawAgeWiseStackedAreaGraph(suicidesByAge){

        svgWidth = 500
        svgHeight = 500

        var margin = {top: 10, right: 20, bottom: 30, left: 50};
        width = svgWidth - margin.right - margin.left;
        height = svgHeight - margin.top -margin.bottom;
        
        d3.selectAll('#age-svg').remove()
        var svg = d3.selectAll('#age-div').append("svg").attr("id","age-svg")
            .attr("width", svgWidth)
            .attr("height", svgHeight)
            .style("background-color", 'black')
            .attr("transform", `translate(${margin.left + 1},${margin.top})`)
            .append("g");

        ageGroups = []
        ageColorsList = ["#2E3EEB","#2CFF00","#d82d13","#ea23a1","grey","cyan"]
        ageColor = {}
        count = 0
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

        var x = d3.scaleLinear()
            .domain([1985,2016])
            .range([margin.left, width]);

            xAxis = g => g
            .attr("transform", `translate(0,${svgHeight - margin.bottom})`)
            .attr("stroke","white")
            .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))

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
        console.log(stackedData)

        var area = d3.area()
        .x(dataPoint => x(dataPoint.year))
        .y0(dataPoint => y(dataPoint.values[0]))
        .y1(dataPoint => y(dataPoint.values[1]));

        series
        .append("path")
        .attr("d", dataValue => area(dataValue))
        .attr("fill", function(d,i) { 
            return ageColor[ageGroups[i]]; })

            svg.append("g")
            .call(xAxis);
        
        svg.append("g")
            .call(yAxis);

        updateLegend(ageColor,"age-legend","Age Groups")
    }



    function drawCountryWiseSuicideRates(countryWiseSuicideData){
        var format = d3.format(",");

        
        var margin = {top: 0, right: 0, bottom: 0, left: 0},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;
        
        var path = d3.geoPath();
        
        d3.selectAll('#country-wise-svg').remove()
        var svg = d3.selectAll('#country-wise-div').append("svg").attr("id","country-wise-svg")
                    .attr("width", width)
                    .attr("height", height)
                    .append('g')
                    .attr('class', 'map');
        
        var projection = d3.geoMercator()
                           .scale(130)
                          .translate( [width / 2, height / 1.5]);
        
        var path = d3.geoPath().projection(projection);
        
        
        queue()
            .defer(d3.json, "../data/world_countries.json")
            .await(ready);
        
        countryColorDict = {}    
        
        function ready(error, data) {
          var populationById = {};
          min = -1
          max = 0
          countryWiseSuicideData.forEach(function(d) { 
              populationById[d.key] = +d.value; 
              if(d.value < min || min == -1){
                  min = d.value
              }
              if(d.value > max){
                  max = d.value
              }
            });
            diff = (max - min)/10
            countryColorVals = []
            for(var i=0;i<10;i++){
                countryColorVals.push(min + (diff*i))
            }

            countryColors = ["cyan", "rgb(10, 200, 48)", "rgb(10, 150, 48)", "rgb(10, 100, 48)", "rgb(237, 237, 237)", "rgb(206, 206, 206)","rgb(100, 12, 36)","rgb(150, 12, 36)","rgb(200, 12, 36)","rgb(250, 12, 36)"]

            var countryColorScale = d3.scaleThreshold()
            .domain(countryColorVals)
            .range(countryColors);

            for(each in countryColorVals){
                countryColorDict[countryColorVals[each]] = countryColors[each]
            }
        
          data.features.forEach(function(d) { d.population = populationById[d.properties["name"]] });
          svg.append("g")
              .attr("class", "countries")
            .selectAll("path")
              .data(data.features)
            .enter().append("path")
              .attr("d", path)
              .style("fill", function(d) { return countryColorScale(populationById[d.properties["name"]]); })
              .style('stroke', 'white')
              .style('stroke-width', 1.5)
              .style("opacity",0.8)
                .style("stroke","white")
                .style('stroke-width', 0.3)
                .on('click',function(d){
                    temp = appliedFilter["Country"]
                    temp.push(d.properties.name)
                    appliedFilter["Country"] = [...new Set(temp)]
                    countryDisp = "Selected Countries: "
                    for(var i in appliedFilter["Country"]){
                        if(i == 0){
                            countryDisp += appliedFilter["Country"][i]
                        }
                        else{
                            countryDisp += ", "+appliedFilter["Country"][i]
                        }
                    }
                    setShowAllcountrySelection(false,countryDisp)
                    drawOverView(mainData,isAvg,appliedFilter)
                })
                .on('mouseover',function(d){

                    div.transition().duration(200).style("opacity",.9);
                    suicide = 0
                    if(d.population != null){
                        suicide = d.population
                    }
                    cx = d3.select(this).attr("cx");
                    cy = d3.select(this).attr("cy");
                    div.html("Country: "+d.properties.name+"<br>Suicide No: "+Math.round(suicide))
                    .style("left",d3.event.pageX+25+"px")
                    .style("top",d3.event.pageY-28+"px")
                    .style("box-shadow", "0px 0px 8px 4px" + this.getAttribute("stroke"));

        
                  d3.select(this)
                    .style("opacity", 1)
                    .style("stroke","white")
                    .style("stroke-width",3);
                })
                .on('mouseout', function(d){
                    div.transition().duration(200).style("opacity",0);

                  d3.select(this)
                    .style("opacity", 0.8)
                    .style("stroke","white")
                    .style("stroke-width",0.3);
                });
        
        updateCountryWiseLegend(countryColorDict,false)

        }

    }

    function updateCountryWiseLegend(countryColor,isVert = true){
        legendWidth = 850
        legendHeight = 50
        d3.selectAll('#country-legend-svg').remove()
        var svg = d3.selectAll('#country-legend-div').append("svg").attr("id","country-legend-svg")
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("background-color", 'black')
        
        svg.append("rect")
            .attr("x", 0) 
            .attr("y", 0)
            .attr("width", legendWidth)
            .attr("height", legendHeight)
            .style("fill", "black");
        
            y = 0
            x = 0
            for(each in  countryColor){
                svg.append("rect")
                    .attr("width", 19)
                    .attr("height", 19)
                    .attr("x",  function(d){
                        return x
                    })
                    .attr("y", function(d){
                        return 0
                    })
                    .attr("fill", countryColor[each]);
                
                svg.append("text")
                    .attr("x", function(d){
                        temp = x+24
                        x=x+85
                        return temp
                    })
                    .attr("y", function(d){
                        return y + 10
                    })
                    .attr("dy", "0.35em")
                    .text(d => Math.round(each))
                    .attr("stroke","white")
                }
    }
    
    appliedFilter={
        "age":[],
        "gdp_block($1e9)":[],
        "Year":[],
        "Country":[]
    }
    isAvg = true
    socioFactor = 0
    drawOverView(mainData,isAvg,appliedFilter)
    
    function drawOverView(data,isAvg,appliedFilter){
        drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
        drawAgeWiseStackedAreaGraph(getStructuredAgeData(data,isAvg,appliedFilter))
        drawGenderBasedDonut(getGenderBasedData(data,isAvg,appliedFilter))
        drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter))
    }

    function applyYearFilter(){
        d3.selectAll("#year_"+0)
            .on('click',function(){
                setYearSelection("year_0")
                appliedFilter["Year"] = []
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+1)
            .on('click',function(){
                setYearSelection("year_"+1)
                appliedFilter["Year"].push(parseInt(document.getElementById("year_"+1).value,10) )
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+2)
            .on('click',function(){
                setYearSelection("year_"+2)
                appliedFilter["Year"].push(document.getElementById("year_"+2).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+3)
            .on('click',function(){
                setYearSelection("year_"+3)
                appliedFilter["Year"].push(document.getElementById("year_"+3).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+4)
            .on('click',function(){
                setYearSelection("year_"+4)
                appliedFilter["Year"].push(document.getElementById("year_"+4).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+5)
            .on('click',function(){
                setYearSelection("year_"+5)
                appliedFilter["Year"].push(document.getElementById("year_"+5).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+6)
            .on('click',function(){
                setYearSelection("year_"+6)
                appliedFilter["Year"].push(document.getElementById("year_"+6).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+7)
            .on('click',function(){
                setYearSelection("year_"+7)
                appliedFilter["Year"].push(document.getElementById("year_"+7).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+8)
            .on('click',function(){
                setYearSelection("year_"+8)
                appliedFilter["Year"].push(document.getElementById("year_"+8).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+9)
            .on('click',function(){
                setYearSelection("year_"+9)
                appliedFilter["Year"].push(document.getElementById("year_"+9).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+10)
            .on('click',function(){
                setYearSelection("year_"+10)
                appliedFilter["Year"].push(document.getElementById("year_"+10).value)
                drawOverView(data,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+11)
            .on('click',function(){
                setYearSelection("year_"+11)
                appliedFilter["Year"].push(document.getElementById("year_"+11).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+12)
            .on('click',function(){
                setYearSelection("year_"+12)
                appliedFilter["Year"].push(document.getElementById("year_"+12).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+13)
            .on('click',function(){
                setYearSelection("year_"+13)
                appliedFilter["Year"].push(document.getElementById("year_"+13).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+14)
            .on('click',function(){
                setYearSelection("year_"+14)
                appliedFilter["Year"].push(document.getElementById("year_"+14).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })

            d3.selectAll("#year_"+15)
            .on('click',function(){
                setYearSelection("year_"+15)
                appliedFilter["Year"].push(document.getElementById("year_"+15).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+16)
            .on('click',function(){
                setYearSelection("year_"+16)
                appliedFilter["Year"].push(document.getElementById("year_"+16).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+17)
            .on('click',function(){
                setYearSelection("year_"+17)
                appliedFilter["Year"].push(document.getElementById("year_"+17).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+18)
            .on('click',function(){
                setYearSelection("year_"+18)
                appliedFilter["Year"].push(document.getElementById("year_"+18).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+19)
            .on('click',function(){
                setYearSelection("year_"+19)
                appliedFilter["Year"].push(document.getElementById("year_"+19).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+20)
            .on('click',function(){
                setYearSelection("year_"+20)
                appliedFilter["Year"].push(document.getElementById("year_"+20).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+21)
            .on('click',function(){
                setYearSelection("year_"+21)
                appliedFilter["Year"].push(document.getElementById("year_"+21).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+22)
            .on('click',function(){
                setYearSelection("year_"+22)
                appliedFilter["Year"].push(document.getElementById("year_"+22).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+23)
            .on('click',function(){
                setYearSelection("year_"+23)
                appliedFilter["year"].push(document.getElementById("year_"+23).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+24)
            .on('click',function(){
                setYearSelection("year_"+24)
                appliedFilter["Year"].push(document.getElementById("year_"+24).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+25)
            .on('click',function(){
                setYearSelection("year_"+25)
                appliedFilter["Year"].push(document.getElementById("year_"+25).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+26)
            .on('click',function(){
                setYearSelection("year_"+26)
                appliedFilter["Year"].push(document.getElementById("year_"+26).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+27)
            .on('click',function(){
                setYearSelection("year_"+27)
                appliedFilter["Year"].push(document.getElementById("year_"+27).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+28)
            .on('click',function(){
                setYearSelection("year_"+28)
                appliedFilter["Year"].push(document.getElementById("year_"+28).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+29)
            .on('click',function(){
                setYearSelection("year_"+29)
                appliedFilter["Year"].push(document.getElementById("year_"+29).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+30)
            .on('click',function(){
                setYearSelection("year_"+30)
                appliedFilter["Year"].push(document.getElementById("year_"+30).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+31)
            .on('click',function(){
                setYearSelection("year_"+31)
                appliedFilter["Year"].push(document.getElementById("year_"+31).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#year_"+32)
            .on('click',function(){
                setYearSelection("year_"+32)
                appliedFilter["Year"].push(document.getElementById("year_"+32).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
    }


    function applyGenderFilter(){
        d3.selectAll("#sex_"+1)
            .on('click',function(){
                setGenderSelection("sex_1")
                appliedFilter["sex"] = [document.getElementById("sex_"+1).value]
                drawOverView(mainData,isAvg,appliedFilter)
                        })
        d3.selectAll("#sex_"+2)
            .on('click',function(){
                setGenderSelection("sex_2")
                appliedFilter["sex"] = [document.getElementById("sex_"+2).value]
                drawOverView(mainData,isAvg,appliedFilter)
                        })
        d3.selectAll("#sex_"+0)
            .on('click',function(){
                setGenderSelection("sex_0")
                appliedFilter["sex"] = []
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            
        }
    function applyDataTypeFilters(){
        d3.selectAll('#dataType_1')
        .on('click',function(){
            setDataTypeSelection("dataType_1")
            appliedFilter[dataTypeFilterName] = document.getElementById("dataType_1").value
            drawOverView(mainData,isAvg,appliedFilter)
                })
        
        d3.selectAll('#dataType_2')
        .on('click',function(){
            setDataTypeSelection("dataType_2")
            appliedFilter[dataTypeFilterName] = document.getElementById("dataType_2").value
            drawOverView(mainData,isAvg,appliedFilter)
                })
    }
    function applyCountryResetFilter(){
        d3.selectAll('#country_0')
        .on('click',function(){
            console.log("filttt")
            console.log(appliedFilter)
            appliedFilter["Country"] = []
            setShowAllcountrySelection(true,"")
            drawOverView(mainData,isAvg,appliedFilter)
                })
    }
    function applyAggregateTypeFilters(){
        d3.selectAll('#agg_1')
        .on('click',function(){
            isAvg = true
            setAggregateSelection("agg_1")
            drawOverView(mainData,isAvg,appliedFilter)
                })
        
        d3.selectAll('#agg_2')
        .on('click',function(){
            isAvg = false
            setAggregateSelection("agg_2")
            drawOverView(mainData,isAvg,appliedFilter)
                })
    }
    
    function applyAgeFilter(){
        d3.selectAll("#age_"+1)
            .on('click',function(){
                setAgeSelection("age_1")
                appliedFilter["age"].push(document.getElementById("age_"+1).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
        d3.selectAll("#age_"+2)
            .on('click',function(){
                setAgeSelection("age_2")
                appliedFilter["age"].push(document.getElementById("age_"+2).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
        d3.selectAll("#age_"+3)
            .on('click',function(){
                setAgeSelection("age_3")
                appliedFilter["age"].push(document.getElementById("age_"+3).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#age_"+4)
            .on('click',function(){
                setAgeSelection("age_4")
                appliedFilter["age"].push(document.getElementById("age_"+4).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            d3.selectAll("#age_"+5)
            .on('click',function(){
                setAgeSelection("age_5")
                appliedFilter["age"].push(document.getElementById("age_"+5).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
        d3.selectAll("#age_"+6)
            .on('click',function(){
                setAgeSelection("age_6")
                appliedFilter["age"].push(document.getElementById("age_"+6).value)
                drawOverView(mainData,isAvg,appliedFilter)
                        })
        d3.selectAll("#age_"+0)
            .on('click',function(){
                setAgeSelection("age_0")
                appliedFilter["age"] = []
                drawOverView(mainData,isAvg,appliedFilter)
                        })
            
        }
        function applyGDPFilter(){
            d3.selectAll("#gdp_"+0)
                .on('click',function(){
                    setGDPSelection("gdp_0")
                    appliedFilter["gdp_block($1e9)"] = []
                    drawOverView(mainData,isAvg,appliedFilter)
                                })
                d3.selectAll("#gdp_"+1)
                .on('click',function(){
                    setGDPSelection("gdp_1")
                    appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+1).value)
                    drawOverView(mainData,isAvg,appliedFilter)
                                })
                d3.selectAll("#gdp_"+2)
                .on('click',function(){
                    setGDPSelection("gdp_2")
                    appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+2).value)
                    drawOverView(mainData,isAvg,appliedFilter)
                                })
                d3.selectAll("#gdp_"+3)
                .on('click',function(){
                    setGDPSelection("gdp_3")
                    appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+3).value)
                    drawOverView(mainData,isAvg,appliedFilter)
                                })
                d3.selectAll("#gdp_"+4)
                .on('click',function(){
                    setGDPSelection("gdp_4")
                    appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+4).value)
                    drawOverView(mainData,isAvg,appliedFilter)
                                })
    
        }
    applyYearFilter()
    applyGDPFilter()
    applyAgeFilter()
    applyCountryResetFilter()
    applyGenderFilter()
    applyDataTypeFilters()
    applyAggregateTypeFilters()
    drawOverView(mainData,isAvg,appliedFilter)
});    