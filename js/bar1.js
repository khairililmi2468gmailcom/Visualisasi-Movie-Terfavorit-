d3.csv("data/movies.csv").then(function (data) {
    // ambil data rating dan score
    var ratingData = [];
    data.forEach(function (d) {
        var rating = d["rating"];
        var score = +d["score"];
        if (!rating) {
            rating = "no rating";
        }
        ratingData.push({
            rating: rating,
            score: score
        });
    });

    // buat object untuk menyimpan hasil aggregasi
    var result = {};

    // lakukan loop pada setiap data rating dan score
    ratingData.forEach(function (d) {
        if (!result[d.rating]) {
            result[d.rating] = 0;
        }
        result[d.rating] += d.score;
    });

    // konversi data yang telah diolah ke dalam format array
    var resultArray = [];
    Object.keys(result).forEach(function (key) {
        resultArray.push({
            rating: key,
            score: result[key]
        });
    });

    // urutkan data berdasarkan score
    resultArray.sort(function (a, b) {
        return b.score - a.score;
    });

    // ambil data rating dan score untuk pembuatan chart
    var rating = [];
    var score = [];
    resultArray.forEach(function (d) {
        rating.push(d.rating);
        score.push(d.score);
    });

    // tentukan ukuran grafik
    var margin = {
        top: 20,
        right: 30,
        bottom: 30,
        left: 200
    };
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    // tentukan skala untuk sumbu x dan y
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(rating);
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(score)]);

    // buat grafik batang
    var svg = d3.select("#chart1").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // tentukan warna untuk setiap batang
    var color = d3.scaleOrdinal()
        .domain(rating)
        .range(d3.schemeCategory10);
    // tentukan skala untuk sumbu x dan y
    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1)
        .domain(rating);
    var y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(score)])
        .nice();

    // tambahkan batang ke dalam grafik
    svg.selectAll(".bar")
        .data(resultArray)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.rating);
        })
        .attr("width", x.bandwidth())
        .attr("y", height)
        .attr("height", 0)
        // animasikan pergerakan batang
        .transition()
        .duration(1000)
        .delay(function (d, i) {
            return i * 100;
        })
        .attr("y", function (d) {
            return y(d.score);
        })
        .attr("height", function (d) {
            return height - y(d.score);
        })
        .attr("fill", function (d) {
            return color(d.rating);
        });


    // tambahkan sumbu x dan y ke dalam grafik
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 10)
        .text("Rating");

    svg.append("g")
        .attr("class", "axis y-axis")
        .call(d3.axisLeft(y).ticks(12))
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", 0 - (height / 2))
        .attr("y", 0 + margin.left)
        .attr("dy", "1em")
        .style('text-anchor', 'middle')
        .text("Total Score");

    // tambahkan judul pada grafik
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("Top Movies by Rating");


    // Membuat tooltip
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("background-color", "white")
        .style("padding", "10px")
        .style("border", "1px solid black")
        .style("opacity", 0);
    // Menambahkan event mouseover pada bar chart
    svg.selectAll(".bar")
        .on("mouseover", function (event, d) {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html("Rating: " + d.rating + "<br>" + "Score: " + d.score)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", function (d, event) {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });


});

