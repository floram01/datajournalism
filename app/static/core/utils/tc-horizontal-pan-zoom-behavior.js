/**
Add an horizontal panning zoom behavior to a chart

@constructor
*/
var TcHorizontalPanZoomBehavior;
TcHorizontalPanZoomBehavior = function() {
  var tcHorizontalPanZoomBehavior, zoom;
  zoom = d3.behavior.zoom();
  /**
  Applied to a selection, makes it pannable and zoomable, horizontally only.
  
  @example
  See `tcBarchart` or `tcWaterfallchart`
  
  @param {object} config - Configuration object
    @param {number[]|function} config.bounds - Bounds of the pannable space
    @param {function} config.onZoom - callback executed on zoom
    (to update the view)
  
  @return {function} callable on a selection (to apply the zoom)
  */
  tcHorizontalPanZoomBehavior = function(config) {
    var boundsComputation, onZoom;
    boundsComputation = d3.functor(config.bounds);
    onZoom = config.onZoom || _.noop;
    return function(selection) {
      zoom.on('zoom', function() {
        var leftBound, rightBound, translateX, _ref;
        _ref = d3.extent(boundsComputation()), rightBound = _ref[0], leftBound = _ref[1];
        translateX = tcHorizontalPanZoomBehavior.translate();
        if (translateX > leftBound) {
          translateX = leftBound;
        }
        if (translateX < rightBound) {
          translateX = rightBound;
        }
        zoom.translate([translateX, 0]);
        return onZoom();
      });
      return selection.call(zoom);
    };
  };
  /**
  Set maximum scale and transition to it
  A transtion can be applied to the selection for smoother results
  */
  tcHorizontalPanZoomBehavior.zoomIn = function(scale) {
    return function(selection) {
      return zoom.scaleExtent([1, Math.max(1, scale)].scale(scale.event(selection)));
    };
  };
  /**
  Exposes d3's underlaying `zoom` object
  @type {d3.zoom}
  */
  tcHorizontalPanZoomBehavior.zoom = zoom;
  /**
  Returns current's horizontal translate offset
  @return {number}
  */
  tcHorizontalPanZoomBehavior.translate = function() {
    return zoom.translate()[0];
  };
  /**
  Returns current's horizontal scale
  @return {number}
  */
  tcHorizontalPanZoomBehavior.scale = function() {
    return zoom.scale();
  };
  /**
  Returns position regarding current zoom
  @return {number}
  */
  tcHorizontalPanZoomBehavior.position = function(x) {
    return this.translate() + this.scale() * x;
  };
  return tcHorizontalPanZoomBehavior;
};