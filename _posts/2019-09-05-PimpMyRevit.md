---
layout: post
title: Pimp my Revit Project
---

## Or the advantages of project specific tools

---

![](/images/Untitled-e1338e8b-cdb6-42df-8b75-1517f34645ab.png)


## Inspiration

---

![](/images/Untitled-5793fb69-abc3-424f-8685-456741121edc.png)

Danny Bentley - BIM Structural Technician at SOM - 2017
[https://github.com/dannysbentley/Sections](https://github.com/dannysbentley/Sections)

<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="900" height="550" data-setup="{}">
<source src="/videos/dannyBentley.mp4" type='video/mp4'></video>


![](/images/Untitled-c0c247cf-8217-496b-8fb4-9ea8f216f501.png)

[https://thebuildingcoder.typepad.com/blog/2012/06/create-section-view-parallel-to-wall.html](https://thebuildingcoder.typepad.com/blog/2012/06/create-section-view-parallel-to-wall.html)

Dynamic Model Update Section - Revit Samples 2012
<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="900" height="550" data-setup="{}">
<source src="/videos/Dynamic Model Updater.mp4" type='video/mp4'></video>

[https://thebuildingcoder.typepad.com/blog/2011/08/associative-section-view-fix.html#2](https://thebuildingcoder.typepad.com/blog/2011/08/associative-section-view-fix.html#2)

Solutions have been out there for a while now, the skillsets to grab them are spreading now and visual programming like Dynamo and Grasshopper have definitely contributed to.

## The good, the bad and the ugly

---

![](/images/Untitled-d66215c6-7bbf-4d45-83eb-7dd61fe6df1b.png)

![](/images/Untitled-5911a92c-5cdc-422d-8e4a-c1389edbba38.png)


## What ~~tools~~ risks?

---

- Small programs that can be built in less than a week by a one person
- They do one very specific thing for one specific project
- They can automate repetitive tasks or make Revit smarter
- They can provide new feature or piggyback existing ones
- They are not meant to be uploaded on the Tool Register but they live on GitLab:
    - Not meant to be deployed globally
    - Can be accessed by anyone who want to reuse part of the code
    - Implements version control
    - Colleagues can update and improve the code
- They are used by a limited and small number of users:
    - Easier to train on how to use the tool
    - Immediate feedback for usability and bugs
- Let's ignore IP for simplicity


## Examples

---

## New tool

---

<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="900" height="550" data-setup="{}">
<source src="/videos/VoidByLine.mp4" type='video/mp4'></video>

1716 Rectangular + 1312 Circular = 3028 → 554mb →

<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="900" height="550" data-setup="{}">
<source src="/videos/VoidByFace.mp4" type='video/mp4'></video>

<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="900" height="550" data-setup="{}">
<source src="/videos/Add metadata.mp4" type='video/mp4'></video>

## Add function to existing one

[https://www.youtube.com/watch?v=Z7fj8q9j_oE&feature=youtu.be](https://www.youtube.com/watch?v=Z7fj8q9j_oE&feature=youtu.be)

## Could have they been created with Dynamo?

- Yes:
    - Revit Clouds
    - Revit Voids
- No:
    - Pdf Metadata
    - BCFier

When another software is involved, Dynamo is not enough.

Also:

- *Dynamo is Dead* cit. Konrad Sobon

![](/images/Untitled-05bcfb64-18ce-4858-a6ad-48192367badb.png)

- It's not as fast as a macro or C# addin
- Easier to share few lines of code than a custom node
- Dynamo never ending version compatibility issues

## Problems

- Inevitably buggy (because done in a hurry and not by Software Developers)
- No customer wants to use an unfinished product that the creators are embarrassed by
- Someone in each office in charge of creation and deployment
- Set up personalised toolbars
- What started as a simple tool with 2 buttons becomes a hell

## How can we move forward?

- Write down any ideas to improve your daily job

![](/images/Untitled-f737d50c-bf45-4466-94e1-cd77e49d4391.png)

[http://tiny.cc/9w43bz](http://tiny.cc/9w43bz)

- Stop thinking C# is too difficult
- C# can be used like Python (i.e. don't worry about OOP)
- Remember:
    - Scripting ≠ Coding
    - Engineers&Technicians ≠ Software Developers
- Get the support and supervision of a Software Developer
- These are proof of concept (mvp) that software developer ultimately should classify as safe to be used or threat

![](/images/Untitled-36f2b198-2e24-4282-a630-a1b03e5b4d62.jpeg)