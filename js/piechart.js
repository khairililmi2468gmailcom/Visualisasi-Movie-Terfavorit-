
// Set up dimensions and margins for pie chart
var width = 600;
var height = 400;
var margin = { top: 20, right: 20, bottom: 20, left: 20 };
var radius = Math.min(width, height) / 2 - 10;

// Set up color scale for pie chart slices
var colorScale = d3.scaleOrdinal()
    .range(d3.schemeCategory10);

// Create pie chart layout
var pie = d3.pie()
    .value(function (d) { return d.percent; })
    .sort(null);

// Create arc generator for pie chart slices
var arc = d3.arc()
    .innerRadius(0)
    .outerRadius(radius);

// Set up SVG element for pie chart
var svg = d3.select("#myPieChart")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + (margin.left + width / 2) + "," + (margin.top + height / 2) + ")");

var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// Load data from CSV file
d3.csv("data/movies.csv").then(function (data) {
    // Calculate total number of movies
    var totalMovies = data.length;

    // Group data by country and calculate number of movies from each country
    var dataByCountry = d3.group(data, function (d) { return d.country; });
    var dataByCountryCount = Array.from(dataByCountry, ([key, value]) => ({ country: key, count: value.length }));

    // Calculate percentage of movies from each country
    var dataByCountryPercentage = dataByCountryCount.map(function (d) {
        return {
            country: d.country,
            percent: d.count / totalMovies * 100
        };
    });

    // Generate pie chart slices
    var slices = svg.selectAll("path.slice")
        .data(pie(dataByCountryPercentage))
        .enter()
        .append("path")
        .attr("class", "slice")
        .attr("d", arc)
        .attr("fill", function (d) { return colorScale(d.data.country); })
        .each(function (d) { this._current = d; }) // store the initial angles
    // Add labels to pie chart slices
    var text = svg.selectAll("text")
        .data(pie(dataByCountryPercentage))
        .enter()
        .append("text")
        .attr("transform", function (d) {
            var pos = arc.centroid(d);
            var midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            pos[0] = radius * 0.9 * (midAngle < Math.PI ? 1 : -1);
            return "translate(" + pos + ")";
        })
        .attr("dy", ".35em")
        .attr("text-anchor", function (d) {
            var midAngle = d.startAngle + (d.endAngle - d.startAngle) / 2;
            return midAngle < Math.PI ? "start" : "end";
        })
        .text(function (d) {
            return d.data.country + " (" + d.data.percent.toFixed(1) + "%)";
        });


    // Add tooltip to pie chart slices
    slices.on("mouseover", function (d) {
        tooltip.html(d.data.country + "<br>" + d.data.percent.toFixed(1) + "%")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px")
            .transition()
            .duration(200)
            .style("opacity", .9);
    })
        .on("mouseout", function (d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", 0);
        });

    // Add title to chart
    svg.append("text")
        .attr("x", 0)
        .attr("y", -height / 2 + margin.top)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Percentage of Movies by Country");
});