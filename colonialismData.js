//parsing data for colonial relationships
function parseColonialData(lines){
	return{
		countryNum: Number(lines["State"]),
		country : lines["Name"],
		countryRuler: Number(lines["ColRuler"])
	};
}
//parsing data of the countries in the Americas
result = [];
function parseAm(row){
	return result.push(row["Country"]);
}

//parsing data of the long and lat of the americas countries 
function parseLocation(lines){
	//TO DO: 
}

d3.csv("coldata100.csv", parseColonialData, function(error, data){
		colData = data;
		rulerWorld = {UK: [], France: [], Portugal: [], Spain: []};
		var i = 0;
		//creates a dictionary with the 4 ruling countries and their "children" all over the world
		colData.forEach(function(){
			//if ruler is UK
			if(colData[i].countryRuler == 200){
				rulerWorld.UK.push(colData[i].country)
			}
			//if ruler is France
			if(colData[i].countryRuler == 220){
				rulerWorld.France.push(colData[i].country)
			}
			//if ruler is Portugal
			if(colData[i].countryRuler == 235){
				rulerWorld.Portugal.push(colData[i].country)
			}
			//if ruler is Spain
			if(colData[i].countryRuler == 230){
				rulerWorld.Spain.push(colData[i].country)
			}

			i++;
		});


		//Now, want to create array of the americas countries
		d3.csv("AmericanCountries.csv", parseAm, function(error, data){
			amArr = result;

			amArr[35] = "United States of America";
		//Now, create new array of ruling countries' children of only americas
			rulerAmericas = {UK: [], France: [], Portugal: [], Spain: []};
			var i = 0;
			//UK
			rulerWorld.UK.forEach(function(){
				var j = 0;
				//if ruler is UK
				amArr.forEach(function(){
					if(amArr[j] == rulerWorld.UK[i]){
					rulerAmericas.UK.push(rulerWorld.UK[i]);
					}
				j++;
				});
			i++;
			});
			//France
			var i = 0;
			rulerWorld.France.forEach(function(){
				var j = 0;
				amArr.forEach(function(){
					if(amArr[j] == rulerWorld.France[i]){
					rulerAmericas.France.push(rulerWorld.France[i]);
					}
				j++;
				});
			i++;
			});
			//Portugal
			var i = 0;
			rulerWorld.Portugal.forEach(function(){
				var j = 0;
				//if ruler is UK
				amArr.forEach(function(){
					if(amArr[j] == rulerWorld.Portugal[i]){
					rulerAmericas.Portugal.push(rulerWorld.Portugal[i]);
					}
				j++;
				});
			i++;
			});
			//Spain
			var i = 0;
			rulerWorld.Spain.forEach(function(){
				var j = 0;
				//if ruler is UK
				amArr.forEach(function(){
					if(amArr[j] == rulerWorld.Spain[i]){
					rulerAmericas.Spain.push(rulerWorld.Spain[i]);
					}
				j++;
				});
			i++;
			});
		
		//Now, want to use long and lat data to create points onto which we will map the the lines




		});
});