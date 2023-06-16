
// Mengambil data dari file CSV
d3.csv("data/movies.csv")
    .then(function (data) {
        // Menghitung jumlah film untuk setiap genre
        var genres = {};
        data.forEach(function (d) {
            if (d.genre in genres) {
                genres[d.genre] += 1;
            } else {
                genres[d.genre] = 1;
            }
        });

        const margin = {
            top: 80,
            right: 30,
            bottom: 70,
            left: 90,
        },
            width = 800 - margin.left - margin.right,
            height = 650 - margin.top - margin.bottom;

        // Membuat elemen svg dan menambahkan ke dalam body html
        var svg = d3
            .select("#my_dataviz")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Mengurutkan genre berdasarkan jumlah film
        var sortedGenres = Object.keys(genres).sort(function (a, b) {
            return genres[b] - genres[a];
        });

        // Mengambil 10 genre teratas
        var topGenres = sortedGenres.slice(0, 10);

        // Menyiapkan data untuk bar chart
        var chartData = [];
        topGenres.forEach(function (genre) {
            chartData.push({
                genre: genre,
                count: genres[genre],
            });
        });

        // Membuat skala sumbu x
        var x = d3
            .scaleBand()
            .domain(
                chartData.map(function (d) {
                    return d.genre;
                })
            )
            .range([0, width])
            .padding(0.1);
        // Menambahkan label sumbu x
        svg
            .append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", "0.35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start")
            .style("font-size", "15px");

        // Membuat skala sumbu y
        var y = d3
            .scaleLinear()
            .domain([
                0,
                d3.max(chartData, function (d) {
                    return d.count;
                }),
            ])
            .range([height, 0]);
        // Menambahkan label sumbu y
        svg
            .append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("font-size", "18px");

        // Membuat elemen rect untuk setiap genre dalam dataset
        // Mengambil elemen rect untuk setiap genre dalam dataset
        var bars = svg
            .selectAll("rect")
            .data(chartData)
            .join("rect")
            .attr("x", function (d) {
                return x(d.genre);
            })
            .attr("y", function (d) {
                return y(d.count);
            })
            .attr("width", x.bandwidth())
            .attr("height", function (d) {
                return height - y(d.count);
            })
            .attr("fill", "#69b3a2")
            .append("title")
            .text(function (d) {
                return d.genre + "; " + d.count + " movies";
            });

        // Memberikan transisi pada elemen rect
        bars.transition()
            .duration(1000)
            .attr("y", function (d) {
                return y(d.count);
            })
            .attr("height", function (d) {
                return height - y(d.count);
            });






        // Menambahkan judul chart
        svg
            .append("text")
            .attr("x", width / 2)
            .attr("y", -20)
            .attr("text-anchor", "middle")
            .style("font-size", "20px")
            .style("font-weight", "bold")
            .text("10 Genre Teratas dengan Jumlah Film Terbanyak");
    })
    .catch(function (error) {
        console.log(error);
    });