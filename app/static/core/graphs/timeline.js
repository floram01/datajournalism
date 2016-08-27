// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){
//improvements: generalise more elements in core, factorise between build and update
  nbviz.buildTimeline = function(graphContainer) {
    // add y scale
    var data = graphContainer.dataGetter(graphContainer);
    nbviz['addData'+ graphContainer._type + 'Info'](data, graphContainer);
    nbviz.initialize(graphContainer, data);
    nbviz.addSVGtoDiv(graphContainer);
    graphContainer.scales.xScale = nbviz.xRangeBand(data, graphContainer);
    graphContainer.scales.yScale = nbviz.yRoundPoints(data, graphContainer);
    
    // create axis
    nbviz.genAxis(graphContainer);
    nbviz.customXTicks(graphContainer);
    nbviz.updateXAxis(data, graphContainer);
    
    //add legend
    nbviz.addLegend(graphContainer);
    nbviz.circleLegend(graphContainer);
    nbviz.textLegend(graphContainer);
    
    // data- join
    nbviz.updateTimeline(graphContainer);

};

  nbviz.updateTimeline = function(graphContainer) {
    var data = graphContainer.dataGetter(graphContainer);
    var svg = graphContainer.svg;
    var dim = graphContainer.dim;
    var _key = graphContainer._label;
    var groupID = graphContainer.groupID;
    
    nbviz.addDataTimelineInfo(data, graphContainer);
    nbviz.updateRangeYRoundPoints(data, graphContainer);
    nbviz.updateRangeXRangeBand(data, graphContainer);

    
    // data-join
    graphContainer.xTime = svg
            .select('g.'+ graphContainer._class)
            // .append('g')
            // .attr('id','years');
            .selectAll(".xTime")
            .data(data, function(d) {
                return d[_key]; 
            });
    
    // update pattern
    graphContainer.xTime.enter().append('g')
        .classed('xTime', true)
        .attr('name', function(d) { return d[_key];})
        .attr("transform", function(time) {
            return "translate(" + graphContainer.scales.xScale(+time[_key]) + "," +graphContainer.dim.height + graphContainer.margin.bottom * 2+ ")";
        })
        .transition().duration(nbviz.TRANS_DURATION)
        .attr("transform", function(time) {
            return "translate(" + graphContainer.scales.xScale(+time[_key]) + ",0)";
        });
    // exit pattern
    graphContainer.xTime.exit().transition().duration(nbviz.TRANS_DURATION)
    .attr("transform", function(time) {
        return "translate(" + 0 + "," + graphContainer.dim.height + graphContainer.margin.bottom*2 + ")";
    })
    .remove();
    
    // data-join inner level
    graphContainer.bubbles = graphContainer.xTime
        .selectAll(".bubbleTime")
        .data(function(d) { 
            return d[groupID];
        }, function(d) {
            return d[graphContainer.dataGetterParams.nestedUniqueKey];
        });
    // update pattern inner level
    graphContainer.bubbles.enter()
    .append('circle')
    .classed('bubbleTime', true)
    .attr('fill', function(d) {
        return nbviz.categoryFill(d[graphContainer.dataGetterParams.colorKey], graphContainer); 
    })
    .attr('cx', graphContainer.scales.xScale.rangeBand()/2)
    .attr('cy', graphContainer.dim.height + graphContainer.margin.bottom*2)
    .attr('r', graphContainer.scales.xScale.rangeBand()/2);
    // transition bubbles from the ext of the chart to their correct y position
    graphContainer.bubbles
    .transition().duration(nbviz.TRANS_DURATION)
    .attr('cy', function(d, i) {
                return graphContainer.scales.yScale(i);
            });

    // exit pattern
    graphContainer.bubbles.exit()
    .transition().duration(nbviz.TRANS_DURATION)
    .attr('cy', graphContainer.dim.height + graphContainer.margin.bottom*2 )
    .remove();
};

}(window.nbviz=window.nbviz || {}));