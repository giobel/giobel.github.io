---
layout: post
title: Revit API using Python - Dictionary 
---
<style>

.overlay {
  fill: none;
  pointer-events: all;
}

 </style>
     
<script src="//code.jquery.com/jquery.js"></script>

<script src="//d3js.org/d3.v3.min.js"></script>

<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/gist-embed/2.7.1/gist-embed.min.js"></script>


# Credits

[teocomi.com](http://teocomi.com/)

[Untangling Python: A Crash Course on Dynamo‘s Python Node](http://au.autodesk.com/au-online/classes-on-demand/class-catalog/classes/year-2017/dynamo-studio/as124816-l#chapter=0)

[guiTalarico](https://github.com/gtalarico)

[Danny Bentley](https://www.youtube.com/channel/UC1Dx-jGyRbvvHzZ8ZyGWF5w) and [SFDUG Sept 2017 Beginner's Guide to Python for Dynamo Users](https://www.youtube.com/watch?v=2e6tKofKsSo)

the [revit 2014 api developer guide](http://thebuildingcoder.typepad.com/files/revit_2014_api_developer_guide.pdf) found on Jeremy Tammik's great blog.

[Python 0.6.3 to 0.7.x Migration](https://github.com/DynamoDS/Dynamo/wiki/Python-0.6.3-to-0.7.x-Migration)

[Michael Kilkelly - Code vs Node](https://learn.archsmarter.com/courses/code-vs-node)


archi-lab, Clockwork, Rhythm, biMorph, Steam Nodes, Wombat. 
The python code is mainly taken from them and from the Dynamo Forum. 

# Index
[A](#a)

[B](#b)

- [Best practice](#best-practice)
- [Beam End Points](#beam-end-points)

[C](#c)

- [CurveLoop](#curveloop))
- [Geometry Objects Conversion](#geometry-objects-conversion)

[D](#d)

[Revit Document/Application](#revit-document/application)

[E](#e)
- [Dynamo Elements](#dynamo-elements)
- [Revit Elements](#revit-element-classification)

[F](#f)
- [Filtered Element Collector](#filtered-element-collector)
- [Passing Functions to Python](#passing-functions-to-python)
- [Passing Python Nodes as Functions](#passing-python-nodes-as-functions)

[G](#g)
- [Accessing Geometry](#accessing-geometry)

[I](#i)
- [Idling Event](#idling-event)
- [Ironpython](#ironpython)
- [Imports](#imports)

[L](#l)
- [Import Libraries](#libraries)
- [List](#list)

[M](#m)
- [Migrations](#migrations)

[P](#p)
- [Get Parameter By Name](#get-parameter-by-name)
- [Project Base Point](#project-base-point)

[R](#r)
- [Revitlookup](#revitlookup)

[S](#s)
- [Survey Point](#survey-point)

[T](#t)
- [Python node Template](#template)
- [Transactions](#transactions)
- [Execution Time](#execution-time)
- [codeblock speed](#codeblock-execution-time)

[U](#u)
- [Units](#units)
- [Unwrapping](#unwrapping)

[W](#w)
- [Why does Dynamo work](#why-does-dynamo-work?-ian-keough)
- [Wrapping](#wrapping)

To be added:

- Iterate through list
- FilteredElementCollector ofType -> crl....




# A

# B
## Best practice
[dynamo primer - chapter 12](http://dynamoprimer.com/en/12_Best-Practice/12-1_Introduction.html)

## Beam End Points
From location curve

<code data-gist-id="b5ffcb2e04e31d68ad7687ed4fa48f8c" data-gist-file="GetBeamEndPoints.py" data-gist-hide-footer="true"></code>

From the element's Instance Geometry

<code data-gist-id="b5ffcb2e04e31d68ad7687ed4fa48f8c" data-gist-file="GetBeamEndPoints_InstanceGeometry.py" data-gist-hide-footer="true"></code>

From the element's Solid Geometry

<code data-gist-id="b5ffcb2e04e31d68ad7687ed4fa48f8c" data-gist-file="GetBeamEndPoints_SolidGeometry.py" data-gist-hide-footer="true"></code>

Use the correct function depending on the element type:

<code data-gist-id="b5ffcb2e04e31d68ad7687ed4fa48f8c" data-gist-file="GetBeamEndPointsLoop.py" data-gist-hide-footer="true"></code>

## Beam Top
<code data-gist-id="b5ffcb2e04e31d68ad7687ed4fa48f8c" data-gist-file="GetBeamZTop.py" data-gist-hide-footer="true"></code>

# C

## CurveLoop
[revitapidocs](http://www.revitapidocs.com/2018.1/84824924-cb89-9e20-de6e-3461f429dfd6.htm)
A class that represents a chain of curves. Required for Filled Regions and Area Loads for example.
CurveLoops can be created from line start and end points:
<code data-gist-id="b5ffcb2e04e31d68ad7687ed4fa48f8c" data-gist-file="CurveLoopByLines.py" data-gist-hide-footer="true"></code>

or can be extracted from an element using GetBoundarySegments():
<code data-gist-id="b5ffcb2e04e31d68ad7687ed4fa48f8c" data-gist-file="CurveLoopByBoundary.py" data-gist-hide-footer="true"></code>

Remarks:
- The curves must typically be continuous.
- It may be either closed (where the start and end points coincide) or open.
- There should be no self-intersections.
A CurveLoop is said to be "continuous" if either:
- the loop contains at most one curve
- the end of each curve coincides with the start of the next one (if there is a next curve). 

These definitions take the order of the curves and the curves' directions into account. For example, a CurveLoop comprising the four edges of a rectangle in the order {bottom, top, left, right} is discontinuous. Similarly, a CurveLoop comprising the four edges of a rectangle in the order {bottom, right, top, left}, with three of the lines oriented in the counter-clockwise direction of the rectangle and the fourth oriented in the clockwise direction, is discontinuous.

Also see [Sort and Orient Curves to Form a Contiguous Loop](http://thebuildingcoder.typepad.com/blog/2013/03/sort-and-orient-curves-to-form-a-contiguous-loop.html)

## Geometry Objects Conversion
- All Geometry coming out of Dynamo Nodes are NOT Revit GeometryObject's, so they need to be converted when used with the Revit API.
- Dynamo represents all Geometry in meters, while Revit uses feet. 
To import the GeometryConversion tools, do this:
```python
import clr
clr.AddReference("RevitNodes")
import Revit
# Import ToProtoType, ToRevitType geometry conversion extension methods
clr.ImportExtensions(Revit.GeometryConversion)
```
credits [teocomi](https://github.com/teocomi/dug-dynamo-unchained/tree/master/dynamo-unchained-1-learn-how-to-develop-zero-touch-nodes-in-c%23)
### From Revit to Dynamo
```python
//Elements
Element.ToDSType(bool); //true if it's an element generated by Revit
//Geometry
XYZ.ToPoint() > Point
XYZ.ToVector() > Vector
Point.ToProtoType() > Point
List<XYZ>.ToPoints() > List<Point>
UV.ToProtoType() > UV
Curve.ToProtoType() > Curve
CurveArray.ToProtoType() > PolyCurve
PolyLine.ToProtoType() > PolyCurve
Plane.ToPlane() > Plane
Solid.ToProtoType() > Solid
Mesh.ToProtoType() > Mesh
IEnumerable<Mesh>.ToProtoType() > Mesh[]
Face.ToProtoType() > IEnumerable<Surface>
Transform.ToCoordinateSystem() > CoordinateSystem
BoundingBoxXYZ.ToProtoType() > BoundingBox
```
### From Dynamo to Revit
```python
//Elements
Element.InternalElement
//Geometry
Point.ToRevitType() > XYZ
Vector.ToRevitType() > XYZ
Plane.ToPlane() > Plane
List<Point>.ToXyzs() > List<XYZ>
Curve.ToRevitType() > Curve
PolyCurve.ToRevitType() > CurveLoop
Surface.ToRevitType() > IList<GeometryObject>
Solid.ToRevitType() > IList<GeometryObject>
Mesh.ToRevitType() > IList<GeometryObject>
CoordinateSystem.ToTransform() > Transform
CoordinateSystem.ToRevitBoundingBox() > BoundingBoxXYZ
BoundingBox.ToRevitType() > BoundingBoxXYZ
```

# D
## Revit Document/Application
```python
import clr
# Import DocumentManager
clr.AddReference("RevitServices")
import RevitServices
from RevitServices.Persistence import DocumentManager
doc = DocumentManager.Instance.CurrentDBDocument
uiapp = DocumentManager.Instance.CurrentUIApplication
app = uiapp.Application
```
## dir()
prints methods and attributes
```python
OUT = dir(FilteredElementCollector)
```
## __doc__
shows docstring of class or function
```python
OUT = FilteredElementCollector.__doc__
```
This class is used to search, filter and iterate through a set of elements.
FilteredElementCollector(document: Document, viewId: ElementId)
FilteredElementCollector(document: Document, elementIds: ICollection[ElementId])
FilteredElementCollector(document: Document)


# E


## Dynamo Elements 
All Elements coming out of Dynamo Nodes are actually wrappers around core Revit Elements. Inside of Python, you can operate on these types directly by calling our nodes from inside of Python, which are all located in the Revit.Elements namespace.

If you would prefer to use the RevitAPI directly, you will need to unwrap the Element before operating on it, use our TransactionManager to ensure that you're operating inside of a RevitAPI Transaction, and wrap any Element you wish to return.
```python
import clr
# Import RevitAPI
clr.AddReference("RevitAPI")
import Autodesk
from Autodesk.Revit.DB import ReferencePointArray
# Import DocumentManager and TransactionManager
clr.AddReference("RevitServices")
import RevitServices
from RevitServices.Persistence import DocumentManager
from RevitServices.Transactions import TransactionManager
# Import ToDSType(bool) extension method
clr.AddReference("RevitNodes")
import Revit
clr.ImportExtensions(Revit.Elements)
# Unwrap
startRefPt = UnwrapElement( IN[0] )
endRefPt = UnwrapElement( IN[1] )
# Start Transaction
doc = DocumentManager.Instance.CurrentDBDocument
TransactionManager.Instance.EnsureInTransaction(doc)
# Make the CurveByPoints
arr = ReferencePointArray()
arr.Append(startRefPt)
arr.Append(endRefPt)
cbp = doc.FamilyCreate.NewCurveByPoints(arr)
# End Transaction
TransactionManager.Instance.TransactionTaskDone()
# Wrap
OUT = cbp.ToDSType(false)
```

## Revit Element Classification
[page 64 revit api developer guide]

Revit Elements are divided into **six groups**: 
- **Model Elements**: represent physical items that exist in a building project. Elements in the Model Elements group can be subdivided into the following:
    - Family Instances: contain family instance objects. You can load family objects into your project or create them from family templates.
    - Host Elements: contain system family objects that can contain other model elements (i.e. wall, roof, ceiling and floor)
    - Structure Elements: contains elements that are only used in Revit Structure.
- **Sketch Elements** represent temporary items used to sketch 2D/3D form:
    - Sketch Plane
    - Sketch
    - Path 3D
    - GenericForm  
- **View Elements** represent the way you view and interact with other objects in Revit.
- **Group Elements** represent the assistant Elements such as Array and Group objects in Revit. 
- **Annotation and Datum Elements**: contain non-physical items that are visible. 
- **Information Elements** contain non-physical invisible items used to store project and application data:
    - Project Datum Elements 
    - Project Datum Elements (Unique)..
 
Each group contains related Elements and their corresponding symbols.  

*Elements are also classified by the following*:  
- Category  
- Family
- Symbol (aka Type)
- Instance  

<img src="/images/elementClassification.PNG" width="900" style="display:block; margin-left: auto; margin-right: auto;">

Move up from Instance to Category:
```python
instanceElement = UnwrapElement(IN[0])
OUT = instanceElement.Symbol, instanceElement.Symbol.Family, instanceElement.Symbol.Category.Name
```

To select all the Family Types we can use a FilteredElementCollector. ToElements() retrieves the Revit elements:
```python
collector = FilteredElementCollector(doc).OfClass(FamilySymbol)
OUT = collector.ToElements()
```

To select all the Family Types of a Category given the Category Id:
```python
collector = FilteredElementCollector(doc)
bic = System.Enum.ToObject(BuiltInCategory, -2001320)
collector.OfCategory(bic)
OUT = collector.ToElements()
```
Which is equivalent to:
```python
collector = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Walls).ToElements()
```
And if we want to select only the instances we need to add WhereElementIsNotElementType():
```python
collector = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Walls).WhereElementIsNotElementType().ToElements()
```

To select all the element from a Family Type we need to:
1. find the category Id to which the Family Type belongs
2. select all the elements of that category [collector.OfCategory(bic)] 
3. look for the element that has the same TypeId as the Family Type  

```python
doc = DocumentManager.Instance.CurrentDBDocument
famtypes = UnwrapElement(IN[0])
elementlist = list()
for ft in famtypes:
	collector = FilteredElementCollector(doc)
	bic = System.Enum.ToObject(BuiltInCategory, ft.Category.Id.IntegerValue)
	collector.OfCategory(bic)
	for item in collector.ToElements():
		if item.GetTypeId().IntegerValue == ft.Id.IntegerValue:
			elementlist.append(item)
	#elementlist.append(ftlist)
OUT = elementlist
```
<img src="/images/elementClassification1.png" width="700" style="display:block; margin-left: auto; margin-right: auto;">

# F
## Filtered Element Collector
```python
result = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Walls)
```
Gives a list of both element and type classes as output:
<img src="/images/collections1.PNG" width="250" style="display:block; margin-left: auto; margin-right: auto;">
```python
result = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Walls).WhereElementIsNotElementType()
```
Gives a list of element class as output:
<img src="/images/collections2.PNG" width="250" style="display:block; margin-left: auto; margin-right: auto;">
```python
result = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_Walls).WhereElementIsNotElementType().ToElements()
```
ToElements() retrieves the element:
<img src="/images/collections3.PNG" width="250" style="display:block; margin-left: auto; margin-right: auto;">

Same applies for the OfClass collector
```python
result = FilteredElementCollector(doc).OfClass(Wall)
```
<img src="/images/collections2.PNG" width="250" style="display:block; margin-left: auto; margin-right: auto;">

```python
result = FilteredElementCollector(doc).OfClass(Wall).WhereElementIsNotElementType().ToElements()
```
<img src="/images/collections3.PNG" width="250" style="display:block; margin-left: auto; margin-right: auto;">

```python
TransactionManager.Instance.EnsureInTransaction(doc)
for filter in filterElements:
	oldRules = filter.GetRules()
	filterRules = List[Autodesk.Revit.DB.FilterRule]()
	for fdr in oldRules:
		ruleType.append(fdr.GetEvaluator().GetType())
		filterNames.append(filter.Name)
		if fdr.GetEvaluator().GetType().Equals(clr.GetClrType(FilterStringLess)):
			filterRules.Add(ParameterFilterRuleFactory.
			CreateLessRule(filter.GetRuleParameters()[0], setValue, True))
		elif fdr.GetEvaluator().GetType().Equals(clr.GetClrType(FilterStringEquals)):
			filterRules.Add(ParameterFilterRuleFactory.
			CreateEqualsRule(filter.GetRuleParameters()[0], setValue, True))
		elif fdr.GetEvaluator().GetType().Equals(clr.GetClrType(FilterStringGreater)):
			filterRules.Add(ParameterFilterRuleFactory.
			CreateGreaterRule(filter.GetRuleParameters()[0], setValue, True))
		else:
			break
		filter.SetRules(filterRules);
TransactionManager.Instance.TransactionTaskDone()
```
## Passing Functions to Python
Currently, passing functions to Python scripts through Dynamo is not supported in 0.7.x. This capability will be returning some time in the future.
## Passing Python Nodes as Functions
Currently, passing Python nodes to other nodes as functions is not supported in 0.7.x. This capability will be returning some time in the future.

# G

## Accessing geometry
```python
opt = Options()
opt.ComputeReferences = True
opt.IncludeNonVisibleObjects = True
opt.View = doc.ActiveView
energySrf = UnwrapElement(IN[0])
geo = []
for obj in energySrf[0].get_Geometry(opt):
	if isinstance(obj, Solid):
		geo.append(obj)
```
This returns an Autodesk.Revit.DB.Solid

```python
geo = []
for obj in energySrf[0].get_Geometry(opt):
	geo.append(obj.ConvertToMany())
```
This returns Surfaces and Lines.

## GetSymbolGeometry() vs GetInstanceGeometry()
[knowledge.autodesk.com](https://knowledge.autodesk.com/search-result/caas/CloudHelp/cloudhelp/2017/ENU/Revit-API/files/GUID-B4F83374-0DF6-4737-91EB-900E676E862B-htm.html)
- A GeometryInstance represents a set of geometry stored by Revit in a default configuration, and then transformed into the proper location as a result of the properties of the element. 
- Revit uses GeometryInstances to allow it to store a single copy of the geometry for a given family and reuse it in multiple instances. 
- Note that not all Family instances will include GeometryInstances. When Revit needs to make a unique copy of the family geometry for a given instance (because of the effect of local joins, intersections, and other factors related to the instance placement) no GeometryInstance will be encountered; instead the Solid geometry will be found at the top level of the hierarchy. 
- A GeometryInstance offers the ability to read its geometry through the GetSymbolGeometry() and GetInstanceGeometry() methods. 
- GetSymbolGeometry() returns the geometry represented in the coordinate system of the family without regards to the orientation and placement location within the project. 
- GetInstanceGeometry() returns the geometry represented in the coordinate system of the project where the instance is placed. This always returns a copy of the element geometry, so while it would be suitable for implementation of an exporter or a geometric analysis tool, it would **not be appropriate to use this for the creation of other Revit elements referencing this geometry**. 
- There are also overloads for both GetInstanceGeometry() and GetSymbolGeometry() that transform the geometry by any arbitrary coordinate system. **These methods always return copies similar to GetInstanceGeometry().** 
- **The GeometryInstance also stored a transformation from the symbol coordinate space to the instance coordinates. This transform is accessible as the Transform property.**

```python
geomInst = None;

instTransform = None;

for instance in element.get_Geometry(opt):
	try:
		geomInst = instance.GetSymbolGeometry()
		instTransform = instance.Transform;
	except:
		continue
transformedPoint = instTransform.OfPoint(location);
``` 

See [instanceByFace example](https://gist.github.com/giobel/b5ffcb2e04e31d68ad7687ed4fa48f8c#file-instancebyface-py)


# I
## Idling Event
[thebuildingcoder - Idling event](http://thebuildingcoder.typepad.com/blog/2010/04/idling-event.html)

The new event **UIApplication.Idling** is raised when it is safe for the API application to access the active document between user interactions.

## Ironpython
An implementation of the python language specification created by microsoft, written in C#. The C# implementation allows it to use the Common Language Runtime (clr) to talk directly to other .NET applications and libraries. This language interoperability has made Ironpython a popular embedded-scripting-language .

## Imports
load additional functionality into your code
* importing modules within Dynamo requires additional code 
```python
import clr
clr.AddReference("ProtoGeometry")
from Autodesk.DesignScript.Geometry import *
```
- imports the *Common Language Runtime* module (glue between Python and the .NET world, it allows to load .dll)
- load .NET dll references (must be used to enable libraries that are not native python libraries).
The python template adds a reference to 'ProtoGeometry'. The actual library is stored here: "C:\Program Files\Dynamo\Dynamo Core\1.3\ProtoCore.dll"
- Once 'ProtoGeometry' has been added, we load things from the DesignScript library.

It is possible to import all the Design Script methods using [more info here](http://dynamobim.org/forums/topic/import-all-design-script-methods-to-python/)
```python
clr.AddReference('DSCoreNodes')
from DSCore import *
```

### Revit API references.
All Elements coming out of Dynamo Nodes are actually wrappers around core Revit Elements. Inside of Python, you can operate on these types directly by calling our nodes from inside of Python, which are all located in the Revit.Elements namespace:
```python
import clr
# Import RevitNodes
clr.AddReference("RevitNodes")
import Revit
# Import types we need. Instead of listing individual types,
# you can do 'from Revit.Elements import *'
from Revit.Elements import CurveByPoints, ReferencePoint
```
If you would prefer to use the RevitAPI directly, you will need to unwrap the Element before operating on it, use our TransactionManager to ensure that you're operating inside of a RevitAPI Transaction, and wrap any Element you wish to return.
```python
import clr
# Import RevitAPI
clr.AddReference("RevitAPI")
from Autodesk.Revit.DB import *
clr.AddReference("RevitAPIUI")
from Autodesk.Revit.UI import TaskDialog
# Import DocumentManager and TransactionManager
clr.AddReference("RevitServices")
from RevitServices.Persistence import DocumentManager
from RevitServices.Transactions import TransactionManager
doc = DocumentManager.Instance.CurrentDBDocument
uiapp = DocumentManager.Instance.CurrentUIApplication
app = uiapp.Application
```
### [How to load external Python modules?](https://forum.dynamobim.com/t/how-to-load-external-python-modules/5678)
```python
import sys
sys.path.append(r'C:\Program Files (x86)\IronPython 2.7\DLLs')
sys.path.append(r'C:\Program Files (x86)\IronPython 2.7\Lib')
import sqlite3
import xml
```

# L

## Libraries

<code data-gist-id="b5ffcb2e04e31d68ad7687ed4fa48f8c" data-gist-file="libraries.py" data-gist-hide-footer="true"></code>


## List
[Gui_Talarico Nov'16](https://forum.dynamobim.com/t/different-ways-of-getting-element-ids/7782/2)

- The list data-type (lower case L) is a native to Python/Ironpython. 
What’s important is, lists don’t care what type of data they hold, so a list can hold anything and everything: numbers, letters, variables, other lists, etc
```python
somelist = list()
#or
somelist = []
```
Both methods create an empty list called *somelist*. Some say the 2nd is [faster](https://stackoverflow.com/questions/2972212/creating-an-empty-list-in-python).
To add elements (or anything else) to a list, you use the .append method:
```python
somelist.append(SomeElemendId)
somelist.append(AnotherElemendId)
```
- List (Capital L), which is a data-type native to the .NET languages.
One of the main differences, is that when a .NET List is created, you declare what type of objects it will hold, and later it will enforce it.
Although it’s also a container, the 2 list types are completely different data-types, so how you add/delete/retrieve/iterate will change.
The List type is not native to Python/Ironpython, so before you can use it, you have to import it from the .NET Collections assembly:
```python
from System.Collections.Generic import List
# Imports List type from .NET's Collections.Generic Namespace
somelist = List[Autodesk.Revit.DB.ElementId]()
# Creates an empty List container that can hold only ElementIds
somelist.Add(SomeElementId)
somelist.Add(AnotherElementId)
# Adds ElementIds to the List
```
- If you try to add any object that is not an ElementId, it will raise an exception.
- Generally, you can/should use Python lists if you are just manipulating data, iterating, etc - they are more flexible, easier to use, and native to Python.
- When working with the Revit API, there instances when you are asked to pass lists/collections of objects.
- In those cases, you have to create a List that holds the required type first.
For example, if you want to create a FilledRegion, Revit asks you to pass a List of CurveLoops, so you have to create a List[CurveLoop](), and add your CurveLoop objects.

## Return List or Instance
If the input is of type list then return the input otherwise store the input in a list and return the list:
```python
if isinstance(IN[0], list):
	element = UnwrapElement(IN[0])
else:
	element = [UnwrapElement(IN[0])]
```

# M
## Migrations
[Dynamo Python Wiki](https://github.com/DynamoDS/Dynamo/wiki/Python-0.6.3-to-0.7.x-Migration)


# P

## Parameter types
Get a parameter:
```python
param = element.GetParameters("Offset")
```
This will return a list so to return the parameter (item) we can use:
```python
param = element.GetParameters("Offset")[0]
```
Check the parameter storage type:
```python
param.StorageType
```
Return the parameter as String:
```python
param.AsString()
```
Return the parameter as Double:
```python
param.AsDouble()
```
Return the parameter as Integer
```python
p.AsInteger()
```
Return the parameter as ElementId:
```python
param.AsElementId()
```
Return the parameter (integer or double) as String without unit conversion: 	
```python
param.AsValueString()
```

## Get Parameter by Name
If the parameter type is known:
```python
#credit MEPover
def GetParamValue(eType, pName):
	paramValue = None
	for i in eType.Parameters:
		if i.Definition.Name == pName:
			paramValue = i.AsValueString()
			#paramValue = i.AsDouble()
			break
		else:
			continue
	return paramValue
```
Otherwise we can use the more generic:
```python
#credit MEPover
element = UnwrapElement(IN[0])
name = IN[1]
def checkParameter(param):
	for p in param:
		internal = p.Definition
		if internal.BuiltInParameter != BuiltInParameter.INVALID:
			return p
	return param[0]
	
for e in element:
	param = e.GetParameters(name)
	if len(param) == 0:
		listout.append(None)
	else:
		p = checkParameter(param)
		if p.StorageType == StorageType.String:
			listout.append(p.AsString())
		elif p.StorageType == StorageType.ElementId:
			elem = doc.GetElement(p.AsElementId())
			listout.append(elem)
		elif p.StorageType == StorageType.Double:
			ProjectUnits = p.DisplayUnitType
			newval = UnitUtils.ConvertFromInternalUnits(p.AsDouble(),ProjectUnits)
			listout.append(newval)
		else:
			listout.append(p.AsInteger())
```

## Project Base Point
```python
# Copyright(c) 2016, Konrad Sobon
# @arch_laboratory, http://archi-lab.net
import clr
clr.AddReference('ProtoGeometry')
from Autodesk.DesignScript.Geometry import *
# Import DocumentManager and TransactionManager
clr.AddReference("RevitServices")
import RevitServices
from RevitServices.Persistence import DocumentManager
doc = DocumentManager.Instance.CurrentDBDocument
# Import RevitAPI
clr.AddReference("RevitAPI")
import Autodesk
from Autodesk.Revit.DB import *
projectBasePt = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_ProjectBasePoint).ToElements()
bipEW = BuiltInParameter.BASEPOINT_EASTWEST_PARAM
bipNS = BuiltInParameter.BASEPOINT_NORTHSOUTH_PARAM
bipElev = BuiltInParameter.BASEPOINT_ELEVATION_PARAM
PBeastWest = projectBasePt[0].get_Parameter(bipEW).AsDouble()
PBnorthSouth = projectBasePt[0].get_Parameter(bipNS).AsDouble()
PBelev = projectBasePt[0].get_Parameter(bipElev).AsDouble()
OUT = Autodesk.DesignScript.Geometry.Point.ByCoordinates(PBeastWest, PBnorthSouth, PBelev)
```
The units can be transformed to the Project Units using UnitUtils:
```python
getDocUnits = doc.GetUnits()
getDisplayUnits = getDocUnits.GetFormatOptions(UnitType.UT_Length).DisplayUnits 
unitConversion = UnitUtils.ConvertFromInternalUnits(PBeastWest, getDisplayUnits)
OUT = Autodesk.DesignScript.Geometry.Point.ByCoordinates(UnitUtils.ConvertFromInternalUnits(PBeastWest, getDisplayUnits), 
UnitUtils.ConvertFromInternalUnits(PBnorthSouth, getDisplayUnits), UnitUtils.ConvertFromInternalUnits(PBelev, getDisplayUnits))
```
We can also get the coordinates of the Project Base Point using the BoundingBox method:
```python
OUT = surveyPoints[0].get_BoundingBox(None).Max, 
```
And if we add the Revit.GeometryConversion namespace
```python
clr.AddReference("RevitNodes")
import Revit
# Import ToProtoType, ToRevitType geometry conversion extension methods
clr.ImportExtensions(Revit.GeometryConversion)
```
we can then convert the Revit XYZ element to a Dynamo Point:
```python
OUT = surveyPoints[0].get_BoundingBox(None).Max.ToPoint()
```
In this case the Survey Point coordinates will be taken from the Project Base Point as origin:

<img src="/images/pbp.PNG" width="700" style="display:block; margin-left: auto; margin-right: auto;">

# R
## RevitLookup
Using the [RevitLookup](https://github.com/jeremytammik/RevitLookup) add-in by Jeremy Tammik we can access all the properties and methods available for a Selected Element, the DB or the Active View:

<div id="imageContainer1"></div>

Element Properties can be accessed through Element.PropertyName:

```python
energySrf = UnwrapElement(IN[0])
OUT = energySrf.Id, energySrf.Pinned, energySrf.UniqueId, energySrf.Type
```
Element methods must be called using ():
```python
energySrf = UnwrapElement(IN[0])
OUT = energySrf.GetAnalyticalOpenings()
```
<div id="imageContainer2"></div>

# S
## Survey Point
```python
# Copyright(c) 2016, Konrad Sobon
# @arch_laboratory, http://archi-lab.net
import clr
clr.AddReference('ProtoGeometry')
from Autodesk.DesignScript.Geometry import *
# Import DocumentManager and TransactionManager
clr.AddReference("RevitServices")
import RevitServices
from RevitServices.Persistence import DocumentManager
doc = DocumentManager.Instance.CurrentDBDocument
# Import RevitAPI
clr.AddReference("RevitAPI")
import Autodesk
from Autodesk.Revit.DB import *
surveyPoints = FilteredElementCollector(doc).OfCategory(BuiltInCategory.OST_SharedBasePoint).ToElements()
bipEW = BuiltInParameter.BASEPOINT_EASTWEST_PARAM
bipNS = BuiltInParameter.BASEPOINT_NORTHSOUTH_PARAM
bipElev = BuiltInParameter.BASEPOINT_ELEVATION_PARAM
SPeastWest = surveyPoints[0].get_Parameter(bipEW).AsDouble()
SPnorthSouth = surveyPoints[0].get_Parameter(bipNS).AsDouble()
SPelev = surveyPoints[0].get_Parameter(bipElev).AsDouble()
OUT = Autodesk.DesignScript.Geometry.Point.ByCoordinates(SPeastWest, SPnorthSouth, SPelev)
```
See Project Base Point for other methods.

# T

## Template
[ Python template support 2.0 #8122 ](https://github.com/DynamoDS/Dynamo/pull/8122)
Dynamo checks if the **PythonTemplate.py** file exists at the user location root (%appdata%/Dynamo/Core/{version}/) and if it does, it reads the file and populates the Python script node with its contents
if the file doesn't exits or it's empty, Dynamo falls back on the hard-coded behaviour
**Only available from version 2.0**

## Transactions
- Dynamo provides its own Transaction framework for working with the RevitAPI. This means that your Python script will be executing in the context of an overall Dynamo Transaction.
- TransactionManager.EnsureInTransaction(): Initializes the Dynamo Transaction
- TransactionManager.TransactionTaskDone(): Tells Dynamo that we are finished using the Transaction
- TransactionManager.ForceCloseTransaction(): Tells Dynamo to commit the active Transaction. This is slower than TransactionTaskDone(), so only use it when you actually need to close the Transaction for your script to work.
```python
import clr
# Import DocumentManager and TransactionManager
clr.AddReference("RevitServices")
import RevitServices
from RevitServices.Persistence import DocumentManager
from RevitServices.Transactions import TransactionManager
# Get the document
doc = DocumentManager.Instance.CurrentDBDocument
# "Start" the transaction
TransactionManager.Instance.EnsureInTransaction(doc)
# Create a reference point (requires a transaction)
refPt = doc.FamilyCreate.NewReferencePoint(XYZ(0, 0, 0))
# "End" the transaction
TransactionManager.Instance.TransactionTaskDone()
```

## Execution Time
[timeit](https://www.geeksforgeeks.org/timeit-python-examples/)
```python
import sys
sys.path.append("C:\Program Files (x86)\IronPython 2.7\Lib")
import timeit
# code snippet to be executed only once
mysetup = "from math import sqrt"
# code snippet whose execution time is to be measured
mycode = """
myList = list()
"""
# timeit statement
OUT = timeit.timeit(setup = mysetup, stmt = mycode, number = 10000)*1000
```

## Codeblock execution time
[Why is it that Code blocks execute faster than set of standard nodes?](https://forum.dynamobim.com/t/dynamo-nodes-vs-code-block-who-is-faster/691/4)

If you open a .dyn file with a text editor, you’ll see that each node balloon is represented by a unique id, contents and 2D coordinates. So when you have a complex chain of code balloons, every time you run your definition, dynamo has to act like a miniature database and an assembler in the background, has to figure out what content is connected to what, sort it and combine it and then finally execute the code.


# U
## Units
- *Dynamo* uses **meters** for length units and the *Revit API* uses **feet** for length units.
- This is true regardless of what the "user-facing" units are in either application
You will need to manually do a unit conversion when:
- passing a length value to a Python node and then invoking the Revit API using those lengths
- extracting a length from the RevitAPI and then returning that value from a Python node

<a style="color:red">**The latest Dynamo Build (1.+) for Revit no longer uses meters for length units.**</a>
- Dynamo units are derived from the active Revit document
- A simple method for dynamically assigning the correct units conversion can be achieved by using the Revit API UnitUtils.ConvertFromInternalUnits() method:
```python
getDocUnits = doc.GetUnits()
getDisplayUnits = getDocUnits.GetFormatOptions(UnitType.UT_Length).DisplayUnits
unitConversion = UnitUtils.ConvertFromInternalUnits(1, getDisplayUnits )
```

## Unwrapping
```python
wrappedElement = IN[0]
unwrappedElement = UnwrapElement( wrappedElement )
# Now I can use 'unwrappedElement' with the RevitAPI
```
For example:
```python
selElement = UnwrapElement(IN[0])
id = selElement.Id #RETURN AN ElementId OBJECT
```
While if we don't unwrap the element, the returned Id is an integer,not an object:
```python
selElement = IN[0]
id = selElement.Id #RETURN THE ID OF THE ELEMENT AS INTEGER
eleId = ElementId(selElement.Id) #CAST THE ID TO AN ElementId OBJECT
```

# W
## Wrapping
In order to interoperate with our Revit nodes, any raw Autodesk.Revit.DB.Element being returned from a Python script must be wrapped in a Revit.Elements.Element. This can be done by using the ToDSType(bool) extension method. 
- The bool argument determines whether or not the Element is "Revit-owned." 
- Revit-owned Elements are not controlled by Dynamo
- non-Revit-owned Elements are
 If you are creating a new Element in your Python script, then you should not mark the wrapped Element as Revit-owned ToDSType(False)
If you are selecting an Element from the Document, then you should mark the wrapped Element as Revit-owned ToDSType(True).
```python
import clr
# Import ToDSType(bool) extension method
clr.AddReference("RevitNodes")
import Revit
clr.ImportExtensions(Revit.Elements)
docPt = FetchRefPtFromDoc() #Fetch an existing ref pt (not a real method)
newPt = CreateNewRefPt()    #Create a new ref pt (not a real method)
OUT = [ 
    docPt.ToDSType(True), #Not created in script, mark as Revit-owned
    newPt.ToDSType(False) #Created in script, mark as non-Revit-owned
]
```

## Why does dynamo work? Ian Keough
[iankeough.com](http://iankeough.com/wordpress/?p=93)
-  see [this post](http://thebuildingcoder.typepad.com/blog/2010/04/asynchronous-api-calls-and-idling.html) on the Building Coder
-  check out my implementation in the [dynamoRevit.cs](https://github.com/DynamoDS/DynamoRevit/blob/Revit2018/src/DynamoRevit/DynamoRevit.cs) file from the repo.

The trick is to open a transaction, subscribe to the **OnIdling** event, make the dynamo window a sub process of the main Revit process, then close the transaction and return to Revit whilst leaving dynamo running.
Controlling Revit this way can be fragile which is why there’s a whole bunch of stuff I do in there to control the process flow, opening and closing of transactions, etc.



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
    .attr("xlink:href", "/images/pyRevitAPI_1.png");

function zoom() {
  svg1.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    

<script>  
var imgHeight = 635, imgWidth = 1600,      
    width =  960, height = 385,             
    translate0 = [0, 0], scale0 = 0.6;  

svg2 = d3.select("#imageContainer2").append("svg")
    .attr("width",  width + "px")
    .attr("height", height + "px");

svg2.append("rect")
    .attr("class", "overlay")
    .attr("width", width + "px")
    .attr("height", height + "px");

svg2 = svg2.append("g")
    .attr("transform", "translate(" + translate0 + ")scale(" + scale0 + ")")
    .call(d3.behavior.zoom().scaleExtent([1, 3]).on("zoom", zoom))
  .append("g");

svg2.append("image")
    .attr("width",  imgWidth + "px")
    .attr("height", imgHeight + "px")
    .attr("xlink:href", "/images/pyRevitAPI_2.png");

function zoom() {
  svg2.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>    
