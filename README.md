# ImageDrawer.js
*A jQuery plugin to animate a drawing image*

[![ImageDrawer.js build](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/UstymUkhman/ImageDrawer.js/blob/master/script/imagedrawer.js)
[![ImageDrawer.js release](https://img.shields.io/badge/release-v1.2.0-brightgreen.svg)](https://github.com/UstymUkhman/ImageDrawer.js)
[![Bower version](https://img.shields.io/badge/bower-v1.2.0-blue.svg)](http://bower.io/)
[![GitHub license](https://img.shields.io/cocoapods/l/AFNetworking.svg)](http://opensource.org/licenses/MIT)

**ImageDrawer.js** is a simple plugin of jQuery and CSS animations which can be called as described below, to imitate an accelerated drawn image.<br>
The drawing process is made of two parts: the first one defines all image borders by using "a black pencil" and the second one gives all the colors to the picture.

## Demo

You can try ImageDrawer.js [here](http://54.93.165.244/experiments/ImageDrawerJs/).<br>

## Download

To download the full plugin just click [here](http://52.59.223.146/static/downloads/ImageDrawer.zip)
or install it from [bower](http://bower.io/):

`````sh
bower install UstymUkhman/ImageDrawer.js
`````

## Requirements

- [jQuery Library](http://jquery.com/download/)

## Usage

First, you have to include both, JavaScript and CSS files in your project:

```html
<head>
  <script type="text/javascript" src="http://code.jquery.com/jquery-1.12.0.min.js"></script>
  <script type="text/javascript" src="js/imagedrawer.js"></script>

  <link rel="stylesheet" type="text/css" href="css/imagedrawer.css" />
</head>
```

or minified versions of those files

```html
<head>
  <script type="text/javascript" src="http://code.jquery.com/jquery-1.12.0.min.js"></script>
  <script type="text/javascript" src="js/imagedrawer.min.js"></script>

  <link rel="stylesheet" type="text/css" href="css/imagedrawer.min.css" />
</head>
```

Once that is done, to actually use the plugin, you have to call `.drawImge()` function by selecting the parent element of the picture you want to draw and passing the `options` object.<br>
So lets suppose this is our HTML:

```html
<body>
  <div id="container">
  	<img id="imageto-draw" src="./img/myImage.jpg" />
  </div>
</body>
```

So, the JS part would be like this:

`````javascript
$('#container').drawImge(options);
`````

The variable `options` is just an object which may contain all or some of this parameters:

**duration**: *drawing time for the whole animation or for each step if it, expressed in seconds*<br> 
**background**: *color to put on the picture while it's been drawing*<br>
**callback**: *function to call onece the painting is over*<br>

**pencil**: *object of options for a drawing pencil image*<br>
&emsp;**width**: *pencil image width*<br>
&emsp;**height**: *pencil image height*<br>
&emsp;**marginTop**: *pencil image top margin on the picture*<br>
&emsp;**marginLeft**: *pencil image top margin on the picture*<br><br>

&emsp;**disappear**: *seconds it's take to make the pencil disappear once the drawing is finished*<br>
&emsp;**fromBottom**: *start drawing from the bottom of the picture*<br>
&emsp;**invertAxis**: *draw image vertically*<br>
&emsp;**src**: *pencil image path*<br>

You can check better options' description and their data types [here](https://github.com/UstymUkhman/ImageDrawer.js/blob/master/script/imagedrawer.js) or visit the [demo page](http://ustymukhman.github.io/ImageDrawer.js/) and try to configure them.

## License
ImageDrawer.js is licensed under the [MIT license](http://opensource.org/licenses/MIT).
