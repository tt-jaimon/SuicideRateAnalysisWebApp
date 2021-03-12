var test = d3.csv("../data/main.csv",function(data){
    var div = d3.select("body").append("div").attr("class","tooltip").style("opacity",0);


    function drawCountryWiseSuicideRates(countryWiseSuicideData){
        var format = d3.format(",");

        
        var margin = {top: 0, right: 0, bottom: 0, left: 0},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;
        
        var path = d3.geoPath();
        
        d3.selectAll("#country-wise-svg").remove()
        var svg = d3.selectAll("#country-wise-div").append("svg").attr("id","country-wise-svg")
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
        d3.selectAll("#country-legend-svg").remove()
        var svg = d3.selectAll("#country-legend-div").append("svg").attr("id","country-legend-svg")
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
        "Year":[]
    }
    isAvg = true
    socioFactor = 0
    drawCountryWiseSuicideRates(getCountryBasedData(data))

    function applyYearFilter(){
        d3.selectAll("#year_"+0)
            .on('click',function(){
                setYearSelection("year_0")
                appliedFilter["Year"] = []
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+1)
            .on('click',function(){
                setYearSelection("year_"+1)
                appliedFilter["Year"].push(parseInt(document.getElementById("year_"+1).value,10) )
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+2)
            .on('click',function(){
                setYearSelection("year_"+2)
                appliedFilter["Year"].push(document.getElementById("year_"+2).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+3)
            .on('click',function(){
                setYearSelection("year_"+3)
                appliedFilter["Year"].push(document.getElementById("year_"+3).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+4)
            .on('click',function(){
                setYearSelection("year_"+4)
                appliedFilter["Year"].push(document.getElementById("year_"+4).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+5)
            .on('click',function(){
                setYearSelection("year_"+5)
                appliedFilter["Year"].push(document.getElementById("year_"+5).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+6)
            .on('click',function(){
                setYearSelection("year_"+6)
                appliedFilter["Year"].push(document.getElementById("year_"+6).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+7)
            .on('click',function(){
                setYearSelection("year_"+7)
                appliedFilter["Year"].push(document.getElementById("year_"+7).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+8)
            .on('click',function(){
                setYearSelection("year_"+8)
                appliedFilter["Year"].push(document.getElementById("year_"+8).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+9)
            .on('click',function(){
                setYearSelection("year_"+9)
                appliedFilter["Year"].push(document.getElementById("year_"+9).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+10)
            .on('click',function(){
                setYearSelection("year_"+10)
                appliedFilter["Year"].push(document.getElementById("year_"+10).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+11)
            .on('click',function(){
                setYearSelection("year_"+11)
                appliedFilter["Year"].push(document.getElementById("year_"+11).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+12)
            .on('click',function(){
                setYearSelection("year_"+12)
                appliedFilter["Year"].push(document.getElementById("year_"+12).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+13)
            .on('click',function(){
                setYearSelection("year_"+13)
                appliedFilter["Year"].push(document.getElementById("year_"+13).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+14)
            .on('click',function(){
                setYearSelection("year_"+14)
                appliedFilter["Year"].push(document.getElementById("year_"+14).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })

            d3.selectAll("#year_"+15)
            .on('click',function(){
                setYearSelection("year_"+15)
                appliedFilter["Year"].push(document.getElementById("year_"+15).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+16)
            .on('click',function(){
                setYearSelection("year_"+16)
                appliedFilter["Year"].push(document.getElementById("year_"+16).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+17)
            .on('click',function(){
                setYearSelection("year_"+17)
                appliedFilter["Year"].push(document.getElementById("year_"+17).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+18)
            .on('click',function(){
                setYearSelection("year_"+18)
                appliedFilter["Year"].push(document.getElementById("year_"+18).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+19)
            .on('click',function(){
                setYearSelection("year_"+19)
                appliedFilter["Year"].push(document.getElementById("year_"+19).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+20)
            .on('click',function(){
                setYearSelection("year_"+20)
                appliedFilter["Year"].push(document.getElementById("year_"+20).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+21)
            .on('click',function(){
                setYearSelection("year_"+21)
                appliedFilter["Year"].push(document.getElementById("year_"+21).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+22)
            .on('click',function(){
                setYearSelection("year_"+22)
                appliedFilter["Year"].push(document.getElementById("year_"+22).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+23)
            .on('click',function(){
                setYearSelection("year_"+23)
                appliedFilter["year"].push(document.getElementById("year_"+23).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+24)
            .on('click',function(){
                setYearSelection("year_"+24)
                appliedFilter["Year"].push(document.getElementById("year_"+24).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+25)
            .on('click',function(){
                setYearSelection("year_"+25)
                appliedFilter["Year"].push(document.getElementById("year_"+25).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+26)
            .on('click',function(){
                setYearSelection("year_"+26)
                appliedFilter["Year"].push(document.getElementById("year_"+26).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+27)
            .on('click',function(){
                setYearSelection("year_"+27)
                appliedFilter["Year"].push(document.getElementById("year_"+27).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+28)
            .on('click',function(){
                setYearSelection("year_"+28)
                appliedFilter["Year"].push(document.getElementById("year_"+28).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+29)
            .on('click',function(){
                setYearSelection("year_"+29)
                appliedFilter["Year"].push(document.getElementById("year_"+29).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+30)
            .on('click',function(){
                setYearSelection("year_"+30)
                appliedFilter["Year"].push(document.getElementById("year_"+30).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+31)
            .on('click',function(){
                setYearSelection("year_"+31)
                appliedFilter["Year"].push(document.getElementById("year_"+31).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#year_"+32)
            .on('click',function(){
                setYearSelection("year_"+32)
                appliedFilter["Year"].push(document.getElementById("year_"+32).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
    }


    function applyGenderFilter(){
        d3.selectAll("#sex_"+1)
            .on('click',function(){
                setGenderSelection("sex_1")
                appliedFilter["sex"] = [document.getElementById("sex_"+1).value]
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
        d3.selectAll("#sex_"+2)
            .on('click',function(){
                setGenderSelection("sex_2")
                appliedFilter["sex"] = [document.getElementById("sex_"+2).value]
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
        d3.selectAll("#sex_"+0)
            .on('click',function(){
                setGenderSelection("sex_0")
                appliedFilter["sex"] = []
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            
        }
    function applyDataTypeFilters(){
        d3.selectAll('#dataType_1')
        .on('click',function(){
            setDataTypeSelection("dataType_1")
            appliedFilter[dataTypeFilterName] = document.getElementById("dataType_1").value
            drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
        })
        
        d3.selectAll('#dataType_2')
        .on('click',function(){
            setDataTypeSelection("dataType_2")
            appliedFilter[dataTypeFilterName] = document.getElementById("dataType_2").value
            drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
        })
    }
    function applyAggregateTypeFilters(){
        d3.selectAll('#agg_1')
        .on('click',function(){
            isAvg = true
            setAggregateSelection("agg_1")
            drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
        })
        
        d3.selectAll('#agg_2')
        .on('click',function(){
            isAvg = false
            setAggregateSelection("agg_2")
            drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
        })
    }
    
    function applyAgeFilter(){
        d3.selectAll("#age_"+1)
            .on('click',function(){
                setAgeSelection("age_1")
                appliedFilter["age"].push(document.getElementById("age_"+1).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
        d3.selectAll("#age_"+2)
            .on('click',function(){
                setAgeSelection("age_2")
                appliedFilter["age"].push(document.getElementById("age_"+2).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
        d3.selectAll("#age_"+3)
            .on('click',function(){
                setAgeSelection("age_3")
                appliedFilter["age"].push(document.getElementById("age_"+3).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#age_"+4)
            .on('click',function(){
                setAgeSelection("age_4")
                appliedFilter["age"].push(document.getElementById("age_"+4).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            d3.selectAll("#age_"+5)
            .on('click',function(){
                setAgeSelection("age_5")
                appliedFilter["age"].push(document.getElementById("age_"+5).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
        d3.selectAll("#age_"+6)
            .on('click',function(){
                setAgeSelection("age_6")
                appliedFilter["age"].push(document.getElementById("age_"+6).value)
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
        d3.selectAll("#age_"+0)
            .on('click',function(){
                setAgeSelection("age_0")
                appliedFilter["age"] = []
                drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
            })
            
        }
        function applyGDPFilter(){
            d3.selectAll("#gdp_"+0)
                .on('click',function(){
                    setGDPSelection("gdp_0")
                    appliedFilter["gdp_block($1e9)"] = []
                    drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
                })
                d3.selectAll("#gdp_"+1)
                .on('click',function(){
                    setGDPSelection("gdp_1")
                    appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+1).value)
                    drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
                })
                d3.selectAll("#gdp_"+2)
                .on('click',function(){
                    setGDPSelection("gdp_2")
                    appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+2).value)
                    drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
                })
                d3.selectAll("#gdp_"+3)
                .on('click',function(){
                    setGDPSelection("gdp_3")
                    appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+3).value)
                    drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
                })
                d3.selectAll("#gdp_"+4)
                .on('click',function(){
                    setGDPSelection("gdp_4")
                    appliedFilter["gdp_block($1e9)"].push(document.getElementById("gdp_"+4).value)
                    drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
                })
    
        }
    applyYearFilter()
    applyGDPFilter()
    applyAgeFilter()
    applyGenderFilter()
    applyDataTypeFilters()
    applyAggregateTypeFilters()
    drawCountryWiseSuicideRates(getCountryBasedData(data,isAvg,appliedFilter))
});
    


