function draw_histogram() {
  var chartDiv = document.getElementById("chart");
  //var chartDiv2 = document.getElementById("chart2");
  var svg = d3.select(chartDiv).append("svg");
  var width = 960;
  var height = 500;
  var margin = { top: 40, right: 40, bottom: 0, left: 80 };
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  // set the ranges
  var x = d3
    .scaleLinear()
    .domain([2006, 2019])
    .range([0, width]);

  var y = d3
    .scaleLinear()
    .domain([0, 35])
    .range([height - margin.top, 0]);

  // set the parameters for the histogram
  var histogram = d3
    .histogram()

    .value(d => d.Year)
    .domain(x.domain())
    .thresholds(x.ticks(12));

  // Use the extracted size to set the size of an SVG element.
  svg
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  //tail of arrow for fact 1
  svg
    .append("line")
    .attr("x1", 311) //<<== change code here
    .attr("y1", 40)
    .attr("x2", 311) //<<== and here
    .attr("y2", 140)
    .attr("id", "f1_line")
    .style("stroke-width", 3)
    .style("stroke", "purple")
    .style("fill", "none")
    .style("opacity", 0);

  // pointy head of arrow for fact 1
  svg
    .append("path")
    .attr("d", "M 311,145 L 316 135 L 306 135") //<<== and here
    .attr("id", "f1_head")
    .style("fill", "purple")
    .style("opacity", 0);

  //tail of arrow for fact 2
  svg
    .append("line")
    .attr("x1", 631) //<<== change code here
    .attr("y1", 50)
    .attr("x2", 631) //<<== and here
    .attr("y2", 150)
    .attr("id", "f2_line")
    .style("stroke-width", 3)
    .style("stroke", "purple")
    .style("fill", "none")
    .style("opacity", 0);

  // pointy head of arrow for fact 2
  svg
    .append("path")
    .attr("d", "M 631,155 L 636 145 L 626 145") //<<== and here
    .attr("id", "f2_head")
    .style("fill", "purple")
    .style("opacity", 0);

  //tail of arrow for fact 2
  svg
    .append("line")
    .attr("x1", 751) //<<== change your code here
    .attr("y1", 50)
    .attr("x2", 751) //<<== and here
    .attr("y2", 150)
    .attr("id", "f3_line")
    .style("stroke-width", 3)
    .style("stroke", "purple")
    .style("fill", "none")
    .style("opacity", 0);

  // pointy head of arrow for fact 3
  svg
    .append("path")
    .attr("d", "M 751,155 L 756 145 L 746 145")
    .attr("id", "f3_head")
    .style("fill", "purple")
    .style("opacity", 0);

  //loading the data
  d3.json("slide2.json").then(data => {
    data.forEach(d => {
      d.Year = +d.Year;
      d.PrimaryGrade = +d.PrimaryGrade.slice(0, -1);
    });

    // group the data for the bars
    var bins = histogram(data);

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
        .style("stroke", "black")
        .style("opacity", 0.8);
    };
    var mousemove = function(d) {
      Tooltip.html(
        "Year: " +
          d[0].Year +
          "<br> Bullying indicator: " +
          d[0].PrimaryGrade +
          "%"
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

    //reseting the location of window temporarty so it doesnt stuck
    function setHash(newHash) {
      location.hash = "someHashThatDoesntExist";
      location.hash = newHash;
    }

    //bin click to move the location of page and set the year selection
    var binClick = function(d) {
      setHash("chart2");
      yearSelection(d.x0);
    };
    //Create bins of histogram and bind it to data
    //and reposition them using the transform method
    svg
      .selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", margin.left)
      .attr("transform", function(d) {
        return "translate(" + x(d.x0) + "," + y(d[0].PrimaryGrade) + ")";
      })
      .attr("width", function(d) {
        return x(d.x1) - x(d.x0) - 1;
      })
      .attr("height", function(d, i) {
        return height - y(d[0].PrimaryGrade);
      })
      .on("mouseover", mouseover) //tooltip mouseover
      .on("mousemove", mousemove) //tooltip mousemove with provides the data
      .on("mouseleave", mouseleave) // tooltip mouseleave
      .on("click", binClick); //Clicking each bin directs the user to stacked bar chart

    // add the x Axis
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(" + margin.left + "," + height + ")")
      .call(d3.axisBottom(x));

    // add the y Axis
    svg
      .append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + margin.left + " ," + margin.top + ")")
      .call(d3.axisLeft(y));
  });
}
draw_histogram();

