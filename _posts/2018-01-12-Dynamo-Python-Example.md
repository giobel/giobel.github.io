---
layout: post
title: Revit API using Python - Example
---
<style>

.overlay {
  fill: none;
  pointer-events: all;
}
    </style>
    
<script src="//code.jquery.com/jquery.js"></script>

<script src="//d3js.org/d3.v3.min.js"></script>

<script src="video.js"></script>

## 1. Import libraries

```python
import clr
clr.AddReference("ProtoGeometry")
from Autodesk.DesignScript.Geometry import *
# Import RevitAPI
clr.AddReference("RevitAPI")
from Autodesk.Revit.DB import *
clr.AddReference("RevitAPIUI")
from Autodesk.Revit.UI import TaskDialog
# Import DocumentManager and TransactionManager
clr.AddReference("RevitServices")
from RevitServices.Persistence import DocumentManager
from RevitServices.Transactions import TransactionManager
# Import ToProtoType, ToRevitType geometry conversion extension methods
clr.AddReference("RevitNodes")
import Revit
clr.ImportExtensions(Revit.GeometryConversion)
```

## 2. Access the the Revit Document/Application

```python
doc = DocumentManager.Instance.CurrentDBDocument
uiapp = DocumentManager.Instance.CurrentUIApplication
app = uiapp.Application
```

## 3. Select Elements

```python
walls = FilteredElementCollector(doc).OfClass(Wall).ToElements()
OUT = walls, dir(walls[0]) #Return the walls and the methods that can be used
```
<img src="/images/python1.PNG" width="300" style="display:block; margin-left: auto; margin-right: auto;">

## 4. Extract parameters
Let's extract the Wall location. We can get find the method using dir(walls[0]) or the Revit Lookup:

<div id="imageContainer1"></div>

```python
locCrvs = [] #Create an empty list to store the curves 
for w in walls:
	locCrvs.append(w.Location)
#Assign your output to the OUT variable.
OUT = locCrvs
```
If we try to convert the output to a Dynamo line using **ToProtoType()** we get an error. That's because we need to extract the **Curve** from the **LocationCurve** first. This can be seen both from Revit Lookup and the dir(locCrvs[0]) output (there isn't a **ToProtoType()** method and there is a **Curve** method). 
<img src="/images/python5.PNG" width="300" style="display:block; margin-left: auto; margin-right: auto;">
So if we run: 
```python
locCrvs = [] #Create an empty list to store the curves 
for w in walls:
	locCrvs.append(w.Location.Curve)
#Assign your output to the OUT variable.
OUT = locCrvs
```
The output is finally a Revit line:

<img src="/images/python2.PNG" width="300" style="display:block; margin-left: auto; margin-right: auto;">
We can use the ToProtoType() method to it into a Dynamo line:

```python
locCrvs.append(w.Location.Curve.ToProtoType())
```
<img src="/images/python3.PNG" width="300" style="display:block; margin-left: auto; margin-right: auto;">



<script>  
var imgHeight = 635, imgWidth = 720,      
    width =  720, height = 385,             
    translate0 = [0, -100], scale0 = 1;  

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
    .attr("xlink:href", "/images/python4.PNG");

function zoom() {
  svg1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
</script>
