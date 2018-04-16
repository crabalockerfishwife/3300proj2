// None of the following is code we wrote! The source is https://medium.com/@andybarefoot/making-a-map-using-d3-js-8aa3637304ee

// We made *slight* changes to the original file linked above

        // DEFINE VARIABLES
        // Define size of map group
        // Full world map is 2:1 ratio
        // Using 12:5 because we will crop top and bottom of map
        w = 2500;
        h = 1400;
        // variables for catching min and max zoom factors
        var minZoom;
        var maxZoom;
      var zoomState;
      var buttonGroups;

      //Tool tip code used from http://bl.ocks.org/biovisualize/1016860
       var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("top", "100px")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("")
        .attr("id", "info");

        // DEFINE FUNCTIONS/OBJECTS
        // Define map projection
        var projection = d3
          .geoEquirectangular()
          .center([-85, 15]) // set centre to further North as we are cropping more off bottom of map
          .scale([w / (1.75 * Math.PI)]) // scale to fit group width
          .translate([w /2, h / 2]) // ensure centred in group

      // None of the following is code we wrote! The source is https://medium.com/@andybarefoot/making-a-map-using-d3-js-8aa3637304ee



      // DEFINE VARIABLES
      // Define size of map group
      // Full world map is 2:1 ratio
      // Using 12:5 because we will crop top and bottom of map
      w = 3000;
      h = 1250;
      // variables for catching min and max zoom factors
      var minZoom;
      var maxZoom;

      // DEFINE FUNCTIONS/OBJECTS
      // Define map projection
      var projection = d3
        .geoEquirectangular()
        .center([0, 15]) // set centre to further North as we are cropping more off bottom of map
        .scale([w / (2 * Math.PI)]) // scale to fit group width
        .translate([w / 2, h / 2]) // ensure centred in group
      ;

      // Define map path
      var path = d3
        .geoPath()
        .projection(projection)
      ;
	  
	  function parseLatLongData(lines){
	return{
		countryName: lines["Country"],
		latitude : Number(lines["Latitude (average)"]),
		longitude: Number(lines["Longitude (average)"]),
		iso3code: lines["Alpha-3 Code"]
	};
}

	function getLine(d) {
	
		//dx = d.destination.x - d.origin.x;
		//dy = d.destination.y - d.origin.y;
		//dr = Math.sqrt(dx*dx + dy*dy);
		return 'M' + d[0].x + ',' + d[0].y + ' ' + d[1].x + ',' + d[1].y;
	
}

      // Create function to apply zoom to countriesGroup
      function zoomed() {
        t = d3
          .event
          .transform
        ;
        countriesGroup
          .attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")")
        ;

        // Define map path
        var path = d3
          .geoPath()
          .projection(projection)
        ;

        // Create function to apply zoom to countriesGroup
        function zoomed() {
          t = d3
            .event
            .transform
          ;
          countriesGroup
            .attr("transform","translate(" + [t.x, t.y] + ")scale(" + t.k + ")")
          ;
        }

        // Define map zoom behaviour
        var zoom = d3
          .zoom()
          .on("zoom", zoomed)
        ;

        function getTextBox(selection) {
          selection
            .each(function(d) {
              d.bbox = this
                .getBBox();
              })
          ;
        }

        // Function that calculates zoom/pan limits and sets zoom to default value 
        function initiateZoom() {
          // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
          minZoom = Math.max($("#map-holder").width() / w, $("#map-holder").height() / h);
          // set max zoom to a suitable factor of this value
          maxZoom = 20 * minZoom;
          // set extent of zoom to chosen values
          // set translate extent so that panning can't cause map to move out of viewport
          zoom
            .scaleExtent([minZoom, maxZoom])
            .translateExtent([[0, 0], [w, h]])
          ;
          // define X and Y offset for centre of map to be shown in centre of holder
          midX = ($("#map-holder").width() - minZoom * w) / 2;
          midY = ($("#map-holder").height() - minZoom * h) / 2;
          // change zoom transform to min zoom and centre offsets
          svg.call(zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(minZoom));
        }
    
        function zoomOut() {
          // Define a "minzoom" whereby the "Countries" is as small possible without leaving white space at top/bottom or sides
          minZoom = Math.max($("#map-holder").width() / w, $("#map-holder").height() / h);
          // set max zoom to a suitable factor of this value
          maxZoom = 20 * minZoom;
          // set extent of zoom to chosen values
          // set translate extent so that panning can't cause map to move out of viewport
          zoom
            .scaleExtent([minZoom, maxZoom])
            .translateExtent([[0, 0], [w, h]])
          ;
          // define X and Y offset for centre of map to be shown in centre of holder
          midX = ($("#map-holder").width() - minZoom * w) / 2;
          midY = ($("#map-holder").height() - minZoom * h) / 2;
          // change zoom transform to min zoom and centre offsets
          svg.transition().duration(500).call(zoom.transform, d3.zoomIdentity.translate(midX, midY).scale(minZoom));
        }

        // zoom to show a bounding box, with optional additional padding as percentage of box size
        function boxZoom(box, centroid, paddingPerc) {
          minXY = box[0];
          maxXY = box[1];
          // find size of map area defined
          zoomWidth = Math.abs(minXY[0] - maxXY[0]);
          zoomHeight = Math.abs(minXY[1] - maxXY[1]);
          // find midpoint of map area defined
          zoomMidX = centroid[0];
          zoomMidY = centroid[1];
          // increase map area to include padding
          zoomWidth = zoomWidth * (1 + paddingPerc / 100);
          zoomHeight = zoomHeight * (1 + paddingPerc / 100);
          // find scale required for area to fill svg
          maxXscale = $("svg").width() / zoomWidth;
          maxYscale = $("svg").height() / zoomHeight;
          zoomScale = Math.min(maxXscale, maxYscale);
          // handle some edge cases
          // limit to max zoom (handles tiny countries)
          zoomScale = Math.min(zoomScale, maxZoom);
          // limit to min zoom (handles large countries and countries that span the date line)
          zoomScale = Math.max(zoomScale, minZoom);
          // Find screen pixel equivalent once scaled
          offsetX = zoomScale * zoomMidX;
          offsetY = zoomScale * zoomMidY;
          // Find offset to centre, making sure no gap at left or top of holder
          dleft = Math.min(0, $("svg").width() / 2 - offsetX);
          dtop = Math.min(0, $("svg").height() / 2 - offsetY);
          // Make sure no gap at bottom or right of holder
          dleft = Math.max($("svg").width() - w * zoomScale, dleft);
          dtop = Math.max($("svg").height() - h * zoomScale, dtop);
          // set zoom
          svg
            .transition()
            .duration(500)
            .call(
              zoom.transform,
              d3.zoomIdentity.translate(dleft, dtop).scale(zoomScale)
            );
      

        }



        // on window resize
        $(window).resize(function() {
          // Resize SVG
          svg
            .attr("width", $("#map-holder").width())
            .attr("height", $("#map-holder").height())
          ;
          initiateZoom();
        });

        // create an SVG
        var svg = d3
          .select("#map-holder")
          .append("svg")
          // set to the same size as the "map-holder" div
          .attr("width", $("#map-holder").width())
          .attr("height", $("#map-holder").height())
          // add zoom functionality
          .call(zoom)
        ;

        // get map data
        d3.json(
          "data.geo.json",
          function(json) {
            //Bind data and create one path per GeoJSON feature
            countriesGroup = svg.append("g").attr("id", "map");
            // add a background rectangle
            countriesGroup
              .append("rect")
              .attr("x", 0)
              .attr("y", 0)
              .attr("width", w)
              .attr("height", h);

            // draw a path for each feature/country
            countries = countriesGroup
              .selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
              .attr("id", function(d, i) {
                return "country" + d.properties.iso_a3;
              })
              .attr("class", "country")
              .attr("stroke-width", 10)
              .attr("stroke", "#ff0000")
              // add a mouseover action to show name label for feature/country
              .on("mouseover", function(d, i) {
                  d3.select("#countryLabel" + d.properties.iso_a3).style("display", "inline-block");
                  tooltip.style("visibility", "visible");

                  function getLanaguages(){
                      var i;
                      for (i = 0; i < americanCountriesWithLang.length; i++) {
                          if (americanCountriesWithLang[i].key == d.properties.name) {
                            var j;
                            var output = "";
                            for (j = 0; j < americanCountriesWithLang[i].value.length; j++) {
                              if (j < 30){ // Set the max number of extinct langauges that can be displayed to 30
                                output += "&nbsp&nbsp"+americanCountriesWithLang[i].value[j]+"<br>";
                              }
                            }
                            return output;
                          }
                      }
                  }

                  var languages = getLanaguages();

                  document.getElementById("info").innerHTML = 
                    d.properties.name+" ("+d.properties.iso_a3+")"+"<br>&nbspList of extinct langauges: <br>"+languages;
              })
              .on("mouseout", function(d, i) {
                  d3.select("#countryLabel" + d.properties.iso_a3).style("display", "none");
                  tooltip.style("visibility", "hidden");
              })
              // add an onclick action to zoom into clicked country
              .on("click", function(d, i) {
                  d3.selectAll(".country").classed("country-on", false);
                  d3.select(this).classed("country-on", true);
                  boxZoom(path.bounds(d), path.centroid(d), 20);
            });

            // Add a label group to each feature/country. This will contain the country name and a background rectangle
            // Use CSS to have class "countryLabel" initially hidden
            countryLabels = countriesGroup
              .selectAll("g")
              .data(json.features)
              .enter()
              .append("g")
              .attr("class", "countryLabel")
              .attr("id", function(d) {
                return "countryLabel" + d.properties.iso_a3;
              })
              .attr("transform", function(d) {
                return (
                  "translate(" + path.centroid(d)[0] + "," + path.centroid(d)[1] + ")"
                );
              })
              // add mouseover functionality to the label
              .on("mouseover", function(d, i) {
                  d3.select(this).style("display", "block");
              })
              .on("mouseout", function(d, i) {
                   d3.select(this).style("display", "none");
             })
              // add an onlcick action to zoom into clicked country
              .on("click", function(d, i) {
                  d3.selectAll(".country").classed("country-on", false);
                  d3.select("#country" + d.properties.iso_a3).classed("country-on", true);
                boxZoom(path.bounds(d), path.centroid(d), 20);
        
        
      
              });
            // add the text to the label group showing country name
            countryLabels
              .append("text")
              .attr("class", "countryName")
              .style("text-anchor", "middle")
              .attr("dx", 0)
              .attr("dy", 0)
              .text(function(d) {
                return d.properties.name;
              })
              .call(getTextBox);
            // add a background rectangle the same size as the text
            countryLabels
              .insert("rect", "text")
              .attr("class", "countryLabelBg")
              .attr("transform", function(d) {
                return "translate(" + (d.bbox.x - 2) + "," + d.bbox.y + ")";
              })
              .attr("width", function(d) {
                return d.bbox.width + 4;
              })
              .attr("height", function(d) {
                return d.bbox.height;
              }); 
            initiateZoom();
      
      
      
        //BUTTON CODE
        //following code taken from: http://www.nikhil-nathwani.com/blog/posts/radio/radio.html

        var allButtons= svg.append("g")
                            .attr("id","allButtons") 

        //fontawesome button labels
      //var mag = d3.select("#mag").attr("x", $("#map-holder").width()*.88).attr("y",$("#map-holder").height()*.95);
        var labels= ['zoom out'];

        //groups for each button (which will hold a rect and text)
            buttonGroups = allButtons.selectAll("g.button")
                              .data(labels)
                              .enter()
                  .append("g")
                      .attr("class","button")
                  .style("cursor","pointer")           
                              .on("click",function(d,i) {
                                  zoomOut();
                              });
    
        //button width and height
        var bWidth= 75; //button width
        var bHeight= 20; //button height
        var bSpace= 10; //space between buttons
        var x0= $("#map-holder").width()*.88; //x offset
        var y0= $("#map-holder").height()*.90; //y offset

        //adding a rect to each button group
        //sidenote: rx and ry give the rects rounded corners
        buttonGroups.append("rect")
                    .attr("class","buttonRect")
                    .attr("width",bWidth)
                    .attr("height",bHeight)
                    .attr("x",function(d,i) {
                        return x0+(bWidth+bSpace)*i;
                    })
                    .attr("y",y0)
                    .attr("rx",5) 
                    .attr("ry",5)
                    .attr("fill","#6A3937");

        //adding text to each button group, centered within the button rect
        buttonGroups.append("text")
                    .attr("class","buttonText")
                    .attr("font-family","Font Awesome")
                    .attr("x",function(d,i) {
                        return x0 + (bWidth+bSpace)*i + bWidth/2;
                    })
                    .attr("y",y0+bHeight/2)
                    .attr("text-anchor","middle")
                    .attr("dominant-baseline","central")
                    .attr("fill","#360C10")
                    .text(function(d) {return d;});
      
      
              var defaultColor= "#BBC5AA";
              var hoverColor= "#0000ff";
              var pressedColor= "#000077";
          
                        
              function updateButtonColors(button, parent) {
                  parent.selectAll("rect")
                          .attr("fill",defaultColor)

                  button.select("rect")
                          .attr("fill",pressedColor)
              }
          

      
          }
        );

  
        initiateZoom();
      });

      // create an SVG
      var svg = d3
        .select("#map-holder")
        .append("svg")
        // set to the same size as the "map-holder" div
        .attr("width", $("#map-holder").width())
        .attr("height", $("#map-holder").height())
        // add zoom functionality
        .call(zoom)
      ;

	d3.csv("Country_Latitude_Longitude.csv", parseLatLongData, function(error, data){
		latLongData = data;
		
     
  
      // get map data
      d3.json(
        "data.geo.json",
        function(json) {
          //Bind data and create one path per GeoJSON feature
          countriesGroup = svg.append("g").attr("id", "map");
          // add a background rectangle
          countriesGroup
            .append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", w)
            .attr("height", h);

          // draw a path for each feature/country
          countries = countriesGroup
            .selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("id", function(d, i) {
              return "country" + d.properties.iso_a3;
            })
            .attr("class", "country")
            .attr("stroke-width", 10)
            .attr("stroke", "#ff0000")
            // add a mouseover action to show name label for feature/country
            .on("mouseover", function(d, i) {
                d3.select("#countryLabel" + d.properties.iso_a3).style("display", "inline-block");

                // I wrote this
                //svg.append("rect").attr("class", "information").attr("x", "400").attr("y", "400");

                // End of wrote this block
            })
            .on("mouseout", function(d, i) {
                d3.select("#countryLabel" + d.properties.iso_a3).style("display", "none");

                d3.select(".information").style("display", "none");
            })
            // add an onclick action to zoom into clicked country
            .on("click", function(d, i) {
				
				if (d.properties.name != "United Kingdom" && d.properties.name != "France" && d.properties.name != "Spain" && d.properties.name != "Portugal"
				&& d.text != "United Kingdom" && d.text != "France" && d.text != "Spain" && d.text != "Portugal") {
                	d3.selectAll(".country").classed("country-on", false);
                	d3.select(this).classed("country-on", true);
                	boxZoom(path.bounds(d), path.centroid(d), 20);
				}
				
				else {
                //d3.select("#country" + d.properties.iso_a3).append()
					var origin = [latLongData[71].longitude, latLongData[71].latitude];
					var destination = [latLongData[8].longitude, latLongData[8].latitude];
					var connections = [projection(origin), projection(destination)];
					
					var line = svg.append("path").attr('d', 
						 'M' + connections[0][0] + ',' + connections[0][1] + ' ' + connections[1][0] + ',' + connections[1][1]
					 )
					.style('stroke', 'black')
					.style('stroke-width', 2)
					.style('fill', 'black'); 
					
					
					
				
		  }
            });
          // Add a label group to each feature/country. This will contain the country name and a background rectangle
          // Use CSS to have class "countryLabel" initially hidden
          countryLabels = countriesGroup
            .selectAll("g")
            .data(json.features)
            .enter()
            .append("g")
            .attr("class", "countryLabel")
            .attr("id", function(d) {
              return "countryLabel" + d.properties.iso_a3;
            })
            .attr("transform", function(d) {
              return (
                "translate(" + path.centroid(d)[0] + "," + path.centroid(d)[1] + ")"
              );
            })
            // add mouseover functionality to the label
            .on("mouseover", function(d, i) {
                d3.select(this).style("display", "block");
            })
            .on("mouseout", function(d, i) {
                 d3.select(this).style("display", "none");
           })
            // add an onlcick action to zoom into clicked country
            .on("click", function(d, i) {
				if (d.properties.iso_a3 != "GBR" && d.properties.iso_a3 != "FRA" && d.properties.iso_a3 != "ESP" && d.properties.iso_a3 != "PRT"
				&& d.text != "United Kingdom" && d.text != "France" && d.text != "Spain" && d.text != "Portugal") {
                	d3.selectAll(".country").classed("country-on", false);
                	d3.select(this).classed("country-on", true);
                	boxZoom(path.bounds(d), path.centroid(d), 20);
				}
				
				else {
                //d3.select("#country" + d.properties.iso_a3).append()
					
				d3.csv("Country_Latitude_Longitude.csv", parseLatLongData, function(error, data){

                function getClickPositionX(e) {
                    return e.clientX;
                }

                function getClickY(e) {
                    return e.clientY;
                }

                var tempx = getClickPositionX(this);
                var tempy = getClickY(this);

                svg.append("line")
                  .attr("x1", tempx)
                  .attr("y1", tempy)
                  .attr("x2", 400)
                  .attr("y2", 400)
                  .style("stroke-width", 10)
                  .style("stroke", "black");
			  });
		  }
            });
          // add the text to the label group showing country name
          countryLabels
            .append("text")
            .attr("class", "countryName")
            .style("text-anchor", "middle")
            .attr("dx", 0)
            .attr("dy", 0)
            .text(function(d) {
              return d.properties.name;
            })
            .call(getTextBox);
          // add a background rectangle the same size as the text
          countryLabels
            .insert("rect", "text")
            .attr("class", "countryLabelBg")
            .attr("transform", function(d) {
              return "translate(" + (d.bbox.x - 2) + "," + d.bbox.y + ")";
            })
            .attr("width", function(d) {
              return d.bbox.width + 4;
            })
            .attr("height", function(d) {
              return d.bbox.height;
            });
          initiateZoom();
        }
      );
  });
  
 
	  
	  
