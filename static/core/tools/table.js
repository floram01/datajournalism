(function(nbviz){
//improvements: generalise more elements in core, factorise between build and update
  nbviz.buildTable = function(graphContainer) {
    var data = graphContainer.dataGetter(graphContainer);
    // nbviz['addData'+ graphContainer._type + 'Info'](data, graphContainer);
    nbviz.initialize(graphContainer, data);
    nbviz.getDivByID(graphContainer);
    nbviz.getSVGDim(graphContainer);

    var tableDiv = d3.select('#' + graphContainer.divID);

    tableDiv.append('h2').text(graphContainer.tableTitle);

    var table = tableDiv
    .append('table');

    table.append('thead').append('tr').selectAll('th').data(graphContainer.tableColumns)
    .enter()
    .append('th')
    .text(function(c){return c});

    graphContainer.tbody = table.append('tbody');

    tableDiv.style({
      'overflow':'scroll',
      'overflow-x':'hidden',
    });

    table.style({
      'font-size':'10px',
    });

    d3.select('#' + graphContainer.divID + ' h2').style({
      'font-size':'14px',
      'margin':'4px',
      'text-align':'center'
    });

    var colWidth = Math.floor(graphContainer.dim.width/graphContainer.tableColumns.length).toString() + 'px'

    tableDiv.selectAll('th').style({
      'width': colWidth
    });


    nbviz.updateTable(graphContainer);

  };

  nbviz.updateTable = function(graphContainer) {
    var data = graphContainer.dataGetter(graphContainer);

    graphContainer.tbody.selectAll('tr').remove();  

    var rows=graphContainer.tbody.selectAll('tr').data(data, function(d){return d.text;});


    // create bars for data points that are not yet bound to a DOM element
    rows.enter()
    .append('tr')
    .classed(graphContainer._class, true);
    
    //remove bars that are not bound to data
    //improvement: translate before exiting (with transition)
    // rows.exit()
    // .transition().duration(nbviz.TRANS_DURATION)
    // .style('opacity', 0)
    // .remove();

    var cells = rows.selectAll('td')
    .data(function(d){return [d.year, d.category, d.name]});

    cells.enter().append('td').text(function(d){return d;});

  };

}(window.nbviz=window.nbviz || {}));