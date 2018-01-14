---
layout: post
title: Revit API using Python
---
<style>

.overlay {
  fill: none;
  pointer-events: all;
}
    </style>
    
<script src="//code.jquery.com/jquery.js"></script>

<script src="//d3js.org/d3.v3.min.js"></script>

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

## Migrations

[Dynamo Python Wiki](https://github.com/DynamoDS/Dynamo/wiki/Python-0.6.3-to-0.7.x-Migration)
### Revit Document/Application
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
### Elements
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

### Unwrapping
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
### Wrapping
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
### Units
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
### GeometryObjects
- All Geometry coming out of Dynamo Nodes are NOT Revit GeometryObject's, so they need to be converted when used with the Revit API.
- Dynamo represents all Geometry in meters, while Revit uses feet. 
To import the GeometryConversion tools, do this:
```python
import clr
clr.AddReference("RevitNodes")
import Revit
# Import ToProtoType, ToRevitType geometry conversion extension methods
clr.ImportExtensions(Revit.GeometryConversio
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

### Transactions
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

### Passing Functions to Python
Currently, passing functions to Python scripts through Dynamo is not supported in 0.7.x. This capability will be returning some time in the future.

### Passing Python Nodes as Functions
Currently, passing Python nodes to other nodes as functions is not supported in 0.7.x. This capability will be returning some time in the future.

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


## [How to load external Python modules?](https://forum.dynamobim.com/t/how-to-load-external-python-modules/5678)
```python
import sys
sys.path.append(r'C:\Program Files (x86)\IronPython 2.7\DLLs')
sys.path.append(r'C:\Program Files (x86)\IronPython 2.7\Lib')
import sqlite3
import xml
```

## [Why is it that Code blocks execute faster than set of standard nodes?](https://forum.dynamobim.com/t/dynamo-nodes-vs-code-block-who-is-faster/691/4)
f you open a .dyn file with a text editor, you’ll see that each node balloon is represented by a unique id, contents and 2D coordinates. So when you have a complex chain of code balloons, every time you run your definition, dynamo has to act like a miniature database and an assembler in the background, has to figure out what content is connected to what, sort it and combine it and then finally execute the code.

## [timeit](https://www.geeksforgeeks.org/timeit-python-examples/)
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


Iterate through list??

GetSymbolGeometry vs GetInstanceGeometry??

FilteredElementCollector
ofType -> crl....





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