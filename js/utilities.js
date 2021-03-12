dataTypeFilterName = "dataType"

function getFilteredData(data,filter){
    console.log(filter)
    filteredData = []
    validFilter = false
    if(Object.keys(filter).length > 0){
        for(var row in data){
            var allFeaturePresent = true
            for(var key in filter){
                if(key == dataTypeFilterName ||Object.keys(filter[key]).length == 0){
                    continue
                }
                found = false
                for(each in filter[key]){
                    validFilter = true
                    if(data[row][key] == filter[key][each]){
                        found = true
                    }
                }
                if(found == false){
                     allFeaturePresent = false
                }
            }
            if(allFeaturePresent == true){
                filteredData.push(data[row])
            }
        }
    }
    if(validFilter == false){
        filteredData = data
    }
    return filteredData
}
    
function getDataValue(d,filter={}){
    if((Object.keys(filter).length > 0) && (dataTypeFilterName in filter)){
        if(filter[dataTypeFilterName] == "suicides/100k"){
            return d["suicides/100k pop"]
        }
    }
    return d["suicides_no"]
}

function getSocioBasedData(mainData,isAvg=true,filter={},socioType = 0){
    filteredData = getFilteredData(mainData,filter)
    var suicidesByGDP = d3.nest()
        .key(function(d) { 
            if(socioType == 1){
                return d["happinessScoreBlock"];
            }
            else if(socioType == 2){
                return d["happinessRankBlock"];
            }
            else if(socioType ==3){
                return d["dystopiaResidualBlock"];
            }
            else if(socioType == 4){
                return d["familyBlock"];
            }
            else if(socioType == 5){
                return d["freedomBlock"];
            }
            else if(socioType == 6){
                return d["generosityBlock"];
            }
            else if(socioType == 7){
                return d["healthBlock"];
            }
            else if(socioType == 8){
                return d["trustBlock"];
            }
            else{
                return d["gdp_block($1e9)"];
            }
        })
        .rollup(function(v) { 
            if(isAvg == true){
                return d3.mean(v, function(d) {
                    return getDataValue(d,filter); }); 
            }
            else{
                return d3.sum(v, function(d) {
                    return getDataValue(d,filter); }); 
            }
        })
        .entries(filteredData);
    return suicidesByGDP
}

function getFactorName(socioType){
    if(socioType == 1){
        return "Happiness Score";
    }
    else if(socioType == 2){
        return "Happiness Rank";
    }
    else if(socioType ==3){
        return "Dystopia Residual";
    }
    else if(socioType == 4){
        return "Family";
    }
    else if(socioType == 5){
        return "Freedom";
    }
    else if(socioType == 6){
        return "Generosity";
    }
    else if(socioType == 7){
        return "Health";
    }
    else if(socioType == 8){
        return "Trust";
    }
    else{
        return "GDP";
    }
}

function getCountryBasedData(mainData,isAvg=true,filter={}){
    filteredData = getFilteredData(mainData,filter)
    console.log(filteredData)
    var suicidesByCountry = d3.nest()
        .key(function(d) { return d.Country; })
        .rollup(function(v) { 
            if(isAvg == true){
                return d3.mean(v, function(d) {
                    return getDataValue(d,filter); }); 
            }
            else{
                return d3.sum(v, function(d) {
                    return getDataValue(d,filter); }); 
            }
        })
        .entries(filteredData);
    return suicidesByCountry
}

function getGenderBasedData(mainData,isAvg=true,filter={}){
    filteredData = getFilteredData(mainData,filter)
    var suicidesByGender = d3.nest()
        .key(function(d) { return d.sex; })
        .rollup(function(v) { 
            if(isAvg == true){
                return d3.mean(v, function(d) {
                    return getDataValue(d,filter); }); 
            }
            else{
                return d3.sum(v, function(d) {
                    return getDataValue(d,filter); }); 
            }
        })
        .entries(filteredData);
    return suicidesByGender
}

