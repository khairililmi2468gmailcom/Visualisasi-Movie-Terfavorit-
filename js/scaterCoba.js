

// Load data CSV
d3.csv('data/movies.csv').then(data => {
    // Konversi tipe data
    data.forEach(d => {
        d.budget = +d.budget;
        d.gross = +d.gross;
    });
    // Lebar dan tinggi chart
    const margin = {
        top: 80,
        right: 30,
        bottom: 70,
        left: 90,
    },
        width = 1200 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    // Lebar dan tinggi chart yang sebenarnya
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // SVG container
    const svg = d3.select('#chart2')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Chart container
    const chart = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    // Skala sumbu x
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.gross)])
        .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.budget)])
        .range([chartHeight, 0]);


    // Buat sumbu x
    const xAxis = d3.axisBottom(xScale);
    chart.append('g')
        .attr('transform', `translate(0, ${chartHeight})`)
        .call(xAxis);

    // Buat sumbu y
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => '$' + d + 'B')
        // .tickSize(-width + 50)
        ;
    // tambahkan padding 50 pixel di sisi kanan sumbu y
    svg.append('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(${margin.left}, ${margin.top})`)
        .call(yAxis);
    // Tambahkan data point ke chart
    chart.selectAll('.dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'dot')
        .attr('cx', d => xScale(d.gross))
        .attr('cy', d => yScale(d.budget))
        .attr('r', 5)
        .attr('fill', '#69b3a2')
        ;
    // tambahkan judul pada grafik
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("Korelasi Anggaran dan Pendapatan");


    // Tambahkan tooltip
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);

    // Tambahkan interaksi untuk menampilkan tooltip pada scatter plot
    svg.selectAll('circle')
        .on('mouseover', function (event, d) {

            tooltip.transition()
                .duration(200)
                .style("opacity", 1);
            const tooltipText = `gross: ${d.gross} <br>badget: ${d.budget}`;
            tooltip.html(tooltipText)

                .style('left', (event.pageX + 10) + 'px')
                .style('top', (event.pageY - 30) + 'px')
                .style('opacity', 0.9);
        })
        .on('mouseout', function () {

            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        })
        .transition() // menambahkan transisi
        .duration(1000) // durasi transisi 1000 ms (1 detik)
        .attr("cx", function (d) { return x(d.gross); })
        .attr("cy", function (d) { return y(d.budget); });
});