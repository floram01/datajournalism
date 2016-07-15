d3.queue()
  // .defer(d3.json, "static/data/world-110m.json") 
  // .defer(d3.csv, "static/data/world-country-names-nobel.csv")
  // .defer(d3.json, "static/data/winning_country_data.json")
  // .defer(nbviz.getDataFromAPI, nbviz.FULL_DATA) 
  .defer(d3.csv, 'static/viz/nobel/data_heatmap.csv') 
  .defer(
    nbviz.DATA_PROVIDER.getterFunction,
    nbviz.DATA_PROVIDER.params
    ) 
  .await(ready);

// d3.json('/static/data/full_data_records.json', function(json){debugger;});

function ready(error, data_heatmap, data_csv) {
 // LOG ANY ERROR TO CONSOLE
  if(error){
      return console.warn(error);
  }

  debugger;

  nbviz.makeFilterAndDimensions(data, nbviz.FILTERS);
  
  nbviz.CHARTS.forEach(function(chartParams, i){
    nbviz.initGraphContainer(chartParams);
    nbviz['build' + chartParams._type](
      nbviz.charts[i]
      )
  })
};
