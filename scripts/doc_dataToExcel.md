---
layout: page
title: dataToExcel
---


<style>

.overlay {
  fill: none;
  pointer-events: all;
}
</style>
    
<script src="//code.jquery.com/jquery.js"></script>

<script src="//d3js.org/d3.v3.min.js"></script>

*Excel.Write.to.File* works well when we need to write the data in a single cell or from a single cell down by columns or right by rows.

<img src="/scripts/img/excelMultipleCellsLagre.png" width="900">

If we want to write our data on multiple cells not connected together we need to use list combine:

<div id="imageContainer1"></div>

This works with list of data too:

<div id="imageContainer2"></div>


<script>  
var imgHeight = 635, imgWidth = 900,      
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
    .attr("xlink:href", "/scripts/img/ExcelMultipleCells1.png");

function zoom() {
  svg1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    

<script>  
var imgHeight = 635, imgWidth = 900,      
    width =  900, height = 385,             
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
    .attr("xlink:href", "/scripts/img/ExcelMultipleCells2.png");

function zoom() {
  svg2.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    
