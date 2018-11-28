---
title: Run Macro as External Command 
layout: post
---

Joshua Lumey
[5 Secrets of Revit API C# Coding Ribbon Button Macro External Events Modeless dockable addin](https://www.youtube.com/watch?v=KHMwd4U_Lrs)

 - Create a module and a macro with some code
```csharp
TaskDialog mainDialog = new TaskDialog("Fun Secrets of Revit Coding!");
mainDialog.MainInstruction = "Secret Code in Revit API !";
mainDialog.MainContent = "Do you want to be an awesome, all powerful, all knowing Revit API coder?";
mainDialog.AddCommandLink(TaskDialogCommandLinkId.CommandLink1,"Yes, I do - show me the way!");
mainDialog.AddCommandLink(TaskDialogCommandLinkId.CommandLink2, "No, I'm in a comfortable vegetative state.");
 ```
 
 - Set ThisApplication to inherit from IExternalCommand
 ```csharp
 public partial class ThisApplication : IExternalCommand
 ``` 
 
 - Modify the macro to be able to accept an UIDocument
 ```csharp
 public void myMacro(UIDocument uidoc)
 ``` 
 
 - Add an Execute subroutine that will run the macro
 ```csharp
public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements){
    myMacro(commandData.Application.ActiveUIDocument);
    return Result.Succeeded;
    }
 ```
 
 - Create a Ribbon Button: create a new module called myRibbon that inherits from IExternalApplication
 ```csharp
 public partial class ThisApplication : IExternalApplication
 ``` 
 
 - To create the button we need to add the following directives:
 ```csharp
using System.Reflection;
using System.IO;
using System.Windows.Media.Imaging;
 ```
 
 and the following references:
 ```csharp
 WindowsBase
 PresentationCore
 SystemXaml
 ```
 