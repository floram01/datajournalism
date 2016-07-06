// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){


// Ajouter toutes les autres scales susceptibles d'être utilisées au fur et à mesure
  nbviz.xRangeBand = function(data, graphContainer) {
    var dim = graphContainer.dim;
    var padding = graphContainer.padding;

    var rangeBandGen = d3.scale.ordinal()
    .domain(graphContainer.data.range)
    .rangeRoundBands([padding.left, dim.width], padding.interbar)

    return rangeBandGen
  };

  nbviz.yRoundPoints = function(data, graphContainer) {
    var dim = graphContainer.dim;
    var padding = graphContainer.padding;
    var yRP = d3.scale.ordinal()
    .domain(d3.range(graphContainer.data.maxLength))
    .rangeRoundPoints([dim.height, padding.bottom])
    return yRP
  };

  nbviz.yLinearScale = function(data, graphContainer) {
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var yLinearScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d){return d.value;})])
    .rangeRound([dim.height, margin.bottom])
    return yLinearScale
  };

  nbviz.updateScales = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart
    graphContainer.scales.xScale.domain( graphContainer.data.range );
    graphContainer.scales.yScale.domain([0, d3.max(data, function(d){
                                       return + d.value; })]);
  };

  nbviz.customXScale = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart

    graphContainer.scales.xScale.domain( data.map(function(d){ return d.key; }) );
  };


}(window.nbviz=window.nbviz || {}));