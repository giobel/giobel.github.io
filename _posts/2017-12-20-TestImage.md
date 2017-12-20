---
layout: post
title: Test Image
---

<style>

.overlay {
  fill: none;
  pointer-events: all;
}
    </style>
    
<script src="//code.jquery.com/jquery.js"></script>

<script src="//d3js.org/d3.v3.min.js"></script>

<div id="imageContainer"></div>

<script>
  


var imgHeight = 1025, imgWidth = 1538,      // Image dimensions (don't change these)
    width =  960, height = 650,             // Dimensions of cropped region
    translate0 = [-290, -180], scale0 = 1;  // Initial offset & scale

svg = d3.select("#imageContainer").append("svg")
    .attr("width",  width + "px")
    .attr("height", height + "px");

svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width + "px")
    .attr("height", height + "px");

svg = svg.append("g")
    .attr("transform", "translate(" + translate0 + ")scale(" + scale0 + ")")
    .call(d3.behavior.zoom().scaleExtent([1, 8]).on("zoom", zoom))
  .append("g");

svg.append("image")
    .attr("width",  imgWidth + "px")
    .attr("height", imgHeight + "px")
    .attr("xlink:href", "Base.png");

function zoom() {
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
}
  </script>
  
  <svg width="1538px" height="1025px" version="1.1"
     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">

  <desc>This graphic links to an external image
  </desc>
  <image preserveAspectRatio="xMinYMin meet"
         x="0" y="0" width="1538" height="1025"
         xlink:href="Base.png">
    <title>My image</title>
  </image>
  <rect x="0" y="0" width="1538" height="1025"
        fill="none" stroke="blue" stroke-width="12"  />


  <g fill="none" stroke="black" stroke-width="3" >
    <line x1="0" y1="1.5" x2="1538" y2="1.5" />
    <line x1="1.5" y1="0" x2="1.5" y2="1025" />
  </g>
  <g fill="red" stroke="none" >
    <rect x="0" y="0" width="3" height="3" />
    <rect x="1535" y="0" width="3" height="3" />
    <rect x="0" y="1022" width="3" height="3" />
  </g>
  <g font-size="14" font-family="Verdana" >
    <text x="10" y="20">(0,0)</text>
    <text x="240" y="20">(300,0)</text>
    <text x="10" y="90">(0,100)</text>
  </g>

</svg>
