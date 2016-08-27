(function(nbviz){


  // charts
  nbviz.CHARTS.forEach(function(f){
    //filter
    d3.select('#chart-holder')
      .append('div')
      .attr({
        'id':f._id + 'menu',
        'class':'menu'
      });

    f.filters.forEach(function(filter){
      d3.select('#' + f._id + 'menu')
      .append('div')
      .attr({
        'id': filter.dimension + '-select',
      })
    });

    f.charts.forEach(function(chart){
      d3.select('#chart-holder')
      .append('div')
      .attr({
        'class':chart.dim.width,
        'id':'div' + chart._id
      })
      .style({
        'position':'relative',
        'height':chart.dim.height
      });
    });
  });

  window.addEventListener('resize', nbviz.resize);

}(window.nbviz=window.nbviz || {}));