var test = d3.csv("../data/Combined.csv",function(data){
    
    function drawSocioEconomicFatcors(suicidesData){
        const width = 500,
        height = 500,
        chartRadius = height / 2 - 40;

        const socioColor = d3.scaleOrdinal(d3.schemeCategory10);

        d3.selectAll("#socio-svg").remove()
        let svg = d3.selectAll('#socio-div').append("svg").attr("id","socio-svg")
            .attr('width', width)
            .attr('height', height)
        
        svg.append("rect")
            .attr("x", 0) 
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .style("fill", "black"); 

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

    appliedFilter={
        "age":[],
        "gdp_block($1e9)":[]
    }
    isAvg = true
    socioFactor = 0
    function applyGenderFilter(){
        d3.selectAll("#sex_"+1)
            .on('click',function(){
                setGenderSelection("sex_1")
                appliedFilter["sex"] = [document.getElementById("sex_"+1).value]
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
        d3.selectAll("#sex_"+2)
            .on('click',function(){
                setGenderSelection("sex_2")
                appliedFilter["sex"] = [document.getElementById("sex_"+2).value]
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
        d3.selectAll("#sex_"+0)
            .on('click',function(){
                setGenderSelection("sex_0")
                appliedFilter["sex"] = []
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
            
        }
    function applySocioEconomicFilter(){
        d3.selectAll("#socio_"+0)
            .on('click',function(){
                setSocioEconomicFactor("socio_0")
                socioFactor = document.getElementById("socio_"+0).value
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
            d3.selectAll("#socio_"+1)
            .on('click',function(){
                setSocioEconomicFactor("socio_1")
                socioFactor = document.getElementById("socio_"+1).value
                console.log(socioFactor)
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
            d3.selectAll("#socio_"+2)
            .on('click',function(){
                setSocioEconomicFactor("socio_2")
                socioFactor = document.getElementById("socio_"+2).value
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
            d3.selectAll("#socio_"+3)
            .on('click',function(){
                setSocioEconomicFactor("socio_3")
                socioFactor = document.getElementById("socio_"+3).value
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
            d3.selectAll("#socio_"+4)
            .on('click',function(){
                setSocioEconomicFactor("socio_4")
                socioFactor = document.getElementById("socio_"+4).value
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
            d3.selectAll("#socio_"+5)
            .on('click',function(){
                setSocioEconomicFactor("socio_5")
                socioFactor = document.getElementById("socio_"+5).value
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
            d3.selectAll("#socio_"+6)
            .on('click',function(){
                setSocioEconomicFactor("socio_6")
                socioFactor = document.getElementById("socio_"+6).value
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
            d3.selectAll("#socio_"+7)
            .on('click',function(){
                setSocioEconomicFactor("socio_7")
                socioFactor = document.getElementById("socio_"+7).value
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
            d3.selectAll("#socio_"+8)
            .on('click',function(){
                setSocioEconomicFactor("socio_8")
                socioFactor = document.getElementById("socio_"+8).value
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
    }
    function applyDataTypeFilters(){
        d3.selectAll('#dataType_1')
        .on('click',function(){
            setDataTypeSelection("dataType_1")
            appliedFilter[dataTypeFilterName] = document.getElementById("dataType_1").value
            drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
        })
        
        d3.selectAll('#dataType_2')
        .on('click',function(){
            setDataTypeSelection("dataType_2")
            appliedFilter[dataTypeFilterName] = document.getElementById("dataType_2").value
            drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
        })
    }
    function applyAggregateTypeFilters(){
        d3.selectAll('#agg_1')
        .on('click',function(){
            isAvg = true
            setAggregateSelection("agg_1")
            drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
        })
        
        d3.selectAll('#agg_2')
        .on('click',function(){
            isAvg = false
            setAggregateSelection("agg_2")
            drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
        })
    }
    function applyAgeFilter(){
        d3.selectAll("#age_"+1)
            .on('click',function(){
                setAgeSelection("age_1")
                appliedFilter["age"].push(document.getElementById("age_"+1).value)
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
        d3.selectAll("#age_"+2)
            .on('click',function(){
                setAgeSelection("age_2")
                appliedFilter["age"].push(document.getElementById("age_"+2).value)
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
        d3.selectAll("#age_"+3)
            .on('click',function(){
                setAgeSelection("age_3")
                appliedFilter["age"].push(document.getElementById("age_"+3).value)
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
            d3.selectAll("#age_"+4)
            .on('click',function(){
                setAgeSelection("age_4")
                appliedFilter["age"].push(document.getElementById("age_"+4).value)
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
            d3.selectAll("#age_"+5)
            .on('click',function(){
                setAgeSelection("age_5")
                appliedFilter["age"].push(document.getElementById("age_"+5).value)
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
        d3.selectAll("#age_"+6)
            .on('click',function(){
                setAgeSelection("age_6")
                appliedFilter["age"].push(document.getElementById("age_"+6).value)
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
        d3.selectAll("#age_"+0)
            .on('click',function(){
                setAgeSelection("age_0")
                appliedFilter["age"] = []
                drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter,socioFactor))
            })
            
        }
    applySocioEconomicFilter()
    applyAgeFilter()
    applyGenderFilter()
    applyDataTypeFilters()
    applyAggregateTypeFilters()
    drawSocioEconomicFatcors(getSocioBasedData(data,isAvg,appliedFilter))
});
    


