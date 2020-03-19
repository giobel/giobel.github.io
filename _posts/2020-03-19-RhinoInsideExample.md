---
layout: post
title: RhinoInsideRevit Example
---

## SETUP

 ###1. Create project parameters for WPA Id
 Parameters that are the same for all element types would be better as Type parameters -> 
 Better consistency (instance parameters more prone to errors).

[CreateProjectTypeParameters_01.dyn](/images/Dynamo%20scripts/CreateProjectTypeParameters_01.dyn)

 ###2. Change Family Category (Optional): https://forum.dynamobim.com/t/change-category-of-family/12605/9

![Dynamo%20scripts/Untitled.png](/images/Dynamo%20scripts/Untitled.png)

###3. Delete parameters:

[DeleteParameters_01.dyn](/images/Dynamo%20scripts/DeleteParameters_01.dyn)

## POPULATE PARAMETERS

###4. Set standard parameters
i.e. Model Name, Element Author, Element Discipline, Element Status, Element Suitability Design Package Number

[SetStationParameters_01.dyn](/images/Dynamo%20scripts/SetStationParameters_01.dyn)

###5. Populate type parameters from Excel

[SetWPAfromExcel_01.dyn](/images/Dynamo%20scripts/SetWPAfromExcel_01.dyn)

## Additional option:

[Autodesk ClassificationManager for Revit](https://www.biminteroperabilitytools.com/classificationmanager.php)

# RHINO INSIDE

###1. Download Rhino for Windows WIP: https://www.rhino3d.com/download/rhino/wip 
###2. Download Rhino.Inside Revit for Windows WIP: https://www.rhino3d.com/download/rhino.inside-revit/7/wip

![Dynamo%20scripts/Untitled%201.png](/images/Dynamo%20scripts/Untitled%201.png)

From Add-Ins select Rhino, this will create a Rhinoceros tab

![Dynamo%20scripts/Untitled%202.png](/images/Dynamo%20scripts/Untitled%202.png)

From the Rhinoceros tab launch Rhino and then start Grasshopper from Rhino

## General notes:
###1. Disable Solver before opening the scripts
    
## Workflow
###1. Delete unnecessary parameters

![Dynamo%20scripts/Untitled%203.png](/images/Dynamo%20scripts/Untitled%203.png)

[DeleteParameters_01.gh](/images/Dynamo%20scripts/DeleteParameters_01.gh)

###2. Create project parameters for selected categories

![Dynamo%20scripts/Untitled%204.png](/images/Dynamo%20scripts/Untitled%204.png)

[CreateProjectParameters_01.gh](/images/Dynamo%20scripts/CreateProjectParameters_01.gh)

###3. Set common project paramters (manually updated by station):
- Model Name
- Element Author
- Element Discipline
- Element Status
- Element Suitability
- Design Package Number
- Element LOD
- Is Constructed
- SBS-ID
- Handover Lot No

![Dynamo%20scripts/Untitled%205.png](/images/Dynamo%20scripts/Untitled%205.png)

[SetStationParameters_02.gh](/images/Dynamo%20scripts/SetStationParameters_02.gh)

 ###4. Set Parameters from Excel

![Dynamo%20scripts/gh_Template.png](/images/Dynamo%20scripts/gh_Template.png)

[SetParametersFromExcel_02.gh](/images/Dynamo%20scripts/SetParametersFromExcel_02.gh)

<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="720" height="550" data-setup="{}">
<source src="/videos/wpa.mp4" type='video/mp4'></video>