async function buildPlot(){
    const data = await d3.json("my_weather_data.json");
    const dateParser = d3.timeParse("%Y-%m-%d");
    console.table(data);
    const width = document.querySelector("body").clientWidth;
    var dimension = {
        width: width,
        height: width*0.4,
        margin: {
            left: 100,
            right: 30,
            top: 60,
            bottom: 30
        }
    };

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg").attr("viewBox", [0, 0, dimension.width, dimension.height]);

    const x_scale = d3.scaleTime().range([dimension.margin.left, dimension.width - dimension.margin.right]);
    const y_scale = d3.scaleLinear()
        .range([dimension.height - dimension.margin.bottom - dimension.margin.top, dimension.margin.top]);

    const x_label = "Time";
    const y_label = "Temperatures";

    // add y label
    svg
        .append("text")
        .attr("text-anchor", "middle")
        .attr(
            "transform",
            `translate(${dimension.margin.left - 60}, ${
                (dimension.height - dimension.margin.top - dimension.margin.bottom + 180) / 2
            }) rotate(-90)`
        )
        .style("font-size", "24px")
        .text(y_label);
    // add x label
    svg
        .append("text")
        .attr("class", "svg_title")
        .attr("x", (dimension.width - dimension.margin.right + dimension.margin.left) / 2)
        .attr("y", dimension.height - dimension.margin.bottom - dimension.margin.top + 60)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .text(x_label);


    const minTemp = (d) => d.temperatureMin;
    const highTemp = (d) => d.temperatureHigh;
    const dates = (d) => dateParser(d.date);

    const yAxismin = d3.scaleLinear()
        .domain(d3.extent(data,minTemp))
        .range([dimension.height-120,120]);

    const yAxismax = d3.scaleLinear()
        .domain(d3.extent(data,highTemp))
        .range([dimension.height-120,120]);

    const xAxis = d3.scaleTime()
        .domain(d3.extent(data,dates))
        .range([120, dimension.width-30]);

    var minimal = d3.line()
        .x(d => xAxis(dates(d)))
        .y(d => yAxismin(minTemp(d)));

    var maximal = d3.line()
        .x(d => xAxis(dates(d)))
        .y(d => yAxismax(highTemp(d)));


    ticks = 10

    x_scale.domain(d3.extent(data, dates)).nice(ticks);
    y_scale.domain(d3.extent(data, highTemp)).nice(ticks);

    svg.append('path').attr("fill", "none").attr("stroke", "steelblue")
        .attr("stroke-width", 1).attr('d', minimal(data)).attr('stroke', 'blue');

    svg.append('path').attr("fill", "none").attr("stroke", "steelblue")
        .attr("stroke-width", 1).attr('d', maximal(data)).attr('stroke', 'red');

    const x_axis = d3.axisBottom()
        .scale(x_scale)
        .tickPadding(10)
        .ticks(ticks)
        .tickSize(-dimension.height + dimension.margin.top * 2 + dimension.margin.bottom);


    const y_axis = d3.axisLeft()
        .scale(y_scale)
        .tickPadding(5)
        .ticks(ticks)
        .tickSize(-dimension.width + dimension.margin.left + dimension.margin.right);

    svg
        .append("g")
        .attr("transform", `translate(0,${dimension.height - dimension.margin.bottom - dimension.margin.top})`)
        .call(x_axis);

// add y axis
    svg
        .append("g")
        .attr("transform", `translate(${dimension.margin.left},0)`)
        .call(y_axis);
}
buildPlot();