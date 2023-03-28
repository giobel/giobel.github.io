---
title: Pimp my Revit Project
layout: post
---

## Or the advantages of building project specific tools

# Summary
---

- ### Credits
- ### What tool?
- ### Examples
- ### Any Dynamo User in the room?
- ### Problems

## Inspiration

<img src="/images/Untitled-e1338e8b-cdb6-42df-8b75-1517f34645ab.png" width="900" align="middle">

<img src="/images/Untitled-5793fb69-abc3-424f-8685-456741121edc.png" width="554" align="middle">

Danny Bentley - BIM Structural Technician at SOM - 2017
[https://github.com/dannysbentley/Sections](https://github.com/dannysbentley/Sections)

<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="720" height="550" data-setup="{}">
<source src="/videos/dannyBentley.mp4" type='video/mp4'></video>

[https://thebuildingcoder.typepad.com/blog/2012/06/create-section-view-parallel-to-wall.html](https://thebuildingcoder.typepad.com/blog/2012/06/create-section-view-parallel-to-wall.html)

![](/images/Untitled-c0c247cf-8217-496b-8fb4-9ea8f216f501.png)

Dynamic Model Update Section - Revit Samples 2012

<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="720" height="550" data-setup="{}">
<source src="/videos/Dynamic Model Update Section - Revit Samples 2012.mp4" type='video/mp4'></video>

[https://thebuildingcoder.typepad.com/blog/2011/08/associative-section-view-fix.html#2](https://thebuildingcoder.typepad.com/blog/2011/08/associative-section-view-fix.html#2)

# The good, the bad and the ugly

![](/images/Untitled-d66215c6-7bbf-4d45-83eb-7dd61fe6df1b.png)

![](/images/Untitled-5911a92c-5cdc-422d-8e4a-c1389edbba38.png)

# What ~~tools~~ risks?

- Small programs that can be built in less than a week by one person
- They do one very specific thing for one specific project
- They can automate repetitive tasks or make Revit smarter
- They can provide new feature or extend existing ones
- They are not meant to be uploaded on the Tool Register but they live on GitLab:
    - Not ready to be deployed outside the office
    - Can be accessed by anyone who want to reuse part of the code
    - Implements version control
    - Colleagues can update and improve the code
- They are used by a limited and small number of users:
    - It can be less user friendly
    - The workflow to follow can be more complex
    - Immediate feedback for usability and bugs
- Let's ignore IP for simplicity


# Examples: New tool

## Void By Face
<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="720" height="550" data-setup="{}">
<source src="/videos/VoidByFace.mp4" type='video/mp4'></video>

1716 Rectangular + 1312 Circular = 3028 → 554mb

## Void By Line
<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="720" height="550" data-setup="{}">
<source src="/videos/VoidByLine.mp4" type='video/mp4'></video>

## Add Metadata to PDF + Viewer
<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="720" height="550" data-setup="{}">
<source src="/videos/MetadataViewer.mp4" type='video/mp4'></video>

# Examples: Add function to existing one

## BCFier batch issues
<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="720" height="550" data-setup="{}">
<source src="/videos/BCFierBatch.mp4" type='video/mp4'></video>

## Print Selected PDFs
<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="720" height="550" data-setup="{}">
<source src="/videos/Print Selected.mp4" type='video/mp4'></video>

# Could have they been created with Dynamo?

- Yes:
    - Revit Voids (Dynamo script by Ethan Gear)
    - Print Selected PDFs
- No:
    - Pdf Metadata
    - BCFier

When another software is involved, Dynamo is not enough.

Also:

- *Dynamo is Dead* cit. Konrad Sobon

![](/images/Untitled-05bcfb64-18ce-4858-a6ad-48192367badb.png)

- It's not as fast as a macro or C# addin
- Easier to share few lines of code than a custom node
- No version control
- Dynamo never ending version compatibility issues and custom packages problems

## Problems

- Inevitably buggy (because done in a hurry and not by Software Developers)
- Someone in each office should be in charge of creation and deployment
- Set up personalised toolbars
- What started as a simple tool with 2 buttons becomes a hell


