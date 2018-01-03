---
layout: page
title: doc_pointAnalysisDisplay
---

<style>

.overlay {
  fill: none;
  pointer-events: all;
}
</style>
    
<script src="//code.jquery.com/jquery.js"></script>

<script src="//d3js.org/d3.v3.min.js"></script>



I came across this example [ammo-watershed-analysis-in-revit-flux](http://jbdynamo.blogspot.co.uk/2017/08/ammo-watershed-analysis-in-revit-flux.html) and this one [colored-surface-analysis-display](http://archi-lab.net/colored-surface-analysis-display-with-mantis-shrimp-and-ladybug-continued/) which explain how to use the Revit’s Analysis Visualization Framework to display the results of external analysis computations on top of the Revit model.

The graphics generated are NOT residents of the database – so they don’t add to the size of the Revit model (and they don’t persist – to preserve the result display, you must save its view to the project as an image).

More info here: 
[Seeing Data And More-TheAVF in Revit API](http://aucache.autodesk.com/au2011/sessions/5229/class_handouts/v1_CP5229-SeeingDataAndMore-TheAVFinRevitAPI.pdf)

https://knowledge.autodesk.com/support/revit-products/learn-explore/caas/CloudHelp/cloudhelp/2014/ENU/Revit/files/GUID-DCA1C6D3-FBD0-4188-A5C2-51821027435E-htm.html

<img src="/images/pa1.png" width="900"> 

The Point Analysis Display node needs a View, Point Coordinates (sampleLocations) and a value associated to the point (samples). 

<img src="/images/pa2.png" width="900"> 

Name, description and unitType refers to the Analysis Display Settings window:

<img src="/images/pa3.png" width="900"> 

To assign a colour legend to the points we need to create an Analysis Display Style:

<img src="/images/pa4.png" width="900"> 

Text annotations can be turned on selecting "Show All" in the Analysis Display Styles Settings tab:

<img src="/images/pa5.png" width="900"> 

<div id="imageContainer1"></div>

The dynamo script can be downloaded [here](https://drive.google.com/open?id=0BxH7XsYIEQEhdVZHU3ZGODUyVTg) and the dataset used [here](https://drive.google.com/open?id=0BxH7XsYIEQEhemxCcW9xSFhGdms)



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
    .attr("xlink:href", "/images/pa6.png");

function zoom() {
  svg1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    
