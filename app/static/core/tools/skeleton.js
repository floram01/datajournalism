(function(nbviz){

  //filter
  nbviz.FILTERS.forEach(function(f){
    d3.select('#menu')
    .append('div')
    .attr({
      'id': f.dimension + '-select',
    })
  })

  // charts
  nbviz.CHARTS.forEach(function(f){
    d3.select('#chart-holder')
    .append('div')
    .attr({
      'class':f.dim.width,
      'id':'div' + f._id
    })
    .style({
      'position':'relative',
      'height':f.dim.height
    });
  });

  window.addEventListener('resize', nbviz.resize);

}(window.nbviz=window.nbviz || {}));