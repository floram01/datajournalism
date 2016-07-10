(function(nbviz){
  nbviz.skeleton = function(){
  //main info
  d3.select('#title')
  .text(nbviz.STORY.title);

  d3.select('#info')
  .style({
    'position':'absolute',
    'font-size':'11px',
    'top': '18px',
    'width':'300px',
    'right':'0px'
  })
  .text(nbviz.STORY._info);
};

  //filter
  nbviz.FILTERS.forEach(function(f){
    d3.select('#menu')
    .append('div')
    .attr({
      'id': f.dimension + '-select',
      'class':'col-md-4'
    })
    .text(f.name)
    .append('select')
  })

  // charts
  nbviz.CHARTS.forEach(function(f){
    d3.select('#chart-holder')
    .append('div')
    .attr({
      'class':f.dim.width,
      'id':f.divID
    })
    .style({
      'position':'relative',
      'height':f.dim.height
    });

  });

  // nbviz.resize = function(d){
  //   nbviz.charts.forEach(function(chart){
  //     nbviz.updateSVG(chart);
  //     nbviz['update' + chart._type](chart);
  //   })
  // };

  window.addEventListener('resize', nbviz.resize);

}(window.nbviz=window.nbviz || {}));

nbviz.skeleton()