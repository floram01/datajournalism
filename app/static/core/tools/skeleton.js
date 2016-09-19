(function(nbviz){


  // charts
  nbviz.CHARTS.forEach(function(f){
    //filter
    d3.select('#global-container')
      .append('div')
      .attr({
        'id':f._id + 'sub-container',
        'class':'container sub-container'
      });

    var topContainer = d3.select('#' + f._id + 'sub-container')
      .append('div')
      .attr({
        'id':f._id + 'top-container',
        'class':'col-md-12',
      });
    
    topContainer
    // d3.select('#' + f._id + 'sub-container')
      .append('div')
      .attr({
        'id':f._id + 'title-container',
        'class':'col-md-4 title-container'
      });

    // d3.select('#' + f._id + 'sub-container')
    topContainer
      .append('div')
      .attr({
        'id':f._id + 'comment-container',
        'class':'col-md-8 comment-container'
      });

    d3.select('#' + f._id + 'sub-container')
      .append('div')
      .attr({
        'id':f._id + 'chart-holder',
        'class':'row'
      })
      .append('div')
      .attr({
        'id':f._id + 'menu',
        'class':'menu col-md-12'
      });

    d3.select('#' + f._id + 'sub-container')
      .append('div')
      .attr({
        'id':f._id + 'sources-container',
        'class':'col-md-12 sources-container'
      });

    f.filters.forEach(function(filter){
      d3.select('#' + f._id + 'menu')
      .append('div')
      .attr({
        'id': f._id + filter.dimension + '-select',
      })
    });


    f.chartsParams.forEach(function(chart){

      d3.select('#' + f._id + 'chart-holder')
      .append('div')
      .attr({
        'class':chart.dim.width ,
      })
      .append('div')
      .attr({
        'class':chart.dim.width + ' legend',
        'id':'divLegend' + chart._id
      })
      .style({
        'position':'relative',
        'height':'auto'
      });

      d3.select('#' + f._id + 'chart-holder')
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

    d3.select('#' + f._id + 'sub-container')
      .append('div')
      .attr({
        'id':f._id + 'main-text',
        'class':'main-text col-md-12',
      });

  });

  window.addEventListener('resize', nbviz.resize);

}(window.nbviz=window.nbviz || {}));