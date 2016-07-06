var query_winners = 'winners?projection=' +
  JSON.stringify( {"mini_bio":0, "bio_image":0} );
var query_test = 'full_data?projection=' +
  JSON.stringify( {"mini_bio":0} );

d3.queue()
  // .defer(d3.json, "static/data/world-110m.json") 
  // .defer(d3.csv, "static/data/world-country-names-nobel.csv")
  // .defer(d3.json, "static/data/winning_country_data.json")
  .defer(nbviz.getDataFromAPI, query_test) 
  .await(ready);

function ready(error, winnersData) {
 // LOG ANY ERROR TO CONSOLE
  if(error){
      return console.warn(error);
  }
  // A refacto, il manque encore une couche d'abstraction (dico associant les dims, les graphs, etc?)

  //INIT with various custom functions
  nbviz.filter = {} || nbviz.filter;
  
  // MAKE OUR FILTER AND ITS DIMENSIONS ==> improve abstraction
  nbviz.makeFilterAndDimensions(winnersData);
  // add filters
  nbviz.addAllFilters(
    [
      {data:winnersData, _id:'key', locationID:'cat-select select', filterTool:nbviz.categoryDim, resetValue:nbviz.ALL_CATS, name:'categories'},
      {data:winnersData, _id:'key', locationID:'gender-select select', filterTool:nbviz.genderDim, resetValue:nbviz.ALL_GENDERS, name:'genders'},
      {data:winnersData, _id:'key', locationID:'country-select select', filterTool:nbviz.countryDim, resetValue:nbviz.ALL_COUNTRIES, name:'countries'}
    ]
  )
  
  // STORE OUR COUNTRY-DATA DATASET
  nbviz.data.winnersData = winnersData;
  // STORE OUR COUNTRY-DATA DATASET
  // nbviz.data.countryData = countryData;
  //GET BY COUNTRY DATA 
  nbviz.data.countryData=nbviz.getCountryData();
  // INITIALIZE MENU AND MAP
  // nbviz.initMenu();
  // nbviz.initMap(worldMap, countryNames);
  // TRIGGER UPDATE WITH FULL WINNERS' DATASET
  // nbviz.onDataChange();
  // Add barchart SVG to the DOM
  nbviz.buildBarchart(nbviz.data.countryData, nbviz.barchart);
  //Add timeline
  nbviz.initGraphContainer('timeline', {top:20, right:20, bottom:40, left:20}, {interbar:.1, left:20, bottom:20}, '#nobel-time', 'timeline', 'timeline')
  nbviz.buildTimeline(
    nbviz.nestDataByKey(winnersData, 'year', nbviz.timeline),
    nbviz.timeline
  )
}
