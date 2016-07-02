// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

  nbviz.buildBarchart = function(data, graphContainer) {
    // add y scale
    var padding = graphContainer.padding;
    var margin = graphContainer.margin;
    

    nbviz.addSVGtoDiv(graphContainer);

    var dim = graphContainer.dim;
    var svg = graphContainer.svg;

    graphContainer.scales.xScale = nbviz.getRangeBandGen(data, graphContainer);
    graphContainer.scales.yScale = nbviz.yLinearScale(data, graphContainer);
    var barWidth = graphContainer.scales.xScale.rangeBand();

    // create axis
    graphContainer.axis.xAxis = d3.svg.axis().scale(graphContainer.scales.xScale).orient("bottom");
    graphContainer.axis.yAxis = d3.svg.axis().scale(graphContainer.scales.yScale).orient('left').ticks(10);
    nbviz.genAxis(graphContainer);

    // data- join
    var bars=svg.selectAll('rect').data(data, function(d){return d.key;});
    // create bars for data points that are not yet bound to a DOM element
    bars.enter()
    .append('rect')
    .classed(graphContainer._class, true)
    // update all bars that are bound to a DOM element
    bars
    .transition().duration(nbviz.TRANS_DURATION)
    .attr('height', function(d){return dim.height - graphContainer.scales.yScale(d.value);})
    .attr('width', barWidth)
    .attr('y', function(d){return graphContainer.scales.yScale(d.value);})
    .attr('x', function(d,i){return graphContainer.scales.xScale(i);});
    //update the axis
    nbviz.customXScale(data, graphContainer);
    nbviz.updateAxis(data, graphContainer);
    //remove bars that are not bound to data
    //improvement: translate before exiting (with transition)
    bars.exit()
    .remove

  };

  nbviz.updateBarchart = function(data, graphContainer) {
    var svg=graphContainer.svg;
    var dim=graphContainer.dim;
    var barWidth = graphContainer.scales.xScale.rangeBand();

    nbviz.updateScales(data, graphContainer);
    var barWidth = graphContainer.scales.xScale.rangeBand();

    // data- join
    var bars=svg.selectAll('rect').data(data, function(d){return d.key;});
    // create bars for data points that are not yet bound to a DOM element
    bars.enter()
    .append('rect')
    .classed(graphContainer._class, true)
    // update all bars that are bound to a DOM element
    bars
    .transition().duration(nbviz.TRANS_DURATION)
    .attr('height', function(d){return dim.height - graphContainer.scales.yScale(d.value);})
    .attr('width', barWidth)
    .attr('y', function(d){return graphContainer.scales.yScale(d.value);})
    // .attr('x', function(d,i){return graphContainer.scales.xScale(i);});
    //update the axis
    nbviz.updateAxis(data, graphContainer);

    //remove bars that are not bound to data
    //improvement: translate before exiting (with transition)
    bars.exit()
    .remove
    nbviz.customXScale(data, graphContainer);
    nbviz.updateAxis(data, graphContainer);
  };

}(window.nbviz=window.nbviz || {}));