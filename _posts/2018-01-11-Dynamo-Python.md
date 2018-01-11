---
layout: post
title: Revit API using Python
---

Accessing geometry
```python
gridRef = ReferenceArray()
opt = Options()
opt.ComputeReferences = True
opt.IncludeNonVisibleObjects = True
opt.View = doc.ActiveView

for grid in grids:
	for obj in grid.get_Geometry(opt):
		if isinstance(obj, Line):
			gline = obj
			gridRef.Append(gline.Reference)
```

<img src="/images/pyRevitAPI_1.png" width="900">
