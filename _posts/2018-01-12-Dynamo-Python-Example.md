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
<img src="/images/python1.PNG" width="500">

## 4. Extract parameters