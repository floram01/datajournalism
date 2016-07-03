(function(nbviz){
  var catList = [nbviz.ALL_CATS].concat(nbviz.CATEGORIES);
  var catSelect = d3.select('#cat-select select');
  
  catSelect.selectAll('options')
  .data(catList)
  .enter()
  .append('option')
  .attr('value', function(d){return d;})
  .html(function(d){return d;});

  catSelect.on('change', function(d){
    var category = d3.select(this).property('value');
    if(category===nbviz.ALL_CATS){nbviz.categoryDim.filter()}else{nbviz.categoryDim.filter(category)};
    nbviz.onDataChange();
  })

}(window.nbviz=window.nbviz||{}));