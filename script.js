function extractMovieData() {
	var alternateNameSpan = $("span[itemprop=alternateName]");
	var nameSpan = $("span[itemprop=name]");
	var yearLabel = $("label:contains('Yapımı')");

	var alternateName = alternateNameSpan? alternateNameSpan.html() : "";
	var name = nameSpan? nameSpan.html() : "";
	var year = yearLabel ? yearLabel.next().children(":first-child").html() : "";

	return {alternateName: alternateName, name: name, year: year}
};

function fetchImdbInfo(movieName, movieYear) {
	var nameEncoded = encodeURIComponent(movieName);

	return $.get("http://www.omdbapi.com/?t=" +  nameEncoded + "&y="+ movieYear);
}

function getImdbSearchLink(movieName, movieYear) {
	var nameEncoded = encodeURIComponent(movieName);
	return "http://www.imdb.com/search/title?release_date=" + 
				movieYear +"," + movieYear + "&title=" + nameEncoded
}

function appendLink(url) {
	return $("div.film-detail div.grid2 div.relative")
		.append($('<div/>', {
			style: "margin: 5px auto"
		})
		.append($('<a/>', {
			href: url,
			target: "_blank"
		})
		.append($('<img/>', {
			src: chrome.extension.getURL("imdb.png"),
			border: 0, 
			height: 33,
			width: 150
		}))));
}

var movieData = extractMovieData();

fetchImdbInfo(movieData.alternateName, movieData.year)
	.then(function(res){
		if ("False" === res.Response) {
			fetchImdbInfo(movieData.name, movieData.year)
				.then(function(res){
					if ("False" === res.Response) {
						var url = getImdbSearchLink(movieData.alternateName, movieData.year);
						appendLink(url);
						return;
					}
					appendLink('http://www.imdb.com/title/' + res.imdbID);
			});
				return;
		}
		appendLink('http://www.imdb.com/title/' + res.imdbID);
	});
