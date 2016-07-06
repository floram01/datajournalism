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
  var _filters=[
    {locationID:'cat-select select', dimension:'category', resetValue:nbviz.ALL_CATS},
    {locationID:'gender-select select', dimension:'gender', resetValue:nbviz.ALL_GENDERS},
    {locationID:'country-select select', dimension:'country', resetValue:nbviz.ALL_COUNTRIES}
  ];

  nbviz.makeFilterAndDimensions(winnersData, _filters);

  nbviz.addAllFilters(
    [
      {data:winnersData, _id:'key', locationID:'cat-select select', filterTool:nbviz.categoryDim, resetValue:nbviz.ALL_CATS, name:'categories'},
      {data:winnersData, _id:'key', locationID:'gender-select select', filterTool:nbviz.genderDim, resetValue:nbviz.ALL_GENDERS, name:'genders'},
      {data:winnersData, _id:'key', locationID:'country-select select', filterTool:nbviz.countryDim, resetValue:nbviz.ALL_COUNTRIES, name:'countries'}
    ]
  );
  
  //GET BY COUNTRY DATA 
  // INITIALIZE MENU AND MAP
  // nbviz.initMenu();
  // nbviz.initMap(worldMap, countryNames);
  // TRIGGER UPDATE WITH FULL WINNERS' DATASET
  // nbviz.onDataChange();
  // Add barchart SVG to the DOM  
  
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
