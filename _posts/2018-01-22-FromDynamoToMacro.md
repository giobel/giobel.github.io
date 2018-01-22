---
layout: post
title: From Dynamo to Macro to External Commands
---
<style>

.overlay {
  fill: none;
  pointer-events: all;
}
    </style>
    
<script src="//code.jquery.com/jquery.js"></script>

<script src="//d3js.org/d3.v3.min.js"></script>

Dynamo is a good tool but scripts deployment, version compatibility, non OOTB nodes and the need to start Dynamo or to launch a script from the player can sometimes represent an obstacle.

For the most used nodes it may be worth to convert them into external commands or bespoke buttons in the toolbar.

The visual scripting process and the constant debugging (that can be done simply by checking the outputs of the individual nodes) represent a first step into proper coding. It helps to subdivide the problem into small chunks of code and to follow the flow of data, its transformation and its structure passing from one node to the other.

With this image in mind I think it's easier to write the same script in C#, in a macro first and then to create an external command in Visual Studio. The advantage of an external command over the other options is the accessibility from Revit through a keyboard shortcut, which increase the productivity and helps to develop a personal workflow in the creation of models or documentations.

This workflow is essential to adapt the software to the user needs and stimulating his creativity more than force him to adapt and follow actions created by others (software developer) that sometimes are convoluted or lack in immediacy.

Let's have a look at this script that places the active view on a selected sheet:

   <div id="imageContainer1"></div>

All the magic happens in SteamNodes's python script:

   <div id="imageContainer2"></div>

Reading through the script we can see Viewport.Create which is the instructions that tells Revit to create a new Viewport at a given location on a sheet.

