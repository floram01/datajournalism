/**
Display details about the selection of a chart.

@constructor

# @param {object} [config] - configuration of the legend


@throws {InvalidElementError} An element should be provided

@tests Details
*/
var TcDetails;
TcDetails = function(DOMElement, config) {
  var LABEL_CLASS, MAIN_CLASS, METAS_CLASS, META_CLASS, SERIES_CLASS, SERIE_CLASS, SERIE_COLOR_CLASS, SERIE_LABEL_CLASS, SERIE_VALUE_CLASS, VALUE_CLASS, selection, tcDetails;
  if (!(DOMElement instanceof HTMLElement)) {
    throw InvalidElementError;
  }
  MAIN_CLASS = 'tc-details';
  LABEL_CLASS = "" + MAIN_CLASS + "__label";
  VALUE_CLASS = "" + MAIN_CLASS + "__value";
  META_CLASS = "" + MAIN_CLASS + "__meta";
  METAS_CLASS = "" + META_CLASS + "-container";
  SERIES_CLASS = "" + MAIN_CLASS + "__series";
  SERIE_CLASS = "" + MAIN_CLASS + "__serie";
  SERIE_COLOR_CLASS = "" + SERIE_CLASS + "-color";
  SERIE_LABEL_CLASS = "" + SERIE_CLASS + "-label";
  SERIE_VALUE_CLASS = "" + SERIE_CLASS + "-value";
  selection = d3.select(DOMElement.classed(MAIN_CLASS, true));
  /**
  Draw or update the details pane.
  
  @param {object} selected - selected object
  
  @param {string} selected.key
  @param {number|string} [selected.value] - if no group
  @param {number|string[]} [selected.meta] - other informations to display
  
  @param {object[]} [selected.values] - in case of a group
  @param {string} selected.values[].serie - label of the serie
  @param {number|string} selected.values[].value - value of the data point
  @param {number|string} [selected.values[].format] - optional formatting of the
  value
  @param {number|string} [selected.values[].unit] - optional unit of the
  value
  
  @param {d3.scale.ordinal} [serieScale] - only ordinal scales for now
  
  
  @throws InvalidSelectionError
  
  @example
  tcDetails(selected)
  */
  tcDetails = function(selected, serieScale) {
    var categories, label, meta, metaContainer, series, value;
    label = TcChartUtils.createOrSelect(selection, 'div', LABEL_CLASS);
    if (selected.key == null) {
      throw InvalidSelectionError();
    }
    label.text(selected.key);
    if (selected.value != null) {
      selection.select(SERIES_CLASS.remove());
      value = TcChartUtils.createOrSelect(selection, 'div', VALUE_CLASS);
      value.text(selected.value);
    } else {
      selection.select(VALUE_CLASS.remove());
      if (selected.values == null) {
        throw InvalidSelectionError();
      }
      series = TcChartUtils.createOrSelect(selection, 'div', SERIES_CLASS);
      series.call(TcLegendOrdinal()(serieScale));
      series = series.selectAll('.tc-legend-ordinal__category'.classed(SERIE_CLASS, true));
      series.selectAll('.tc-legend-ordinal__category-color'.classed(SERIE_COLOR_CLASS, true));
      series.selectAll('.tc-legend-ordinal__category-label'.classed(SERIE_LABEL_CLASS, true));
      categories = series.each(function(c) {
        var serieValues;
        serieValues = d3.select(this.selectAll(("." + SERIE_VALUE_CLASS).data(_.where(selected.values, {
          serie: c
        }))));
        serieValues.enter().insert('div', '.tc-legend-ordinal__category-label'.classed(SERIE_VALUE_CLASS, true));
        serieValues.exit().remove();
        return serieValues.text(function(d) {
          var formattedValue, unit;
          formattedValue = (d != null ? d.format : void 0) != null ? d3.format(d.format)(d.value) : d.value;
          unit = (d != null ? d.unit : void 0) != null ? d.unit : '';
          return "" + formattedValue + unit;
        });
      });
    }
    metaContainer = TcChartUtils.createOrSelect(selection, 'div', METAS_CLASS);
    meta = metaContainer.selectAll(("." + META_CLASS).data(selected.meta || []));
    meta.enter().append('div'.classed(META_CLASS, true));
    meta.exit().remove();
    return meta.text(function(d) {
      return d;
    });
  };
  return tcDetails;
};