function yearSelection(year) {
  document.getElementById("year").value = year;
  d3.csv("data.csv").then(d => {});
}

d3.csv("data.csv").then(d => {
  console.log(d[0]), chart(d);
});

function chart(csv) {
  //keys for each stacked bar
  var keys = csv.columns.slice(2);

  var year = [...new Set(csv.map(d => d.Year))];
  var states = [...new Set(csv.map(d => d.State))];

  var options = d3
    .select("#year")
    .selectAll("option")
    .data(year)
    .enter()
    .append("option")
    .text(d => d);

  // defining the size and margine of svg
  var svg = d3.select("#chart2"),
    margin = { top: 35, left: 75, bottom: 0, right: 0 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

  //constructs a new scale for x-axis with specific domain and range and center alignment
  var x = d3
    .scaleBand()
    .range([margin.left, width - margin.right])
    .padding(0.1);

  var y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);

  var xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis");

  var yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis");

  //Binding each stack of each bar chart to a colour
  var z = d3
    .scaleOrdinal()
    .range(["steelblue", "darkgray", "lightblue"])
    .domain(keys);

  // updating the values of stacked bar chart if a change happens
  update(d3.select("#year").property("value"), 0);
  function update(input, speed) {
    var data = csv.filter(f => f.Year == input);

    data.forEach(function(d) {
      d.total = d3.sum(keys, k => +d[k]);
      return d;
    });

    y.domain([0, d3.max(data, d => d3.sum(keys, k => +d[k]))]).nice();

    svg
      .selectAll(".y-axis")
      .transition()
      .duration(speed)
      .call(d3.axisLeft(y).ticks(null, "s"));

    data.sort(
      d3.select("#sort").property("checked")
        ? (a, b) => b.BI - a.BI
        : (a, b) => states.indexOf(a.State) - states.indexOf(b.State)
    );

    x.domain(data.map(d => d.State));

    svg
      .selectAll(".x-axis")
      .transition()
      .duration(speed)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    var group = svg
      .selectAll("g.layer")
      .data(d3.stack().keys(keys)(data), d => d.key);

    group.exit().remove();

    group
      .enter()
      .append("g")
      .classed("layer", true)
      .attr("fill", d => z(d.key));

    var bars = svg
      .selectAll("g.layer")
      .selectAll("rect")
      .data(d => d, e => e.data.State);

    bars.exit().remove();

    bars
      .enter()
      .append("rect")
      .attr("width", x.bandwidth())
      .merge(bars)
      .transition()
      .duration(speed)
      .attr("x", d => x(d.data.State))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]));

    var text = svg.selectAll(".text").data(data, d => d.State);

    text.exit().remove();

    text
      .enter()
      .append("text")
      .attr("class", "text")
      .attr("text-anchor", "middle")
      .merge(text)
      .transition()
      .duration(speed)
      .attr("x", d => x(d.State) + x.bandwidth() / 2)
      .attr("y", d => y(d.BI) - 5)
      .text(d => d.BI);
  }

  var select = d3.select("#year").on("change", function() {
    update(this.value, 750);
  });

  var checkbox = d3.select("#sort").on("click", function() {
    update(select.property("value"), 750);
  });
}

