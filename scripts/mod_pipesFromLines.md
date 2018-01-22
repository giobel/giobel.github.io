---
layout: page
title: Create Pipes from Lines
---

<style>

.overlay {
  fill: none;
  pointer-events: all;
}
    </style>
    
<script src="//code.jquery.com/jquery.js"></script>

<script src="//d3js.org/d3.v3.min.js"></script>

This script will convert a set of detail lines into placeholders and will assign the correct connector (elbows, tees or cross) at every junction. The placeholders can then be converted into pipes using the apposite toolbar command in Revit:

<img src="/scripts/img/dwgToPipes.gif" width="720">

<img src="/images/pipes1.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

The OrganisePipe node organises the lines in line with elbows, with tees and with crosses and gives their index position as output. 

<img src="/scripts/img/pipes2.PNG" width="720">

The OrganisePipe node starts finding the main pipe route (the one with the elbows) using GroupByCurves and create a polycurve. For the remaining lines you can extract their starting points and check whether they belong to the polycurve (if ParameterAtPoint gives you an error, then these points don’t belong to the curve). The lines that pass this test go to the T list. For the others we need to check that their End Point does not belong to the polycurve. If it belongs than these lines are added to the T list. The remaining lines are included in the Cross list.

You can use the node output to subdivide the pipe placeholders in 3 lists. The elbows can be directly created, for the tees and cross you need to perform an intersection (Tool.GetSurroundingElement) to find the pipes they are connected to.

<div id="imageContainer1"></div>

The heavy lifting is done by the 4 python scripts:

<div id="imageContainer2"></div>
<div id="imageContainer3"></div>
<div id="imageContainer4"></div>
<div id="imageContainer5"></div>

The custom node can be downloaded [here](https://drive.google.com/open?id=0BxH7XsYIEQEhVkkya2NNYjhXQ1k) and the full script [here](https://drive.google.com/open?id=0BxH7XsYIEQEhbFRYTWFDYWppR0U).


<script>  
var imgHeight = 635, imgWidth = 720,      
    width =  720, height = 385,             
    translate0 = [0, 0], scale0 = 1;  

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
    .attr("xlink:href", "/scripts/img/pipes3.png");

function zoom() {
  svg1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    
  
  <script>  
var imgHeight = 635, imgWidth = 720,      
    width =  720, height = 385,             
    translate0 = [0, 0], scale0 = 1;  

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
    .attr("xlink:href", "/scripts/img/pipes4.PNG");

function zoom() {
  svg2.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    
  
  <script>  
var imgHeight = 635, imgWidth = 720,      
    width =  720, height = 385,             
    translate0 = [0, 0], scale0 = 1;  

svg3 = d3.select("#imageContainer3").append("svg")
    .attr("width",  width + "px")
    .attr("height", height + "px");

svg3.append("rect")
    .attr("class", "overlay")
    .attr("width", width + "px")
    .attr("height", height + "px");

svg3 = svg3.append("g")
    .attr("transform", "translate(" + translate0 + ")scale(" + scale0 + ")")
    .call(d3.behavior.zoom().scaleExtent([1, 3]).on("zoom", zoom))
  .append("g");

svg3.append("image")
    .attr("width",  imgWidth + "px")
    .attr("height", imgHeight + "px")
    .attr("xlink:href", "/scripts/img/pipes5.PNG");

function zoom() {
  svg3.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    

<script>  
var imgHeight = 635, imgWidth = 720,      
    width =  720, height = 385,             
    translate0 = [0, 0], scale0 = 1;  

svg4 = d3.select("#imageContainer4").append("svg")
    .attr("width",  width + "px")
    .attr("height", height + "px");

svg4.append("rect")
    .attr("class", "overlay")
    .attr("width", width + "px")
    .attr("height", height + "px");

svg4 = svg4.append("g")
    .attr("transform", "translate(" + translate0 + ")scale(" + scale0 + ")")
    .call(d3.behavior.zoom().scaleExtent([1, 3]).on("zoom", zoom))
  .append("g");

svg4.append("image")
    .attr("width",  imgWidth + "px")
    .attr("height", imgHeight + "px")
    .attr("xlink:href", "/scripts/img/pipes6.PNG");

function zoom() {
  svg4.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    

<script>  
var imgHeight = 635, imgWidth = 720,      
    width =  720, height = 385,             
    translate0 = [0, 0], scale0 = 1;  

svg5 = d3.select("#imageContainer5").append("svg")
    .attr("width",  width + "px")
    .attr("height", height + "px");

svg5.append("rect")
    .attr("class", "overlay")
    .attr("width", width + "px")
    .attr("height", height + "px");

svg5 = svg5.append("g")
    .attr("transform", "translate(" + translate0 + ")scale(" + scale0 + ")")
    .call(d3.behavior.zoom().scaleExtent([1, 3]).on("zoom", zoom))
  .append("g");

svg5.append("image")
    .attr("width",  imgWidth + "px")
    .attr("height", imgHeight + "px")
    .attr("xlink:href", "/scripts/img/pipes7.PNG");

function zoom() {
  svg5.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    
