// The margine of chart
var margin = { top: 40, right: 80, bottom: 30, left: 50 },
  width = 960 - margin.left - margin.right, // width of chart
  height = 500 - margin.top - margin.bottom; // height of chart

//x-axis scale
var x = d3.scaleLinear().range([0, width]);

//y-axis scale
var y = d3.scaleLinear().range([height, 0]);

// init xAsis with number of ticks based on number of our data
var xAxis = d3.axisBottom(width).tickFormat(function(d) {
  return d.x;
});

//init y-axis
var yAxis = d3.axisLeft(height);
//Defining the first line in graph for primary grade
var line = d3
  .line()
  .x(function(d) {
    return x(d.Year);
  })
  .y(function(d) {
    return y(d.PrimaryGrade);
  });

//Defining the second line in graph for primary grade
var line2 = d3
  .line()
  .x(function(d) {
    return x(d.Year);
  })
  .y(function(d) {
    return y(d.SecondaryGrade);
  });

// SVG element in virtual dom
var svg = d3
  .select("#div_template")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Tooltip for chart
var Tooltip = d3
  .select("#div_template")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("position", "absolute")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px");

//Mouseover for tooltip
var mouseover = function(d) {
  Tooltip.style("opacity", 1);
  d3.select(this)
    .style("stroke", "black")
    .style("opacity", 1);
};
//MouseMove for tooltip for primary line
var mousemove = function(d) {
  Tooltip.html(
    "Year: " + d.Year + "<br> Bullying indicator: " + d.PrimaryGrade + "%"
  )
    .style("left", d3.event.pageX + "px")
    .style("top", d3.event.pageY - 70 + "px");
};
//MouseMove for tooltip for secondary line
var mousemove1 = function(d) {
  Tooltip.html(
    "Year: " + d.Year + "<br> Bullying indicator: " + d.SecondaryGrade + "%"
  )
    .style("left", d3.event.pageX + "px")
    .style("top", d3.event.pageY - 70 + "px");
};
//Mouse leave function for tooltip
var mouseleave = function(d) {
  Tooltip.style("opacity", 0);
  d3.select(this)
    .style("stroke", "none")
    .style("opacity", 0.9);
};
//tail of arrow for fact 2
svg
  .append("line")
  .attr("x1", 691) //<<== change your code here
  .attr("y1", 100)
  .attr("x2", 691) //<<== and here
  .attr("y2", 150)
  .attr("id", "f2_line")
  .style("stroke-width", 3)
  .style("stroke", "purple")
  .style("fill", "none")
  .style("opacity", 0);
// head of arrow for fact 2
svg
  .append("path")
  .attr("d", "M 691,155 L 696 145 L 686 145")
  .attr("id", "f2_head")
  .style("fill", "purple")
  .style("opacity", 0);

//tail of arrow for fact 3
svg
  .append("line")
  .attr("x1", 761) //<<== change your code here
  .attr("y1", 55)
  .attr("x2", 761) //<<== and here
  .attr("y2", 105)
  .attr("id", "f3_line")
  .style("stroke-width", 3)
  .style("stroke", "purple")
  .style("fill", "none")
  .style("opacity", 0);

// pointy head of arrow for fact 3
svg
  .append("path")
  .attr("d", "M 761,111 L 766 101 L 756 101") //<<== change your code here
  .attr("id", "f3_head")
  .style("fill", "purple")
  .style("opacity", 0);

//tail of arrow for fact 1
svg
  .append("line")
  .attr("x1", 277) //<<== change your code here
  .attr("y1", 55)
  .attr("x2", 277) //<<== and here
  .attr("y2", 95)
  .attr("id", "f1_line")
  .style("stroke-width", 3)
  .style("stroke", "purple")
  .style("fill", "none")
  .style("opacity", 0);

// pointy head of arrow for fact 1
svg
  .append("path")
  .attr("d", "M 277,101 L 282 91 L 272 91") //<<== change your code here
  .attr("id", "f1_head")
  .style("fill", "purple")
  .style("opacity", 0);

