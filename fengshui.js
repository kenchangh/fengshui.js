(function($) {

var fengshui = {};

function removePrefix(selector) {
  if (selector[0] === '.' || selector[0] === '#') {
    selector = selector.slice(1);
  }
  return selector;
}

function selectorToVar(selector, separator) {
  return selector.replace(
    new RegExp(separator+'([a-z])', 'g'), function(g) {
      return g[1].toUpperCase();
    });
}

function processName(component, separator, useComponentVars) {
  var selectorVar = removePrefix(component);
  if (useComponentVars) {
    selectorVar = selectorToVar(selectorVar, separator);
  }
  return selectorVar;
}

function System(blueprint) {
  // settle blueprint.options' default values
  var options = blueprint.options === undefined
    ? {} : blueprint.options;
  var useComponentVars = options.componentVars === undefined
    ? true
    : options.componentVars;
  var separator = options.separator === undefined
    ? '-'
    : options.separator;

  // having System inherit some props from blueprint
  this.fsRootStr = $.trim(blueprint.root);
  this.fsRoot = $(this.fsRootStr);
  this.fsComponents = blueprint.components;
  this.fsSeparator = separator;
  this.fsUseVars = useComponentVars;

  var components = blueprint.components;
  for (var i = 0; i < components.length; i++) {
    var component = $.trim(components[i]);
    var selectorVar = processName(component, separator,
      useComponentVars);
    this[selectorVar] = $(blueprint.root + ' ' + component);
  }
}

function setCtx(context) {
  var $context = $(context);
  var $root = $context.closest(this.fsRootStr);
  for (var i = 0; i < this.fsComponents.length; i++) {
    var component = this.fsComponents[i];
    var selectorVar = processName(component,
      this.fsSeparator,this.fsUseVars);
    this[selectorVar] = $root.find(component);
  }
  return this;
}

System.prototype = {
  setCtx: setCtx
};


// extra jQuery plugins
$.fn.incr = function increment(diff) {
  diff === undefined ? diff = 1 : diff;
  var number = parseInt(this.text(), 10);
  number += diff;
  this.text(number.toString());
};


// function attachments
fengshui.System = System;
window.fengshui = fengshui;

})(jQuery);