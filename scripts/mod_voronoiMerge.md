---
layout: page
title: Merge Voronoi cells boundaries
---

<style>

.overlay {
  fill: none;
  pointer-events: all;
}
</style>
    
<script src="//code.jquery.com/jquery.js"></script>

<script src="//d3js.org/d3.v3.min.js"></script>

To recreate the cells, you may try creating TSplineSurfaces from Lines, extract the Faces, extract the Edges, get the Edge Curve Geometry and then create a PolyCurve by joined curves, but it's quite a convoluted way. 

I would use Dynamo to export the geometry in Rhino and create the Voronoi there as it is a more developed environment to play with geometry.

<div id="imageContainer1"></div>

check!

<script>  
var imgHeight = 664, imgWidth = 4004,      
    width =  900, height = 385,             
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
    .attr("xlink:href", "/scripts/img/voronoiMerge.png");

function zoom() {
  svg1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    
