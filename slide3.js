//Setting the margine and size of graph
const margin = { top: 40, right: 50, bottom: 40, left: 50 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

//x-axis scale
const xScale = d3.scaleLinear().range([0, width]);
//y-axis scale
const yScale = d3.scaleLinear().range([height, 0]);
//init x-axis with the scale
const xAxis = d3.axisBottom(xScale);
//init y-axis with the scale
const yAxis = d3.axisLeft(yScale);

// Creating svg element
const svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
//loading data
d3.json("scatterplot.json").then(data => {
  data.forEach(d => {
    d.Bullying = +d.Bullying.slice(0, -1);
    d.Connected = +d.Connected.slice(0, -1);
  });
  //Finding the min and max of array and return for domain
  //of x-axis scale and y-axis scale
  xScale.domain(d3.extent(data, d => d.Bullying)).nice();
  yScale.domain(d3.extent(data, d => d.Connected)).nice();

  // x-axis
  svg
    .append("g")
    .attr("class", "xaxis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
  svg
    .append("text")
    .attr("transform", "translate(" + (width - 30) + " ," + (height + 35) + ")")
    .style("text-anchor", "middle")
    .attr("font-weight", 900)
    .text("Bullying indicator%");

  // y-axis
  svg
    .append("g")
    .attr("class", "yaxis")
    .call(yAxis);

  svg
    .append("text")
    .attr("transform", "translate(" + 35 + " ," + -10 + ")")
    .style("text-anchor", "middle")
    .attr("font-weight", 700)
    .text("Connected Indicator%");
  //tooltip
  var Tooltip = d3
    .select("#chart")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("position", "absolute")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

  var mouseover = function(d) {
    Tooltip.style("opacity", 1);
    d3.select(this)
      .style("stroke", "blue")
      .style("opacity", 1);
  };
  //appending data for the tooltip
  var mousemove = function(d) {
    Tooltip.html(
      "Suburb: " + d.Council + "<br> Bullying indicator: " + d.Bullying + "%"
    )
      .style("left", d3.event.pageX + "px")
      .style("top", d3.event.pageY - 70 + "px");
  };

  var mouseleave = function(d) {
    Tooltip.style("opacity", 0);
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 1);
  };

  // plot points
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("r", 10.5)
    .attr("cx", d => xScale(d.Bullying))
    .attr("cy", d => yScale(d.Connected))
    .style("fill", "steelblue")
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);
});
