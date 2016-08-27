// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

  nbviz.addLegend = function(graphContainer){
    var dimensionName = graphContainer.dataGetterParams.colorKey;
    var _options = nbviz[graphContainer.chartsParams._id + dimensionName + 'Values'];
    //filters for resetValues to be excluded from the legend
    graphContainer.chartsParams.filters.forEach(function(d){
      if(d.dimension === dimensionName){
        var i = _options.indexOf(d.resetValue);
        if(i!==-1){_options.splice(i,1)};        
      }

    });

    graphContainer.legend = graphContainer.svg.append('g')
        .attr('transform', "translate(10, 10)")
        .attr('class', 'labels')
        .selectAll('label').data(_options)//à généraliser, notamment le shift
        .enter().append('g')
        .attr('transform', function(d, i) {
            return "translate(0," + i * 10 + ")"; 
        });
};
  // fill à généraliser, nbviz.categoryFill ne dépend pas du graphContainer et n'est pas un param d'add legend
  nbviz.circleLegend = function(graphContainer){
    graphContainer.legend.append('circle')
      .attr('class', 'legend') 
      .attr('fill', function(d){return nbviz.categoryFill(d,graphContainer)}) 
      .attr('r', graphContainer.scales.xScale.rangeBand()/2);
};
  
  nbviz.textLegend = function(graphContainer){
    graphContainer.legend.append('text')
    .text(function(d) {
        return d;
    })
    .attr('dy', '0.4em')
    .attr('x', 10);
};

}(window.nbviz=window.nbviz || {}));