function getStructuredAgeData(mainData,isAvg = true,filter={}){
    suicidesByAge = getAgeBasedData(mainData,isAvg,filter)
    yearData = {}
    ageGroups = []
    for(i in suicidesByAge){
        age = suicidesByAge[i].key
        ageGroups.push(age)
        for(j in suicidesByAge[i].values){
            temp = {}
            year = suicidesByAge[i].values[j].key
            if( year in yearData){
                temp = yearData[year]
            }
            temp[age] = suicidesByAge[i].values[j].value
            yearData[year] = temp
        }
    }
    res = []
    for(key in yearData){
        temp={}
        temp["year"] = parseInt(key, 10)
        for(i in ageGroups){
            if(ageGroups[i] in yearData[key]){
                temp[ageGroups[i]] = yearData[key][ageGroups[i]]
            }
            else{
                temp[ageGroups[i]] = 0
            }
        }
        res.push(temp)
    }
    return res
}

function getAgeBasedData(mainData,isAvg = true,filter={}){
    filteredData = getFilteredData(mainData,filter)
    var suicidesByAge = d3.nest()
        .key(function(d) { return d.age; })
        .key(function(d) { return d.Year; })
        .rollup(function(v) { 
            if(isAvg == true){
                return d3.mean(v, function(d) {
                    return getDataValue(d,filter); }); 
            }
            else{
                return d3.sum(v, function(d) {
                    return getDataValue(d,filter); }); 
            }
        })
        .entries(filteredData);
    return suicidesByAge
}

function formatName(value){
    return value[0].toUpperCase()+value.substring(1, value.length)
}

function setAggregateSelection(agg){
    if(agg == "agg_1"){
        d3.selectAll('#agg_l_1').attr("class","btn btn-secondary active")
        d3.selectAll('#agg_l_2').attr("class","btn btn-secondary")
    }
    else{
        d3.selectAll('#agg_l_2').attr("class","btn btn-secondary active")
        d3.selectAll('#agg_l_1').attr("class","btn btn-secondary")
    }
}

function setSocioEconomicFactor(socio){
    if(socio == "socio_0"){
        d3.selectAll('#socio_l_0').attr("class","btn btn-secondary active")
        d3.selectAll('#socio_l_1').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_2').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_3').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_4').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_5').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_6').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_7').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_8').attr("class","btn btn-secondary")
    }
    else if(socio == "socio_1"){
        d3.selectAll('#socio_l_0').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_1').attr("class","btn btn-secondary active")
        d3.selectAll('#socio_l_2').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_3').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_4').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_5').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_6').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_7').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_8').attr("class","btn btn-secondary")
    }
    else if(socio == "socio_2"){
        d3.selectAll('#socio_l_0').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_1').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_2').attr("class","btn btn-secondary active")
        d3.selectAll('#socio_l_3').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_4').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_5').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_6').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_7').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_8').attr("class","btn btn-secondary")
    }
    else if(socio == "socio_3"){
        d3.selectAll('#socio_l_0').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_1').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_2').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_3').attr("class","btn btn-secondary active")
        d3.selectAll('#socio_l_4').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_5').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_6').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_7').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_8').attr("class","btn btn-secondary")
    }
    else if(socio == "socio_4"){
        d3.selectAll('#socio_l_0').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_1').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_2').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_3').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_4').attr("class","btn btn-secondary active")
        d3.selectAll('#socio_l_5').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_6').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_7').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_8').attr("class","btn btn-secondary")
    }
    else if(socio == "socio_5"){
        d3.selectAll('#socio_l_0').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_1').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_2').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_3').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_4').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_5').attr("class","btn btn-secondary active")
        d3.selectAll('#socio_l_6').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_7').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_8').attr("class","btn btn-secondary")
    }
    else if(socio == "socio_6"){
        d3.selectAll('#socio_l_0').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_1').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_2').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_3').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_4').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_5').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_6').attr("class","btn btn-secondary active")
        d3.selectAll('#socio_l_7').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_8').attr("class","btn btn-secondary")
    }
    else if(socio == "socio_7"){
        d3.selectAll('#socio_l_0').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_1').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_2').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_3').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_4').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_5').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_6').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_7').attr("class","btn btn-secondary active")
        d3.selectAll('#socio_l_8').attr("class","btn btn-secondary")
    }
    else if(socio == "socio_8"){
        d3.selectAll('#socio_l_0').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_1').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_2').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_3').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_4').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_5').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_6').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_7').attr("class","btn btn-secondary")
        d3.selectAll('#socio_l_8').attr("class","btn btn-secondary active")
    }
}