function chart2(csv, fact) {
  var keys = csv.columns.slice(2);

  var year = [...new Set(csv.map(d => d.Year))];
  var states = [...new Set(csv.map(d => d.State))];

  var options = d3
    .select("#year")
    .selectAll("option")
    .data(year)
    .enter()
    .append("option")
    .text(d => d);

  var svg = d3.select("#chart2"),
    margin = { top: 35, left: 35, bottom: 0, right: 0 },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

  var x = d3
    .scaleBand()
    .range([margin.left, width - margin.right])
    .padding(0.1);

  var y = d3.scaleLinear().rangeRound([height - margin.bottom, margin.top]);

  var xAxis = svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .attr("class", "x-axis");

  var yAxis = svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .attr("class", "y-axis");

  var z = d3
    .scaleOrdinal()
    .range(["steelblue", "darkorange", "lightblue"])
    .domain(keys);

  var input = fact == "" ? this.value : fact;
  update(input, 0);
  // update the stacked bar chart each time is invoked
  //with the data and speed of transition
  function update(input, speed) {
    var data = csv.filter(f => f.Year == input);

    data.forEach(function(d) {
      d.total = d3.sum(keys, k => +d[k]);
      return d;
    });

    y.domain([0, d3.max(data, d => d3.sum(keys, k => +d[k]))]).nice();

    svg
      .selectAll(".y-axis")
      .transition()
      .duration(speed)
      .call(d3.axisLeft(y).ticks(null, "s"));

    data.sort(
      d3.select("#sort").property("checked")
        ? (a, b) => b.BI - a.BI
        : (a, b) => states.indexOf(a.State) - states.indexOf(b.State)
    );

    x.domain(data.map(d => d.State));

    svg
      .selectAll(".x-axis")
      .transition()
      .duration(speed)
      .call(d3.axisBottom(x).tickSizeOuter(0));

    var group = svg
      .selectAll("g.layer")
      .data(d3.stack().keys(keys)(data), d => d.key);

    group.exit().remove();

    group
      .enter()
      .append("g")
      .classed("layer", true)
      .attr("fill", d => z(d.key));

    var bars = svg
      .selectAll("g.layer")
      .selectAll("rect")
      .data(d => d, e => e.data.State);

    bars.exit().remove();

    bars
      .enter()
      .append("rect")
      .attr("width", x.bandwidth())
      .merge(bars)
      .transition()
      .duration(speed)
      .attr("x", d => x(d.data.State))
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]));

    var text = svg.selectAll(".text").data(data, d => d.State);

    text.exit().remove();

    text
      .enter()
      .append("text")
      .attr("class", "text")
      .attr("text-anchor", "middle")
      .merge(text)
      .transition()
      .duration(speed)
      .attr("x", d => x(d.State) + x.bandwidth() / 2)
      .attr("y", d => y(d.BI) - 5)
      .text(d => d.BI);
  }

  var select = d3.select("#year").on("change", function() {
    update(this.value, 750);
  });

  var checkbox = d3.select("#sort").on("click", function() {
    update(select.property("value"), 750);
  });
}
// invoke fact 3 element and reveal the arrow
function revealFact3(idElement) {
  d3.select("#f" + idElement + "_line").style("opacity", 1);
  d3.select("#f" + idElement + "_head").style("opacity", 1);
  document.getElementById("f" + idElement.toString()).innerHTML =
    "<a href='#' onclick=" +
    "resetFact(" +
    idElement +
    ");" +
    ">In contrast to Male and Female, other Genders are very vulnerable to get bullied. In 2016, the ratio of other gender were even higher than Aboriginal children.</a>";
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
    ">Being a girl or a boy does not bring any protection from getting bullied. The largest difference between proportion of girls and boys being bullied is only 1.6% in 2014. </a>";
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
    ">Aboriginal children are more prone to get bullied than any other race. At its highest 1/3 of Aboriginal children reported of getting bullied in 2009.</a>";
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
