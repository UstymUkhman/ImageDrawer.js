'use strict';

(function () {
  var pencil = '';
  var callback = '';
  var duration = '30,';

  var activeDraw = false;
  var objectStyle = false;
  var visibleCode = false;
  var callbackComa = false;

  var gui = null;
  var image = null;
  var container = null;
  var optionTimeout = null;
  var callbackAnimation = '';
  var durationTimeout = null;

  var drawSettings = {
    uploadImage: function () {
      input.click()
    },

    borderPencil: 18,
    pencilShades: 12,
    colorShades: 15,
    fullColors: 15,
    duration: 30,

    object: false,
    array: false,

    background: '#ffffff',
    callbackFn: true,
    callback: null,
    pencil: false,

    pencilWidth: 50,
    pencilHeight: 70,
    marginTop: -50,
    marginLeft: -700,

    disappear: 2,
    fromBottom: false,
    invertAxis: false,
    pencilImage: '../img/pencil.png',

    showCode: showCode,
    draw: onDraw
  };

  function showCode () {
    callbackAnimation = 'code'
    visibleCode = true
  }

  function onDraw () {
    var _durationObj = {
      borderPencil: drawSettings.borderPencil,
      pencilShades: drawSettings.pencilShades,
      colorShades: drawSettings.colorShades,
      fullColors: drawSettings.fullColors
    }

    var _pencilObj = {
      width: drawSettings.pencilWidth,
      height: drawSettings.pencilHeight,
      marginTop: drawSettings.marginTop,
      marginLeft: drawSettings.marginLeft,

      fromBottom: drawSettings.fromBottom,
      invertAxis: drawSettings.invertAxis,
      disappear: drawSettings.disappear,
      src: drawSettings.pencilImage
    }

    var _duration = objectStyle ? _durationObj : drawSettings.duration
    var _callback = drawSettings.callback || setActivePlugin
    var _pencil = drawSettings.pencil ? _pencilObj : null

    var settings = {
      background: drawSettings.background,
      callback: _callback,
      duration: _duration,
      pencil: _pencil
    }

    if (activeDraw) {
      $(container).drawImage(settings)
      activeDraw = false
    }
  }

  function setActivePlugin () {
    activeDraw = true
  }

  function setOptions () {
    gui.add(drawSettings, 'uploadImage').name('Upload Image')
    const timings = gui.addFolder('Timings')

    timings.add(drawSettings, 'duration', 1, 60).step(1).name('Duration').onChange(() => {
      drawSettings.object = false
      drawSettings.array = false
      setDuration()
    })

    timings.add(drawSettings, 'borderPencil', 1, 30).step(1).name('Border Pencil').onChange(onDurationChange)
    timings.add(drawSettings, 'pencilShades', 1, 30).step(1).name('Pencil Shades').onChange(onDurationChange)
    timings.add(drawSettings, 'colorShades', 1, 30).step(1).name('Color Shades').onChange(onDurationChange)
    timings.add(drawSettings, 'fullColors', 1, 30).step(1).name('Full Colors').onChange(onDurationChange)

    timings.add(drawSettings, 'object').name('Object Style').listen().onChange(() => {
      drawSettings.array = false
      setDuration()
    })

    timings.add(drawSettings, 'array').name('Array Style').listen().onChange(() => {
      drawSettings.object = false
      setDuration()
    })

    gui.addColor(drawSettings, 'background').name('Background Color')
    gui.add(drawSettings, 'callbackFn').name('Callback Function').onChange(toggleCallback)

    const pencil = gui.addFolder('Pencil')
    pencil.add(drawSettings, 'pencil').name('Pencil Options').listen().onChange(togglePencil)

    pencil.add(drawSettings, 'pencilWidth', 1, 100).step(1).name('Pencil Width').onChange(setPencilOption)
    pencil.add(drawSettings, 'pencilHeight', 1, 100).step(1).name('Pencil Height').onChange(setPencilOption)

    pencil.add(drawSettings, 'marginTop').name('Margin Top').onChange(setPencilOption)
    pencil.add(drawSettings, 'marginLeft').name('Margin Left').onChange(setPencilOption)

    pencil.add(drawSettings, 'disappear', 0.5, 5.0).step(0.5).name('Disappear In').onChange(setPencilOption)
    pencil.add(drawSettings, 'fromBottom').name('From Bottom').onChange(setPencilOption)
    pencil.add(drawSettings, 'invertAxis').name('Invert Axis').onChange(setPencilOption)
    pencil.add(drawSettings, 'pencilImage').name('Pencil Image').domElement.style.pointerEvents = 'none'

    gui.add(drawSettings, 'showCode').name('Show Code')
    gui.add(drawSettings, 'draw').name('Draw')
  }

  function setDuration () {
    clearTimeout(durationTimeout)

    if (drawSettings.object) {
      objectStyle = true

      durationTimeout = setTimeout(() => {
        duration = '{<br/>\
          &emsp;&emsp;borderPencil: <span class="number">' + drawSettings.borderPencil + '</span>,<br/>\
          &emsp;&emsp;pencilShades: <span class="number">' + drawSettings.pencilShades + '</span>,<br/>\
          &emsp;&emsp;colorShades: <span class="number">' + drawSettings.colorShades + '</span>,<br/>\
          &emsp;&emsp;fullColors: <span class="number">' + drawSettings.fullColors + '</span><br/>\
        &emsp;},<br/>'
      }, 500)

      return
    }

    objectStyle = false

    if (drawSettings.array) {
      duration = '[\
        <span class="number">' + drawSettings.borderPencil + '</span>,\
        <span class="number">' + drawSettings.pencilShades + '</span>,\
        <span class="number">' + drawSettings.colorShades + '</span>,\
        <span class="number">' + drawSettings.fullColors + '</span>\
      ],'

      return
    }

    duration = drawSettings.duration + ','
  }

  function onDurationChange () {
    if (!drawSettings.array) {
      drawSettings.object = true
    }

    setDuration()
  }

  function toggleCallback (show) {
    if (!show) {
      drawSettings.callbackFn = false
      drawSettings.callback = null
      callbackComa = false
      callback = ''
    } else {
      setTimeout(() => {
        callbackComa = drawSettings.pencil
        drawSettings.callback = onDrawEnd
        drawSettings.callbackFn = true

        callback = '\
          <br /><br />&emsp;callback: <span class="function">function</span> () {<br/>\
            &emsp;&emsp;<span class="function">alert</span>(<span class="string">\'The painting is finished!\'</span>);<br/>\
          &emsp;}'
      }, 500)
    }
  }

  function onDrawEnd () {
    alert('The painting is finished!')
    setActivePlugin()
  }

  function togglePencil (show) {
    clearTimeout(optionTimeout)
    callbackComa = show && drawSettings.callback

    if (!show) {
      pencil = ''
    } else {
      optionTimeout = setTimeout(() => {
        pencil = '\
          <br /><br />&emsp;pencil: {<br />\
            &emsp;&emsp;width: <span class="number">' + drawSettings.pencilWidth + '</span>,<br />\
            &emsp;&emsp;height: <span class="number">' + drawSettings.pencilHeight + '</span>,<br />\
            &emsp;&emsp;marginTop: <span class="number">' + drawSettings.marginTop + '</span>,<br />\
            &emsp;&emsp;marginLeft: <span class="number">' + drawSettings.marginLeft + '</span>,<br /><br />\
            \
            &emsp;&emsp;disappear: <span class="number">' + drawSettings.disappear + '</span>,<br />\
            &emsp;&emsp;fromBottom: <span class="number">' + drawSettings.fromBottom.toString() + '</span>,<br />\
            &emsp;&emsp;invertAxis: <span class="number">' + drawSettings.invertAxis.toString() + '</span>,<br />\
            &emsp;&emsp;src: <span class="string">\'' + drawSettings.pencilImage + '\'</span><br />\
          &emsp;}\
        '
      }, 500)
    }
  }

  function setPencilOption () {
    togglePencil(true)
    drawSettings.pencil = true
  }

  window.addEventListener('DOMContentLoaded', function () {
    var input = document.getElementById('input');
        image = document.getElementById('image');
    container = document.getElementById('container');

    var reader = new FileReader();

    reader.onload = function () {
      image.src = reader.result;
    }

    gui = new dat.GUI();
    setOptions();

    toggleCallback(drawSettings.callbackFn);
    togglePencil(drawSettings.pencil);

    window.setImage = function () {
			var file = input.files[0];
      reader.readAsDataURL(file);
    }
  });
})();
