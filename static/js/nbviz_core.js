// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

  nbviz.data = {}; // our main data object
  nbviz.valuePerCapita = 0; // metric flag
  nbviz.activeCountry = null;
  nbviz.TRANS_DURATION = 1500; // length in ms for our transitions
  nbviz.MAX_CENTROID_RADIUS = 30;
  nbviz.MIN_CENTROID_RADIUS = 2;
  nbviz.COLORS = {palegold:'#E6BE8A'}; // any named colors we use
  $EVE_API = 'http://localhost:5000/api/';

  nbviz.barchart = {};// our main barchart object
  nbviz.barchart.margin = {top:20, right:20, bottom:60, left:40};
  nbviz.barchart.padding ={interbar:.1, left:20} 
  nbviz.barchart.divID='#nobel-bar'
  nbviz.barchart.svgID='barchart'
  nbviz.barchart._class='barchart'

  nbviz.timeline = {};// our main barchart object
  nbviz.barchart.margin = {top:20, right:20, bottom:60, left:40};
  nbviz.barchart.padding ={interbar:.1, left:20} 
  nbviz.barchart.divID='#nobel-bar'
  nbviz.barchart.svgID='barchart'
  nbviz.barchart._class='barchart'

  nbviz.ALL_CATS = 'All Categories';
  nbviz.ALL_GENDERS = 'All'
  nbviz.ALL_COUNTRIES='All Countries'

  nbviz.TRANS_DURATION = 2000
  
  nbviz.categoryFill = function(category){
    var i = nbviz.categories.indexOf(category);
      return d3.hcl(i / nbviz.categories.length * 360, 60, 70);
  };

  nbviz.initGraphContainer = function(name, margins, padding, divID, svgID, _class){
    nbviz[name] = o = {};
    o.margin = {top:margins.top, right:margins.right, left:margins.left, bottom:margins.bottom};
    o.padding = {interbar : padding.interbar, left : padding.left, bottom : padding.bottom};
    o.divID = divID;
    o.svgID = svgID;
    o._class = _class;
    o

    return o
  };

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

  nbviz.nestDataByKey = function(entries, key, graphContainer) {          
    graphContainer.data = graphContainer.data || {};

    graphContainer.data.main = data = d3.nest()
    .key(function(w){return w[key]})
    .entries(entries)

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

  nbviz.initialize = function(graphContainer, data) {
    graphContainer.svg = graphContainer.svg || {};
    graphContainer.scales = graphContainer.scales || {};
    graphContainer.axis = graphContainer.axis || {};
    graphContainer.dim = graphContainer.dim || {};
    
  };

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

// get the graphContainer div bounding rect
  nbviz.getDivByID = function(graphContainer) {
    var chartHolder=d3.select(graphContainer.divID);
    graphContainer.boundingRect = chartHolder.node().getBoundingClientRect();
  };

// set the chart dimensions based on the div dimensions - margins
  nbviz.getSVGDim = function(graphContainer) {
    var boundingRect = graphContainer.boundingRect;
    var margin = graphContainer.margin;

    var dim = {}
    dim.width = boundingRect.width - margin.left - margin.right
    dim.height = boundingRect.height - margin.top - margin.bottom
    
    graphContainer.dim = dim;
  };

//add the svg based on the div dimensions (chart dimensions + margins) 
  nbviz.addSVGtoDiv = function(graphContainer) {
    nbviz.getDivByID(graphContainer)
    nbviz.getSVGDim(graphContainer)
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var divID = graphContainer.divID;
    
    graphContainer.svg = d3.select(divID).append("svg")
    .attr('id',graphContainer.svgID)
    .attr("width", dim.width + margin.left + margin.right)
    .attr("height", dim.height + margin.top + margin.bottom)
    .append("g").classed(graphContainer._class, true)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  };

// Ajouter toutes les autres scales susceptibles d'être utilisées au fur et à mesure
  nbviz.xRangeBand = function(data, graphContainer) {
    var dim = graphContainer.dim;
    var padding = graphContainer.padding;

    var rangeBandGen = d3.scale.ordinal()
    .domain(graphContainer.data.range)
    .rangeRoundBands([padding.left, dim.width], padding.interbar)

    return rangeBandGen
  };

  nbviz.yRP = function(data, graphContainer) {
    var dim = graphContainer.dim;
    var padding = graphContainer.padding;
    var yRP = d3.scale.ordinal()
    .domain(d3.range(graphContainer.data.maxLength))
    .rangeRoundPoints([dim.height, padding.bottom])
    return yRP
  };

//Généraliser yLinearScale à LinearScale 
  nbviz.yLinearScale = function(data, graphContainer) {
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var yLinearScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d){return d.value;})])
    .rangeRound([dim.height, margin.bottom])
    return yLinearScale
  };

  nbviz.genAxis = function(graphContainer) {
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var padding = graphContainer.padding;
    var svg = graphContainer.svg;

    var yAxisPadding = margin.left - padding.left//how to avoid this? more complex than it need to be
    graphContainer.axis.xAxis = d3.svg.axis().scale(graphContainer.scales.xScale).orient("bottom");
    graphContainer.axis.yAxis = d3.svg.axis().scale(graphContainer.scales.yScale).orient('left').ticks(10);

    svg.append('g').attr('class','x axis ' + graphContainer._class).attr("transform", "translate(" + 0 + "," + dim.height + ")"); 
    svg.append('g').attr('class','y axis ' + graphContainer._class).attr("transform", "translate(" + yAxisPadding + "," + 0 + ")"); 
  };

  nbviz.customXTicks = function(graphContainer) {
    var axis = graphContainer.axis.xAxis;
    var scale = graphContainer.scales.xScale;
    // var tickFreq=graphContainer.axis.xTicks 
    var tickFreq=10;
    
    axis.tickValues(scale.domain().filter(
                function(d,i){
                  return !(d%tickFreq); 
                })
              );
  };

  nbviz.updateScales = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart
    graphContainer.scales.xScale.domain( d3.range(data.length) );
    graphContainer.scales.yScale.domain([0, d3.max(data, function(d){
                                       return +d.value; })]);

  };

  nbviz.customXScale = function(data, graphContainer){
    // Update scale domains with new data, graphContainer i.e. for barchart: nbviz.barchart

    graphContainer.scales.xScale.domain( data.map(function(d){ return d.key; }) );
  };

  nbviz.updateXAxis = function(data, graphContainer){

    graphContainer.svg.select('.x.axis.'+ graphContainer._class)
        .transition().duration(nbviz.TRANS_DURATION)
        .call(graphContainer.axis.xAxis) 
        .selectAll("text") 
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");
  };

  nbviz.updateYAxis = function(data, graphContainer){
    graphContainer.svg.select('.y.axis.'+ graphContainer._class)
        .transition().duration(nbviz.TRANS_DURATION)
        .call(graphContainer.axis.yAxis);
  };

  nbviz.getCountryData = function() {
    var countryGroups = nbviz.countryDim.group().all(); 

    // make main data-ball
    var data = countryGroups.map( function(c) { 
        // var cData = nbviz.data.countryData[c.key]; 
        var value = c.value;
        // if per-capita value then divide by pop. size
        // if(nbviz.valuePerCapita){
        //     value = value / cData.population; 
        // }
        return {
            key: c.key, // e.g. Japan
            value: value, // e.g. 19 (prizes)
            // code: cData.alpha3Code, // e.g. JPN
        };
    })
        .sort(function(a, b) { 
            return b.value - a.value; // descending
        });

    return data;
};

  nbviz.listOptions = function(data, filterTool, _id, resetValue) {
    _options=[resetValue];
    filterTool.group().all().forEach(function(o){
        _options.push(o[_id]);
    });
    return _options;
};

  nbviz.addFilter = function(data, _id, locationID, filterTool, resetValue, name){
     
    _options=nbviz.listOptions(data, filterTool, _id, resetValue);
    if(_options[0].includes('All')){_options.pop(0)};//à généraliser a priori resetValue contient All pas top
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
  
  nbviz.addAllFilters = function(filters){
    filters.forEach(function(o){
      nbviz.addFilter(o.data, o._id, o.locationID, o.filterTool, o.resetValue, o.name);
    });
};
  
  nbviz.addLegend = function(graphContainer){
    graphContainer.legend = graphContainer.svg.append('g')
        .attr('transform', "translate(10, 10)")
        .attr('class', 'labels')
        .selectAll('label').data(nbviz.categories)//à généraliser 
        .enter().append('g')
        .attr('transform', function(d, i) {
            return "translate(0," + i * 10 + ")"; 
        });
};
  
  nbviz.circleLegend = function(graphContainer){
    graphContainer.legend.append('circle')
      .attr('class', 'legend') 
      .attr('fill', (nbviz.categoryFill)) 
      .attr('r', graphContainer.scales.xScale.rangeBand()/2);
};
  
  nbviz.textLegend = function(graphContainer){
    graphContainer.legend.append('text')
    .text(function(d) {
        return d;
    })
    .attr('dy', '0.4em')
    .attr('x', 10);
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