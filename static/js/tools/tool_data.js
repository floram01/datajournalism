// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

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

// based on a filterTool dimension crossfilter object extract the values of the dimension and add a resetValue
  nbviz.listOptions = function(data, filterTool, resetValue) {
    _options=[resetValue];
    filterTool.group().all().forEach(function(o){
        _options.push(o.key);
    });
    return _options;
};

// populate a filter (locationID) with the values linked to a filterTool
// use listOption
// use onDataChange
  nbviz.addFilter = function(data, filterParams){
    _options=nbviz.listOptions(data, filterParams.filterTool, filterParams.resetValue);
    // if(_options[0].includes('All')){_options.shift(0)};//à généraliser a priori resetValue contient All pas top
    nbviz[filterParams.dimension + 'Values'] = _options;
    
    _filter = d3.select('#' + filterParams.locationID);
    _filter
      .selectAll('options')
      .data(_options)
      .enter()
      .append('option')
      .attr('value', function(d){return d;})
      .html(function(d){return d;});

    _filter.on('change', function(d){
      var category = d3.select(this).property('value');
      if (category===filterParams.resetValue){
          filterParams.filterTool.filter();
        } else {
          filterParams.filterTool.filter(category);
        };
      nbviz.onDataChange();
  });
};

  // set up the dimensions of the crossfilter
  nbviz.makeFilterAndDimensions = function(winnersData, filters){
    nbviz.filter=crossfilter(winnersData);
    filters.forEach(function(f){
      f.filterTool = nbviz[f.dimension + 'Dim'] = nbviz.filter.dimension(function(o) {
        return o[f.dimension];
      });
      nbviz.addFilter(winnersData, f);      
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