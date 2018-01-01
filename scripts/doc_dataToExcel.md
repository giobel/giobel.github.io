---
layout: page
title: dataToExcel
---


<style>

.overlay {
  fill: none;
  pointer-events: all;
}
</style>
    
<script src="//code.jquery.com/jquery.js"></script>

<script src="//d3js.org/d3.v3.min.js"></script>

*Excel.Write.to.File* works well when we need to write the data in a single cell or from a single cell down by columns or right by rows.

<img src="/scripts/img/excelMultipleCellsLagre.png" width="900">

If we want to write our data on multiple cells not connected together we need to use list combine:

<img src="/scripts/img/ExcelMultipleCells1.png" width="900">

This works with list of data too:

<img src="/scripts/img/ExcelMultipleCells2.png" width="900">
