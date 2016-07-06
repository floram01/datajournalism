// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

  nbviz.valuePerCapita = 0; // metric flag
  nbviz.activeCountry = null;
  nbviz.TRANS_DURATION = 1500; // length in ms for our transitions
  nbviz.MAX_CENTROID_RADIUS = 30;
  nbviz.MIN_CENTROID_RADIUS = 2;
  nbviz.COLORS = {palegold:'#E6BE8A'}; // any named colors we use
  $EVE_API = 'http://localhost:5000/api/';//adress where the servor api is serving the database

  nbviz.ALL_CATS = 'All Categories';
  nbviz.ALL_GENDERS = 'All'
  nbviz.ALL_COUNTRIES='All Countries'


// if items in data then we're dealing with a mongoDB object and we take its items
// else we have a simple object and return it directly
  nbviz.getDataFromAPI = function(resource, callback){
      d3.json($EVE_API + resource, function(error, data) {
        if('_items' in data){ 
          callback(null, data._items); 
        }
        else{
          callback(null, data);
        }

        if(error){
          return callback(error);
        }
      });
  };

  // nest data (entries) sharing same dimension 'key'
  // build or update a data object in graphContainer containing the nested data and some parameters
  nbviz.nestDataByKey = function(entries, key, graphContainer) {          
    graphContainer.data = graphContainer.data || {};

    graphContainer.data.main = data = d3.nest()
    .key(function(w){return w[key]})
    .entries(entries);

    graphContainer.data.min = d3.min(data, function(d){return d.key;});
    graphContainer.data.max = d3.max(data, function(d){return d.key;});
    graphContainer.data.range = d3.range(+ graphContainer.data.min, + graphContainer.data.max + 1);
    graphContainer.data.maxLength = d3.max(data, function(d){return d.values.length}) + 1;
    return data
  };

//range à généraliser en fonction des besoins identifiés au fur et à mesure
  nbviz.addDataInfo = function(data, key, graphContainer) {          
    graphContainer.data = graphContainer.data || {};

    graphContainer.data.min = d3.min(data, function(d){return d[key];});
    graphContainer.data.max = d3.max(data, function(d){return d[key];});
    graphContainer.data.range = d3.range(data.length);
    
    return data
  };

// sort the data grouped by country and drop countries with value of 0
  nbviz.getCountryData = function() {
    var countryGroups = nbviz.countryDim.group().all(); 

    // make main data-ball
    var data = countryGroups
        .sort(function(a, b) { 
            return b.value - a.value; // descending
        });
        data=data.filter(function(d){return d.value > 0});
    return data;
};

  // set up the dimensions of the crossfilter
  nbviz.makeFilterAndDimensions = function(winnersData){
    nbviz.filter=crossfilter(winnersData);
    
    nbviz.categoryDim = nbviz.filter.dimension(function(o) {
      return o.category;
    });
    nbviz.countryDim = nbviz.filter.dimension(function(o) {
      return o.country;
    });
    nbviz.genderDim = nbviz.filter.dimension(function(o) {
      return o.gender;
    });
  };

// based on a filterTool dimension crossfilter object extract the values of the dimension and add a resetValue
  nbviz.listOptions = function(data, filterTool, _id, resetValue) {
    _options=[resetValue];
    filterTool.group().all().forEach(function(o){
        _options.push(o[_id]);
    });
    return _options;
};

// populate a filter (locationID) with the values linked to a filterTool
// use listOption
// use onDataChange
  nbviz.addFilter = function(data, _id, locationID, filterTool, resetValue, name){
     
    _options=nbviz.listOptions(data, filterTool, _id, resetValue);
    // if(_options[0].includes('All')){_options.shift(0)};//à généraliser a priori resetValue contient All pas top
    nbviz[name] = _options;
    
    _filter = d3.select('#' + locationID);
    _filter
      .selectAll('options')
      .data(_options)
      .enter()
      .append('option')
      .attr('value', function(d){return d;})
      .html(function(d){return d;});

    _filter.on('change', function(d){
      var category = d3.select(this).property('value');
      if (category===resetValue){
          filterTool.filter();
        } else {
          filterTool.filter(category);
        };
      nbviz.onDataChange();
  });
};
  // iter though an array offilters object
 // {data:, _id:'key' of the crossfilter dimension object, locationID:'cssID select', filterTool:crossfilterDimensionObject, resetValue:nbviz.myCatResetValue, name:'myName'},
  nbviz.addAllFilters = function(filters){
    filters.forEach(function(o){
      nbviz.addFilter(o.data, o._id, o.locationID, o.filterTool, o.resetValue, o.name);
    });
};

  nbviz.onDataChange = function() {
      var data = nbviz.getCountryData();
      nbviz.updateBarchart(data,nbviz.barchart);
      // nbviz.updateMap(data);
      // nbviz.updateList(nbviz.countryDim.top(Infinity));
      data = nbviz.nestDataByKey(nbviz.countryDim.top(Infinity), 'year', nbviz.timeline);
      nbviz.updateTimeline(data, nbviz.timeline);
  };

}(window.nbviz=window.nbviz || {}));