//Loading the json file and converting the string to number and removing the percentage sign
d3.json("data.json").then(data => {
  data.forEach(d => {
    d.Year = +d.Year;
    d.PrimaryGrade = +d.PrimaryGrade.slice(0, -1);
    d.SecondaryGrade = +d.SecondaryGrade.slice(0, -1);
  });
  //x-axis domain, extend returns the min and max value in natural order inside the array
  x.domain(
    d3.extent(data, function(d) {
      return d.Year;
    })
  );

  //y-asix domain
  y.domain([
    0,
    d3.max(data, function(d) {
      return Math.max(d.PrimaryGrade, d.SecondaryGrade);
    })
  ]);

  //creates a path element in svg inside DOM
  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "blue")
    .attr("d", line);

  //creates a path element in svg inside DOM
  svg
    .append("path")
    .data([data])
    .attr("class", "line")
    .style("stroke", "red")
    .attr("d", line2);

  //creates a circles elements and bind it to data in svg inside DOM
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d) {
      return x(d.Year);
    })
    .attr("cy", function(d) {
      return y(d.PrimaryGrade);
    })
    .attr("r", 5)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  svg
    .selectAll(".dot2")
    .data(data)
    .enter()
    .append("circle") // Uses the enter().append() method
    .attr("class", "dot") // Assign a class for styling
    .attr("cx", function(d) {
      return x(d.Year);
    })
    .attr("cy", function(d) {
      return y(d.SecondaryGrade);
    })
    .attr("r", 5)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove1)
    .on("mouseleave", mouseleave);

  // 3. Call the x axis in a group tag
  svg
    .append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  // x axis label
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (width - 10) + " ," + (height + margin.top - 50) + ")"
    )
    .style("text-anchor", "middle")
    .attr("font-weight", 900)
    .text("Year");

  // 4. Call the y axis in a group tag
  svg
    .append("g")
    .attr("class", "y axis")
    .call(d3.axisLeft(y));
  // y-axis label
  svg
    .append("text")
    .attr("transform", "translate(" + 20 + " ," + -10 + ")")
    .style("text-anchor", "middle")
    .attr("font-weight", 900)
    .text("Bullying Indicator");
  // secondary grade line label
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (width - 50) + "," + y(data[0].SecondaryGrade) + ")"
    )
    .attr("dy", 145)
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("Secondary Grade");
  svg
    .append("text")
    .attr(
      "transform",
      "translate(" + (width - 50) + "," + y(data[0].PrimaryGrade) + ")"
    )
    .attr("dy", 165)
    .attr("text-anchor", "start")
    .style("fill", "blue")
    .text("Primary Grade");
});
// invoke fact 3 element and reveal the arrow
function revealFact3(idElement) {
  d3.select("#f" + idElement + "_line").style("opacity", 1);
  d3.select("#f" + idElement + "_head").style("opacity", 1);
  document.getElementById("f" + idElement.toString()).innerHTML =
    "<a href='#' onclick=" +
    "resetFact(" +
    idElement +
    ");" +
    ">Same-sex Marriage becomes legal in state of victoria</a>";
}
// invoke fact 2 element and reveal the arrow

function revealFact2(idElement) {
  d3.select("#f" + idElement + "_line").style("opacity", 1);
  d3.select("#f" + idElement + "_head").style("opacity", 1);
  document.getElementById("f" + idElement.toString()).innerHTML =
    "<a href='#' onclick=" +
    "resetFact(" +
    idElement +
    ");" +
    ">Atos Survey structre has been updated and other-gender category was introduced as a separate category in sex gender</a>";
}
// invoke fact 1 element and reveal the arrow

function revealFact1(idElement) {
  d3.select("#f" + idElement + "_line").style("opacity", 1);
  d3.select("#f" + idElement + "_head").style("opacity", 1);
  document.getElementById("f" + idElement.toString()).innerHTML =
    "<a href='#' onclick=" +
    "resetFact(" +
    idElement +
    ");" +
    ">New category introduced to differentiate between aboriginal and non-aboriginal children</a>";
}
//reset the facts
function resetFact(idElement) {
  d3.select("#f" + idElement + "_line").style("opacity", 0);
  d3.select("#f" + idElement + "_head").style("opacity", 0);
  document.getElementById("f" + idElement.toString()).innerHTML =
    "<a href='#' onclick=" +
    "revealFact" +
    idElement +
    "(" +
    idElement +
    ");" +
    ">Fact " +
    idElement +
    "</a>";
}