In order to understand how this command works we can go to the [RevitAPIdocs](http://www.revitapidocs.com/) website and search Viewport:

   <img src="/images/macro3.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

You can see that there are two Viewport items: Methods and Class. If you select Viewport Class you will see that methods are a subdirectory of the viewport class (along with members and properties):

   <img src="/images/macro4.PNG" width="1051" style="display:block; margin-left: auto; margin-right: auto;">

In simple words, a class is like a family type and a method is what you can do with that family. In this case you can "Return the center of the outline of the viewport on the sheet, excluding the viewport
label" (GetBoxCenter) or you can "Move this viewport so that the center of the box outline (excluding the viewport label) is at a given point" (SetBoxCenter). Let's focus on the Create method:

   <img src="/images/macro5.PNG" width="300" style="display:block; margin-left: auto; margin-right: auto;">

The arguments between the parenthesis are the inputs we need to provide to this method in order to get our viewport on a sheet. If you notice, sheet, view and point are also the inputs of the custom node while document is not explicitly required (but it's defined at the beginning of the python script):

   <div id="imageContainer3"></div>

So how do we convert this script into a macro? Let's open the Macro Manager and create a new module called myMacros in the Application panel:

   <img src="/images/macro7.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">

Macros can reside either in the active project file or within the application. Macros saved within the project file can be used by any user who opens that file. Macros saved in the application are saved to the user's Revit configuration. These macros can be used on any model file, but only by the user who created the macro.
You can find a detailed explanation of how to create your first macro here.

Once you press ok, Revit will open a new window. This is called Sharp Develop and it is an integrated development environment in which we will be writing the macro.
The command:

<img src="/images/macro8.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

will create a macro called placeActiveView accessible by other macros in this module (public) that will place our view on a sheet without returning any object (void).

<img src="/images/macro9.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

If we build the solution (Build -> Solution or F8) and we close the Sharp Developer we will see that our macro has appeared under the myMacros module. Let's click Edit and go back to Sharp Develop.

<img src="/images/macro10.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

Every macros start accessing the project opened:

<img src="/images/macro11.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

Autodesk.Revit.UI.UIDocument - provides access to UI-level interfaces for the document, such as the contents of the  selection and the ability to prompt the user to make selections and pick points.

Autodesk.Revit.DB.Document - provides access to all other document level properties

If multiple documents are open, the active document is the one whose view is active in the Revit session.

In our case we also want to get the active view:

<img src="/images/macro12.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

Let's now get the sheet where the view will be placed.

In Dynamo we would create a list with all the elements of the Sheets category, retrieve their Sheet Number and find the one that matches the desired one:

<img src="/images/macro13.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

Which is the equivalent of:

<img src="/images/macro14.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

We first create a variable viewSh where the sheet will be stored [49]. Then we use a FilteredElementCollector to select all the sheets in the current project [51]. Then we cycle through them and when the sheet number matches the desired one we append the sheet in our variable [53-58]. We can then visualise the sheet Id in a Task Dialog to double check it's the correct one.

To run the macro we first need to build it (F8) and then run it from the macro manager:

<img src="/images/macro15.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

The output will simply be the Task Dialog with the sheet zBS-001 Id:

<img src="/images/macro16.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

Which is what we were expecting:

<img src="/images/macro17.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

So now we have all the elements to use the Viewport.Create method:

<img src="/images/macro18.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

but to use it we need to start a Transaction.

A transaction is a context required in order to make any changes to a Revit model. Only one transaction can be open at a time; nesting is not allowed. Each transaction must have a name, which will be listed on the Undo menu in Revit once a transaction is successfully committed.

For best practice, any transaction should be enclosed in a 'using' block or guarded within a try-catch-finally blocks to guarantee that it does not out-live its scope.

<img src="/images/macro19.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

If we build our macro and run it the active view will be placed on the sheet zBS-001 at coordinates (0,0,0):

<img src="/images/macro20.PNG" width="400" style="display:block; margin-left: auto; margin-right: auto;">

So how can we ask the user to input the Sheet Number? We need to create a Window Form. [I learned about Window Form from this tutorial by Matthew Nelson](http://www.mattbenimble.com/articles/revit-macro-forms/ ).

Right click on ThisApplication.cs in the left project window, Add, New Item...

<img src="/images/macro21.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">

...Form and Create.

<img src="/images/macro22.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">

Open the Design Form

   <img src="/images/macro23.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">

Open the Tools bar from View:

   <img src="/images/macro24.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">

Click on the Windows Forms folder

   <img src="/images/macro25.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">

If you leave the custom properties the window will appear at the "WindowsDefaultLocation". We can make it appear at the Centre of the Screen simply selecting this value in the Layout - Start Position field:

   <img src="/images/macro26.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">

Then draw a Label and a Text Box. Select the Label and in the Properties window change the Text to something meaningful.

   <img src="/images/macro27.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">

Then select the text box and check its name ("textBox1") as we will need it later.

   <img src="/images/macro28.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">

Then let's add two buttons, Ok and Cancel.

   <img src="/images/macro29.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">
   <img src="/images/macro30.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">
    
And set their Dialog Result to OK and Cancel respectively. This will close the Form and save or cancel the result.

   <img src="/images/macro31.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">

Then double click on the OK button. This will open the Source Code of our Form1 and will create a void Button1Click() class. We need to store the Sheet Number that the user will type in the text box into a string:

   <img src="/images/macro32.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">    

We can then go back to ThisApplication.cs and import the System.Windows.Forms library in our code:

   <img src="/images/macro33.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">

and place the body of the code we have written so far inside an instance of the Form1:

   <img src="/images/macro34.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">

We also need to store the user input into a variable (sheetNumber) that we will use to filter the list of Sheets:

   <img src="/images/macro35.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">

Now we can build the macro and test it.

You will notice that if you leave the text box empty or you write a sheet number that does not exists Revit will throw an error:

   <img src="/images/macro36.PNG" width="1000" style="display:block; margin-left: auto; margin-right: auto;">



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
    .attr("xlink:href", "/images/macro1.PNG");

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
    .attr("xlink:href", "/images/macro2.PNG");

function zoom() {
  svg2.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>
  
  <script>  
var imgHeight = 635, imgWidth = 1600,      
    width =  960, height = 385,             
    translate0 = [0, 0], scale0 = 0.6;  

svg3 = d3.select("#imageContainer3").append("svg")
    .attr("width",  width + "px")
    .attr("height", height + "px");

svg3.append("rect")
    .attr("class", "overlay")
    .attr("width", width + "px")
    .attr("height", height + "px");

svg3 = svg3.append("g")
    .attr("transform", "translate(" + translate0 + ")scale(" + scale0 + ")")
    .call(d3.behavior.zoom().scaleExtent([1, 3]).on("zoom", zoom))
  .append("g");

svg3.append("image")
    .attr("width",  imgWidth + "px")
    .attr("height", imgHeight + "px")
    .attr("xlink:href", "/images/macro6.PNG");

function zoom() {
  svg3.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  console.log("translate: " + d3.event.translate + ", scale: " + d3.event.scale);
  }
  </script>