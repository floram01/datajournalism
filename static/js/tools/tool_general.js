// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

  // build a graphContainer object with name "name" and corresponding parameters
  //margins and padding are objects, other parameters are strings
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

  nbviz.initialize = function(graphContainer, data) {
    graphContainer.svg = graphContainer.svg || {};
    graphContainer.scales = graphContainer.scales || {};
    graphContainer.axis = graphContainer.axis || {};
    graphContainer.dim = graphContainer.dim || {};
    
  };
  
  //return a color based on the index of an element in an array
  nbviz.categoryFill = function(category){
    var i = nbviz.categories.indexOf(category);
      return d3.hcl(i / nbviz.categories.length * 360, 60, 70);
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
  
}(window.nbviz=window.nbviz || {}));