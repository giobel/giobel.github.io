---
layout: post
title: D3Js Panning and Zooming
---

<script src="//code.jquery.com/jquery.js"></script>

<canvas id="canvas"></canvas>

<script src="//d3js.org/d3.v3.min.js"></script>

<script>
var width = 960,
  height = 500;

var randomX = d3.random.normal(width / 2, 80),
  randomY = d3.random.normal(height / 2, 80);

var data = d3.range(2000).map(function() {
  return [
    randomX(),
    randomY()
  ];
});

var x = d3.scale.linear()
  .domain([0, width])
  .range([0, width]);

var y = d3.scale.linear()
  .domain([0, height])
  .range([height, 0]);

var canvas = d3.select("canvas")
  .attr("width", width)
  .attr("height", height)
  .call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on("zoom", zoom))
  .node().getContext("2d");

function zoom() {
  canvas.clearRect(0, 0, width, height);
  draw();
}

function draw() {
  for (var i = 0; i <= 500; i += 50) {
    canvas.drawImage(img, x(i), 100, 50, 40);
  }

}
var img = new Image();
img.src = "http://static.dnaindia.com/sites/default/files/styles/half/public/2016/04/02/444652-google-photos-emoji-google-image-search-using-emoji-coolkengzz-shutterstock.jpg?itok=b1lBccFF";
img.onload = function() {

  draw();

}

</script>


