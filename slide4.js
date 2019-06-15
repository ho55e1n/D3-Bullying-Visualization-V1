draw_bubbles("bad bubble.json", "Worst Suburbs", "#chart");
draw_bubbles("good bubble.json", "Best Suburbs", "#chart2");

function draw_bubbles(filename, title, divID) {
  d3.json(filename).then(data => {
    data.forEach(d => {
      // d.Year = +d.Year;
      // d.PrimaryGrade = +d.PrimaryGrade.slice(0, -1);
      // d.SecondaryGrade = +d.SecondaryGrade.slice(0, -1);
    });
    dataset = data[0];
    console.log("data,", data[0]);
    console.log("dataset,", dataset);
    console.log("equal", dataset == data[0]);

    var margin = { top: 40, right: 80, bottom: 30, left: 50 },
      width = 500 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    console.log("d3.schemePaired ==> ", d3.schemePaired);

    var color = d3.scaleOrdinal(d3.schemePaired);

    var bubble = d3
      .pack(dataset)
      .size([width, height])
      .padding(1.5);

    var svg = d3
      .select(divID)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .attr("class", "bubble");

    var Tooltip = d3
      .select(divID)
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("background-color", "white")
      .style("position", "fixed")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "5px");

    //Mouseover for tooltip
    var mouseover = function(d) {
      Tooltip.style("opacity", 1);
      d3.select(this)
        .style("stroke", "black")
        .style("opacity", 0.4);
    };
    var mousemove = function(d) {
      Tooltip.html(
        "Name: " +
          d.data.name +
          "<br> Ranking Occurance: " +
          d.data.Count +
          "<br> Grade: " +
          d.data.Grade +
          "<br> Area type: " +
          d.data["Area type"]
      )
        .style("left", d3.event.pageX + 50 + "px")
        .style("top", d3.event.pageY - 100 + "px");
    };

    var mouseleave = function(d) {
      Tooltip.style("opacity", 0);
      d3.select(this)
        .style("stroke", "none")
        .style("opacity", 0.9);
    };

    svg
      .append("line")
      .attr("x1", 0) //<<== change your code here
      .attr("y1", 35)
      .attr("x2", 321) //<<== and here
      .attr("y2", 35)
      .attr("id", "f1_line")
      .style("stroke-width", 3)
      .style("stroke", "black")
      .style("fill", "none")
      .style("opacity", 1);

    svg
      .append("text")
      .attr("transform", "translate(" + width / 2 + " ," + 25 + ")")
      .style("text-anchor", "middle")
      .attr("font-weight", 900)
      .text(title);
    var nodes = d3
      .hierarchy(dataset)
      .sum(function(d) {
        return d.Count;
      })
      .sort(function(a, b) {
        return b.Count - a.Count;
      });

    console.log("nodes:", nodes);
    var node = svg
      .selectAll(".node")
      .data(bubble(nodes).descendants())
      .enter()
      .filter(function(d) {
        console.log("!d.bad", !d.children);
        return !d.children;
      })
      .append("g")
      .attr("class", "node")
      .attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
      });

    node
      .append("circle")
      .attr("r", function(d) {
        return d.r;
      })
      .style("fill", function(d, i) {
        return color(i);
      })
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);

    node
      .append("text")
      .attr("dy", ".2em")
      .style("text-anchor", "middle")
      .text(function(d) {
        console.log("d.data", d);
        return d.data.name.substring(0, d.r / 3);
      })
      .attr("font-family", "sans-serif")
      .attr("font-size", function(d) {
        return d.r / 5;
      })
      .attr("fill", "black");

    node
      .append("text")
      .attr("dy", "1.3em")
      .style("text-anchor", "middle")
      .text(function(d) {
        return d.data.Count;
      })
      .attr("font-family", "sans serif")
      .attr("font-size", function(d) {
        return d.r / 5;
      })
      .attr("fill", "black");
  });
  console.log("Hello");
}
