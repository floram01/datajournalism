// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){
//improvements: generalise more elements in core, factorise between build and update
  nbviz.buildTimeline = function(data, graphContainer) {
    // add y scale
    var padding = graphContainer.padding;
    var margin = graphContainer.margin;

    nbviz.initialize(graphContainer, data);

    nbviz.addSVGtoDiv(graphContainer);

    var dim = graphContainer.dim;
    var svg = graphContainer.svg;

    graphContainer.scales.xScale = nbviz.xRangeBand(data, graphContainer);
    graphContainer.scales.yScale = nbviz.yRoundPoints(data, graphContainer);
    // create axis
    nbviz.genAxis(graphContainer);
    nbviz.customXTicks(graphContainer, 10);
    nbviz.updateXAxis(data, graphContainer);
    
    //add legend
    nbviz.addLegend(graphContainer);
    nbviz.circleLegend(graphContainer);
    nbviz.textLegend(graphContainer);
    // data- join
    nbviz.updateTimeline(data,graphContainer);

};

  nbviz.updateTimeline = function(data, graphContainer) {
    var svg=graphContainer.svg;
    var dim=graphContainer.dim;
    graphContainer.yearsLabels = svg
            // .append('g')
            // .attr('id','years');
            .selectAll(".year")
            .data(data, function(d) {
                return d.key; 
            });

    graphContainer.yearsLabels.enter().append('g')
        .classed('year', true)
        .attr('name', function(d) { return d.key;})
        .attr("transform", function(year) {
            return "translate(" + graphContainer.scales.xScale(+year.key) + "," +graphContainer.dim.height + graphContainer.margin.bottom*2 + ")";
        })
        .transition().duration(nbviz.TRANS_DURATION)
        .attr("transform", function(year) {
            return "translate(" + graphContainer.scales.xScale(+year.key) + ",0)";
        });

    graphContainer.yearsLabels.exit().transition().duration(nbviz.TRANS_DURATION)
    .attr("transform", function(year) {
        return "translate(" + 0 + "," + graphContainer.dim.height + graphContainer.margin.bottom*2 + ")";
    })
    .remove();

    graphContainer.winnersBubbles = graphContainer.yearsLabels
        .selectAll(".winner")
        .data(function(d) { 
            return d.values;
        }, function(d) {
            return d.name;
        });

    graphContainer.winnersBubbles.enter()
    .append('circle')
    .classed('winner', true)
    .attr('fill', function(d) {
        return nbviz.categoryFill(d.category); 
    })
    .attr('cx', graphContainer.scales.xScale.rangeBand()/2)
    .attr('cy', graphContainer.dim.height + graphContainer.margin.bottom*2)
    .attr('r', graphContainer.scales.xScale.rangeBand()/2);

    graphContainer.winnersBubbles
    .transition().duration(nbviz.TRANS_DURATION)
    .attr('cy', function(d, i) {
                return graphContainer.scales.yScale(i);
            });

    graphContainer.winnersBubbles.exit()
    .transition().duration(nbviz.TRANS_DURATION)
    .attr('cy', graphContainer.dim.height + graphContainer.margin.bottom*2 )
    .remove();
};

}(window.nbviz=window.nbviz || {}));