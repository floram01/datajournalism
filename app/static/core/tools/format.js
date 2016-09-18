(function(nbviz){
//improvements: generalise more elements in core, factorise between build and update
  
  nbviz.format = function(element, graphContainer) {
    element = nbviz.formatPrecision(element, graphContainer);
    return element
  };

  nbviz.formatPrecision = function(value, element, graphContainer) {
    var my_precision = graphContainer.precision[element] || ',.0f';
    var my_format = d3.format(my_precision);
    return my_format(value)
    };

}(window.nbviz=window.nbviz || {}));