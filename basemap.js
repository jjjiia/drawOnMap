var width = Math.max(960, window.innerWidth),
    height = Math.max(500, window.innerHeight),
    prefix = prefixMatch(["webkit", "ms", "Moz", "O"]);

var tile = d3.geo.tile()
    .size([width, height]);

var projection = d3.geo.mercator()
    .scale((1 << 23) / 2 / Math.PI)
    .translate([-width / 2, -height / 2]); // just temporary

var tileProjection = d3.geo.mercator();

var tilePath = d3.geo.path()
    .projection(tileProjection);

var zoom = d3.behavior.zoom()
    .scale(projection.scale() * 2 * Math.PI)
    .scaleExtent([1 << 22, 1 << 23])
    .translate(projection([-74.0064, 40.7142]).map(function(x) { return -x; }))
    .on("zoom", zoomed);

var map = d3.select("#basemap")
    .attr("class", "map")
    .style("width", width + "px")
    .style("height", height + "px")
    .call(zoom)
    .on("mousemove", mousemoved)

var layer = map.append("div")
    .attr("class", "layer");

var info = map.append("div")
    .attr("class", "info");



zoomed();

function zoomed() {
  var tiles = tile
      .scale(zoom.scale())
      .translate(zoom.translate())
      ();

  projection
      .scale(zoom.scale() / 2 / Math.PI)
      .translate(zoom.translate());

  var image = layer
      .style(prefix + "transform", matrix3d(tiles.scale, tiles.translate))
    .selectAll(".tile")
      .data(tiles, function(d) { return d; });

  image.exit()
      .each(function(d) { this._xhr.abort(); })
      .remove();

  image.enter().append("svg")
      .attr("class", "tile")
      .style("left", function(d) { return d[0] * 256 + "px"; })
      .style("top", function(d) { return d[1] * 256 + "px"; })
      .each(function(d) {
        var svg = d3.select(this);
        this._xhr = d3.json("http://" + ["a", "b", "c"][(d[0] * 31 + d[1]) % 3] + ".tile.openstreetmap.us/vectiles-highroad/" + d[2] + "/" + d[0] + "/" + d[1] + ".json", function(error, json) {
          var k = Math.pow(2, d[2]) * 256; // size of the world in pixels

          tilePath.projection()
              .translate([k / 2 - d[0] * 256, k / 2 - d[1] * 256]) // [0°,0°] in pixels
              .scale(k / 2 / Math.PI);

          svg.selectAll("path")
              .data(json.features.sort(function(a, b) { return a.properties.sort_key - b.properties.sort_key; }))
            .enter().append("path")
              .attr("class", function(d) { return d.properties.kind; })
              .attr("d", tilePath);
        });
      });
}


function mousemoved() {
  info.text(formatLocation(projection.invert(d3.mouse(this)), zoom.scale()));  
}

function matrix3d(scale, translate) {
  var k = scale / 256, r = scale % 1 ? Number : Math.round;
  return "matrix3d(" + [k, 0, 0, 0, 0, k, 0, 0, 0, 0, k, 0, r(translate[0] * scale), r(translate[1] * scale), 0, 1 ] + ")";
}

function prefixMatch(p) {
  var i = -1, n = p.length, s = document.body.style;
  while (++i < n) if (p[i] + "Transform" in s) return "-" + p[i].toLowerCase() + "-";
  return "";
}

function formatLocation(p, k) {
  var format = d3.format("." + Math.floor(Math.log(k) / 2 - 2) + "f");
  return (p[1] < 0 ? format(-p[1]) + "°S" : format(p[1]) + "°N") + " "
       + (p[0] < 0 ? format(-p[0]) + "°W" : format(p[0]) + "°E");
}


var isDown = false;
var xs = [0]
var ys = [0]
var frame = 0
var speed = 0
var rScale = d3.scale.linear().domain([0,100]).range([3,20])
var drawing =d3.select("#toplayer").append("svg").attr("width",width).attr("height",height).attr("x",0).attr("y",0)
drawing.on('mousedown',function(){
        isDown = true
        var originX = d3.mouse(this)[0]
        var originY = d3.mouse(this)[1]
        xs.push(d3.mouse(this)[0])
        ys.push(d3.mouse(this)[1])
        frame +=1
        
      //  console.log(d3.event.pageX)
      //  console.log(d3.mouse(this))
        //d3.select("#toplayer svg").append("circle").attr("r",5).attr("cx",x).attr("cy",y).attr("fill","red").attr("opacity",.7)
    })
    .on("mousemove",function(){
        info.text(formatLocation(projection.invert(d3.mouse(this)), zoom.scale()));
       if (isDown == true){
        var x = d3.mouse(this)[0]
        var y = d3.mouse(this)[1]
        xs.push(x)
        ys.push(y)
        frame +=1
        var changeX = xs[frame]-xs[frame-1]
        var changeY = ys[frame]-ys[frame-1]
        var speed = Math.sqrt(changeX*changeX+changeY*changeY)
        r = rScale(speed) 
        draw(x,y,r)
        }
        
    })
    .on("mouseup", function(){
            isDown = false;
        }); 

function draw(x,y,r){
    d3.select("#toplayer svg").append("circle").attr("r",r).attr("cx",x).attr("cy",y).attr("fill","red").attr("opacity",.2)
}