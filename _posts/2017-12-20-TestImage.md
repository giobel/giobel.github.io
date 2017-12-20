---
layout: post
title: Test Image
---

<style type="text/css">

span.components,
	span.dependencies {
    	border-radius: 5px;
    	margin: 3px;
	    padding: 2px;
	    display: inline-block;
    	font-size: .9em;
    }

	span.components{
		border: 2px solid #BDC0C7;
	}

	span.dependencies {
		border: 2px solid #B73939;
	}

    div#imageContainer {
    	margin: auto;
    	display: block;
    	border: 3px solid #000000;
    	border-radius: 10px;
    	padding: 10px;
    }

   div#videoContainer {
    	margin: auto;
    	display: block;
    	padding: 10px;
    }

    div#slideshow{
    	margin: 0 auto;
    	text-align: center;
    }

    button{
    	cursor: pointer;
    }

    </style>
    
<script src="//code.jquery.com/jquery.js"></script>

<canvas id="canvas"></canvas>

<script src="//d3js.org/d3.v3.min.js"></script>

<div id="imageContainer"></div>


<g transform="translate(0,0)scale(1)">
  <image width="935px" height="480px" xmlns:xlink="http://www.w3.org/1999/xlink" 
  xlink:href="https://raw.githubusercontent.com/giobel/hydra/master/Hydra Example/canvas.png">
  </image>
</g>


<script>
  
svg = d3.select("#imageContainer").append("svg")
	    .attr("width",  (width - (2.5 * padding)) + "px")
	    .attr("height", height + "px");

var zoom = d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom);

svg = svg.call(zoom)
	  .append("g");

	svg.append("image")
	    .attr("width",  (imgWidth - (2.5 * padding)) + "px")
	    .attr("height", imgHeight + "px")
	    .attr("xlink:href", function(){ return example.githubBase + "/" + d3.keys(example.images[slide])[0]});
      
      function zoom() {
	 	svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
		replaceState(d3.event.scale, d3.event.translate);	  
	};

	function zoomtoextents(){
		svg.call(zoom.scale(1).translate([0,0]));
		svg.attr("transform", "translate(0,0)scale(1)");
		replaceState(1, [0,0]);
	}

	function initialzoom(){
		svg.call(zoom.scale(scale0).translate(translate0));
		svg.attr("transform", "translate(" + translate0 + ")scale(" + scale0 + ")");
		replaceState(scale0, translate0);	  
	}
  </script>
