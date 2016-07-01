// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

  nbviz.buildBarchart = function(data, divID, _class) {
    var graph = 'bar'

    // add y scale
    var padding = nbviz.padding.barchart;
    var margin = nbviz.margin.barchart;
    

    nbviz.addSVGtoDiv(divID, _class,margin);

    var dim = nbviz.dim.barchart;
    var svg = d3.select("svg#bar");
    var rangeBandGen = nbviz.getRangeBandGen(data, dim, margin, padding);
    var yLinearScale = nbviz.yLinearScale(data, dim, margin);
    var barWidth = rangeBandGen.rangeBand();

    // create axis
    var xAxis = d3.svg.axis().scale(rangeBandGen).orient("bottom");
    var yAxis = d3.svg.axis().scale(yLinearScale).orient('left').ticks(10);
    nbviz.genAxis(svg, dim, padding, margin, graph);

    // data- join
    var bars=svg.selectAll('rect').data(data)

    // create bars for data points that are not yet bound to a DOM element
    bars.enter()
    .append('rect')
    .classed(_class, true)

    // update all bars that are bound to a DOM element
    bars
    .attr('height', function(d){return dim.height - yLinearScale(d.value);})
    .attr('width', barWidth)
    .attr('y', function(d){return yLinearScale(d.value);})
    .attr('x', function(d,i){return rangeBandGen(i);});
    //update the axis
    nbviz.updateAxis(data, rangeBandGen, yLinearScale, xAxis, yAxis, svg, graph);

    //remove bars that are not bound to data
    //improvement: translate before exiting (with transition)
    bars.exit()
    .remove

  };

}(window.nbviz=window.nbviz || {}));