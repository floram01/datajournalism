(function(nbviz){
//improvements: generalise more elements in core, factorise between build and update
  
  nbviz.format = function(element, graphContainer) {
    element = nbviz.formatPrecision(element, graphContainer);
    return element
  };

  nbviz.formatPrecision = function(element, graphContainer) {
    var my_precision = element.precision || ',.0f';
    var my_format = d3.format(my_precision);
    return my_format(element[graphContainer._value])
  };

}(window.nbviz=window.nbviz || {}));