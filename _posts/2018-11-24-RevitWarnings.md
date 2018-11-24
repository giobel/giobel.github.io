---
title: Suppressing Revit Warnings 
layout: post
---

In Revit there are different types of warnings. The most recurring ones are:

1. Transaction related warnings
2. Warnings displayed when the model is open

[Jeremy Tammik](https://thebuildingcoder.typepad.com/blog/2010/08/suppress-unwanted-dialogue.html) suggests 3 methods:
1. [DialogBoxShowing](https://thebuildingcoder.typepad.com/blog/2009/06/autoconfirm-save-using-dialogboxshowing-event.html) event, which can be used to dismiss a dialogue programmatically.
2. The Revit 2011 API also includes a comprehensive [failure processing API](https://thebuildingcoder.typepad.com/blog/2010/04/failure-api.html), which can do much more than the DialogBoxShowing event.
3. If all else fails and you just want to get rid of the dialogue box by any means, you can also use the Windows API to detect when it is displayed and dismiss it using my [dialogue clicker](https://thebuildingcoder.typepad.com/blog/2009/10/dismiss-dialogue-using-windows-api.html) application to suppress it.

The [Warning Swallower](https://thebuildingcoder.typepad.com/blog/2016/09/warning-swallower-and-roomedit3d-viewer-extension.html) deals with the transaction related warnings.
Here's the solution from the Revit Samples [CmdPreprocessFailure.cs](https://github.com/jeremytammik/the_building_coder_samples/blob/master/BuildingCoder/BuildingCoder/CmdPreprocessFailure.cs#L44-L67)

For opening warnings, we can't use the Warning Swallower. This post [Open Document and ignore errors]([Control Dynamo from the web](https://github.com/DynamoDS/DeveloperWorkshop/tree/master/CBW227911%20-%20Control%20Dynamo%20from%20the%20Web)) explains step by step how to dismiss a dialogue:

1. If you want to run the macro in Revit zero state mode, import the Autodesk.Revit.ApplicationServices namespace and create a new UIApplication
```csharp
UIApplication uiapp = new UIApplication(Application);	
Application app = uiapp.Application;
```

2. Subscribe to the [DialogBoxShowing event](http://www.revitapidocs.com/2018.1/a5b8870c-d2b8-d3e8-fa35-e9e2166d54f5.htm) (the DialogBoxShowing event can be found in the Autodesk.Revit.UI.Events namespace).
```csharp
uiapp.DialogBoxShowing += new EventHandler<DialogBoxShowingEventArgs>(DialogBoxShowing);
```

Depending on the type of the dialog that is being shown, the event's argument's type varies as follows: 
- When it is a dialog box, the event's argument is an object of DialogBoxShowingEventArgs . 
- When it is a message box, the event's argument is an object of MessageBoxShowingEventArgs ,which is subclass of DialogBoxShowingEventArgs. 
- When it is a task dialog, the event's argument is an object of TaskDialogShowingEventArgs ,which is subclass of DialogBoxShowingEventArgs.

3. Create a void method to access the correct argument's type. In this case a TaskDialog:
```csharp
void DialogBoxShowing(object sender, DialogBoxShowingEventArgs e) {
    TaskDialogShowingEventArgs e2 = e as TaskDialogShowingEventArgs;
```

4. Loop through the TaskDialogShowingEventArgs DialogId to find the one to suppress. To suppress it use the OverrideResult() method:
```csharp
string s = string.Empty;			
    bool isConfirm = false;
    int dialogResult = 0;

    if (e2.DialogId.Equals("TaskDialog_Missing_Third_Party_Updaters"))
        {
        isConfirm = true;
        dialogResult = (int)TaskDialogResult.CommandLink1;
        }
    
    if (isConfirm)
        {
        e2.OverrideResult(dialogResult);
        s += ", auto-confirmed.";
        }
        else
        {
        s = string.Format(
        ", dialog id {0}, message '{1}'",
        e2.DialogId, e2.Message);
        forms.MessageBox.Show(s);				
        }			
```

You can find a snippet [here](https://gist.github.com/giobel/a90eb49a0c322bb2f0c3adfbd1acc794#file-disableopeningwarnings-cs)