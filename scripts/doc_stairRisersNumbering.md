---
layout: post
title: Calculate the number of risers in a stair
---
<style>

.overlay {
  fill: none;
  pointer-events: all;
}
    </style>
    
<script src="//code.jquery.com/jquery.js"></script>

<script src="//d3js.org/d3.v3.min.js"></script>

Stairs in Revit are quite peculiar. The same stair behaves differently if "Begin With Riser" or "End With Riser" are selected. 

All these stairs have 13 raisers but Revit counts the risers differently as it does not know where I have drawn the landings (normal structural slabs, separated from the stairs).

<img src="/scripts/img/stairs1.PNG" width="720">

<img src="/scripts/img/stairs2.PNG" width="720">

We can use Dynamo to count the risers and write the result into a new parameter.

Let's start selecting all the stairs in the Revit model, get the Stair Runs and separate them according to their Begin/End Riser values (both thick or either one or the other tick).

<div id="imageContainer1"></div>

<img src="/scripts/img/stairs5.PNG" width="720">

<img src="/scripts/img/stairs4.PNG" width="720">

Then if the stairs Begin and Ends with a Riser, we can calculate the number of risers using the formula (RUN HEIGHT-2*RISER HEIGHT)/RUN HEIGHT

<div id="imageContainer2"></div>

If the stairs Begin or End with a Riser, we can calculate the number of risers using the formula (RUN HEIGHT-RISER HEIGHT)/RUN HEIGHT

<div id="imageContainer3"></div>

We can the use SetParameterByName to write the result back into Revit.

<img src="/scripts/img/stairs8.PNG" width="720">

The Dynamo script (version 0.8) can be downloaded [here](https://drive.google.com/open?id=0BxH7XsYIEQEhbms5ZUlNSUNNc0k)

<script>  
var imgHeight = 635, imgWidth = 720,      
    width =  720, height = 385,             
    translate0 = [0, 0], scale0 = 0.9;  

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
    .attr("xlink:href", "/scripts/img/stairs3.PNG");

function zoom() {
  svg1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>   

<script>  
var imgHeight = 635, imgWidth = 720,      
    width =  720, height = 385,             
    translate0 = [0, 0], scale0 = 0.9;  

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
    .attr("xlink:href", "/scripts/img/stairs6.PNG");

function zoom() {
  svg2.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>   

<script>  
var imgHeight = 635, imgWidth = 720,      
    width =  720, height = 385,             
    translate0 = [0, 0], scale0 = 0.9;  

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
    .attr("xlink:href", "/scripts/img/stairs7.PNG");

function zoom() {
  svg3.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>   
