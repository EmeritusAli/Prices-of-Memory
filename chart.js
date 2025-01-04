async function drawChart() {
    const data = await d3.csv('./data.csv', d3.autoType);
//     console.log(data);
    const dimentions = {
        width: Math.min(window.innerWidth * 0.6, 900),
        height: Math.min(window.innerWidth * 0.6, 900),
        margin: {
            top: 20,
            right: 50,
            bottom: 50,
            left: 20,
        },
    };

    dimentions.boundedWidth = dimentions.width - dimentions.margin.left - dimentions.margin.right;
    dimentions.boundedHeight = dimentions.height - dimentions.margin.top - dimentions.margin.bottom;

    const wrapper = d3.select('#wrapper')
        .append('svg')
        .attr('width', dimentions.width)
        .attr('height', dimentions.height);

    
  






}

drawChart();