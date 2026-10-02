---
layout: post
title: Navis Addins
---

## What we need to create an addin with a toolbar and button is Navis

### Folder structure

## Navisworks Add-in Folder Structure

```text
C:\ProgramData\Autodesk\ApplicationPlugins
│
└── name.bundle
    │
    ├── PackageContents.xml
    │
    └── Contents
        │
        └── 2026
            │
            ├── NavisworksTools.dll
            │
            ├── en-US
            │   └── name-Ribbon.xaml
            │
            └── Resources
                ├── icon1.png
                └── icon2.png
```

### PackageContents.xaml

Loads the addins for the correct version of Navis

<details>
    <summary>code</summary>

```xaml
    <?xml version="1.0" encoding="utf-8" ?>
<ApplicationPackage SchemaVersion="1.0" Name="LOR-FBA" AppVersion="1.0.0.0" ProductType="Application"
Author="LOR" ProductCode="{60A433A1-B731-4539-B8A5-B8E38CE405B8}">
  <Components Description="Navisworks 2026 parts">
    <RuntimeRequirements OS="Win64" Platform="NAVMAN|NAVSIM" SeriesMin="Nw23" SeriesMax="Nw23" />
    <ComponentEntry AppName="LOR-FBA" AppType="ManagedPlugin" ModuleName="./Contents/2026/fba-comply.dll" />
  </Components>
</ApplicationPackage>
```
</details>

### name-Ribbon.xaml

- Sort buttons in panels
- - Button ID to match ID in App.cs

<details>
    <summary>code</summary>
    
```xaml
<?xml version="1.0" encoding="utf-8" ?>
<RibbonControl
    xmlns="clr-namespace:Autodesk.Windows;assembly=AdWindows"
    xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml"
    xmlns:nvw="clr-namespace:Autodesk.Navisworks.Gui.Roamer.AIRLook;assembly=navisworks.gui.roamer"
    x:Uid="UID_LOR_FBA_RIBBON_CONTROL">
    <RibbonTab Title="LOR-FBA" Id="ID_LOR_FBA_TAB">
        <RibbonPanel x:Uid="UID_LOR_FBA_PANEL">
            <RibbonPanelSource x:Uid="UID_NavisAddinManage_TAB_AddinManager_SOURCE" Title="COMPLY">
                <nvw:NWRibbonButton
                    x:Uid="UID_ButtonDownload"
                    Id="ID_ButtonDownload"
                    KeyTip="X1"
                    Orientation="Vertical"
                    ShowText="True"
                    Size="Large" />
                <nvw:NWRibbonButton
                    x:Uid="UID_ButtonDumpData"
                    Id="ID_ButtonDumpData"
                    KeyTip="X3"
                    Orientation="Vertical"
                    ShowText="True"
                    Size="Large" />
            </RibbonPanelSource>
        </RibbonPanel>
        <RibbonPanel x:Uid="UID_Lab_PANEL">
            <RibbonPanelSource x:Uid="UID_NavisAddinManage_TAB_Utilities_SOURCE" Title="UTILITIES">
			                <nvw:NWRibbonButton
                    x:Uid="UID_ButtonAddTab"
                    Id="ID_ButtonAddTab"
                    KeyTip="X2"
                    Orientation="Vertical"
                    ShowText="True"
                    Size="Large" />
                <nvw:NWRibbonButton
                    x:Uid="UID_ButtonRemoveTab"
                    Id="ID_ButtonRemoveTab"
                    KeyTip="X1"
                    Orientation="Vertical"
                    ShowText="True"
                    Size="Large" />
				<nvw:NWRibbonButton
                    x:Uid="UID_ButtonRemoveProperties"
                    Id="ID_ButtonRemoveProperties"
                    KeyTip="X2"
                    Orientation="Vertical"
                    ShowText="True"
                    Size="Large" />
            </RibbonPanelSource>
        </RibbonPanel>
		<RibbonPanel x:Uid="UID_CSV_PANEL">
            <RibbonPanelSource x:Uid="UID_NavisAddinManage_TAB_CSV_SOURCE" Title="CSV">
			    <nvw:NWRibbonButton
                    x:Uid="UID_ExportToCsv"
                    Id="ID_ExportToCsv"
                    KeyTip="Y1"
                    Orientation="Vertical"
                    ShowText="True"
                    Size="Large" />
                <nvw:NWRibbonButton
                    x:Uid="UID_ImportFromCsv"
                    Id="ID_ImportFromCsv"
                    KeyTip="X2"
                    Orientation="Vertical"
                    ShowText="True"
                    Size="Large" />
            </RibbonPanelSource>
        </RibbonPanel>
    </RibbonTab>
</RibbonControl>
```
</details>

### App.cs

- Set the buttons display name
- Points to the icons png files saved in the Resources folder

```csharp
[Plugin("LOR-FBA", "fba-de", DisplayName = "APAM")]
[RibbonLayout("LOR-FBA-Ribbon.xaml")] // must match file in LOR-FBA.bundle\Contents\2026\en-US\
[RibbonTab("ID_LOR_FBA_TAB", DisplayName = "APAM")]
[Command("ID_ButtonDownload", DisplayName = "Download\nData", Icon = "Resources\\app-16.png", LargeIcon = "Resources\\app-32.png", ToolTip = "Donwload data from Comply and save it as json file in C:\\Temp folder")]
[Command("ID_ButtonAddTab", DisplayName = "Add Tab", Icon = "Resources\\document-16.png", LargeIcon = "Resources\\document-32.png", ToolTip = "Create a new tab for the selected items")]
[Command("ID_ButtonDumpData", DisplayName = "Write\nData", Icon = "Resources\\2_16.png", LargeIcon = "Resources\\2_32.png", ToolTip = "Read data from the downloaded json file and write it into the selected items")]
[Command("ID_ButtonRemoveTab", DisplayName = "Remove\nTab", Icon = "Resources\\delete_16.png", LargeIcon = "Resources\\delete_32.png", ToolTip = "Remove a tab from the selected items")]
[Command("ID_ButtonRemoveProperties", DisplayName = "Remove\nProperties", Icon = "Resources\\delete_16.png", LargeIcon = "Resources\\delete_32.png", ToolTip = "Remove selected properties from selected items")]
[Command("ID_ExportToCsv", DisplayName = "Export csv", Icon = "Resources\\5_32.png", LargeIcon = "Resources\\5_32.png", ToolTip = "Export selected proeprties to a .csv file")]
[Command("ID_ImportFromCsv", DisplayName = "Import csv", Icon = "Resources\\lab32x32.png", LargeIcon = "Resources\\lab32x32.png", ToolTip = "Import properties from .csv file")]
```
