// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

// Ajouter toutes les autres scales susceptibles d'être utilisées au fur et à mesure
  nbviz.xRangeBand = function(data, graphContainer) {
    var dim = graphContainer.dim;
    var padding = graphContainer.padding;
    var _range = graphContainer.data.valueRange || graphContainer.data.pointRange || graphContainer.data.xRange
    var bandwith = dim.width/_range.length

    var rangeBandGen = d3.scale.ordinal()
    .domain(_range)
    .rangeRoundBands([bandwith + padding.left, dim.width - bandwith], padding.interbar)

    return rangeBandGen
  };

  nbviz.yRangeBand = function(data, graphContainer) {
    var dim = graphContainer.dim;
    var padding = graphContainer.padding;
    var _range = graphContainer.data.valueRange || graphContainer.data.pointRange || graphContainer.data.yRange

    var rangeBandGen = d3.scale.ordinal()
    .domain(_range)
    .rangeRoundBands([padding.bottom, dim.height], padding.interbar)
    return rangeBandGen
  };

  nbviz.updateDomainXRangeBand = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var padding = graphContainer.padding;

    graphContainer.scales.xScale.domain( graphContainer.data.valueRange || graphContainer.data.pointRange || graphContainer.data.xRange );
  };

  nbviz.updateDomainYRangeBand = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var padding = graphContainer.padding;

    graphContainer.scales.yScale.domain( graphContainer.data.valueRange || graphContainer.data.pointRange || graphContainer.data.yRange );
  };

  nbviz.updateRangeXRangeBand = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var padding = graphContainer.padding;

    graphContainer.scales.xScale.rangeRoundBands([padding.left, dim.width], padding.interbar);
  };

  nbviz.yRoundPoints = function(data, graphContainer) {
    var dim = graphContainer.dim;
    var padding = graphContainer.padding;
    var yRP = d3.scale.ordinal()
    .domain(d3.range(graphContainer.data.maxGroupLength))
    .rangeRoundPoints([dim.height, padding.bottom])
    return yRP
  };

  nbviz.updateRangeYRoundPoints = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var padding = graphContainer.padding;

    graphContainer.scales.yScale.rangeRoundPoints([dim.height, padding.bottom]);
  };

  nbviz.xLinearScale = function(data, graphContainer) {
    var dim = graphContainer.dim;
    var padding = graphContainer.padding;
    var margin = graphContainer.margin;
    var xLinearScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d){return d[graphContainer._value];})])
    .rangeRound([padding.left, dim.width - padding.left - margin.left - margin.right])
    return xLinearScale
  };

  nbviz.yLinearScale = function(data, graphContainer) {
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var yLinearScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d){return d[graphContainer._value];})])
    .rangeRound([dim.height, margin.top])
    return yLinearScale
  };

  nbviz.updateDomainYLinearScale = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart

    graphContainer.scales.yScale.domain([0, d3.max(data, function(d){
                                       return + d[graphContainer._value]; })]);
  };

  nbviz.updateDomainXLinearScale = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart

    graphContainer.scales.xScale.domain([0, d3.max(data, function(d){
                                       return + d[graphContainer._value]; })]);
  };

  nbviz.updateRangeYLinearScale = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var padding = graphContainer.padding;

    graphContainer.scales.yScale.rangeRound([dim.height, margin.top]);
  };

  nbviz.customXScale = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart
    graphContainer.scales.xScale.domain( data.map(function(d){ return d[graphContainer._xKey]; }) );
  };

  nbviz.customYScale = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart
    graphContainer.scales.yScale.domain( data.map(function(d){ return d[graphContainer._yKey]; }) );
  };

  nbviz.customGroupedYScale = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart
    var preparedData = crossfilter(data);
    var dimension = preparedData.dimension(function(o){return o[graphContainer._yKey]});
    var groupedSum = dimension.group().reduceSum(function(o){return o[graphContainer._value]});
    var sortedDimension = groupedSum.top(Infinity);

    graphContainer.scales.yScale.domain( sortedDimension.map(function(d){ return d.key; }) );
  };


}(window.nbviz=window.nbviz || {}));