function setYearSelection(year,isAlreadySet = false){
    if(isAlreadySet == false){
        if(year == "year_0"){
            d3.selectAll('#year_l_0').attr("class","btn btn-secondary active")
            for(j=1;j<33;j++){
                d3.selectAll("#year_l_"+j).attr("class","btn btn-secondary")
            }
        }
        for(var i=1;i<33;i++){
            if(year == "year_"+i){
                d3.selectAll("#year_l_"+i).attr("class","btn btn-secondary active")
                d3.selectAll('#year_l_0').attr("class","btn btn-secondary")
                break;
            }
        }
    }
}

function setGDPSelection(gdp,isAlreadySet = false){
    if(isAlreadySet == false){
        if(gdp == "gdp_0"){
            d3.selectAll('#gdp_l_0').attr("class","btn btn-secondary active")
            d3.selectAll('#gdp_l_1').attr("class","btn btn-secondary")
            d3.selectAll('#gdp_l_2').attr("class","btn btn-secondary")
            d3.selectAll('#gdp_l_3').attr("class","btn btn-secondary")
            d3.selectAll('#gdp_l_4').attr("class","btn btn-secondary")
            d3.selectAll('#gdp_l_5').attr("class","btn btn-secondary")
            d3.selectAll('#gdp_l_6').attr("class","btn btn-secondary")
        }
        else if(gdp == "gdp_1"){
            d3.selectAll('#gdp_l_1').attr("class","btn btn-secondary active")
            d3.selectAll('#gdp_l_0').attr("class","btn btn-secondary")
        }
        else if(gdp == "gdp_2"){
            d3.selectAll('#gdp_l_2').attr("class","btn btn-secondary active")
            d3.selectAll('#gdp_l_0').attr("class","btn btn-secondary")
        }
        else if(gdp == "gdp_3"){
            d3.selectAll('#gdp_l_3').attr("class","btn btn-secondary active")
            d3.selectAll('#gdp_l_0').attr("class","btn btn-secondary")
        }
        else if(gdp == "gdp_4"){
            d3.selectAll('#gdp_l_4').attr("class","btn btn-secondary active")
            d3.selectAll('#gdp_l_0').attr("class","btn btn-secondary")
        }
    }
}

function setAgeSelection(age,isAlreadySet = false){
    if(isAlreadySet == false){
        if(age == "age_0"){
            d3.selectAll('#age_l_0').attr("class","btn btn-secondary active")
            d3.selectAll('#age_l_1').attr("class","btn btn-secondary")
            d3.selectAll('#age_l_2').attr("class","btn btn-secondary")
            d3.selectAll('#age_l_3').attr("class","btn btn-secondary")
            d3.selectAll('#age_l_4').attr("class","btn btn-secondary")
            d3.selectAll('#age_l_5').attr("class","btn btn-secondary")
            d3.selectAll('#age_l_6').attr("class","btn btn-secondary")
        }
        else if(age == "age_1"){
            d3.selectAll('#age_l_1').attr("class","btn btn-secondary active")
            d3.selectAll('#age_l_0').attr("class","btn btn-secondary")
        }
        else if(age == "age_2"){
            d3.selectAll('#age_l_2').attr("class","btn btn-secondary active")
            d3.selectAll('#age_l_0').attr("class","btn btn-secondary")
        }
        else if(age == "age_3"){
            d3.selectAll('#age_l_3').attr("class","btn btn-secondary active")
            d3.selectAll('#age_l_0').attr("class","btn btn-secondary")
        }
        else if(age == "age_4"){
            d3.selectAll('#age_l_4').attr("class","btn btn-secondary active")
            d3.selectAll('#age_l_0').attr("class","btn btn-secondary")
        }
        else if(age == "age_5"){
            d3.selectAll('#age_l_5').attr("class","btn btn-secondary active")
            d3.selectAll('#age_l_0').attr("class","btn btn-secondary")
        }
        else if(age == "age_6"){
            d3.selectAll('#age_l_6').attr("class","btn btn-secondary active")
            d3.selectAll('#age_l_0').attr("class","btn btn-secondary")
        }    
    }
    
}

