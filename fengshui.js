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
  var aliases = blueprint.aliases === undefined
    ? {} : blueprint.aliases;

  // having System inherit some props from blueprint
  // TODO: add aliases
  blueprint.root = '.'+blueprint.root; // add class prefix
  this.fsRootStr = blueprint.root;
  this.fsRoot = $(this.fsRootStr);
  this.fsComponents = [];
  this.fsSeparator = separator;
  this.fsUseVars = useComponentVars;
  this.aliases = aliases;
  var system = this;

  var $root = $(blueprint.root);
  // just sample one
  // somehow jQuery will skip the first one in array
  // when using jQuery collection as context,
  // so use element instead
  var $topRoot = $root[0];

  // get everything with class attr
  var $hasClass = $('*[class]', $topRoot);
  $hasClass.each(function() {
    var classes = $.trim($(this).attr('class')).split(/\s+/g);
    // ['btn', 'btn-lg', 'btn-default']
    $.each(classes, function(index) {
      var component = classes[index];
      var componentVar = processName(component, separator,
        useComponentVars);
      // add only if it's not there
      if (system[componentVar] === undefined) {
        system.fsComponents.push(component);
        system[componentVar] = $('.'+component, $root);
      }

      // create an alias
      if (aliases[component] !== undefined) {
        system[aliases[component]] = system[componentVar];
      }
    });
  });
}

function setCtx(context) {
  var $context = $(context);
  var $root = $context.closest(this.fsRootStr);
  var aliases = this.aliases;
  for (var i = 0; i < this.fsComponents.length; i++) {
    var component = this.fsComponents[i];
    var componentVar = processName(component,
      this.fsSeparator, this.fsUseVars);
    this[componentVar] = $root.find('.'+component);

    // create an alias
    if (aliases[component] !== undefined) {
      this[aliases[component]] = this[componentVar];
    }
  }
  return this;
}

System.prototype = {
  setCtx: setCtx
};

// function attachments
fengshui.System = System;
window.fengshui = fengshui;

})(jQuery); // fengshui

// extra jQuery plugins
(function($) {
$.fn.incr = function increment(diff) {
  diff === undefined ? diff = 1 : diff;
  var number = parseInt(this.text(), 10);
  number += diff;
  this.text(number.toString());
};
})(jQuery);
