// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

// if items in data then we're dealing with a mongoDB object and we take its items
// else we have a simple object and return it directly
  nbviz.prepareDataSet = function(param, callback){
    nbviz.DATASTORE = nbviz.DATASTORE || {}
    param.getterFunction(param, callback)
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
  // a mettre à part
  nbviz.parseDate = function(params, data){
    parseDate = d3.time.format(params.format).parse;
    data.forEach(function(d){
      d[params.dimension] = parseDate(String(d[params.dimension]));
    });
    return data
  };
  
  //mettre à part la part de formating en construisant une fonction format-manager?
  nbviz.getDataFromJSON = function(params, callback){
      d3.json(nbviz.DATA_PATH + params.source, function(error, data) {    
        if(error){
          return callback(error);
        } else {
          if(params.parseDate){data = nbviz.parseDate(params.parseDate, data)};
          if(params.type==='local'){
            nbviz.CHARTS.forEach(function(chartsParams){
            nbviz.DATASTORE[params.name + chartsParams._id] = data;
            });
          }else{
            nbviz.DATASTORE[params.name] = data;
          };
          callback(null, data);
        };
      });
  };

  nbviz.getDataFromCSV = function(params, callback){
      d3.csv(nbviz.DATA_PATH + params.source, function(error, data) {    
        if(error){
          return callback(error);
        } else {
          if(params.type==='local'){
            nbviz.CHARTS.forEach(function(chartsParams){
            nbviz.DATASTORE[params.name + chartsParams._id] = data;
            });
          }else{
            nbviz.DATASTORE[params.name] = data;
          };
          callback(null, data);
        };
      });
  };

  nbviz.fullData = function(graphContainer) {          
    var data = nbviz.DATASTORE[graphContainer.domain + graphContainer.chartsParams._id]
    if(graphContainer.sort){
      if(graphContainer._sort=='desc'){
        data.sort(function(a,b){
          return b.sortKey - a.sortKey;
        })
      }
    }
    return data
  };

  // nest data (entries) sharing same dimension 'key'
  // build or update a data object in graphContainer containing the nested data and some parameters
  
  nbviz.nestDataByKey = function(graphContainer) {          
    var _dim = graphContainer.dataGetterParams.dim;
    var entries = nbviz[graphContainer.chartsParams._id + _dim + 'Dim'].top(Infinity);
    var _value= graphContainer._value;
    var format = graphContainer.format?graphContainer.format.flag:null;
    var sort = graphContainer.dataGetterParams.sort;

    // A generalise dans le script formatting
    if(sort){
      entries = entries.sort(function(a, b) { 
            return a.Edition - b.Edition; // descending
        })
    };
    var _key = graphContainer.dataGetterParams.nestKey;

    var data = d3.nest()
    .key(function(w){return w[_key]})
    .entries(entries);
    
    graphContainer.groupID = 'values';
    graphContainer._label = 'key';
    return data
  };

// add a case with no grouping i.e. if groupDim is null: just sort and filter
  nbviz.groupBy = function(graphContainer) {
    var _dim = graphContainer.dataGetterParams.groupDim;
    var data = nbviz[graphContainer.chartsParams._id + _dim + 'Dim'].group().all()
        .sort(function(a, b) { 
            return b[graphContainer._value] - a[graphContainer._value]; // descending
        })
        .filter(function(d){return d[graphContainer._value] !== 0});

    graphContainer._label = 'key';
    if(graphContainer.dataGetterParams.customAxis){
      graphContainer['_' + graphContainer.dataGetterParams.customAxis + 'Key'] = 'key'
    };

    return data;
};

// add a case with no grouping i.e. if groupDim is null: just sort and filter
  
  nbviz.allDataSortedByKey = function(graphContainer) {
    var _dim = graphContainer.dataGetterParams.dim;
    var data = nbviz[graphContainer.chartsParams._id + _dim + 'Dim'].top(Infinity).sort(function(a, b) {
      return +b[graphContainer.dataGetterParams.sortKey] - +a[graphContainer.dataGetterParams.sortKey];
    });
    return data;
};
// add a case with no grouping i.e. if groupDim is null: just sort and filter
  nbviz.topFlop = function(graphContainer) {
    var _dim = graphContainer.dataGetterParams.dim;
    var top = graphContainer.dataGetterParams.top;
    var top_num = graphContainer.dataGetterParams.top_num;
    var data = nbviz[graphContainer.chartsParams._id + _dim + 'Dim'].top(Infinity).sort(function(a, b) {
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
    var _key = graphContainer._label;
    graphContainer.data.valueRange = d3.range(
      + d3.min(data, function(d){return d[_key];}),
      + d3.max(data, function(d){return d[_key];}) +1
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
//range à généraliser en fonction des besoins identifiés au fur et à mesure
  nbviz.addDataLinechartInfo = function(data, graphContainer) {          
    graphContainer.data = graphContainer.data || {};

    var groupID = graphContainer.groupID;
    var _key = graphContainer._label;
    var step = graphContainer.xStep;

    var min = d3.min(data, function(d){
          return d3.min(d.values, function(x){return x.Edition})
        })
    var max = d3.max(data, function(d){
          return d3.max(d.values, function(x){return x.Edition})
        })
    
    var max_value = d3.max(data, function(d){
          return d3.max(d.values, function(x){return x.value})
        })

    graphContainer.data.xExtent = [min, max];
    graphContainer.data.maxValue = max_value;
    return data
  };

// based on a filterTool dimension crossfilter object extract the values of the dimension and add a resetValue
  nbviz.listOptions = function(data, filterTool, resetValue) {
    var _options=[];

    if(resetValue){_options.push(resetValue)};

    filterTool.group().all().forEach(function(o){
        _options.push(o.key);
    });
    
    return _options;
};

  nbviz.addDropdownFilter = function(data, filterParams, chartsParams){

    _options=nbviz.listOptions(data, filterParams.filterTool, filterParams.resetValue);
    // if(_options[0].includes('All')){_options.shift(0)};//à généraliser a priori resetValue contient All pas top
    nbviz[chartsParams._id + filterParams.dimension + 'Values'] = _options;
    _filter = d3.select('#' + chartsParams._id + filterParams.dimension + '-select').append('select');;
    _filter
      .selectAll('options')
      .data(_options)
      .enter()
      .append('option')
      .attr('value', function(d){return d;})
      .html(function(d){return d;});

    d3.selectAll('option').filter(function(d){
      return d===filterParams.defaultValue||d===filterParams.resetValue;
    })
    .attr('selected','selected');
    
    if(filterParams.defaultValue){
      filterParams.filterTool.filter(filterParams.defaultValue);
    };

    _filter.on('change', function(d){
      var category = d3.select(this).property('value');
      if (category===filterParams.resetValue){
          filterParams.filterTool.filter();
        } else {
          filterParams.filterTool.filter(category);
        };
      // filterParams.filterTool.filter(category);
      nbviz.onDataChange(chartsParams);

      // select the default value

  });
};

  nbviz.addRadioFilter = function(data, filterParams, chartsParams){

    _options=nbviz.listOptions(data, filterParams.filterTool, filterParams.resetValue);
    // if(_options[0].includes('All')){_options.shift(0)};//à généraliser a priori resetValue contient All pas top
    nbviz[chartsParams._id + filterParams.dimension + 'Values'] = _options;
    _filter = d3.select('#' + chartsParams._id + filterParams.dimension + '-select').append('form');
    _filter
      .selectAll('label .' + chartsParams._id)
      .data(_options)
      .enter()
      .append('label')
      .html(function(d){return d;})
      .append('input')
      .attr({
        'type':'radio',
        'name':'mode',
        'class':chartsParams._id
      });

    d3.selectAll('input').filter(function(d){
      return d===filterParams.defaultValue||d===filterParams.resetValue;
    })
    .attr('checked','checked');

    if(filterParams.defaultValue){
      filterParams.filterTool.filter(filterParams.defaultValue);
    };
    d3.selectAll('label .' + chartsParams._id).on('change', function(d){
      var category = d;
      if (category===filterParams.resetValue){
          filterParams.filterTool.filter();
        } else {
          filterParams.filterTool.filter(category);
        };
      // filterParams.filterTool.filter(category);
      nbviz.onDataChange(chartsParams);

      // select the default value

  });
  };

  nbviz.addHiddenFilter = function(data, filterParams, chartsParams){
    if(filterParams.defaultValue){
      filterParams.filterTool.filter(filterParams.defaultValue);
    };
  };

  // set up the dimensions of the crossfilter
  nbviz.makeFilterAndDimensions = function(winnersData, chartsParams){
    nbviz[chartsParams._id + 'filter']=crossfilter(winnersData);
    chartsParams.filters.forEach(function(f){
      f.filterTool = nbviz[chartsParams._id + f.dimension + 'Dim'] = nbviz[chartsParams._id + 'filter'].dimension(function(o) {
        return o[f.dimension];
      });
      nbviz['add' + f.type + 'Filter'](winnersData, f, chartsParams);
    });
  };

// to generalize iterating through all the graphs and updating the data, the data getter function has to be linked to 
//the graphContainer itself
  nbviz.onDataChange = function(chartsParams) {
      chartsParams.charts.forEach(function(chart){
        nbviz['update'+chart._type](chart);
    });
  };

}(window.nbviz=window.nbviz || {}));