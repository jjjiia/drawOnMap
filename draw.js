var width = Math.max(960, window.innerWidth),
    height = Math.max(500, window.innerHeight)
    //prefix = prefixMatch(["webkit", "ms", "Moz", "O"]);
    
    
var drawing = d3.select("#draw").append("svg")
    .style("width", width + "px")
    .style("height", height + "px").attr("fill","none")
    
  

drawing.append("rect").style("width", 500).attr("fill","red")
    .style("height", 500)
    .on("click", function(){
        console.log("click")
        drawDots()
    });



function drawDots(){
    var mouse = [0,0]        
    var mouse = d3.mouse(this)
    console.log(mouse[0])
   drawing.selectAll("circle").append("circle")
        .attr("cx",mouse[0])
        .attr("cy",mouse[1])
        .attr("r",3)
        .style("fill","#000000")
        .style("opacity",.3)   
    }