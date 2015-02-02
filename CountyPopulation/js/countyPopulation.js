/// <reference path="jquery.min.js" />
/// <reference path="mapbox.js" />
/// <reference path="turf.min.js" />

var map = L.mapbox.map('map').setView([40, -74.50], 9);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var countyPop = L.mapbox.featureLayer('data/CountyPopulation20m.geojson');

countyPop.on("ready", function () {
    var reclassed = turf.reclass(
        countyPop.getGeoJSON(), 'Pop2010', 'size', translations);
});

var translations = [
      [0, 100000, "small"],
      [100000, 10000000, "large"]
];

var filters = document.getElementById('filters');
var checkboxes = [];
// Create a filter interface.
for (var i = 0; i < translations.length; i++) {
    // Create an an input checkbox and label inside.
    var item = filters.appendChild(document.createElement('div'));
    var checkbox = item.appendChild(document.createElement('input'));
    var label = item.appendChild(document.createElement('label'));
    checkbox.type = 'radio';
    checkbox.name = 'countySize';
    checkbox.id = translations[i][2];
    //checkbox.checked = true;
    checkbox.value = false;
    // create a label to the right of the checkbox with explanatory text
    label.innerHTML = translations[i][2] + ' counties';
    label.setAttribute('for', translations[i][2]);
    // Whenever a person clicks on this checkbox, call the update().
    checkbox.addEventListener('click', update);
    checkboxes.push(checkbox);
}

function update() {
    var enabled = {};
    // Run through each checkbox and record whether it is checked. If it is,
    // add it to the object of types to display, otherwise do not.
    var filterValue;
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) filterValue = checkboxes[i].id;
    }
    console.log(filterValue);
    map.featureLayer.setGeoJSON(turf.filter(countyPop.getGeoJSON(), 'size', filterValue)).eachLayer(function (layer) {
            var content = '<h2>' + layer.feature.properties.NAME + '<\/h2>'
                + 'Population: ' + layer.feature.properties.Pop2010 + '<br\/>'
                + 'Size: ' + layer.feature.properties.size;
            layer.bindPopup(content);
        });
}

