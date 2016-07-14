// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

  // build a graphContainer object with name "name" and corresponding parameters
  //margins and padding are objects, other parameters are strings
  nbviz.initGraphContainer = function(chart){
    nbviz.charts = nbviz.charts || [];
    var o = {};
    o.margin = {top:chart.margins.top, right:chart.margins.right, left:chart.margins.left, bottom:chart.margins.bottom};
    o.padding = {interbar : chart.padding.interbar, left : chart.padding.left, bottom : chart.padding.bottom, legend : chart.padding.legend};
    o.divID = chart.divID;
    o.svgID = chart._id;
    o._class = chart._id;
    o._key = chart._key;
    o.xTicksFreq = chart.xTicksFreq||1;
    o.timeID = chart.timeID||null;
    o.groupID = chart.groupID||null;
    o._type = chart._type;
    o.dataGetter = chart.dataGetter;
    o.dataGetterParams = chart.dataGetterParams||{};
    o.dataGetterParams = chart.dataGetterParams||{};
    o.tableTitle = chart.tableTitle||{};
    o.tableColumns = chart.tableColumns||{};

    nbviz.charts.push(o)
    return o
  };

  nbviz.initialize = function(graphContainer, data) {
    graphContainer.filter = graphContainer.filter || {};
    graphContainer.svg = graphContainer.svg || {};
    graphContainer.scales = graphContainer.scales || {};
    graphContainer.axis = graphContainer.axis || {};
    graphContainer.dim = graphContainer.dim || {};
    
  };
  
  //return a color based on the index of an element in an array
  nbviz.categoryFill = function(category){
    var i = nbviz.categoryValues.indexOf(category);
      return d3.hcl(i / nbviz.categoryValues.length * 360, 60, 70);
  };

// get the graphContainer div bounding rect
  nbviz.getDivByID = function(graphContainer) {
    var chartHolder=d3.select('#' + graphContainer.divID);

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
    nbviz.getDivByID(graphContainer);
    nbviz.getSVGDim(graphContainer);
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var divID = '#' + graphContainer.divID;
    
    graphContainer.svg = d3.select(divID).append("svg")
    .attr('id',graphContainer.svgID)
    .attr("width", dim.width + margin.left + margin.right)
    .attr("height", dim.height + margin.top + margin.bottom);

    graphContainer.svg
    .append("g").classed(graphContainer._class, true)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  };

//add the svg based on the div dimensions (chart dimensions + margins) 
  // nbviz.updateSVG = function(graphContainer) {
  //   nbviz.getDivByID(graphContainer);
  //   nbviz.getSVGDim(graphContainer);
  //   var dim = graphContainer.dim;
  //   var margin = graphContainer.margin;
  //   var divID = '#' + graphContainer.divID;
    
  //   graphContainer.svg = d3.select(graphContainer.svgID)
  //   .attr("width", dim.width + margin.left + margin.right)
  //   .attr("height", dim.height + margin.top + margin.bottom);
  // };

//add the svg based on the div dimensions (chart dimensions + margins) 
  nbviz.addSVGtoDiv = function(graphContainer) {
    nbviz.getDivByID(graphContainer)
    nbviz.getSVGDim(graphContainer)
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var divID = '#' + graphContainer.divID;
    
    graphContainer.svg = d3.select(divID).append("svg")
    .attr('id',graphContainer.svgID)
    .attr("width", dim.width + margin.left + margin.right)
    .attr("height", dim.height + margin.top + margin.bottom)
    .append("g").classed(graphContainer._class, true)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  };
  
}(window.nbviz=window.nbviz || {}));