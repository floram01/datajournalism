/**
Utility functions for common manipulations in charts
*/
var TcChartUtils;
TcChartUtils = {
  /**
    Set the height attribute of an SVG element
  
    @param {HTMLElement} svgElement
    @param {Number} height
    */
  adjustSvgHeight: function(svgElement, height) {
    return svgElement.setAttribute('height', "" + height + "px");
  },
  /**
  Lazy create an element using its tag name and its class
  
  @param {d3.Selection} baseSelection - parent slection
  @param {string} tagName
  @param {string} className
  @param {string} [insertBefore] - selector of element to be inserted before
  
  @return {d3.selection}
  */
  createOrSelect: function(baseSelection, tagName, className, insertBefore) {
    var selection;
    selection = baseSelection.select("" + tagName + "." + className);
    if (!selection.size()) {
      if (insertBefore == null) {
        selection = baseSelection.append(tagName);
      } else {
        selection = baseSelection.insert(tagName, insertBefore);
      }
      selection.classed(className, true);
    }
    return selection;
  },
  /**
  Listen to the destruction of a DOM Element and execute an action (generally
  clean up)
  
  Warning: will also be fired is the element is moved in the DOM
  
  @param {HTMLElement} DOMElement - element to be destroyed
  @param {function} onDestroyAction -callback to be executed when the element
  will be destroyed
  
  @return {MutationObserver}
  */
  setOnDestroyAction: function(DOMElement, onDestroyAction) {
    var destroyObserver;
    destroyObserver = new MutationObserver(function(e) {
      if (_.contains(e[0].removedNodes, DOMElement)) {
        onDestroyAction();
      }
      return destroyObserver.disconnect();
    });
    destroyObserver.observe(DOMElement.parentNode, {
      childList: true
    });
    return destroyObserver;
  },
  /**
  Listen to the resize of a DOM Element and execute an action
  
  Don't forget to unbind it after! (with removeOnResizeAction)
  
  See http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
  
  @param {HTMLElement} DOMElement - element to be resized
  @param {function} onResizeAction -callback to be executed when the element
  will be resized
  */
  setOnResizeAction: function(DOMElement, onResizeAction) {
    if (!DOMElement.__resizeListeners__) {
      return window.addResizeListener(DOMElement, onResizeAction);
    }
  },
  /**
  Remove the resize listener of a DOM Element
  
  See http://www.backalleycoder.com/2013/03/18/cross-browser-event-based-element-resize-detection/
  
  @param {HTMLElement} DOMElement
  */
  removeOnResizeAction: window.removeResizeListener,
  /**
  To be used in d3 operations to extract current node's index
  
  @param {object} d - data element
  @param {number} i - index of element in data array
  
  @example
  `d3.select('rect').attr('data-index', f3.index);`
   will output
    <rect data-index=0>
    <rect data-index=1>
    <rect data-index=2>
  */
  index: function(d, i) {
    return i;
  },
  /**
  Property of an element of dataset
  
  @deprecated
  
  @param {string} property - property name of element of dataset
  */
  property: function(property) {
    return function(d) {
      return d[property];
    };
  },
  /**
  Wrap text if too long
  @param {string} text - text will be wrap
  @param {string} width - width of element
  */
  wrap: function(text, width) {
    text.each(function() {
      var dy, line, lineHeight, lineNumber, tspan, word, words, x, y;
      text = d3.select(this);
      words = text.text().split(/\s+/).reverse();
      word = void 0;
      line = [];
      lineNumber = 0;
      lineHeight = 1.1;
      y = text.attr('y');
      x = text.attr('x');
      dy = text.attr('dy') ? parseFloat(text.attr('dy')) : 0;
      tspan = text.text(null.append('tspan'.attr('x', x.attr('y', y.attr('dy', dy + 'em')))));
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(' '));
        if ((tspan.node().getComputedTextLength() > width) && (line.length > 1)) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text.append('tspan'.attr('x', x.attr('y', y.attr('dy', ("" + (++lineNumber * lineHeight + dy) + "em").text(word)))));
        }
      }
    });
  },
  /**
  Construct a function that will order a dataset according to given parameters
  
  @param {Object} orderParams - parameters for ordering dataset
  */
  orderingFunction: function(orderParams) {
    var accessor, orderBy, reverse;
    if (!orderParams) {
      return _.identity();
    }
    if (typeof orderParams === 'object') {
      reverse = orderParams.reverse;
      if (orderParams.by) {
        if (_.isArray(orderParams.by)) {
          accessor = orderParams.by;
        } else {
          accessor = TcChartUtils.property(orderParams.by);
        }
      } else {
        accessor = _.identity();
      }
      if (orderParams.custom) {
        orderBy = function(d) {
          var index;
          index = _.indexOf(orderParams.custom, accessor(d));
          if (index === -1) {
            return Math.Infinity;
          } else {
            return index;
          }
        };
      } else {
        orderBy = accessor;
      }
    } else {
      orderBy = orderParams;
    }
    return function(dataset) {
      var orderedDataset;
      if (_.isArray(orderBy)) {
        orderedDataset = _.sortByAll(dataset, orderBy);
      } else {
        orderedDataset = _.sortBy(dataset, orderBy);
      }
      if (reverse) {
        orderedDataset = _(orderedDataset).reverse().value();
      }
      return orderedDataset;
    };
  },
  /**
  Construct a function that will order a dataset according to given parameters
  
  @param {Object} orderParams - parameters for ordering dataset
  */
  transform: function(translate, scale, rotate, skew) {
    var transform;
    transform = d3.transform();
    if (translate != null) {
      transform.translate = translate;
    }
    if (scale != null) {
      transform.scale = scale;
    }
    if (rotate != null) {
      transform.rotate = rotate;
    }
    if (skew != null) {
      transform.skew = skew;
    }
    return transform.toString();
  },
  /**
  Add a callback to the end of the transtion
  
  @param {function} callback - callback to be invoked at the end of the
  transition
  
  @example
  selection
  .transition()
  .call(TcChartUtils.onTranstionEnd(callback))
  */
  onTranstionEnd: function(callback) {
    if (callback == null) {
      callback = _.noop;
    }
    return function(transition) {
      var n;
      if (transition.size() === 0) {
        return callback.apply(this, arguments);
      }
      n = 1;
      return transition.each('end', function() {
        if (n++ === transition.size()) {
          return callback.apply(this, arguments);
        }
      });
    };
  },
  scalarExtent: function(extent) {
    return Math.abs(extent[1] - extent[0]);
  },
  sign: function(value) {
    if (value > 0) {
      return '+';
    } else {
      return '';
    }
  }
};