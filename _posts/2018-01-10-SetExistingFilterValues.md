---
layout: post
title: Set Values of Existing Filters 
---

```python
import clr
clr.AddReference('ProtoGeometry')
from Autodesk.DesignScript.Geometry import *


# Import DocumentManager and TransactionManager
clr.AddReference("RevitServices")
import RevitServices
from RevitServices.Persistence import DocumentManager
from RevitServices.Transactions import TransactionManager


# Import RevitAPI
clr.AddReference("RevitAPI")
import Autodesk
from Autodesk.Revit.DB import *


doc = DocumentManager.Instance.CurrentDBDocument
uiapp = DocumentManager.Instance.CurrentUIApplication
app = uiapp.Application


from System.Collections.Generic import *


# Import ToDSType(bool) extension method
clr.AddReference("RevitNodes")
import Revit
clr.ImportExtensions(Revit.Elements)

filterElement = UnwrapElement(IN[0])

setValue = IN[1]

#categories = List[Autodesk.Revit.DB.ElementId]()

#categories.Add(ElementId(BuiltInCategory.OST_Walls))

parameterCollector = FilteredElementCollector(doc)

# typeof IS NOT RECOGNIZED. WE MUST USE clr.GetClrType()
#parameter = parameterCollector.OfClass(typeof(Autodesk.Revit.DB.Wall)).FirstElement().get_Parameter("Comments")

comment_param = BuiltInParameter.ALL_MODEL_INSTANCE_COMMENTS

parameter = Autodesk.Revit.DB.FilteredElementCollector(DocumentManager.Instance.CurrentDBDocument).OfClass(clr.GetClrType(Wall)).FirstElement().get_Parameter(comment_param)

filterRules = List[Autodesk.Revit.DB.FilterRule]()

filterRules.Add(ParameterFilterRuleFactory.CreateEqualsRule(parameter.Id, setValue, True));

TransactionManager.Instance.EnsureInTransaction(doc)

#filterElement.ClearRules()
filterElement.SetRules(filterRules);
 
TransactionManager.Instance.TransactionTaskDone()

OUT = categories, parameter
```
