---
layout: page
title: doc_setTagLeaders
---

<style>

.overlay {
  fill: none;
  pointer-events: all;
}
    </style>
    
<script src="//code.jquery.com/jquery.js"></script>

<script src="//d3js.org/d3.v3.min.js"></script>


<img src="/scripts/img/setLeader.gif" width="900">


<div id="imageContainer1"></div>


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
    .attr("xlink:href", "img/leaderElbows.png");

function zoom() {
  svg1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    

*References:*

[Autodesk.Revit.DB.IndependentTag - This method forms a tag relationship to the host object.](http://www.revitapidocs.com/2018/1f622654-786a-b8fd-1f81-278698bacd5b.htm)

[TextNote Leader Alignment - the building coder](http://thebuildingcoder.typepad.com/blog/2014/02/textnote-leader-alignment.html)

The script can be downloaded [here](https://drive.google.com/open?id=0BxH7XsYIEQEhS2dob2JpT2hfajQ).
