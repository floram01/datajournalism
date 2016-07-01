var query_winners = 'winners?projection=' +
  JSON.stringify( {"mini_bio":0, "bio_image":0} );
var query_test = 'full_data?where=' +
  JSON.stringify( {"gender":"female"} );

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

  // STORE OUR COUNTRY-DATA DATASET
  nbviz.data.winnersData = winnersData;
  // STORE OUR COUNTRY-DATA DATASET
  // nbviz.data.countryData = countryData;
  // MAKE OUR FILTER AND ITS DIMENSIONS
  nbviz.makeFilterAndDimensions(winnersData);
  //GET BY COUNTRY DATA 
  nbviz.data.countryData=nbviz.getCountryData();
  // INITIALIZE MENU AND MAP
  // nbviz.initMenu();
  // nbviz.initMap(worldMap, countryNames);
  // TRIGGER UPDATE WITH FULL WINNERS' DATASET
  // nbviz.onDataChange();

  // Add barchart SVG to the DOM
  nbviz.buildBarchart(nbviz.data.countryData, "#nobel-bar", "bar", nbviz.margin.barchart);
}
