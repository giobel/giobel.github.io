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

<div id="imageContainer1"></div>

<div id="imageContainer2"></div>

<script>  
var imgHeight = 635, imgWidth = 1600,      
    width =  960, height = 385,             
    translate0 = [0, 0], scale0 = 0.6;  

svg1 = d3.select("#imageContainer1").append("svg")
    .attr("width",  width + "px")
    .attr("height", height + "px");

svg1.append("rect")
    .attr("class", "overlay")
    .attr("width", width + "px")
    .attr("height", height + "px");

svg1 = svg1.append("g")
    .attr("transform", "translate(" + translate0 + ")scale(" + scale0 + ")")
    .call(d3.behavior.zoom().scaleExtent([1, 3]).on("zoom", zoom))
  .append("g");

svg1.append("image")
    .attr("width",  imgWidth + "px")
    .attr("height", imgHeight + "px")
    .attr("xlink:href", "/images/macro1.PNG");

function zoom() {
  svg1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    

**Second Image**

<script>
var imgHeight = 635, imgWidth = 1600,      
    width =  960, height = 385,             
    translate0 = [0, 0], scale0 = 0.6;  
  
svg2 = d3.select("#imageContainer2").append("svg")
    .attr("width",  width + "px")
    .attr("height", height + "px");

svg2.append("rect")
    .attr("class", "overlay")
    .attr("width", width + "px")
    .attr("height", height + "px");

svg2 = svg2.append("g")
    .attr("transform", "translate(" + translate0 + ")scale(" + scale0 + ")")
    .call(d3.behavior.zoom().scaleExtent([1, 3]).on("zoom", zoom))
  .append("g");

svg2.append("image")
    .attr("width",  imgWidth + "px")
    .attr("height", imgHeight + "px")
    .attr("xlink:href", "/images/macro2.PNG");

function zoom() {
  svg2.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>
  
