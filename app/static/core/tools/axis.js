// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){


  nbviz.genXAxis = function(graphContainer) {
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var padding = graphContainer.padding;
    var svg = graphContainer.svg;

    graphContainer.axis.xAxis = d3.svg.axis().scale(graphContainer.scales.xScale).orient("bottom");

    svg.select('g.'+ graphContainer._class).append('g').attr('class','x axis ' + graphContainer._class).attr("transform", "translate(" + 0 + "," + dim.height + ")"); 
  };

  nbviz.genYAxis = function(graphContainer) {
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var padding = graphContainer.padding;
    var svg = graphContainer.svg;

    var yAxisPadding = margin.left - padding.left//how to avoid this? more complex than it need to be
    graphContainer.axis.yAxis = d3.svg.axis().scale(graphContainer.scales.yScale).orient('left').ticks(10);

    svg.select('g.'+ graphContainer._class).append('g').attr('class','y axis ' + graphContainer._class).attr("transform", "translate(" + yAxisPadding + "," + 0 + ")"); 
  };

  nbviz.genAxis = function(graphContainer) {
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var padding = graphContainer.padding;
    var svg = graphContainer.svg;

    var yAxisPadding = margin.left - padding.left//how to avoid this? more complex than it need to be
    graphContainer.axis.xAxis = d3.svg.axis().scale(graphContainer.scales.xScale).orient("bottom");
    graphContainer.axis.yAxis = d3.svg.axis().scale(graphContainer.scales.yScale).orient('left').ticks(10);
    
    if(graphContainer.posXScale=='top'){
      svg.select('g.'+ graphContainer._class).append('g').attr('class','x axis ' + graphContainer._class).attr("transform", "translate(" + 0 + "," + 0 + ")");
    } else {
      svg.select('g.'+ graphContainer._class).append('g').attr('class','x axis ' + graphContainer._class).attr("transform", "translate(" + 0 + "," + dim.height + ")"); 
    };
    svg.select('g.'+ graphContainer._class).append('g').attr('class','y axis ' + graphContainer._class).attr("transform", "translate(" + yAxisPadding + "," + 0 + ")"); 
  };

//generalize to customTicks?Or add customYTicks
  nbviz.customXTicks = function(graphContainer) {
    var axis = graphContainer.axis.xAxis;
    var scale = graphContainer.scales.xScale;
    
    axis.tickValues(scale.domain().filter(
                function(d,i){
                  return !(d%graphContainer.xTicksFreq); 
                })
              );
  };

// prendre en compte une possiblité de personnalisation...
// arriver à tt garder en une fonction ou passer à 2?
  nbviz.updateXAxis = function(data, graphContainer){
    var XAxis = graphContainer.svg.select('.x.axis.'+ graphContainer._class)
        .transition().duration(nbviz.TRANS_DURATION)
        .call(graphContainer.axis.xAxis);

    XAxis     
        .selectAll("text") 
        .style("text-anchor", graphContainer.anchorXScale?graphContainer.anchorXScale:'end')
        // .attr("dx", "-.8em")
        // .attr("dy", ".15em");

    if(graphContainer.wrapXLegend){
      XAxis
        .selectAll(".tick text")
        .call(nbviz.wrapText, graphContainer.scales.xScale.rangeBand());
    };

    if (graphContainer.orientXScale!='horizontal'){
        XAxis
        .selectAll("text") 
        .attr("transform", "rotate(-20)");
    };
  };

  nbviz.updateYAxis = function(data, graphContainer){
    graphContainer.svg.select('.y.axis.'+ graphContainer._class)
        .transition().duration(nbviz.TRANS_DURATION)
        .call(graphContainer.axis.yAxis);
  };

}(window.nbviz=window.nbviz || {}));