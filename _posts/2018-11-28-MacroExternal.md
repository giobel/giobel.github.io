---
title: Run Macro as External Command 
layout: post
---

Joshua Lumley [5 Secrets of Revit API C# Coding Ribbon Button Macro External Events Modeless dockable addin](https://www.youtube.com/watch?v=KHMwd4U_Lrs)

- Modeless forms requires this nested structure: ExternalEvents -> Try-Catch statements for error handling messages -> Transaction -> Interaction with the database

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
 
 - An IExternalApplication requires a OnStartup and OnShutdown routine
 ```csharp 		
public Result OnShutdown(UIControlledApplication a)
{
    return Result.Succeeded;
}

public Result OnStartup(UIControlledApplication a)
{
    string ChecklistsNumber = "myRibbonButton";
    string path = Assembly.GetExecutingAssembly().Location; 
                                                      
    String exeConfigPath = Path.GetDirectoryName(path) + "\\myRibbon.dll";
    a.CreateRibbonTab(ChecklistsNumber);
    RibbonPanel PRLChecklistsPanel = a.CreateRibbonPanel(ChecklistsNumber, ChecklistsNumber);
    PushButtonData myPushButtonData = new PushButtonData(ChecklistsNumber, ChecklistsNumber, exeConfigPath, "myRibbon.Invoke");

    myPushButtonData.LargeImage = new BitmapImage(new Uri(Path.Combine(Path.GetDirectoryName(path) + "\\011 myButtonImage paste into Addin.png"), UriKind.Absolute));

    RibbonItem myRibbonItem = PRLChecklistsPanel.AddItem(myPushButtonData);

    return Result.Succeeded;
}				
 ```
 
 - Add an ExternalEvent that calls the macro. The InvokeMember allows to run the command from memory without shutting down Revit
 ```csharp
 	
	    [Autodesk.Revit.Attributes.Transaction(Autodesk.Revit.Attributes.TransactionMode.Manual)]	

       public class Invoke : IExternalCommand
    {
        //public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        public Result Execute(ExternalCommandData commandData, ref string message, ElementSet elements)
        {
            string path = Assembly.GetExecutingAssembly().Location;
            //String exeConfigPath = Path.GetDirectoryName(path) + "..\\..\\..\\" + "myMacros\\2018\\Revit\\AppHookup\\_969_PRLChecklists\\AddIn\\_969_PRLChecklists.dll";
            String exeConfigPath = Path.GetDirectoryName(path) + "..\\..\\..\\" + "myModule\\AddIn\\myModule.dll";
            String exeConfigPath2 = Path.GetDirectoryName(path) + "..\\..\\..\\" + "myModule\\AddIn";

            string strCommandName = "ThisApplication";

            byte[] assemblyBytes = File.ReadAllBytes(exeConfigPath);

            Assembly objAssembly = Assembly.Load(assemblyBytes);
            IEnumerable<Type> myIEnumerableType = GetTypesSafely(objAssembly);
            foreach (Type objType in myIEnumerableType)
            {
                if (objType.IsClass)
                {
                    if (objType.Name.ToLower() == strCommandName.ToLower())
                    {
                        object ibaseObject = Activator.CreateInstance(objType);
                        object[] arguments = new object[] { commandData, exeConfigPath2, elements };
                        object result = null;

                        result = objType.InvokeMember("Execute", BindingFlags.Default | BindingFlags.InvokeMethod, null, ibaseObject, arguments);

                        break; 
                    }
                }
            }
            return Result.Succeeded;     

        }
        private static IEnumerable<Type> GetTypesSafely(Assembly assembly)
        {
            try
            {
                return assembly.GetTypes();
            }
            catch (ReflectionTypeLoadException ex)
            {
                return ex.Types.Where(x => x != null);
            }
        }
       }
 ```
 
 - Add an image to the button. The image should be saved in the C:\ProgramData\Autodesk\Revit\Macros\2018\Revit\AppHookup\myRibbon\AddIn folder
 
 - Add an addin file to the Revit folder C:\ProgramData\Autodesk\Revit\Addins\2018
 
 - Add a modeless form
 ```csharp
 namespace myModule
{
	/// <summary>
	/// Description of Form1.
	/// </summary>
	public partial class Form1 : System.Windows.Forms.Form
	{
		
	public Document doc { get; set; }
		
            linePatternsWeightsFalse mylinePatternsWeightsFalse;
            ExternalEvent myMakeLinePatterns;
            
           linePatternsWeightsTrue mylinePatternsWeightsTrue;
            ExternalEvent myMakeLineWeights;
	public Form1()
		{
			//
			// The InitializeComponent() call is required for Windows Forms designer support.
			//
			InitializeComponent();
			mylinePatternsWeightsFalse = new linePatternsWeightsFalse();
			myMakeLinePatterns = ExternalEvent.Create(mylinePatternsWeightsFalse);
			
			mylinePatternsWeightsTrue = new linePatternsWeightsTrue();
			myMakeLineWeights = ExternalEvent.Create(mylinePatternsWeightsTrue);
			//
		}
		

	}
	
public class linePatternsWeightsTrue : IExternalEventHandler
    {

        public void Execute(UIApplication a)
        {
        	
        	UIDocument uidoc =  a.ActiveUIDocument;
        	Document doc = uidoc.Document;
        	
	Transaction transaction = new Transaction( doc);
	transaction.Start( "Draw Line Patterns or Weights" );	
        	
        	DrawLines myThis = new DrawLines();
        	
        	myThis._99_DrawLinePatterns(true, false, uidoc);
    		transaction.Commit();
        	return;
        	
        }
        
       public string GetName()
        {
            return "External Event Example";
        }
	    
	    
	}
	    
    [Autodesk.Revit.Attributes.Transaction(Autodesk.Revit.Attributes.TransactionMode.Manual)]
    [Autodesk.Revit.DB.Macros.AddInId("23CF5F71-5468-438D-97C7-554F4F782936")]	
	
	    public class linePatternsWeightsFalse : IExternalEventHandler
    {
    	
        public void Execute(UIApplication a)
        {
        	
        	UIDocument uidoc =  a.ActiveUIDocument;
        	Document doc = uidoc.Document;
        	
            Transaction transaction = new Transaction( doc);
            transaction.Start( "Draw Line Patterns or Weights" );	
        	
        	DrawLines myThis = new DrawLines();
      	
        	myThis._99_DrawLinePatterns(false, false, uidoc);

    		transaction.Commit();
        	return;
        }
        
        
   public string GetName()
        {
            return "External Event Example";
        }
	    
	    
	}
}
 ```
 
 - InvalidOperationException errors can be neutralized using a try and catch statement
 ```csharp
 try
            {
   				throw new InvalidOperationException();  
   				
		      	using (Transaction t = new Transaction(doc, "Set a parameters"))
		              {
		               	t.Start();
		                doc.ProjectInformation.GetParameters("Project Name")[0].Set("Space Elevator");  //this needs to change in two places
		                t.Commit();
		               }
		      	
		      	
				//myEE7ActionParameter.Raise();  				
            }

            #region catch and finally
            catch (Exception ex)
            {
                TaskDialog.Show("Catch", "Failed due to:" + Environment.NewLine + ex.Message);
            }
            finally
            {
          
 ```
 
 - "Starting a transaction from an external application running outside of API context is not allowed." requires to launch methods from ExternalEvents. It has to be declared first and then activated.
 ```csharp
// Declaration 
	public partial class Form1 : System.Windows.Forms.Form
	{
		
		ButtonEE7Parameter myEE7Parameter;
        ExternalEvent myEE7ActionParameter;
```

```csharp
// Initialization
public Form1()
    {
        //
        // The InitializeComponent() call is required for Windows Forms designer support.
        //
        InitializeComponent();
        
        myEE7Parameter = new ButtonEE7Parameter();
        myEE7ActionParameter = ExternalEvent.Create(myEE7Parameter);
```

- Use a raise command to trigger the ExternalEvent
```csharp
void Button3Click(object sender, EventArgs e)
{
    try
    {
        myEE7ActionParameter.Raise();  				
    }
    catch (Exception ex)
    {
        TaskDialog.Show("Catch", "Failed due to:" + Environment.NewLine + ex.Message);
    }
    finally
    {
    }
}
```