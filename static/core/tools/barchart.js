// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){
//improvements: generalise more elements in core, factorise between build and update
  nbviz.buildBarchart = function(graphContainer) {
    var data = graphContainer.dataGetter(graphContainer);
    nbviz['addData'+ graphContainer._type + 'Info'](data, graphContainer);
    nbviz.initialize(graphContainer, data);

    nbviz.addSVGtoDiv(graphContainer);

    var dim = graphContainer.dim;
    var svg = graphContainer.svg;

    // graphContainer.data ={}; //créer une fonction qui calcule ces éléments?
    graphContainer.scales.xScale = nbviz.xRangeBand(data, graphContainer);
    graphContainer.scales.yScale = nbviz.yLinearScale(data, graphContainer);

    // create axis
    nbviz.genAxis(graphContainer);

    nbviz.updateBarchart(graphContainer);

  };

  nbviz.updateBarchart = function(graphContainer) {
    var data = graphContainer.dataGetter(graphContainer);
    var svg=graphContainer.svg;
    var dim=graphContainer.dim;
    nbviz.addDataBarchartInfo(data, graphContainer);
    nbviz.updateDomainXRangeBand(data, graphContainer);
    nbviz.updateRangeXRangeBand(data, graphContainer);
    nbviz.updateDomainYLinearScale(data, graphContainer);
    nbviz.updateRangeYLinearScale(data, graphContainer);

    var barWidth = graphContainer.scales.xScale.rangeBand();
    
    // data- join
    // provoque toujours bug au moment de l'update?
    var bars=svg.selectAll('rect').data(data, function(d){return d[graphContainer._key];});

    // create bars for data points that are not yet bound to a DOM element
    bars.enter()
    .append('rect')
    .classed(graphContainer._class, true);
    
    // update all bars that are bound to a DOM element
    bars
    .transition().duration(nbviz.TRANS_DURATION)
    .attr('height', function(d){return dim.height - graphContainer.scales.yScale(d.value);})
    .attr('width', barWidth)
    .attr('y', function(d){return graphContainer.scales.yScale(d.value);})
    .attr('x', function(d,i){return graphContainer.scales.xScale(i);});
    
    //remove bars that are not bound to data
    //improvement: translate before exiting (with transition)
    bars.exit()
    .remove();

    nbviz.customXScale(data, graphContainer);
    nbviz.updateXAxis(data, graphContainer);
    nbviz.updateYAxis(data, graphContainer);
  };

}(window.nbviz=window.nbviz || {}));