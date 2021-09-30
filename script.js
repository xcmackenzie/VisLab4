
d3.csv('wealth-health-2014.csv', d3.autoType).then(data => {
    console.log(data)

    let outerWidth = 650
    let outerHeight = 500
    let margin = {top: 30, bottom: 30, left: 30, right: 30}
    let width = outerWidth - margin.left - margin.right
    let height = outerHeight - margin.top - margin.bottom

    let regions = new Set(data.map(d => d.Region))

    // Create SVG
    let svg = d3.select(".chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left}, ${margin.right})`)

    let incomeMin = d3.min(data, data => data.Income)
    let incomeMax = d3.max(data, data => data.Income)

    // Scales
    let xScale = d3.scaleLinear()
        .domain([incomeMin, incomeMax])
        .range([0, width])
    
    console.log(xScale(incomeMax))

    let yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.LifeExpectancy))
        .range([height, 0])

    let colorScale = d3.scaleOrdinal(d3.schemeTableau10)
        .domain(regions)

    let radiusScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.Population))
        .range([5, 25])

    // Axes
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5, "s")

    const yAxis = d3.axisLeft()
        .scale(yScale)

    svg.append("g")
        .attr("class", "axis x-axis")
        .call(xAxis)
        .attr("transform", `translate(0, ${height})`)

    svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis)

    // Circles
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr('cx', d => xScale(d.Income))
        .attr('cy', d => yScale(d.LifeExpectancy))
        .attr("r", d => radiusScale(d.Population))
        .attr("fill", d => colorScale(d.Region))
        .attr("opacity", "60%")
        .attr("stroke", "black")
        .on("mouseenter", (event, d) => {
            let pos = d3.pointer(event, window)

            d3.select(".tooltip")
                .style('left', pos[0] + 10)
                .style('top', pos[1] + 10)
                .html(
                `Country: ${d.Country} <br>
                Region: ${d.Region} <br>
                Population: ${d3.format(",")(d.Population)} <br>
                Income: ${d3.format(",")(d.Income)} <br>
                LifeExpectancy: ${d3.format(",.2f")(d.LifeExpectancy)}`
                )
            
            d3.select('.tooltip').style('display', 'block')
            
        })
        .on("mouseleave", (event, d) => {
            d3.select('.tooltip').style('display', 'none')
        })

    // Axis Labels
    svg.append("text")
        .attr('x', width)
        .attr('y', height - 5)
        .attr('text-anchor', 'end')
        .text("Income")

    svg.append("text")
        .attr('x', 10)
        .attr('y', 0)
        .attr('writing-mode', 'vertical-lr')
        .text("Life Expectancy")

    // Legend and labels
    svg.append('g')
        .attr('class', 'legend')
        .selectAll('rect')
        .data(regions)
        .enter()
        .append('rect')
        .attr('x', width - 150)
        .attr('y', (d, i) => 400 - i * (20))
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', d => colorScale(d))

    svg.append('g')
        .attr('class', 'legend-labels')
        .selectAll('labels')
        .data(regions)
        .enter()
        .append('text')
        .attr('x', width - 150 + 15 * 1.2)
        .attr('y', (d, i) => 400 - i * (20) + 12)
        .text(d => d)
})