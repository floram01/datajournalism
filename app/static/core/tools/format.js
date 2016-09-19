(function(nbviz){
//improvements: generalise more elements in core, factorise between build and update
  
  nbviz.format = function(element, graphContainer) {
    element = nbviz.formatPrecision(element, graphContainer);
    return element
  };

  nbviz.formatPrecision = function(element, value, graphContainer) {
    if(graphContainer.precision[value].type == 'column'){
      var my_precision = element[graphContainer.precision[value].precisionCol] || ',.0f';
    }else{
      var my_precision = graphContainer.precision[value] || ',.0f';
    }
    var my_format = d3.format(my_precision);
    return my_format(element[value])
    };

}(window.nbviz=window.nbviz || {}));