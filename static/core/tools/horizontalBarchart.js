// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){
//improvements: generalise more elements in core, factorise between build and update
  nbviz.buildHorizontalBarchart = function(graphContainer) {
    var data = graphContainer.dataGetter(graphContainer);
    nbviz['addData'+ graphContainer._type + 'Info'](data, graphContainer);
    nbviz.initialize(graphContainer, data);

    nbviz.addSVGtoDiv(graphContainer);

    var dim = graphContainer.dim;
    var svg = graphContainer.svg;

    // graphContainer.data ={}; //créer une fonction qui calcule ces éléments?
    graphContainer.scales.xScale = nbviz.xLinearScale(data, graphContainer);
    graphContainer.scales.yScale = nbviz.yRangeBand(data, graphContainer);

    // create axis
    nbviz.genYAxis(graphContainer);

    nbviz.updateHorizontalBarchart(graphContainer);

  };

  nbviz.updateHorizontalBarchart = function(graphContainer) {
    var data = graphContainer.dataGetter(graphContainer);
    var svg = graphContainer.svg;
    var dim = graphContainer.dim;

    nbviz.addDataBarchartInfo(data, graphContainer);
    nbviz.updateDomainYRangeBand(data, graphContainer);
    nbviz.updateDomainXLinearScale(data, graphContainer);

    var barWidth = graphContainer.scales.yScale.rangeBand();
    

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
    .attr('height', barWidth)
    .attr('width', function(d){return graphContainer.scales.xScale(d.value);})
    .attr('y', function(d,i){return graphContainer.scales.yScale(i);})
    .attr('x', function(d){return graphContainer.margin.left + graphContainer.padding.left;});
    
    //remove bars that are not bound to data
    //improvement: translate before exiting (with transition)
    bars.exit()
    .remove();

    var legend = svg.selectAll('text.legend').data(data, function(d){return d[graphContainer._key];});
    legend.enter()
    .append('text')
    .classed(graphContainer._class + ' legend', true);
    legend
    .transition().duration(nbviz.TRANS_DURATION)
    .attr({
        'y' : function(d,i){return graphContainer.scales.yScale(i) + barWidth/2;},
        'x' : function(d){
            return graphContainer.scales.xScale(d.value) + graphContainer.margin.left - graphContainer.padding.legend;
        },
        'text-anchor' : 'end'
    })  
    .text(function(d){return d.value})
    .attr({
        'fill':'white',
        'font-size':'12px'
    })

    legend.exit().remove();

    nbviz.customYScale(data, graphContainer);
    nbviz.updateYAxis(data, graphContainer);
  };

}(window.nbviz=window.nbviz || {}));