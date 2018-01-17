---
layout: post
title: Revit API using Python - Example
---

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
using Collector
```python
result = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Revisions).WhereElementIsNotElementType().ToElements()
```