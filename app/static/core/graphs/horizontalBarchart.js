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
    var bars=svg.select('g.' + graphContainer._class).selectAll('rect').data(data, function(d){return d[graphContainer._label];});

    // create bars for data points that are not yet bound to a DOM element
    bars.enter()
    .append('rect')
    .classed(graphContainer._class, true);
    
    // update all bars that are bound to a DOM element
    bars
    .transition().duration(nbviz.TRANS_DURATION)
    .attr('class','svg-main-color')
    .attr('height', barWidth)
    .attr('width', function(d){return graphContainer.scales.xScale(d[graphContainer._value]);})
    .attr('y', function(d,i){return graphContainer.scales.yScale(i);})
    .attr('x', function(d){return graphContainer.margin.left + graphContainer.padding.left;});
    //remove bars that are not bound to data
    //improvement: translate before exiting (with transition)
    bars.exit()
    .remove();

    //addd bar-value legend
    var legend = svg.select('g.' + graphContainer._class).selectAll('text.legend').data(data, function(d){return d[graphContainer._label];});
    legend.enter()
    .append('text')
    .classed(graphContainer._class + ' legend', true);
    legend
    .transition().duration(nbviz.TRANS_DURATION)
    .attr({
        'y' : function(d,i){return graphContainer.scales.yScale(i) + barWidth/2;},
        'dy': '.4em',
        'x' : function(d){
            return graphContainer.scales.xScale(d[graphContainer._value]) + graphContainer.margin.left  + graphContainer.padding.left;
        },
        'dx' : function(d){
            var pos =  graphContainer.scales.xScale(d[graphContainer._value]) + graphContainer.margin.left  + graphContainer.padding.left - graphContainer.padding.legend;
            if (pos < (graphContainer.margin.left  + graphContainer.padding.left + 2 * graphContainer.padding.legend)){
                return + graphContainer.padding.legend;
            } else {
                return  - graphContainer.padding.legend;
            };
        },
        'text-anchor' : function(d){
            var pos = graphContainer.scales.xScale(d[graphContainer._value]) + graphContainer.margin.left  + graphContainer.padding.left - graphContainer.padding.legend;
            if (pos < (graphContainer.margin.left  + graphContainer.padding.left + 2 * graphContainer.padding.legend)){
                return 'start'
            } else {
                return 'end'
             };
        },
        'vertical-align':'bottom'
    })  
    .text(function(d){return nbviz.formatPrecision(d, 'value', graphContainer)});

    legend.exit().remove();

    // add title
    // svg.append('text').attr({
    //     'class':'graph-title',
    //     'x':(graphContainer.dim.width + graphContainer.margin.left + graphContainer.margin.right)/2,
    //     'y':graphContainer.margin.top/4*3,
    //     'text-anchor':'middle'
    // })
    // .text(graphContainer.chartParams.title)

    nbviz.customYScale(data, graphContainer);
    nbviz.updateYAxis(data, graphContainer);
  };

}(window.nbviz=window.nbviz || {}));