q = d3.queue()
  // .defer(d3.json, "static/data/world-110m.json") 
  // .defer(d3.csv, "static/data/world-country-names-nobel.csv")
  // .defer(d3.json, "static/data/winning_country_data.json")
  // .defer(nbviz.getDataFromAPI, nbviz.FULL_DATA) 

nbviz.DATA_PROVIDER.params.forEach(function(param){
  q.defer(nbviz.prepareDataSet, param)
})

  // q.defer(d3.csv, 'static/viz/summer_olympics/data_heatmap.csv') 
 
  q.awaitAll(ready);

// d3.json('/static/data/full_data_records.json', function(json){debugger;});

function ready(error, data) {
 // LOG ANY ERROR TO CONSOLE
  if(error){
      return console.warn(error);
  }
  // nbviz.STATIC_DATA = {};
  // nbviz.STATIC_DATA.heatmap = data[1];
  nbviz.makeFilterAndDimensions(nbviz.DATASTORE[nbviz.FULL_DATA], nbviz.FILTERS);
  // add title etc.
  nbviz.buildStory();
  nbviz.CHARTS.forEach(function(chartParams, i){
    nbviz.initGraphContainer(chartParams);
    nbviz['build' + chartParams._type](
      nbviz.charts[i]
      )
  });
  nbviz.addText();
};
