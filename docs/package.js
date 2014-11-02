(function(pkg) {
  (function() {
  var annotateSourceURL, cacheFor, circularGuard, defaultEntryPoint, fileSeparator, generateRequireFn, global, isPackage, loadModule, loadPackage, loadPath, normalizePath, rootModule, startsWith,
    __slice = [].slice;

  fileSeparator = '/';

  global = window;

  defaultEntryPoint = "main";

  circularGuard = {};

  rootModule = {
    path: ""
  };

  loadPath = function(parentModule, pkg, path) {
    var cache, localPath, module, normalizedPath;
    if (startsWith(path, '/')) {
      localPath = [];
    } else {
      localPath = parentModule.path.split(fileSeparator);
    }
    normalizedPath = normalizePath(path, localPath);
    cache = cacheFor(pkg);
    if (module = cache[normalizedPath]) {
      if (module === circularGuard) {
        throw "Circular dependency detected when requiring " + normalizedPath;
      }
    } else {
      cache[normalizedPath] = circularGuard;
      try {
        cache[normalizedPath] = module = loadModule(pkg, normalizedPath);
      } finally {
        if (cache[normalizedPath] === circularGuard) {
          delete cache[normalizedPath];
        }
      }
    }
    return module.exports;
  };

  normalizePath = function(path, base) {
    var piece, result;
    if (base == null) {
      base = [];
    }
    base = base.concat(path.split(fileSeparator));
    result = [];
    while (base.length) {
      switch (piece = base.shift()) {
        case "..":
          result.pop();
          break;
        case "":
        case ".":
          break;
        default:
          result.push(piece);
      }
    }
    return result.join(fileSeparator);
  };

  loadPackage = function(pkg) {
    var path;
    path = pkg.entryPoint || defaultEntryPoint;
    return loadPath(rootModule, pkg, path);
  };

  loadModule = function(pkg, path) {
    var args, context, dirname, file, module, program, values;
    if (!(file = pkg.distribution[path])) {
      throw "Could not find file at " + path + " in " + pkg.name;
    }
    program = annotateSourceURL(file.content, pkg, path);
    dirname = path.split(fileSeparator).slice(0, -1).join(fileSeparator);
    module = {
      path: dirname,
      exports: {}
    };
    context = {
      require: generateRequireFn(pkg, module),
      global: global,
      module: module,
      exports: module.exports,
      PACKAGE: pkg,
      __filename: path,
      __dirname: dirname
    };
    args = Object.keys(context);
    values = args.map(function(name) {
      return context[name];
    });
    Function.apply(null, __slice.call(args).concat([program])).apply(module, values);
    return module;
  };

  isPackage = function(path) {
    if (!(startsWith(path, fileSeparator) || startsWith(path, "." + fileSeparator) || startsWith(path, ".." + fileSeparator))) {
      return path.split(fileSeparator)[0];
    } else {
      return false;
    }
  };

  generateRequireFn = function(pkg, module) {
    if (module == null) {
      module = rootModule;
    }
    if (pkg.name == null) {
      pkg.name = "ROOT";
    }
    if (pkg.scopedName == null) {
      pkg.scopedName = "ROOT";
    }
    return function(path) {
      var otherPackage;
      if (isPackage(path)) {
        if (!(otherPackage = pkg.dependencies[path])) {
          throw "Package: " + path + " not found.";
        }
        if (otherPackage.name == null) {
          otherPackage.name = path;
        }
        if (otherPackage.scopedName == null) {
          otherPackage.scopedName = "" + pkg.scopedName + ":" + path;
        }
        return loadPackage(otherPackage);
      } else {
        return loadPath(module, pkg, path);
      }
    };
  };

  if (typeof exports !== "undefined" && exports !== null) {
    exports.generateFor = generateRequireFn;
  } else {
    global.Require = {
      generateFor: generateRequireFn
    };
  }

  startsWith = function(string, prefix) {
    return string.lastIndexOf(prefix, 0) === 0;
  };

  cacheFor = function(pkg) {
    if (pkg.cache) {
      return pkg.cache;
    }
    Object.defineProperty(pkg, "cache", {
      value: {}
    });
    return pkg.cache;
  };

  annotateSourceURL = function(program, pkg, path) {
    return "" + program + "\n//# sourceURL=" + pkg.scopedName + "/" + path;
  };

}).call(this);

//# sourceURL=main.coffee
  window.require = Require.generateFor(pkg);
})({
  "source": {
    "LICENSE": {
      "path": "LICENSE",
      "content": "The MIT License (MIT)\n\nCopyright (c) 2013 distri\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of\nthis software and associated documentation files (the \"Software\"), to deal in\nthe Software without restriction, including without limitation the rights to\nuse, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of\nthe Software, and to permit persons to whom the Software is furnished to do so,\nsubject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS\nFOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR\nCOPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER\nIN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN\nCONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.\n",
      "mode": "100644",
      "type": "blob"
    },
    "README.md": {
      "path": "README.md",
      "content": "engine\n======\n\nA game engine\n",
      "mode": "100644",
      "type": "blob"
    },
    "main.coffee.md": {
      "path": "main.coffee.md",
      "content": "Engine\n======\n\n    Engine = (I={}, self=Bindable(I)) ->\n      defaults I,\n        FPS: 60\n        paused: false\n\n      frameAdvance = false\n\n      running = false\n      startTime = +new Date()\n      lastStepTime = -Infinity\n      animLoop = (timestamp) ->\n        timestamp ||= +new Date()\n        msPerFrame = (1000 / I.FPS)\n\n        delta = timestamp - lastStepTime\n        remainder = delta - msPerFrame\n\n        if remainder > 0\n          lastStepTime = timestamp - Math.min(remainder, msPerFrame)\n          step()\n\n        if running\n          window.requestAnimationFrame(animLoop)\n\n      update = (elapsedTime) ->\n        self.trigger \"beforeUpdate\", elapsedTime\n        self.trigger \"update\", elapsedTime\n        self.trigger \"afterUpdate\", elapsedTime\n\n      draw = ->\n        return unless canvas = I.canvas\n\n        self.trigger \"beforeDraw\", canvas\n        self.trigger \"draw\", canvas\n        self.trigger \"overlay\", canvas\n\n      step = ->\n        if !I.paused || frameAdvance\n          elapsedTime = (1 / I.FPS)\n          update(elapsedTime)\n\n        draw()\n\n      self.extend\n\nStart the game simulation.\n\n>     engine.start()\n\n@methodOf Engine#\n@name start\n\n        start: ->\n          unless running\n            running = true\n            window.requestAnimationFrame(animLoop)\n\n          return self\n\nStop the simulation.\n\n>     engine.stop()\n\n@methodOf Engine#\n@name stop\n\n        stop: ->\n          running = false\n\n          return self\n\nPause the game and step through 1 update of the engine.\n\n>     engine.frameAdvance()\n\n@methodOf Engine#\n@name frameAdvance\n\n        frameAdvance: ->\n          I.paused = true\n          frameAdvance = true\n          step()\n          frameAdvance = false\n\nResume the game.\n\n>     engine.play()\n\n@methodOf Engine#\n@name play\n\n        play: ->\n          I.paused = false\n\nToggle the paused state of the simulation.\n\n>     engine.pause()\n\n@methodOf Engine#\n@name pause\n@param {Boolean} [setTo] Force to pause by passing true or unpause by passing false.\n\n        pause: (setTo) ->\n          if setTo?\n            I.paused = setTo\n          else\n            I.paused = !I.paused\n\n\nQuery the engine to see if it is paused.\n\n>     engine.pause()\n>     engine.paused() # true\n>\n>     engine.play()\n>     engine.paused() # false\n\n@methodOf Engine#\n@name paused\n\n        paused: ->\n          I.paused\n\nChange the framerate of the game. The default framerate is 60 fps.\n\n>     engine.setFramerate(60)\n\n@methodOf Engine#\n@name setFramerate\n\n        setFramerate: (newFPS) ->\n          I.FPS = newFPS\n          self.stop()\n          self.start()\n\n        update: update\n        draw: draw\n\n      Engine.defaultModules.each (module) ->\n        self.include module\n\n      self.trigger \"init\"\n\n      return self\n\n    Engine.defaultModules = [\n      \"age\"\n      \"engine/background\"\n      \"engine/collision\"\n      \"engine/game_state\"\n      \"engine/finder\"\n      \"engine/keyboard\"\n      \"engine/mouse\"\n      \"engine/options\"\n      \"timed_events\"\n    ].map (name) ->\n      require \"./modules/#{name}\"\n\n    module.exports = Engine",
      "mode": "100644"
    }
  },
  "distribution": {
    "main": {
      "path": "main",
      "content": "(function() {\n  var Engine;\n\n  Engine = function(I, self) {\n    var animLoop, draw, frameAdvance, lastStepTime, running, startTime, step, update;\n    if (I == null) {\n      I = {};\n    }\n    if (self == null) {\n      self = Bindable(I);\n    }\n    defaults(I, {\n      FPS: 60,\n      paused: false\n    });\n    frameAdvance = false;\n    running = false;\n    startTime = +new Date();\n    lastStepTime = -Infinity;\n    animLoop = function(timestamp) {\n      var delta, msPerFrame, remainder;\n      timestamp || (timestamp = +new Date());\n      msPerFrame = 1000 / I.FPS;\n      delta = timestamp - lastStepTime;\n      remainder = delta - msPerFrame;\n      if (remainder > 0) {\n        lastStepTime = timestamp - Math.min(remainder, msPerFrame);\n        step();\n      }\n      if (running) {\n        return window.requestAnimationFrame(animLoop);\n      }\n    };\n    update = function(elapsedTime) {\n      self.trigger(\"beforeUpdate\", elapsedTime);\n      self.trigger(\"update\", elapsedTime);\n      return self.trigger(\"afterUpdate\", elapsedTime);\n    };\n    draw = function() {\n      var canvas;\n      if (!(canvas = I.canvas)) {\n        return;\n      }\n      self.trigger(\"beforeDraw\", canvas);\n      self.trigger(\"draw\", canvas);\n      return self.trigger(\"overlay\", canvas);\n    };\n    step = function() {\n      var elapsedTime;\n      if (!I.paused || frameAdvance) {\n        elapsedTime = 1 / I.FPS;\n        update(elapsedTime);\n      }\n      return draw();\n    };\n    self.extend({\n      start: function() {\n        if (!running) {\n          running = true;\n          window.requestAnimationFrame(animLoop);\n        }\n        return self;\n      },\n      stop: function() {\n        running = false;\n        return self;\n      },\n      frameAdvance: function() {\n        I.paused = true;\n        frameAdvance = true;\n        step();\n        return frameAdvance = false;\n      },\n      play: function() {\n        return I.paused = false;\n      },\n      pause: function(setTo) {\n        if (setTo != null) {\n          return I.paused = setTo;\n        } else {\n          return I.paused = !I.paused;\n        }\n      },\n      paused: function() {\n        return I.paused;\n      },\n      setFramerate: function(newFPS) {\n        I.FPS = newFPS;\n        self.stop();\n        return self.start();\n      },\n      update: update,\n      draw: draw\n    });\n    Engine.defaultModules.each(function(module) {\n      return self.include(module);\n    });\n    self.trigger(\"init\");\n    return self;\n  };\n\n  Engine.defaultModules = [\"age\", \"engine/background\", \"engine/collision\", \"engine/game_state\", \"engine/finder\", \"engine/keyboard\", \"engine/mouse\", \"engine/options\", \"timed_events\"].map(function(name) {\n    return require(\"./modules/\" + name);\n  });\n\n  module.exports = Engine;\n\n}).call(this);\n",
      "type": "blob"
    }
  },
  "progenitor": {
    "url": "http://www.danielx.net/editor/"
  },
  "entryPoint": "main",
  "repository": {
    "branch": "master",
    "default_branch": "master",
    "full_name": "distri/engine",
    "homepage": null,
    "description": "A game engine",
    "html_url": "https://github.com/distri/engine",
    "url": "https://api.github.com/repos/distri/engine",
    "publishBranch": "gh-pages"
  },
  "dependencies": {}
});