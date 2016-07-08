d3.queue()
  // .defer(d3.json, "static/data/world-110m.json") 
  // .defer(d3.csv, "static/data/world-country-names-nobel.csv")
  // .defer(d3.json, "static/data/winning_country_data.json")
  .defer(nbviz.getDataFromAPI, nbviz.FULL_DATA) 
  .await(ready);

function ready(error, data) {
 // LOG ANY ERROR TO CONSOLE
  if(error){
      return console.warn(error);
  }

  nbviz.makeFilterAndDimensions(data, nbviz.FILTERS);
  
  nbviz.CHARTS.forEach(function(chartParams){
    nbviz.initGraphContainer(chartParams);
    nbviz['build' + chartParams._type](
      nbviz[chartParams._id]
      )
      
  })
};
