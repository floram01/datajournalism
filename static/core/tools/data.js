// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

// if items in data then we're dealing with a mongoDB object and we take its items
// else we have a simple object and return it directly
  nbviz.prepareDataSet = function(param, callback){
    nbviz.DATASTORE = nbviz.DATASTORE || {}
    nbviz.DATASTORE[param.name] = param.getterFunction(param, callback)
  };

  nbviz.getDataFromAPI = function(params, callback){
      d3.json($EVE_API + params.resource, function(error, data) {
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
  
  nbviz.getDataFromJSON = function(params, callback){
      d3.json(params.source, function(error, data) {    
        if(error){
          return callback(error);
        } else {
          nbviz.DATASTORE[params.name] = data;
          callback(null, data);
        };
      });
  };

  nbviz.getDataFromCSV = function(params, callback){
      d3.csv(params.source, function(error, data) {    
        if(error){
          return callback(error);
        } else {
          nbviz.DATASTORE[params.name] = data;
          callback(null, data);
        };
      });
  };

  nbviz.fullData = function(graphContainer) {          
    var data = nbviz.DATASTORE[graphContainer.domain]
    return data
  };

  // nest data (entries) sharing same dimension 'key'
  // build or update a data object in graphContainer containing the nested data and some parameters
  nbviz.nestDataByKey = function(graphContainer) {          
    var _dim = graphContainer.dataGetterParams.groupDim;
    var entries = nbviz[_dim + 'Dim'].top(Infinity);
    var _key = graphContainer.timeID;

    var data = d3.nest()
    .key(function(w){return w[_key]})
    .entries(entries);

    return data
  };

// add a case with no grouping i.e. if groupDim is null: just sort and filter
  nbviz.groupBy = function(graphContainer) {
    var _dim = graphContainer.dataGetterParams.groupDim;
    var data = nbviz[_dim + 'Dim'].group().all()
        .sort(function(a, b) { 
            return b.value - a.value; // descending
        })
        .filter(function(d){return d.value > 0});
    return data;
};

// add a case with no grouping i.e. if groupDim is null: just sort and filter
  nbviz.allDataSortedByKey = function(graphContainer) {
    var _dim = graphContainer.dataGetterParams.groupDim;
    var data = nbviz[_dim + 'Dim'].top(Infinity).sort(function(a, b) {
      return +b[graphContainer._key] - +a[graphContainer._key];
    });
    return data;
};
// add a case with no grouping i.e. if groupDim is null: just sort and filter
  nbviz.myGetter = function(graphContainer) {
    var _dim = graphContainer.dataGetterParams.groupDim;
    var top = graphContainer.dataGetterParams.top;
    var top_num = graphContainer.dataGetterParams.top_num;

    var data = nbviz[_dim + 'Dim'].top(Infinity).sort(function(a, b) {
      if (top){
        return +b[graphContainer._value] - +a[graphContainer._value];
      }else {return +b[graphContainer._value] - +a[graphContainer._value];}
    });

    return data.slice(0,top_num);
};

//range à généraliser en fonction des besoins identifiés au fur et à mesure
  nbviz.addDataBarchartInfo = function(data, graphContainer) {          
    graphContainer.data = graphContainer.data || {};
    graphContainer.data.pointRange = d3.range(data.length);
    
    return data
  };

//range à généraliser en fonction des besoins identifiés au fur et à mesure
  nbviz.addDataHorizontalBarchartInfo = function(data, graphContainer) {          
    graphContainer.data = graphContainer.data || {};
    graphContainer.data.pointRange = d3.range(data.length);
    
    return data
  };

//range à généraliser en fonction des besoins identifiés au fur et à mesure
  nbviz.addDataTimelineInfo = function(data, graphContainer) {          
    graphContainer.data = graphContainer.data || {};

    var groupID = graphContainer.groupID;
    var _key = graphContainer._key;

    graphContainer.data.valueRange = d3.range(
      + d3.min(data, function(d){return d[_key];}),
      + d3.max(data, function(d){return d[_key];}) + 1
       );
    graphContainer.data.maxGroupLength = d3.max(data, function(d){return d[groupID].length}) + 1;
    
    return data
  };

//range à généraliser en fonction des besoins identifiés au fur et à mesure
  nbviz.addDataHeatmapInfo = function(data, graphContainer) {          
    graphContainer.data = graphContainer.data || {};

    graphContainer.data.min = d3.min(data, function(d){return + d[graphContainer._value];});
    graphContainer.data.max = d3.max(data, function(d){return + d[graphContainer._value];});
    graphContainer.data.xRange = d3.range(0, d3.max(data, function(d){return + d[graphContainer.xIndex];}) + 1);
    graphContainer.data.yRange = d3.range(0, d3.max(data, function(d){return + d[graphContainer.yIndex];}) + 1);
    return data
  };

// based on a filterTool dimension crossfilter object extract the values of the dimension and add a resetValue
  nbviz.listOptions = function(data, filterTool, resetValue) {
    // _options=[resetValue];
    var _options = [];
    filterTool.group().all().forEach(function(o){
        _options.push(o.key);
    });
    return _options;
};

// populate a filter (locationID) with the values linked to a filterTool
// use listOption
// use onDataChange
  nbviz.addFilter = function(data, filterParams){
    // d3.select('#menu')
    // .append('div')
    // .attr('id', filterParams.dimension + '-select')
    // .text(filterParams.name)
    // .append('select');
    _options=nbviz.listOptions(data, filterParams.filterTool, filterParams.resetValue);
    // if(_options[0].includes('All')){_options.shift(0)};//à généraliser a priori resetValue contient All pas top
    nbviz[filterParams.dimension + 'Values'] = _options;
    
    _filter = d3.select('#' + filterParams.dimension + '-select select');
    _filter
      .selectAll('options')
      .data(_options)
      .enter()
      .append('option')
      .attr('value', function(d){return d;})
      .html(function(d){return d;});

    filterParams.filterTool.filter(filterParams.defaultValue);

    _filter.on('change', function(d){
      var category = d3.select(this).property('value');
      // if (category===filterParams.resetValue){
      //     filterParams.filterTool.filter();
      //   } else {
      //     filterParams.filterTool.filter(category);
      //   };
      filterParams.filterTool.filter(category);
      nbviz.onDataChange();

      // select the default value

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

// to generalize iterating through all the graphs and updating the data, the data getter function has to be linked to 
//the graphContainer itself
  nbviz.onDataChange = function() {
      nbviz.charts.forEach(function(chart){
        nbviz['update'+chart._type](chart);
    });
  };

}(window.nbviz=window.nbviz || {}));