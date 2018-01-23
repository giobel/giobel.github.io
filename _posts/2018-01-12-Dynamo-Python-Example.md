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
<img src="/images/python4.PNG" width="300" style="display:block; margin-left: auto; margin-right: auto;">
```python
locCrvs = [] #Create an empty list to store the curves 
for w in walls:
	locCrvs.append(w.Location)
#Assign your output to the OUT variable.
OUT = locCrvs
```
If we try to convert the output to a Dynamo line using **ToProtoType()** we get an error. That's because we need to extract the Curve from the LocationCurve. This can be seen both from Revit Lookup and the dir(locCrvs[0]) output (there isn't a ToProtoType() method and there is a Curve method). So if we run: 
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
