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
  
  // MAKE OUR FILTER AND ITS DIMENSIONS
  nbviz.makeFilterAndDimensions(winnersData);
  // add filters
  nbviz.addFilter(winnersData, 'key', 'cat-select select', nbviz.categoryDim, nbviz.ALL_CATS);
  nbviz.addFilter(winnersData, 'key', 'gender-select select', nbviz.genderDim, nbviz.ALL_GENDERS);
  nbviz.addFilter(winnersData, 'key', 'country-select select', nbviz.countryDim, nbviz.ALL_COUNTRIES);
  
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
}
