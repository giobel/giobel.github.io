---
layout: page
title: View Template Audit
---


## Summary

1. Select all the views and isolate the View Templates
2. Get the ViewTemplateId for each view and the View Templates Id
3. List All Indices of the two ids and count the occurrences

<img src="/scripts/img/viewTemplates.PNG" width="900">

### Select all views
```python
import clr
clr.AddReference('RevitAPI')
from Autodesk.Revit.DB import *
import Autodesk
clr.AddReference("RevitServices")
import RevitServices
from RevitServices.Persistence import DocumentManager
doc = DocumentManager.Instance.CurrentDBDocument
collector = FilteredElementCollector(doc)
views = collector.OfClass(View).ToElements()
viewlist = list()
for view in views:
	if view.ViewType == ViewType.ThreeD:
		if not(view.IsTemplate):
			viewlist.append(view)
	else:
		viewlist.append(view)
		
OUT = viewlist
```

### Is View Template?

```python
import clr
clr.AddReference('RevitAPI')
from Autodesk.Revit.DB import *
views = UnwrapElement(IN[0])
elementlist = list()
notaview = list()
for view in views:
	try:
		if view.IsTemplate:
			elementlist.append(True)
		else:
			elementlist.append(False)
	except:
		elementlist.append(False)
OUT = elementlist
```

### View Template Id
```python
import clr
clr.AddReference('RevitAPI')
from Autodesk.Revit.DB import *
clr.AddReference("RevitServices")
import RevitServices
from RevitServices.Persistence import DocumentManager
doc = DocumentManager.Instance.CurrentDBDocument
views = UnwrapElement(IN[0])
elementlist = list()
views = UnwrapElement(IN[0])
template = []
for v in views:
	try:
		#template.append(doc.GetElement(v.ViewTemplateId))
		template.append(v.ViewTemplateId.ToString())
	except:
		""
OUT = template
```

