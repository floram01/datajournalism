// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){
  nbviz.test='abcd';

  nbviz.data = {}; // our main data object
  nbviz.valuePerCapita = 0; // metric flag
  nbviz.activeCountry = null;
  nbviz.ALL_CATS = 'All Categories';
  nbviz.TRANS_DURATION = 2000; // length in ms for our transitions
  nbviz.MAX_CENTROID_RADIUS = 30;
  nbviz.MIN_CENTROID_RADIUS = 2;
  nbviz.COLORS = {palegold:'#E6BE8A'}; // any named colors we use
  $EVE_API = 'http://localhost:5000/api/';
  nbviz.margin = {};// our main margin object
  nbviz.margin.barchart = {top:20, right:20, bottom:30, left:40};
  nbviz.padding = {};// our main margin object
  nbviz.padding.barchart ={interbar:.1, left:20} 
  nbviz.dim = {};// our main dim object
  nbviz.CATEGORIES = ["Chemistry", "Economics", "Literature", "Peace","Physics", "Physiology or Medicine"];
  nbviz.categoryFill = function(category){
    var i = nbviz.CATEGORIES.indexOf(category);
      return d3.hcl(i / nbviz.CATEGORIES.length * 360, 60, 70);
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

  var nestDataByYear = function(entries) {          
  //...
  };

  nbviz.makeFilterAndDimensions = function(winnersData){
    nbviz.filter=crossfilter(winnersData);
    nbviz.filterByCountries();
    nbviz.filterByCategory();
  };

  nbviz.filterByCountries = function(countryNames) {
    nbviz.genderDim = nbviz.filter.dimension(function(o) {
      return o.gender;
    });
  };

  nbviz.filterByCategory = function(cat) {
    nbviz.countryDim = nbviz.filter.dimension(function(o) {
      return o.country;
    });
  };

  nbviz.getDivByID = function(divID) {
    var chartHolder=d3.select(divID);
    var boundingRect = chartHolder.node().getBoundingClientRect();
    return boundingRect
  };

  nbviz.getSVGDim = function(divID, margin) {
    var boundingRect = nbviz.getDivByID(divID);
    var dim = {}
    dim.width = boundingRect.width - margin.left - margin.right
    dim.height = boundingRect.height - margin.top - margin.bottom
    
    nbviz.dim.barchart = dim;
    return dim
  };

  nbviz.addSVGtoDiv = function(divID, _class, margin) {
    var dim = nbviz.getSVGDim(divID, margin);

    d3.select(divID).append("svg")
    .attr('id','bar')
    .attr("width", dim.width + margin.left + margin.right)
    .attr("height", dim.height + margin.top + margin.bottom)
    .append("g").classed(_class, true)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  };

// Ajouter toutes les autres scales susceptibles d'être utilisées au fur et à mesure
  nbviz.getRangeBandGen = function(data, dim, margin, padding) {
    var rangeBandGen = d3.scale.ordinal()
    .domain(d3.range(data.length))
    .rangeRoundBands([padding.left, dim.width], padding.interbar)

    return rangeBandGen
  };

// Ajouter toutes les autres scales susceptibles d'être utilisées au fur et à mesure
//Généraliser yLinearScale à LinearScale 
  nbviz.yLinearScale = function(data, dim, margin) {
    var yLinearScale = d3.scale.linear()
    .domain([0, d3.max(data, function(d){return d.value;})])
    .rangeRound([dim.height, margin.bottom])
    return yLinearScale
  };

  nbviz.genAxis = function(svg, graph) {
    var dim = nbviz.dim.barchart;
    var padding = nbviz.padding.barchart;
    var margin = nbviz.margin.barchart;
    var yAxisPadding = margin.left - padding.left//how to avoid this? more complex than it need to be
    svg.append('g').attr('class','x axis ' + graph).attr("transform", "translate(" + 0 + "," + dim.height + ")"); 
    svg.append('g').attr('class','y axis ' + graph).attr("transform", "translate(" + yAxisPadding + "," + 0 + ")"); 
  };

  nbviz.updateAxis = function(data, xScale, yScale, xAxis, yAxis, svg, graph){
    // A. Update scale domains with new data
    xScale.domain( data.map(function(d){ return d.key; }) );
    yScale.domain([0, d3.max(data, function(d){
                                       return +d.value; })]);

    // B. Use the axes generators with the new scale domains
    svg.select('.x.axis.'+ graph)
        .call(xAxis) 
        .selectAll("text") 
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    svg.select('.y.axis.'+ graph)
        .call(yAxis);
  }

  nbviz.buildBarchart = function(data, divID, _class) {
    var graph = 'bar'

    // add y scale
    var padding = nbviz.padding.barchart;
    var margin = nbviz.margin.barchart;
    

    nbviz.addSVGtoDiv(divID, _class,margin);

    var dim = nbviz.dim.barchart;
    var svg = d3.select("svg#bar")
    var rangeBandGen = nbviz.getRangeBandGen(data, dim, margin, padding);
    var yLinearScale = nbviz.yLinearScale(data, dim, margin);
    var barWidth = rangeBandGen.rangeBand();

    // create axis
    var xAxis = d3.svg.axis().scale(rangeBandGen).orient("bottom");
    var yAxis = d3.svg.axis().scale(yLinearScale).orient('left').ticks(10);
    nbviz.genAxis(svg, graph);

    // data- join
    var bars=svg.selectAll('rect').data(data)

    // create bars for data points that are not yet bound to a DOM element
    bars.enter()
    .append('rect')
    .classed(_class, true)

    // update all bars that are bound to a DOM element
    bars
    .attr('height', function(d){return dim.height - yLinearScale(d.value);})
    .attr('width', barWidth)
    .attr('y', function(d){return yLinearScale(d.value);})
    .attr('x', function(d,i){return rangeBandGen(i);});
    //update the axis
    nbviz.updateAxis(data, rangeBandGen, yLinearScale, xAxis, yAxis, svg, graph);

    //remove bars that are not bound to data
    //improvement: translate before exiting (with transition)
    bars.exit()
    .remove

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

  nbviz.onDataChange = function() { 
      var data = nbviz.getCountryData();
      nbviz.updateBarChart(data);
      nbviz.updateMap(data);
      nbviz.updateList(nbviz.countryDim.top(Infinity));
      data = nestDataByYear(nbviz.countryDim.top(Infinity));
      nbviz.updateTimeChart(data);
  };

}(window.nbviz=window.nbviz || {}));