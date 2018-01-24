---
layout: page
title: Iterative sum with Dynamo
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

Problem: I have exported the quantities from Revit and I want to combine a list of files together into one single file.

<img src="/scripts/img/iterativeSum2.PNG" width="900">

I also want to extract only five columns and put them in the same order.

<img src="/scripts/img/iterativeSum3.PNG" width="900">
<br>
<img src="/scripts/img/iterativeSum4.PNG" width="900">

Let's start reading all the excel files into one single list:

<img src="/scripts/img/iterativeSum5.PNG" width="900">

Then let's extract the five columns, remove the titles and clean the list from null values:

<img src="/scripts/img/iterativeSum6.PNG" width="900">

The python script works as the GetItemAtIndex node:

<img src="/scripts/img/iterativeSum7.PNG" width="900">

Finally let's Write the data to an Excel File:

<img src="/scripts/img/iterativeSum8.PNG" width="900">

In order to write our data to a single Excel file we need to count the number of rows in each original Excel file to find the start row at which those data will be written. i.e. the first file has 193 rows and it will start from row 0, the second file has 59 rows which must start at row 193, the third file has 118 rows which must start at row 193+59=252 and so on.
The Python Script add each value to the sum of its predecessors:










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
    .attr("xlink:href", "/scripts/img/iterativeSum1.PNG");

function zoom() {
  svg1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    
