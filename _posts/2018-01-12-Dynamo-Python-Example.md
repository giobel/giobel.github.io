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
OUT = walls, dir(walls[0]) #RETURN THE WALLS AND THE METHODS THAT CAN BE USED
```
<img src="/images/python1.PNG" width="300" style="display:block; margin-left: auto; margin-right: auto;">

## 4. Extract parameters
Let's extract the Wall location curve:
```python
locCrvs = [] #CREATE AN EMPTY LIST TO STORE THE CURVES 
for w in walls:
	locCrvs.append(w.Location.Curve)
#Assign your output to the OUT variable.
OUT = locCrvs
```
The output is a Revit line:
<img src="/images/python2.PNG" width="300" style="display:block; margin-left: auto; margin-right: auto;">
If we want to convert it into a Dynamo line we need to use the ToProtoType() method:
```python
locCrvs.append(w.Location.Curve.ToProtoType())
```
<img src="/images/python3.PNG" width="300" style="display:block; margin-left: auto; margin-right: auto;">
