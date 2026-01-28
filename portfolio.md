## INFRASTRUCTURE WORKS

### Temporary Works modelling with Rhino

<img width="1209" height="602" alt="image" src="https://github.com/user-attachments/assets/1f2e4429-a33d-430e-924b-3777a8945684" />

<img width="1945" height="1440" alt="image" src="https://github.com/user-attachments/assets/e949693b-e687-44ed-bd66-4b0ae6f7987b" />

### Construction Sequence (Synchro 4D)

![image](https://github.com/user-attachments/assets/dfbf632f-7639-4ddb-b4ed-cb1da1831c14)

[4d sequence](https://youtu.be/oBYamUuiAAA?si=SRZPwFBbGDrzS8Dl)

### Fuzor - Mainentance clearance checks

![P2_01](https://github.com/giobel/giobel.github.io/assets/27025848/4c7e7a0d-435a-4eae-962a-965dcef44ad3)

![P7](https://github.com/giobel/giobel.github.io/assets/27025848/fd5c8a8e-33fd-4947-8d93-d5a5f6e37b32)

---

## MODEL MANAGEMENT

### Model Federation - Navisworks to Revizto

<img width="528" height="95" alt="image" src="https://github.com/user-attachments/assets/b36cf847-091d-4656-8e71-d6e98a6162ab" />

### PowerBi Dashboard

Python script using [IfcOpenShell](https://ifcopenshell.org/) to pull properties from .ifc files and present them in a powerbi dashboard. Dashboard used to track design models progression and quality.

<img width="1919" height="975" alt="image" src="https://github.com/user-attachments/assets/dba91fc8-e6cd-43e2-abd1-ccc30deefa2d" />
<img width="1402" height="803" alt="image" src="https://github.com/user-attachments/assets/6c890e1a-bb08-47b1-9ebb-83b79875c812" />

---

## COMPUTATIONAL DESIGN

#### Earth fill/excavation volume

- Create a 1x1 grid of points
- Project points to top and bottom surfaces
- Measure the distance between the points
- Mass addition of all the lengths gives the approx volume between the surfaces

[Cut and Fill](https://github.com/giobel/Storage/blob/main/Grasshopper/COL/Cut%20and%20Fill%20Heatmap.gh)

![image](https://github.com/giobel/giobel.github.io/assets/27025848/6fed1529-037c-46ce-ae3f-8d3e2d3e65dd)

![image](https://github.com/giobel/giobel.github.io/assets/27025848/12aa4b89-7257-41ba-be02-316d1bff1be4)

#### Salamander//Geometry Gym model geometry

[Wall and Fence](https://github.com/giobel/Storage/blob/main/Grasshopper/BED/R001-Survey%20Wall%20and%20Fence.gh)

![image](https://github.com/giobel/giobel.github.io/assets/27025848/03ddedb2-6851-4f16-a711-7fdd60f573cf)

### Rhino Compute

Rhino compute + Geometry Gym to edit model and save it to ifc file

![rhinoComputeIfc](https://github.com/giobel/giobel.github.io/assets/27025848/c9447f05-c1fd-43b5-8be7-5de380939dc2)

### Geometry Gym for Rhino

Edit IFC geometry in Rhino and export a new IFC file with custom properties (pour zone, volume, chainage start and finish) using Geometry Gym and bespoke addin (based on Geometry Gym open source library [link](https://github.com/giobel/RhinoLOR) )

[Powerpoint](https://github.com/giobel/Storage/blob/main/DE%20GH%20IFC.pptx)

[BaseSlabVolumes01](https://github.com/giobel/Storage/blob/main/Grasshopper/UMA/BaseSlabVolumes01.gh)

- Geometry edited in Rhino (slabs split at each pouring location)

![image](https://github.com/giobel/ReviTab/assets/27025848/6ded62f0-71f8-46c9-aa2e-a18b5cc216e5)

- IFC file generated using Geometry Gym
  
![image](https://github.com/giobel/ReviTab/assets/27025848/017428a5-7d87-4ecf-a5ee-1934d05d0345)

- IFC file edited
  - Transform origin from Local Coordinates to World Coordinates
    
      ![image](https://github.com/giobel/ReviTab/assets/27025848/c1dbaa35-07a1-426f-b903-27b3e0d6fcb8)
    
  - Add Property Set (see [community.osarch.org/discussion/1547](https://community.osarch.org/discussion/1547/) )
    
    ![image](https://github.com/giobel/ReviTab/assets/27025848/e53a7038-4b83-4e1f-a16f-6fcb4d7c1cae)
  
  - Add Property Values
    
    ![image](https://github.com/giobel/ReviTab/assets/27025848/6c84fada-49e7-4929-b15f-ab0f03fc082b)

- Write new IFC file
  
  ![image](https://github.com/giobel/giobel.github.io/assets/27025848/4607d778-5e8d-42c4-aaab-7128eff681c2)

- Smart View in BIMcollab

  ![image](https://github.com/giobel/giobel.github.io/assets/27025848/e8dbc51b-bf75-4e70-8a2a-44269e32a968)

### Tekla - Grasshopper Live Link

- Create Custom Components in Tekla:

![image](https://github.com/giobel/giobel.github.io/assets/27025848/9b7c9924-9165-4f14-9bc3-6cea29d851be)

![image](https://github.com/giobel/giobel.github.io/assets/27025848/4b03032b-e653-47a6-8e75-e3ed48e7d5cb)

- Use GH Tekla live link to place the Custom Components from E/N coordinates

![image](https://github.com/giobel/giobel.github.io/assets/27025848/7309984c-f67c-4e4f-8aff-c54e1a212162)

![image](https://github.com/giobel/giobel.github.io/assets/27025848/19ed3179-acd2-435b-a6f8-596b378d740e)

- Use a script to extract string from the custom components

[Tekla beam set out](https://github.com/giobel/Tekla_BeamSetOutPts)

![image](https://github.com/giobel/giobel.github.io/assets/27025848/90fceb28-3e9a-4616-b2e1-43c2f9c6b43f)

![image](https://github.com/giobel/giobel.github.io/assets/27025848/ab9658a3-b9ed-4966-a1e9-9d5eef8fd3b5)

---

## ADDINS

### Revit Addin Development

Project specific addins.

<img width="1602" height="95" alt="image" src="https://github.com/user-attachments/assets/4d81ca66-b93d-4c76-8146-83653d5be692" />

### Navisworks Addin Development

- Import/Export model properties to Excel. 
- Add custom properties to model items.

<img width="455" height="93" alt="image" src="https://github.com/user-attachments/assets/3837df4e-43c5-4052-bb21-e7efb86ec2cf" />

### Signal Sighting viewpoints (Navisworks)

[Signal Sighting](https://github.com/giobel/SignalSighting)

Generate viewpoints at calculated distances along the railway alignment.

![image](https://github.com/giobel/giobel.github.io/assets/27025848/ebde4333-eccf-4d4e-bf06-5c07a1237ed5)

---

## WEB APPS / EXTENSIONS

#### Clip Planes at chainage (Trimble Connect)

[TC Clip Planes](https://github.com/giobel/tcapp)

![image](https://github.com/giobel/giobel.github.io/assets/27025848/a2bf0ced-6f58-4c4f-8cce-fb54c9147068)

#### Models Health Report (Trimble Connect)

[TC Models Health Report](https://github.com/giobel/TC-PR-EXT)

![image](https://github.com/giobel/giobel.github.io/assets/27025848/0a81b197-70f6-4d60-8fee-ae817496b4b4)

![image](https://github.com/giobel/giobel.github.io/assets/27025848/4d81930c-7463-4b24-8116-dd4267ce7e55)

#### Carbon Calculation (Trimble Connect)

Proof of concept to run carbon calculation inside Trimble Connect.

[TC Carbon](https://github.com/giobel/tc-carbon)

![image](https://github.com/giobel/giobel.github.io/assets/27025848/bef0fc5d-5c66-4f23-be00-5e73c7cadf58)

![image](https://github.com/giobel/giobel.github.io/assets/27025848/2302326e-2c8c-4f74-9cdb-968a1bd3ad35)

### P6 data to ifc model (IfcOpenShell with Trimble Connect)

- Ifcopenshell [script](https://gist.github.com/giobel/08e254a4ee54c6f38425c4b6c93b450a#file-p6attributes-py) to write P6 data into .ifc model
  
![image](https://github.com/giobel/giobel.github.io/assets/27025848/fab68e2f-4294-4d27-85c2-8e0b0d06d67b)

- Python script to add status sharing data

[Status Sharing](https://github.com/giobel/TrimbleConnectPyAPI)

![image](https://github.com/giobel/giobel.github.io/assets/27025848/a92bd738-0ca4-40f4-a969-1f0c3f550174)

 - Status can then be animated (the TC desktop app allows animation to dates in the future too)

![image](https://giobel.github.io/Sequence%20(1).gif)

### IFC Pile writer from Excel

Using Geometry Gym open source ifc library, generate solid geometries (Drilled Piles) from as-built data stored in Excel (E/N, Pile Mark, Pile Diameter, Length, Status) and saved them in a new ifc file. 
Script added to Task Scheduler and set to run daily to generate updated as-built model from site.

[IFC pile tracker](https://github.com/giobel/IFCpileTracker/tree/master)


---

## MODELLING AND DRAFTING

![GBPortfolio-Redux 1 _Page_06](https://github.com/user-attachments/assets/c4be161f-ea94-4137-ac94-de86b9c667b5)

![GBPortfolio-Redux 1 _Page_10](https://github.com/user-attachments/assets/0edb0c16-78a8-47cb-a717-a13498ce86e0)

![GBPortfolio-Redux 1 _Page_12](https://github.com/user-attachments/assets/ca824c2e-8b94-4595-a8ae-e7651159d48c)

![GBPortfolio-Redux 1 _Page_13](https://github.com/user-attachments/assets/39d33dbb-11e1-4a54-98b0-3bcb39fdd371)

