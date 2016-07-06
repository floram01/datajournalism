// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){
//improvements: generalise more elements in core, factorise between build and update
  nbviz.buildBarchart = function(data, graphContainer) {
    nbviz.addDataInfo(data, 'key', graphContainer);
    // add y scale
    var padding = graphContainer.padding;
    var margin = graphContainer.margin;

    nbviz.initialize(graphContainer, data);

    nbviz.addSVGtoDiv(graphContainer);

    var dim = graphContainer.dim;
    var svg = graphContainer.svg;

    // graphContainer.data ={}; //créer une fonction qui calcule ces éléments?
    // graphContainer.data.range = d3.range(data.length);
    graphContainer.scales.xScale = nbviz.xRangeBand(data, graphContainer);
    graphContainer.scales.yScale = nbviz.yLinearScale(data, graphContainer);
    var barWidth = graphContainer.scales.xScale.rangeBand();

    // create axis
    nbviz.genAxis(graphContainer)

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
    nbviz.updateXAxis(data, graphContainer);
    nbviz.updateYAxis(data, graphContainer);
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
    var bars=svg.selectAll('rect').data(data);
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
    nbviz.updateXAxis(data, graphContainer);
    nbviz.updateYAxis(data, graphContainer);
    //remove bars that are not bound to data
    //improvement: translate before exiting (with transition)
    bars.exit()
    .remove;

    nbviz.customXScale(data, graphContainer);
    nbviz.updateXAxis(data, graphContainer);
    nbviz.updateYAxis(data, graphContainer);
  };

}(window.nbviz=window.nbviz || {}));