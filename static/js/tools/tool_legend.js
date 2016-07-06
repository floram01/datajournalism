// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

  nbviz.addLegend = function(graphContainer, dimensionName){
    var _options = nbviz[dimensionName + 'Values'];//à généraliser a priori resetValue contient All pas top
    _options.shift(0);
    graphContainer.legend = graphContainer.svg.append('g')
        .attr('transform', "translate(10, 10)")
        .attr('class', 'labels')
        .selectAll('label').data(_options)//à généraliser, notamment le shift
        .enter().append('g')
        .attr('transform', function(d, i) {
            return "translate(0," + i * 10 + ")"; 
        });
};
  
  nbviz.circleLegend = function(graphContainer){
    graphContainer.legend.append('circle')
      .attr('class', 'legend') 
      .attr('fill', (nbviz.categoryFill)) 
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