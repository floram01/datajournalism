// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){
//improvements: generalise more elements in core, factorise between build and update
  nbviz.buildLinechart = function(graphContainer) {
    // add y scale
    var data = graphContainer.dataGetter(graphContainer);
    nbviz['addData'+ graphContainer._type + 'Info'](data, graphContainer);
    nbviz.initialize(graphContainer, data);
    nbviz.addSVGtoDiv(graphContainer);

    graphContainer.scales.xScale = nbviz.xTime(data, graphContainer);
    graphContainer.scales.yScale = nbviz.yLinearScale(data, graphContainer);
    // create axis
    nbviz.genXAxis(graphContainer);
    nbviz.genYAxis(graphContainer);
    // nbviz.customXTicks(graphContainer);
    nbviz.updateXAxis(data, graphContainer);
    
    //add legend
    // nbviz.addLegend(graphContainer);
    // nbviz.circleLegend(graphContainer);
    // nbviz.textLegend(graphContainer);

    // data- join
    nbviz.updateLinechart(graphContainer);

};

  nbviz.updateLinechart = function(graphContainer) {
    var data = graphContainer.dataGetter(graphContainer);
    var svg = graphContainer.svg;
    var dim = graphContainer.dim;
    var _value = graphContainer._value;
    // var groupID = graphContainer.groupID;
    
    nbviz['addData'+ graphContainer._type + 'Info'](data, graphContainer);
    nbviz.updateDomainYLinearScale(data, graphContainer);
    nbviz.updateDomainXTime(data, graphContainer);


    var line = d3.svg.line()
    .x(function(d) { return graphContainer.scales.xScale(d.Edition); })
    .y(function(d) { return graphContainer.scales.yScale(d.value); });

    g = svg.select('g.'+ graphContainer._class);

    var lines = g.selectAll('.lines').data(data).enter().append('g').attr('class', 'lines');
    
    lines.append("path")
    .attr("class", "line")
    .attr("d", function(d) { return line(d.values); })
    .attr({
        'fill': 'none',
        'stroke': '#666',
        'stroke-width': '1.5px'
    });
    
    // nbviz.customXScale(data, graphContainer);
    // .style("stroke", function(d) { return z(d.id); });
};

}(window.nbviz=window.nbviz || {}));