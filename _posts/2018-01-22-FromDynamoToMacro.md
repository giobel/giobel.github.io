---
layout: post
title: From Dynamo to Macro to External Commands
---
<style>

.overlay {
  fill: none;
  pointer-events: all;
}
    </style>
    
<script src="//code.jquery.com/jquery.js"></script>

<script src="//d3js.org/d3.v3.min.js"></script>

Dynamo is a good tool but scripts deployment, version compatibility, non OOTB nodes and the need to start Dynamo or to launch a script from the player can sometimes represent an obstacle.

For the most used nodes it may be worth to convert them into external commands or bespoke buttons in the toolbar.

The visual scripting process and the constant debugging (that can be done simply by checking the outputs of the individual nodes) represent a first step into proper coding. It helps to subdivide the problem into small chunks of code and to follow the flow of data, its transformation and its structure passing from one node to the other.

With this image in mind I think it's easier to write the same script in C#, in a macro first and then to create an external command in Visual Studio. The advantage of an external command over the other options is the accessibility from Revit through a keyboard shortcut, which increase the productivity and helps to develop a personal workflow in the creation of models or documentations.

This workflow is essential to adapt the software to the user needs and stimulating his creativity more than force him to adapt and follow actions created by others (software developer) that sometimes are convoluted or lack in immediacy.

Let's have a look at this script that places the active view on a selected sheet:

<div id="imageContainer1"></div>

All the magic happens in SteamNodes's python script:

<div id="imageContainer2"></div>

Reading through the script we can see Viewport.Create which is the instructions that tells Revit to create a new Viewport at a given location on a sheet.

In order to understand how this command works we can go to the RevitAPIdocs website and search Viewport:

<img src="/images/macro3.PNG" width="250" style="display:block; margin-left: auto; margin-right: auto;">












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

<script>  
var imgHeight = 635, imgWidth = 1600,      
    width =  960, height = 385,             
    translate0 = [0, 0], scale0 = 0.6;  

svg1 = d3.select("#imageContainer2").append("svg")
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
    .attr("xlink:href", "/images/macro2.PNG");

function zoom() {
  svg1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>