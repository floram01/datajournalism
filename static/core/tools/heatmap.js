// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){
//improvements: generalise more elements in core, factorise between build and update
  nbviz.buildHeatmap = function(graphContainer) {
    var data = nbviz.STATIC_DATA.heatmap;
    nbviz['addData'+ graphContainer._type + 'Info'](data, graphContainer);
    nbviz.initialize(graphContainer, data);

    nbviz.addSVGtoDiv(graphContainer);

    var dim = graphContainer.dim;
    var svg = graphContainer.svg;

    // graphContainer.data ={}; //créer une fonction qui calcule ces éléments?
    graphContainer.scales.xScale = nbviz.xRangeBand(data, graphContainer);
    graphContainer.scales.yScale = nbviz.yRangeBand(data, graphContainer);

    // add color scale
    graphContainer.scales.colorScale = d3.scale.linear()
    .domain([graphContainer.data.min, graphContainer.data.max])
    .range(['white','black']);

    // create axis
    nbviz.genAxis(graphContainer);

    // nbviz.updateBarchart(graphContainer);
    var cards = svg.selectAll(".cards")
    .data(data, function(d) {return d.country+':'+d.year;});

    // cards.append("title");
    cards.enter().append("rect")
      .attr("x", function(d) { return graphContainer.scales.xScale( + d.x_index); })
      .attr("y", function(d) { return graphContainer.scales.yScale( + d.y_index); })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("class", "cards")
      .attr("width", graphContainer.scales.xScale.rangeBand())
      .attr("height", graphContainer.scales.yScale.rangeBand())
      .style("fill", function(d){return graphContainer.scales.colorScale( + d[graphContainer._value]);});

    // cards.transition().duration(1000)
    //   .style("fill", function(d) { return colorScale(d.value); });

    // cards.select("title").text(function(d) { return d.value; });

    // cards.exit().remove();
  };

  nbviz.updateHeatmap = function(graphContainer) {

  };

}(window.nbviz=window.nbviz || {}));