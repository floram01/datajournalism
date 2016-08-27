// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

  // build a graphContainer object with name "name" and corresponding parameters
  //margins and padding are objects, other parameters are strings
  nbviz.initGraphContainer = function(chart, chartsParams){
    chartsParams.charts = chartsParams.charts || [];
    var o = {};
    o.margin = {top:chart.margins.top, right:chart.margins.right, left:chart.margins.left, bottom:chart.margins.bottom};
    o.padding = {interbar : chart.padding.interbar, left : chart.padding.left, right : chart.padding.right, bottom : chart.padding.bottom, legend : chart.padding.legend};
    o._id = chart._id;
    o._class = chart._id;
    o.divID = '#div' + chart._id;
    o._key = chart._key;
    o._yKey = chart._yKey;
    o._xKey = chart._xKey;
    o.xTicksFreq = chart.xTicksFreq||1;
    o.timeID = chart.timeID||null;
    o.groupID = chart.groupID||null;
    o._type = chart._type;
    o.dataGetter = chart.dataGetter;
    o.dataGetterParams = chart.dataGetterParams||{};
    o.dataGetterParams = chart.dataGetterParams||{};
    o.tableTitle = chart.tableTitle||{};
    o.tableColumns = chart.tableColumns||{};
    o._value = chart._value||{};
    o._label = chart._label||{};
    o.xDimension = chart.xDimension||{};
    o.yDimension = chart.yDimension||{};
    o.xIndex = chart.xIndex||{};
    o.yIndex = chart.yIndex||{};
    o.domain = chart.domain;
    o.format = chart.format;
    o.title = chart.title;
    o.source = chart.source;
    o.source = chart.source;
    o.xStep = chart.xStep;
    o.format = chart.format;
    o.story = chart.story;
    o.filters = chart.filters;
    o.chartsParams = chartsParams;
    o.text=chart.text;

    chartsParams.charts.push(o);
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
    nbviz.getDivByID(graphContainer);
    nbviz.getSVGDim(graphContainer);
    var dim = graphContainer.dim;
    var margin = graphContainer.margin;
    var divID = graphContainer.divID;
    
    graphContainer.svg = d3.select(divID).append("svg")
    .attr('id','svg' + graphContainer._id)
    .attr("width", dim.width + margin.left + margin.right)
    .attr("height", dim.height + margin.top + margin.bottom);
    
    graphContainer.svg
    .append("g").classed(graphContainer._class, true)
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  };

// add the title, comment and sources
  nbviz.buildStory = function(chartsParams){
    var _id = chartsParams._id;
    var story = chartsParams.story;
    d3.select('#' + _id + 'title-container').append('text').text(story.title)
    d3.select('#' + _id + 'comment-container').append('text').text(story.comment)
    d3.select('#' + _id + 'sources-container').append('text').text(story.sources)
  };

  nbviz.buildText = function(graphContainer){
    if(graphContainer.story.text){
      d3.select('#' + graphContainer._id + 'main-text').append('text').text(nbviz.DATASTORE[graphContainer.story.text.domain]['0'].content);
    };
  };

  
}(window.nbviz=window.nbviz || {}));