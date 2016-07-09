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
    .attr('id', f.dimension + '-select')
    .text(f.name)
    .append('select')
  })

  // charts
  nbviz.CHARTS.forEach(function(f){
    d3.select('#chart-holder')
    .append('div')
    .attr('id',f.divID)
    .style({
      'position':'relative',
      'top':f.dim.top,
      'left':f.dim.left,
      'height':f.dim.height,
      'width':f.dim.width
    })
  });

}(window.nbviz=window.nbviz || {}));

nbviz.skeleton()