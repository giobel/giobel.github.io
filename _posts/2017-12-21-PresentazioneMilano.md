---
layout: post
title: Presentazione Milano 21/12
---
<script src="video.js"></script>

# Sommario
---

- ### Interfaccia con Revit
- ### Revit per l’ingegneria strutturale
- ### Armature in Revit

# Interfaccia con Revit

- Importazione da DWG
- Importazione da IFC
- Plugin dedicati
- Utilizzo di script/visual programming

# Creazione del modello da zero

<img src="/images/gsaDynaRevit.png" width="900">

<img src="/images/shapeFileDynamo.png" width="900">

## Modifiche

- Difficile traslare elementi in Revit
- Gli elementi vengono cancellati e ricreati con una nuova ID
- Si perdono tag e annotazioni associate

---

## 1. Importazione da DWG (elementi solidi)
<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="900" height="550" data-setup="{}">
<source src="/videos/1-Dwg to Revit.mp4" type='video/mp4'></video>

## 2. Importazione da DWG (wireframe)
<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="900" height="550" data-setup="{}">
<source src="/videos/2-Gsa To Revit.mp4" type='video/mp4'></video>

## 3. Importazione da IFC
<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="900" height="550" data-setup="{}">
<source src="/videos/3-IFC.mp4" type='video/mp4'></video>

## 4. GSA plugin
<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="900" height="550" data-setup="{}">
<source src="/videos/4-gsa Addin.mp4" type='video/mp4'></video>

<img src="/images/konstruMapping1.png" width="900">

<img src="/images/konstruMapping.png" width="900">


**PROS**
- Metodo piu’ rapido per creare modelli in Revit

**CONS**
- Precisione
- Rischio di dover ricreare il modello da zero ad ogni cambio di geometrie (perdendo note e tag)

## 5. Dynamo
<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="900" height="550" data-setup="{}">
<source src="/videos/5-Dynamo.mp4" type='video/mp4'></video>

**PROS**
- Metodo piu’ rapido per creare modelli in Revit
- Modello parametrico
- Script riutilizzabile
- Crea direttamente elementi nativi Revit

**CONS**
- Spesso solo l’autore ha pieno controllo di quanto accade e dell’output prodotto
- Un singolo script potrebbe risultare troppo complesso
- Lo script necessita comunque di aggiustamenti se utilizzato per un altro progetto
- Possibilita’ di esportare verso programmi ad elementi finiti

<img src="/images/dynamoScripts.PNG" width="900">

# Revit per l’Ingegneria Strutturale

<img src="/images/busRoofRevit.png" width="900">

<img src="/images/busRoofRevit2.png" width="900">

<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="900" height="720" data-setup="{}">
<source src="/videos/revit structural modelling.mp4" type='video/mp4'></video>

## Tools di modellazione in Revit

<img src="/images/distilleryRoof.PNG" width="900">

<video id="pelican-installation" class="video-js vjs-default-skin" controls preload="auto" width="900" height="720" data-setup="{}">
<source src="/videos/Revit mass Example.mp4" type='video/mp4'></video>

**PROS**
- Ripetibilita’ e modularita’
- Vasta libreria di elementi

**CONS**
- Estendere/proiettare linee di costruzione
- Intersecare piani e superfici
- Creare elementi per coordinate XYZ
- Difficile creare componenti su misura

# Armature in Revit

<img src="/images/armature.PNG" width="900">

<img src="/images/armature1.PNG" width="900">

<img src="/images/armature2.PNG" width="900">