function setGenderSelection(sex){
    if(sex == "sex_0"){
        d3.selectAll('#sex_l_0').attr("class","btn btn-secondary active")
        d3.selectAll('#sex_l_1').attr("class","btn btn-secondary")
        d3.selectAll('#sex_l_2').attr("class","btn btn-secondary")
    }
    else if(sex == "sex_1"){
        d3.selectAll('#sex_l_0').attr("class","btn btn-secondary")
        d3.selectAll('#sex_l_1').attr("class","btn btn-secondary active")
        d3.selectAll('#sex_l_2').attr("class","btn btn-secondary")
    }
    else{
        d3.selectAll('#sex_l_0').attr("class","btn btn-secondary")
        d3.selectAll('#sex_l_1').attr("class","btn btn-secondary")
        d3.selectAll('#sex_l_2').attr("class","btn btn-secondary active")
    }
}

function setShowAllcountrySelection(showAll = true,displayStr=""){
    d3.selectAll("#selected-countries-disp").remove()
    if(showAll == true){
        d3.selectAll('#country_l_0').attr("class","btn btn-secondary active")
    }
    else{
        d3.selectAll("#selected-countries-div").append("h4").attr("id","selected-countries-disp")
        .text(displayStr)
        d3.selectAll('#country_l_0').attr("class","btn btn-secondary")

    }
}

function setDataTypeSelection(dataType){
    if(dataType == "dataType_1"){
        d3.selectAll('#dataType_l_1').attr("class","btn btn-secondary active")
        d3.selectAll('#dataType_l_2').attr("class","btn btn-secondary")
    }
    else{
        d3.selectAll('#dataType_l_2').attr("class","btn btn-secondary active")
        d3.selectAll('#dataType_l_1').attr("class","btn btn-secondary")
    }
}

function genderColor (key){
    if(key == 'male'){
        return "#2E3EEB"
    }
    return "#2CFF00"
}

function getStokeColor(key){
    if(key == 'male'){
        return "white"
    }
    return "black"
}

function updateLegend(color,svgIdName,legendName){
    legendWidth = 300
    legendHeight = 500
    d3.selectAll("#"+svgIdName+"-svg").remove()

    var svg = d3.selectAll("#"+svgIdName+"-div").append("svg").attr("id",svgIdName+"-svg")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("background-color", 'black')

    svg.append('text')
        .attr('x', 0)
        .attr('y', 30)
        .style("font-size", "30")
        .attr("stroke","white")
        .attr("fill","white")
        .text(legendName);
    
        y = 30
        x = 20
        for(each in  color){
            svg.append("rect")
                .attr("width", 19)
                .attr("height", 19)
                .attr("x", x)
                .attr("y", function(d){
                    y=y+30
                    return y
                })
                .attr("fill", color[each]);
            svg.append("text")
                .attr("x", x+24)
                .attr("y", function(d){
                    return y + 10
                })
                .attr("dy", "0.35em")
                .text(d => each)
                .attr("stroke","white")
            }
}

    


