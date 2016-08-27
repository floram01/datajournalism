/**
Creates a new instance of barchart (vertical)

@constructor

@param {HTMLElement} DOMElement - HTML element that should contain the bar chart

@param {object} config - configuration of the chart
@param {string} config.value - key that provides value in each data's row
@param {string} config.label - key that provides labels in each data's row
@param {string} [config.groups] - key that provides group in each data's row

@param {object} [config.transitions] - transitions configuration
@param {object} [config.transitions.labels] - labels transition configuration
@param {object} [config.transitions.labels.duration = 600]
@param {object} [config.transitions.labels.delay = 0]
@param {object} [config.transitions.values] - values transition configuration
@param {object} [config.transitions.values.duration = config.transitions.labels.duration]
@param {object} [config.transitions.values.delay = config.transitions.labels.duration + config.transitions.values.duration + 100]
@param {object} [config.transitions.zoom] - zoom transition configuration
(when zoom is necessary, i.e. there is too many bars on screen)
@param {object} [config.transitions.zoom.duration = 1000]
@param {object} [config.transitions.zoom.delay]- default after the two other transitions

@param {boolean} [config.colorSelectedBar] - True by default if
`config.crossfilter` exists


@throws {InvalidElementError} An element should be provided
@throws {InvalidConfigError} A config should be provided


@example
tcBarchart = TcBarchart(chartOptions)
tcBarchart(document.getElementByClassname('.tc-bar-chart__chart-wrapper'), data)

@tests Bar chart
*/
var TcBarchart;
TcBarchart = function(DOMElement, config) {
  var barWidth, chartParentSelection, colorScaleIndex, dateFormat, groupSelector, labelSelector, labelsTransitionDelay, labelsTransitionDuration, legendSelection, margins, scaleEmitters, selectionEmitter, selectionEmitterSource, shouldColorSelectedBar, svgElement, svgSelection, tcBarchart, tcDetails, tcHorizontalPanZoomBehavior, transitionEmitters, valueSelector, valueWidth, valuesTransitionDelay, valuesTransitionDuration, zoomTransitionDelay, zoomTransitionDuration, _computeScales, _generateAxis, _generateTransitions, _ref, _ref10, _ref11, _ref12, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9, _select, _update, _updateSelection;
  // if (!(DOMElement instanceof HTMLElement)) {
  //   console.log('InvalidElementError');
  // }
  if (config == null) {
    console.log('InvalidElementError');
  }
  if (config.value == null) {
    console.log('InvalidElementError');
  }
  if (config.label == null) {
    console.log('InvalidElementError');
  }
  valueSelector = config.value;
  labelSelector = config.label;
  groupSelector = config.groups;
  shouldColorSelectedBar = config.colorSelectedBar || (config.crossfilter != null);
  barWidth = 20;
  valueWidth = 100;
  colorScaleIndex = void 0;
  dateFormat = void 0;
  margins = {
    left: 15,
    top: 25,
    bottom: 30,
    right: 15
  };
  labelsTransitionDelay = 0;
  labelsTransitionDuration = 600;
  valuesTransitionDelay = labelsTransitionDelay + labelsTransitionDuration + 100;
  valuesTransitionDuration = labelsTransitionDuration;
  zoomTransitionDelay = 300 + Math.max(labelsTransitionDelay + labelsTransitionDuration, valuesTransitionDelay + valuesTransitionDuration);
  zoomTransitionDuration =1000;
  /* Event emitters */
  scaleEmitters = {
    group: new Rx.BehaviorSubject()
  };
  selectionEmitterSource = new Rx.BehaviorSubject();
  selectionEmitter = selectionEmitterSource.distinctUntilChanged();
  transitionEmitters = {
    labels: new Rx.Subject(),
    values: new Rx.Subject(),
    zoom: new Rx.Subject()
  };
  /* Panning */
  tcHorizontalPanZoomBehavior = TcHorizontalPanZoomBehavior();
  /* Initialization */
  d3.select(DOMElement).classed('bar-chart', true);
  debugger;
  if (config.legend) {
    chartParentSelection = TcChartUtils.createOrSelect(d3.select(DOMElement), 'div', 'bar-chart__chart-with-details');
    legendSelection = TcChartUtils.createOrSelect(chartParentSelection, 'div', 'bar-chart__details');
    tcDetails = TcDetails(legendSelection.node());
    selectionEmitter.combineLatest(scaleEmitters.group.subscribe(function(_arg) {
      var formattedSelection, groupScale, selection;
      selection = _arg[0], groupScale = _arg[1];
      if (!groupScale) {
        return;
      }
      if (selection != null) {
        formattedSelection = {
          key: selection.key,
          values: _.map(selection.values(function(d) {
            return {
              key: d[labelSelector],
              serie: d[groupSelector],
              value: d[valueSelector],
              // unit: typeof UnitManager !== "undefined" && UnitManager !== null ? UnitManager.get(d, valueSelector) : void 0,
              // format: typeof PrecisionManager !== "undefined" && PrecisionManager !== null ? PrecisionManager.get(d, valueSelector) : void 0
            };
          }))
        };
      } else {
        formattedSelection = {
          key: '',
          values: []
        };
      }
      return tcDetails(formattedSelection, groupScale);
    }));
  } else {
    chartParentSelection = d3.select(DOMElement);
  }
  svgSelection = TcChartUtils.createOrSelect(chartParentSelection, 'svg', 'bar-chart__chart-container');
  svgElement = svgSelection.node();
  /* Private functions */
  _generateTransitions = function(disabled) {
    var labelsTransitionsCount, valuesTransitionsCount, zoomTransitionsCount;
    if (disabled == null) {
      disabled = false;
    }
    labelsTransitionsCount = 0;
    valuesTransitionsCount = 0;
    zoomTransitionsCount = 0;
    if (disabled) {
      return {
        labels: _.identity,
        values: _.identity,
        zoom: _.identity
      };
    }
    return {
      labels: function(selection) {
        labelsTransitionsCount++;
        return selection.transition('labels'.delay(labelsTransitionDelay.duration(labelsTransitionDuration.call(TcChartUtils.onTranstionEnd(function() {
          labelsTransitionsCount--;
          if (!labelsTransitionsCount) {
            return transitionEmitters.labels.onNext();
          }
        })))));
      },
      values: function(selection) {
        valuesTransitionsCount++;
        return selection.transition('values'.delay(valuesTransitionDelay.duration(valuesTransitionDuration.call(TcChartUtils.onTranstionEnd(function() {
          valuesTransitionsCount--;
          if (!valuesTransitionsCount) {
            return transitionEmitters.values.onNext();
          }
        })))));
      },
      zoom: function(selection) {
        zoomTransitionsCount++;
        return selection.transition('zoom'.delay(zoomTransitionDelay.duration(zoomTransitionDuration.call(TcChartUtils.onTranstionEnd(function() {
          zoomTransitionsCount--;
          if (!zoomTransitionsCount) {
            return setTimeout(function() {
              return transitionEmitters.zoom.onNext();
            });
          }
        })))));
      }
    };
  };
  _select = function(d, i) {
    if (shouldColorSelectedBar) {
      svgSelection.selectAll('.x-groups'.classed('x-groups--selected', false));
      d3.select(this.classed('x-groups--selected', true));
    }
    return selectionEmitterSource.onNext(d);
  };
  _updateSelection = function(xGroups) {
    var newSelectionGroup, selected;
    selected = selectionEmitterSource.getValue();
    newSelectionGroup = xGroups.filter(function(d) {
      return ((d != null ? d.key : void 0) != null) && (d.key === (selected != null ? selected.key : void 0));
    });
    if (newSelectionGroup.size()) {
      return newSelectionGroup.each(_select);
    } else {
      return selectionEmitterSource.onNext();
    }
  };
  _computeScales = function(svgElement, data, tcHorizontalPanZoomBehavior, disableEmitters) {
    var availableHeight, availableWidth, groups, horizontalBounds, labels, orderParams, scales, values, verticalBounds;
    if (disableEmitters == null) {
      disableEmitters = false;
    }
    scales = {};
    horizontalBounds = [tcHorizontalPanZoomBehavior.position(margins.left), tcHorizontalPanZoomBehavior.position($(svgElement).width() - margins.right)];
    availableWidth = horizontalBounds[1] - horizontalBounds[0];
    verticalBounds = [margins.top, $(svgElement).height() - margins.bottom];
    availableHeight = verticalBounds[1] - verticalBounds[0];
    if (data[0] && data[0][labelSelector] instanceof Date) {
      labels = _(data.pluck(labelSelector.unique(function(d) {
        return d.getTime().sortBy(function(d) {
          return d.getTime().value();
        });
      })));
    } else {
      labels = _(data.pluck(labelSelector.unique(function(d) {
        return d.sortBy(function(d) {
          return d.value();
        });
      })));
      if (config.labelsOrder != null) {
        orderParams = {
          by: labelSelector,
          custom: config.labelsOrder
        };
        labels = TcChartUtils.orderingFunction(orderParams)(labels);
      }
    }
    scales.label = d3.scale.ordinal().domain(labels.rangeRoundBands(horizontalBounds, 0.1, 0.2));
    groups = _(data.pluck(groupSelector.unique().sortBy().value()));
    if (config.groupsOrder != null) {
      orderParams = {
        custom: config.groupsOrder
      };
      groups = TcChartUtils.orderingFunction(orderParams)(groups);
    }
    scales.groupPosition = d3.scale.ordinal().domain(groups.rangeRoundBands([0, scales.label.rangeBand()], 0.1, 0.2));
    scales.group = d3.scale.ordinal().domain(groups.range(d3.range(groups.length)));
    if (!disableEmitters) {
      scaleEmitters.group.onNext(scales.group);
    }
    values = _.pluck(data, valueSelector);
    values.push(0);
    scales.value = d3.scale.linear().domain(d3.extent(values.range(verticalBounds.reverse())));
    return scales;
  };
  _generateAxis = function(scales, yFormat) {
    var timeFormats, xAxis, yAxis;
    if (scales.label.domain()[0] && scales.label.domain()[0] instanceof Date) {
      timeFormats = TcChartUtils.selectAppropriateTimeFormats(scales.label.domain());
      config.tickFormat = timeFormats.tickFormat;
      dateFormat = timeFormats.dateFormat;
    }
    xAxis = d3.svg.axis().scale(scales.label.orient('bottom'.outerTickSize(0)));
    if (config.tickFormat) {
      xAxis.tickFormat(d3.time.format(config.tickFormat));
    }
    if (timeFormats) {
      xAxis.ticks(3..tickSize(0..tickPadding(10 + TcChartUtils.scalarExtent(scales.value.range()))));
    }
    yAxis = d3.svg.axis().scale(scales.value.ticks(3..tickSize(0..tickPadding(-10..orient('left'.tickSize(-1 * TcChartUtils.scalarExtent(scales.label.rangeExtent()), 0, 0..tickFormat(d3.format(yFormat))))))));
    return {
      x: xAxis,
      y: yAxis
    };
  };
  _update = function(data, scales, transitions) {
    var axis, barGroups, groupsToRemove, nestedData, xAxisSelection, xGroups, xGroupsContainer, yAxisSelection, _xGroups;
    TcChartUtils.createOrSelect(svgSelection, 'g', 'y'.classed('axis', true));
    xGroupsContainer = TcChartUtils.createOrSelect(svgSelection, 'g', 'x-groups-container');
    TcChartUtils.createOrSelect(svgSelection, 'g', 'x'.classed('axis', true));
    axis = _generateAxis(scales, typeof PrecisionManager !== "undefined" && PrecisionManager !== null ? PrecisionManager.get(data[0], valueSelector) : void 0);
    nestedData = d3.nest().key(function(d) {
      return d[labelSelector].entries(data);
    });
    _xGroups = xGroupsContainer.selectAll('.x-groups'.data(nestedData, function(d) {
      return d.key;
    }));
    groupsToRemove = _xGroups.exit();
    transitions.labels(groupsToRemove.remove());
    xGroups = _xGroups.enter();
    xGroups.append('g'.classed('x-groups', true.attr('data-label', function(d) {
      return d.key.on('click', _select.append('rect'.classed('bar-chart__touch-zone', true)));
    })));
    _xGroups.select('.bar-chart__touch-zone'.attr({
      fill: 'transparent',
      x: _.min(scales.groupPosition.rangeExtent()),
      y: _.min(scales.value.range()),
      width: TcChartUtils.scalarExtent(scales.groupPosition.rangeExtent()),
      height: TcChartUtils.scalarExtent(scales.value.range())
    }));
    transitions.labels(_xGroups.attr('transform', function(d) {
      return TcChartUtils.transform([scales.label(d.key), 0]);
    }));
    _xGroups.each(function(groupData) {
      return d3.select(this.selectAll('.bar-chart__bar-group'.data(groupData.values, function(d) {
        return d[groupSelector].call(TcVerticalBars({
          value: function(d) {
            return scales.value(d[valueSelector]);
          },
          label: function(d) {
            return d[groupSelector];
          },
          base: scales.value(0),
          width: scales.groupPosition.rangeBand(),
          display: {
            values: function(d) {
              return (typeof PrecisionManager !== "undefined" && PrecisionManager !== null ? PrecisionManager.format(d, valueSelector) : void 0) || d[valueSelector];
            }
          }
        })(transitions.attr('transform', function(d) {
          return TcChartUtils.transform([scales.groupPosition(d[groupSelector]), 0].classed('bar-chart__bar-group', true));
        })));
      })));
    });
    barGroups = _xGroups.selectAll('.bar-chart__bar-group'.attr('data-serie', function(d) {
      return d[groupSelector].attr('data-serie-index', function(d) {
        return scales.group(d[groupSelector]);
      });
    }));
    xAxisSelection = svgSelection.select('.x.axis'.attr('transform', "translate(-1, " + (scales.value(0)) + ")"));
    transitions.labels(xAxisSelection.call(axis.x.selectAll('text'.each(function(d) {
      return TcChartUtils.wrap(d3.select(this), scales.label.rangeBand());
    }))));
    yAxisSelection = svgSelection.select('.y.axis');
    transitions.values(yAxisSelection.call(axis.y));
    return yAxisSelection.selectAll('text'.attr('dy', '-0.6em'.style("text-anchor", "start")));
  };
  /**
  Render and/or update the bar chart.
  
  @example
  tcBarchart(data)
  
  @param {Array} data - Array of data rows
  */
  tcBarchart = function(data) {
    var barSizeRatio, orderParams, scales, transitions;
    if (config.groupsOrder == null) {
      orderParams = {
        by: groupSelector,
        custom: config.groupsOrder
      };
      data = TcChartUtils.orderingFunction(orderParams)(data);
    } else {
      data = _.sortBy(data, groupSelector);
    }
    scales = _computeScales(svgElement, data, tcHorizontalPanZoomBehavior);
    transitions = _generateTransitions();
    _update(data, scales, transitions);
    svgSelection.call(tcHorizontalPanZoomBehavior({
      bounds: function() {
        return [0, $(svgElement).width() - margins.right - TcChartUtils.scalarExtent(scales.label.rangeExtent())];
      },
      onZoom: function() {
        scales = _computeScales(svgElement, data, tcHorizontalPanZoomBehavior, true);
        return _update(data, scales, _generateTransitions(true));
      }
    }));
    barSizeRatio = barWidth / scales.groupPosition.rangeBand();
    transitions.zoom(svgSelection.call(tcHorizontalPanZoomBehavior.zoomIn(barSizeRatio)));
    return _updateSelection(svgSelection.selectAll('.x-groups'));
  };
  /**
  Subject to notify selection changes
  */
  tcBarchart.scaleEmitters = function() {
    return scaleEmitters;
  };
  tcBarchart.selectionEmitter = function() {
    return selectionEmitter;
  };
  tcBarchart.transitionEmitters = function() {
    return transitionEmitters;
  };
  /**
  Instead of updating manually the chart, link it to different datawarehouses
  
  @param {object} dataWarehouse - object containing the required datasets
  */
  tcBarchart.receiveUpdatesFromDataWarehouse = function(dataWarehouse) {
    var dataset, datasetId, update;
    datasetId = config.dataset || (config.id != null ? config.id : 'default');
    dataset = dataWarehouse.getById(datasetId);
    update = function() {
      return tcBarchart(dataset.data);
    };
    if (dataset) {
      dataset.getData().then(null, null, function() {
        return update();
      });
    }
    return update();
  };
  /**
  Trigger an update (useful for resize events)
  
  @param {object} dataWarehouse - object containing the required datasets
  */
  tcBarchart.triggerUpdateFromDataWarehouse = function(dataWarehouse) {
    var dataset, datasetId;
    datasetId = config.dataset || (config.id != null ? config.id : 'default');
    dataset = dataWarehouse.getById(datasetId);
    return tcBarchart(dataset.data);
  };
  return tcBarchart;
};