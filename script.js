function extractMovieData() {
	var alternateNameSpan = $("span[itemprop=alternateName]");
	var nameSpan = $("span[itemprop=name]");
	var yearLabel = $("label:contains('Yapımı')");

	var alternateName = alternateNameSpan? alternateNameSpan.html() : "";
	var name = nameSpan? nameSpan.html() : "";
	var year = yearLabel ? yearLabel.next().children(":first-child").html() : "";

	return {alternateName: alternateName, name: name, year: year}
};

function fetchImdbLink(movieData, byName) {
	var url = byName ? encodeURIComponent(movieData.name)
					 : encodeURIComponent(movieData.alternateName);

	return $.get("http://www.omdbapi.com/?t=" +  url + "&y="+ movieData.year);
}

var movieFound = false;

function appendLink(imdbMovieInformation) {
	if ("False" === imdbMovieInformation.Response) {
		return;
	}

	var img = $('<img/>', {
		id: 'imdb_logo_' + imdbMovieInformation.imdbID,
		src: chrome.extension.getURL("imdb.png"),
		border: 0, 
		height: 33,
		width: 150
	});

	var link = $('<a/>', {
		id: 'imdb_link_' + imdbMovieInformation.imdbID,
		href: 'http://www.imdb.com/title/' + imdbMovieInformation.imdbID,
		target: "_blank"
	});

	link.append(img);

	var div = $('<div/>', {
		style: "margin: 5px auto"
	});

	div.append(link);

	$("div.film-detail div.grid2 div.relative").append(div);
}

var movieData = extractMovieData();

fetchImdbLink(movieData)
	.then(appendLink)
	.then(tryWithFirstName(movieData));

function tryWithFirstName(movieData) {
	return function() {
		if (movieFound) {
			return;
		}
		fetchImdbLink(movieData, true)
			.done(appendLink);
	}
}
