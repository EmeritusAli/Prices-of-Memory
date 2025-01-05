async function drawChart() {
    let data = await d3.csv('./data.csv', d3.autoType)
    data = data.map(d => {
        return {
            entity: d.Entity,
            code: d.Code,
            year: d.Year,
            flash: d['Historical price of flash memory'],
            memory: d['Historical price of memory'],
            ssd: d['Historical price of solid-state drives'],
            disk: d['Historical price of disk drives'],
        }
    });
    console.log(data);
    const dimentions = {
        width: Math.min(window.innerWidth * 0.6, 1200),
        height: Math.min(window.innerWidth * 0.6, 600),
        margin: {
            top: 20,
            right: 50,
            bottom: 60,
            left: 60,
        },
    };

    dimentions.boundedWidth = dimentions.width - dimentions.margin.left - dimentions.margin.right;
    dimentions.boundedHeight = dimentions.height - dimentions.margin.top - dimentions.margin.bottom;

    const wrapper = d3.select('.map-wrapper')
        .append('svg')
        .attr('width', dimentions.width)
        .attr('height', dimentions.height);

    const bounds = wrapper.append('g')
        .style('transform', `translate(${dimentions.margin.left}px, ${dimentions.margin.top}px)`);

    const xAccessor = d => d.year;

    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, xAccessor))
        .range([0, dimentions.boundedWidth]);

    // const allYValues = data.map(d => d.flash).concat(data.map(d => d.memory)).concat(data.map(d => d.ssd)).concat(data.map(d => d.disk));
    const allPrices = data.flatMap(d => [d.flash, d.memory, d.ssd, d.disk])
                            .filter(price => price !== null && price !== undefined);

    const yScale = d3.scaleLog()  // Changed from scaleLinear to scaleLog
    .domain([
        d3.min(allPrices.filter(price => price > 0)), // Filter out 0 and negative values
        d3.max(allPrices)
    ])
    .range([dimentions.boundedHeight, 0])
    .nice();

    const lineGenerator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(d.value))
        .defined(d => d.value !== null && d.value !== undefined)
        .curve(d3.curveNatural);

    const series = [
        {name: "Memory", key: "memory", color: "#ff6b6b"},
        {name: "Flash", key: "flash", color: "#4ecdc4"},
        {name: "SSD", key: "ssd", color: "#6bff6b"},
        {name: "Disk", key: "disk", color: "#ff6bff"},

    ];

    series.forEach(s => {
        const lineData = data
            .map(d => ({
                year: d.year,
                value: d[s.key]
            }))
            .filter(d => d.value !== null && d.value !== undefined)
            .sort((a, b) => a.year - b.year);

        if (lineData.length > 0) {
            bounds.append('path')
                .attr('d', lineGenerator(lineData))
                .attr('fill', 'none')
                .attr('stroke', s.color)
                .attr('stroke-width', 2);
        }
    });

    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => {
            const format = d3.format('.2s');
            const value = format(d);
            if (value.endsWith('G')) return value.replace('G', 'B');
            if (value.endsWith('T')) return value.replace('T', 'T');
            if (value.endsWith('P')) return value.replace('P', 'Q');
            return value;
        });
    
    const xAxis = d3.axisBottom(xScale)
                       .tickFormat(d3.format('d'));
    
    bounds.append('g')
        .attr('transform', `translate(0, ${dimentions.boundedHeight})`)
        .call(xAxis);
    
    bounds.append('g')
          .call(yAxis);

    
    

    

    

    
  






}

drawChart();