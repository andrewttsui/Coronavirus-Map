var rawData = [];
var data = [];
var dataValues = [];

function filter_array(arr) {
    var index = -1,
        arr_length = arr ? arr.length : 0,
        resIndex = -1,
        result = [];

    while (++index < arr_length) {
        var value = arr[index];
        if (value != null) {
            result[++resIndex] = value;
        }
    }
    return result;
}

function zip(arrays) {
    return arrays[0].map(function(_,i){
        return arrays.map(function(array){return array[i]})
    });
}

function showMap(mode) {
    var confirmed = document.getElementById("confirmed");
    var deaths = document.getElementById("deaths");
    var recovered = document.getElementById("recovered");
    if(mode == 'recovered') {
        confirmed.style.display = "none";
        deaths.style.display = "none";
        recovered.style.display = "initial";
        document.getElementById('map-title').innerHTML = "COVID-19 Confirmed Recoveries";
    } else if(mode == 'deaths') {
        confirmed.style.display = "none";
        deaths.style.display = "initial";
        recovered.style.display = "none";
        document.getElementById('map-title').innerHTML = "COVID-19 Confirmed Deaths";
    } else {
        confirmed.style.display = "initial";
        deaths.style.display = "none";
        recovered.style.display = "none";
        document.getElementById('map-title').innerHTML = "COVID-19 Confirmed Cases";
    }
}

function preload() {
    rawData = loadJSON('https://covidtracking.com/api/v1/states/current.json');
}

function loadData() {
    Object.values(rawData).forEach(function(value) {
        var info = [value.state, value.positive, value.death, value.recovered];
        data.push(info);
    });

    dataValues = zip(data).slice(1);
}

function setup() {
    loadData();
}

function draw() {
    var confirmedValues = filter_array(dataValues[0]);
    var deathValues = filter_array(dataValues[1]);
    var recoveredValues = filter_array(dataValues[2]);
    var confirmedDataset = {};
    var recoveredDataset = {};
    var deathsDataset = {};
    
    var minValue = Math.min.apply(null, confirmedValues);
    var maxValue = Math.max.apply(null, confirmedValues);
    
    var paletteScale = d3.scale.linear()
        .domain([minValue,maxValue])
        .range(["#dee9ff","#002775"]); // red color
    
    // expected item format => [state, confirmed, deaths, recovered]
    data.forEach(function(item) {
        var state = item[0];
        var confirmedValue = item[1];
        confirmedDataset[state] = {confirmed: confirmedValue, fillColor: confirmedValue ? paletteScale(confirmedValue) : "#c2c2c2" };
    });
    
    var confirmedMap = new Datamap({
        scope: 'usa',
        element: document.getElementById('confirmed'),
        geographyConfig: {
            popupOnHover: true,
            highlightOnHover: true,
            highlightFillColor: function(geo) {
                return geo['fillColor'];
            },
            borderColor: '#444',
            borderWidth: 0.5,
            popupTemplate: function(geo, data) {
                if (!data.confirmed) { return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Confirmed Count: <strong>', 'N/A', '</strong>',
                    '</div>'].join(''); }
                
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Confirmed Count: <strong>', data.confirmed, '</strong>',
                    '</div>'].join('');
            }
        },
        fills: {
            defaultFill: '#c2c2c2',
        },
        data: confirmedDataset,
    });

    var minValue = Math.min.apply(null, deathValues);
    var maxValue = Math.max.apply(null, deathValues);
    
    var paletteScale = d3.scale.linear()
        .domain([minValue,maxValue])
        .range(["#fcf0f0","#7a0000"]); // red color
    
    // expected item format => [state, confirmed, deaths, recovered]
    data.forEach(function(item) {
        var state = item[0];
        var deathsValue = item[2];
        deathsDataset[state] = {deaths: deathsValue, fillColor: deathsValue ? paletteScale(deathsValue) : "#c2c2c2"};
    });

    var deathMap = new Datamap({
        scope: 'usa',
        element: document.getElementById('deaths'),
        geographyConfig: {
            popupOnHover: true,
            highlightOnHover: true,
            highlightFillColor: function(geo) {
                return geo['fillColor'];
            },
            borderColor: '#444',
            borderWidth: 0.5,
            popupTemplate: function(geo, data) {
                if (!data.deaths) { return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Deaths: <strong>', 'N/A', '</strong>',
                    '</div>'].join('');}
                
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Deaths: <strong>', data.deaths, '</strong>',
                    '</div>'].join('');
            }
        },
        fills: {
            defaultFill: '#c2c2c2',
        },
        data: deathsDataset,
    });

    var minValue = Math.min.apply(null, recoveredValues);
    var maxValue = Math.max.apply(null, recoveredValues);
    
    var paletteScale = d3.scale.linear()
        .domain([minValue,maxValue])
        .range(["#deffe5","#005c14"]); // red color
    
    // expected item format => [state, confirmed, deaths, recovered]
    data.forEach(function(item) {
        var state = item[0];
        var recoveredValue = item[3];
        console.log(recoveredValue);
        recoveredDataset[state] = {recovered: recoveredValue, fillColor: recoveredValue ? paletteScale(recoveredValue) : "#c2c2c2"};
    });

    var recoveredMap = new Datamap({
        scope: 'usa',
        element: document.getElementById('recovered'),
        geographyConfig: {
            popupOnHover: true,
            highlightOnHover: true,
            highlightFillColor: function(geo) {
                return geo['fillColor'];
            },
            borderColor: '#444',
            borderWidth: 0.5,
            popupTemplate: function(geo, data) {
                if (!data.recovered) { return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Recovered: <strong>', 'N/A', '</strong>',
                    '</div>'].join('');}
                
                return ['<div class="hoverinfo">',
                    '<strong>', geo.properties.name, '</strong>',
                    '<br>Recovered: <strong>', data.recovered, '</strong>',
                    '</div>'].join('');
            }
        },
        fills: {
            defaultFill: '#c2c2c2',
        },
        data: recoveredDataset,
    });

    showMap('confirmed');
    noLoop();
}

