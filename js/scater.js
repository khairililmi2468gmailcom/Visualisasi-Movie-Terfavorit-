const margin = { top: 20, right: 20, bottom: 30, left: 40 };
const width = 1000 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const svg = d3.select("#chart2")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/movies.csv").then(function (data) {
    data.forEach(function (d) {
        d.budget = +d.budget;
        d.gross = +d.gross;
    });
    const x = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.budget; })).nice()
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, function (d) { return d.gross; })).nice()
        .range([height, 0]);

    // tambahkan judul pada grafik
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("Korelasi Anggaran dan Pendapatan");

    // tambahkan sumbu x dan y ke dalam grafik
    svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", margin.bottom - 10)
        .text("Anggaran");

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
        .text("Pendapatan");
    // Menambahkan tooltip
    var tooltip = d3.select("#chart2").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);


    tooltip.append("rect")
        .attr("class", "tooltip-box")
        .attr("width", 100)
        .attr("height", 70)
        .attr("rx", 5)
        .attr("ry", 5);

    tooltip.append("text")
        .attr("class", "tooltip-text")
        .attr("x", 10)
        .attr("y", 20)
        .text("");
    svg.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function (d) { return x(data.budget); })
        .attr("cy", function (d) { return y(data.gross); })
        .on("mouseover", function (d) {
            // Menampilkan tooltip ketika kursor masuk ke dalam lingkaran
            tooltip.transition()
                .duration(200)
                .style("opacity", 1);

            // Mengatur posisi tooltip pada sumbu x dan y
            tooltip.style("left", (d3.event.pageX + 10) + "px")
                .style("top", (d3.event.pageY - 28) + "px");

            // Menambahkan teks pada tooltip
            tooltip.html("Judul Film: " + "Korelasi Anggaran dengan Pendapatan" + "<br>" +
                "Anggaran: " + d.budget + "<br>" +
                "Pendapatan: " + d.gross);
        })
        .on("mouseout", function (d) {
            // Menyembunyikan tooltip ketika kursor keluar dari lingkaran
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .transition() // menambahkan transisi
        .duration(1000) // durasi transisi 1000 ms (1 detik)
        .attr("cx", function (d) { return x(d.budget); })
        .attr("cy", function (d) { return y(d.gross); });


});
