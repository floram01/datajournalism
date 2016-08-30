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
    var svg = graphContainer.svg;

    graphContainer.scales.xScale = nbviz.xTime(data, graphContainer);
    graphContainer.scales.yScale = nbviz.yLinearScale(data, graphContainer);
    // create axis
    nbviz.genXAxis(graphContainer);
    nbviz.genYAxis(graphContainer);
    // nbviz.customXTicks(graphContainer);
    nbviz.updateXAxis(data, graphContainer);
    nbviz.updateYAxis(data, graphContainer);
    
    //add legend
    // nbviz.addLegend(graphContainer);
    // nbviz.circleLegend(graphContainer);
    // nbviz.textLegend(graphContainer);

    // data- join
    graphContainer.line = d3.svg.line()
    .x(function(d) { return graphContainer.scales.xScale(d.Edition); })
    .y(function(d) { return graphContainer.scales.yScale(d.value); });

    g = svg.select('g.'+ graphContainer._class);

    // data- join
    graphContainer.series = g
    .selectAll('.series')
    .data(data);
    
    graphContainer.series.enter()
    .append('g')
    .attr('class', 'series')
    .append("path")
    .attr("class", "line")
    .attr({
        'fill': 'none',
        'stroke': '#666',
        'stroke-width': '1.5px'
    });

    // var parseDate = d3.time.format("%Y").parse;
    // var tooltip = {};
    // tooltip.x = parseDate(String(1996))
    // data.forEach(function(d){
    //     if(d.key=='United Kingdom'){
    //         d.values.forEach(function(o){
    //             var target = new Date(o.Edition); 
    //             var temp = new Date(parseDate(String(1996)));
    //             if(target.getTime() === temp.getTime()){
    //                 tooltip.y = o.value;
    //             };
    //         });
    //     };
    // });

    // var circleToolTip = g.selectAll('.circleToolTip').data([tooltip], function(d){return d.x});
    // circleToolTip
    // .enter()
    // .append('circle')
    // .attr('cx',function(d){return graphContainer.scales.xScale(d.x)})
    // .attr('cy',function(d){return graphContainer.scales.yScale(d.y)})
    // .attr('r',5)
    // .classed('.circleToolTip', true);

    nbviz.updateLinechart(graphContainer)
};

  nbviz.updateLinechart = function(graphContainer) {
    var data = graphContainer.dataGetter(graphContainer);
    var svg = graphContainer.svg;
    g = svg.select('g.'+ graphContainer._class);
    
    var dim = graphContainer.dim;
    var _value = graphContainer._value;
    // var groupID = graphContainer.groupID;
    
    nbviz['addData'+ graphContainer._type + 'Info'](data, graphContainer);
    nbviz.updateDomainYLinearScale(data, graphContainer);
    nbviz.updateDomainXTime(data, graphContainer);

    
    // data-join
    graphContainer.series.data(data);
    //update
    graphContainer.series.select('path')
    .attr("d", function(d) { return graphContainer.line(d.values); })

    // update axis
    nbviz.updateXAxis(data, graphContainer);
    nbviz.updateYAxis(data, graphContainer);

    var parseDate = d3.time.format("%Y").parse;
    var tooltip = {};
    tooltip.x = parseDate(String(1996))
    data.forEach(function(d){
        if(d.key=='United Kingdom'){
            d.values.forEach(function(o){
                var target = new Date(o.Edition); 
                var temp = new Date(parseDate(String(1996)));
                if(target.getTime() === temp.getTime()){
                    tooltip.y = o.value;
                };
            });
        };
    });

    var circleToolTip = g.selectAll('.circleTooltip').data([tooltip], function(d){return d.x});
    circleToolTip
    .attr('cx',function(d){return graphContainer.scales.xScale(d.x)})
    .attr('cy',function(d){return graphContainer.scales.yScale(d.y)})
    .attr('r',5);
    
    circleToolTip
    .enter()
    .append('circle')
    .attr('cx',function(d){return graphContainer.scales.xScale(d.x)})
    .attr('cy',function(d){return graphContainer.scales.yScale(d.y)})
    .attr('r',5)
    .classed('circleTooltip', true)

    circleToolTip
    .exit()
    .remove();

    //method brutale
    // d3.select('.circleTooltip').data([tooltip])
    // .attr('cx',function(d){return graphContainer.scales.xScale(d.x)})
    // .attr('cy',function(d){return graphContainer.scales.yScale(d.y)})
    // .attr('r',5);
    
    g.append('text')
    .attr({
        'id':'tooltip',
        'class':'textTooltip hidden',
        'x':graphContainer.scales.xScale(tooltip.x),
        'y':graphContainer.scales.yScale(tooltip.y),
        'text-anchor':'middle',
        'dy':'-0.5em'
        })
    .text('Traumatisme de 1996');

    var rect = g.insert("rect","#tooltip")
        .classed('boxTooltip',true)
        .attr('id','boxTooltip')
        .classed('hidden',true);


    circleToolTip.on("mouseover", function(d){
        d3.select('#tooltip')
        .classed('hidden',false);

        var text = d3.select("#tooltip");
        var bbox = text.node().getBBox();
        var padding = 2;

        d3.select('#boxTooltip')
        .attr("x", bbox.x - padding)
        .attr("y", bbox.y - padding)
        .attr("width", bbox.width + (padding*2))
        .attr("height", bbox.height + (padding*2))
        .classed('hidden',false);

    });

    circleToolTip.on("mouseout", function(d){
        d3.select('#tooltip')
        .classed('hidden',true)

        d3.select('#boxTooltip')
        .classed('hidden',true);
    });
};

}(window.nbviz=window.nbviz || {}));