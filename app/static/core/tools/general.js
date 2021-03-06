// applique immediatement une fonction à window.nbviz ou créé cet objet
// la fonction associe à nbvz des helper functions, des variables, etc. qui seront partagés entre tous les 
//scripts

(function(nbviz){

  // build a graphContainer object with name "name" and corresponding parameters
  //margins and padding are objects, other parameters are strings
  nbviz.initGraphContainer = function(chart, chartsParams){
    chartsParams.charts = chartsParams.charts || [];
    var o = {};
    o.margin = chart.margins?{top:chart.margins.top, right:chart.margins.right, left:chart.margins.left, bottom:chart.margins.bottom}:{};
    o.padding = chart.padding?{interbar : chart.padding.interbar, left : chart.padding.left, right : chart.padding.right, bottom : chart.padding.bottom, legend : chart.padding.legend}:{};
    o._id = chart._id||{};
    o._class = chart._id||{};
    o.divID = '#div' + chart._id||{};
    o._key = chart._key||{};
    o._yKey = chart._yKey||{};
    o._xKey = chart._xKey||{};
    o.xTicksFreq = chart.xTicksFreq||1;
    o.timeID = chart.timeID||null;
    o.groupID = chart.groupID||null;
    o._type = chart._type||{};
    o.dataGetter = chart.dataGetter||{};
    o.dataGetterParams = chart.dataGetterParams||{};
    o.tableTitle = chart.tableTitle||{};
    o.tableColumns = chart.tableColumns||{};
    o._value = chart._value||{};
    o._label = chart._label||{};
    o.xDimension = chart.xDimension||{};
    o.yDimension = chart.yDimension||{};
    o.xIndex = chart.xIndex||{};
    o.yIndex = chart.yIndex||{};
    o.domain = chart.domain||{};
    o.format = chart.format||{};
    o.title = chart.title||{};
    o.source = chart.source||{};
    o.source = chart.source||{};
    o.xStep = chart.xStep||{};
    o.format = chart.format||{};
    o.story = chart.story||{};
    o.filters = chart.filters||{};
    o.chartsParams = chartsParams||{};
    o.text=chart.text||{};
    o.hideYScale = chart.hideYScale||null;
    o.posXScale = chart.posXScale||{};
    o.orientXScale = chart.orientXScale||null;
    o.anchorXScale = chart.anchorXScale||{};
    o.dim = chart.dim||{};
    o.wrapXLegend = chart.wrapXLegend||null;
    o.precision = chart.precision

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
  nbviz.categoryFill = function(category, graphContainer){
    var i = nbviz[graphContainer.chartsParams._id + 'categoryValues'].indexOf(category);
      return d3.hcl(i / nbviz[graphContainer.chartsParams._id + 'categoryValues'].length * 360, 60, 70);
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
    d3.select('#' + _id + 'sources-container').append('text').text('Sources : '+ story.sources)
  };

// add the article title, comment and sources
  nbviz.addArticleTitle = function(){
    d3.select('#article-title')
    .append('text')
    .text(nbviz.STORY.title);
    if (nbviz.STORY.edito){
      d3.select('#article-edito')
      // .append('text')
      // .text(nbviz.DATASTORE[nbviz.STORY.edito]['0'].content)
      .html(nbviz.DATASTORE[nbviz.STORY.edito]['0'].content);
    };

  };

  nbviz.buildText = function(graphContainer){
    if(graphContainer.story.text){
      d3.select('#' + graphContainer._id + 'main-text').html(nbviz.DATASTORE[graphContainer.story.text.domain]['0'].content);
    };
  };

  nbviz.wrapText = function (text, width) {
    text.each(function() {
      var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
      // words.pop()
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  };

  nbviz.buildIMG =  function(chart){
    d3.select(chart.divID)
    .append('img')
    .attr('src',nbviz.IMG_PATH + chart.domain)
    // .style('width','inherit');
    .style('height',chart.dim.height)
    .style('display','block')
    .style('margin-right','auto')
    .style('margin-left','auto')
  };
  
}(window.nbviz=window.nbviz || {}));