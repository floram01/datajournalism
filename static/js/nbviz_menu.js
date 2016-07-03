(function(nbviz){
  var catList = [nbviz.ALL_CATS].concat(nbviz.CATEGORIES);
  var catSelect = d3.select('#cat-select select');
  
  // 3rd argument = resetValue, if no resetValue juste enter false
  nbviz.addFilter(catList, 'cat-select select', nbviz.ALL_CATS);

  // catSelect.on('change', function(d){
  //   var category = d3.select(this).property('value');
  //   if(category===nbviz.ALL_CATS){nbviz.categoryDim.filter()}else{nbviz.categoryDim.filter(category)};
  //   nbviz.onDataChange();
  // })

}(window.nbviz=window.nbviz||{}));