d3.queue()
  // .defer(d3.json, "static/data/world-110m.json") 
  // .defer(d3.csv, "static/data/world-country-names-nobel.csv")
  // .defer(d3.json, "static/data/winning_country_data.json")
  .defer(nbviz.getDataFromAPI, nbviz.FULL_DATA) 
  .await(ready);

function ready(error, winnersData) {
 // LOG ANY ERROR TO CONSOLE
  if(error){
      return console.warn(error);
  }

  // MAKE OUR FILTER AND ITS DIMENSIONS ==> improve abstraction
  // add filters
  nbviz.makeFilterAndDimensions(winnersData, nbviz.FILTERS);
  
  //GET BY COUNTRY DATA 
  // INITIALIZE MENU AND MAP
  // nbviz.initMenu();
  // nbviz.initMap(worldMap, countryNames);
  // TRIGGER UPDATE WITH FULL WINNERS' DATASET
  // nbviz.onDataChange();
  // Add barchart SVG to the DOM  
  
  //change this so that it mainly goes in parameters
  nbviz.initGraphContainer(
    'barchart', {top:20, right:20, bottom:60, left:40}, {interbar:.1, left:20, bottom:20}, '#nobel-bar', 'barchart', 'barchart'
  );
  nbviz.buildBarchart(
    nbviz.getCountryData(),
    nbviz.barchart
  );
  //Add timeline
  
  nbviz.initGraphContainer(
    'timeline', {top:20, right:20, bottom:40, left:20}, {interbar:.1, left:20, bottom:20}, '#nobel-time', 'timeline', 'timeline'
    );
  nbviz.buildTimeline(
    nbviz.nestDataByKey(winnersData, 'year', nbviz.timeline),
    nbviz.timeline
  );
}
