result = [];
	rawExtinctData = [];
	americanCountriesWithLang = [];
	americanCountries = [];
	
	function parseExtinctData(line) {
		
		return {
			language: line["Name in English"],
			countriesWithLang: line["Countries"]
			
		};
		
	};
	
	function parseAmericanCountries(row) {
		
		result.push(row["Country"]);
		return result;
		
	};
	
	d3.csv("extinctlangs.csv", parseExtinctData, function(error, extinct){
	
		rawExtinctData = extinct;
		
	});
		
		d3.csv("AmericanCountries.csv", parseAmericanCountries, function(error, amer){
			
			americanCountries = result;
			
			
			var j = 0;
			americanCountries.forEach(function(){
				
				langArr = [];
				var k = 0;
				rawExtinctData.forEach(function() {
					
					if (rawExtinctData[k].countriesWithLang.includes(americanCountries[j])){
						
						langArr.push(rawExtinctData[k].language);
					}
					k++;
				});
				
				americanCountriesWithLang.push({key: americanCountries[j], value: langArr});
				j++;
				
			});
		
		});