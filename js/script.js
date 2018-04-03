/********************************************
    Author: Richie Flores
    Date: 30 March 2018
    Name: script.js
    Project: Simpla app to display articles
            and news related to city.
********************************************/

function loadData() {

    // grab all values from html
    const $body = $('body');
    const $wikiElem = $('#wikipedia-links');
    const $nytHeaderElem = $('#nytimes-header');
    const $nytElem = $('#nytimes-articles');
    const $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // grab all values including Google Street View API
    const userStreet = $('#street').val();
    const userCity = $('#city').val();
    const userAddress = userStreet + ',' + userCity;
    const url = 'https://maps.googleapis.com/maps/api/streetview?size=600x300&location=' +
        userAddress + '&key=AIzaSyDO1v3HG02cbMVp7Xs-_KiZHRSt3sNw4BY';


    // NYT Ajax request
    const nytURL = 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=' + 
    userCity + '&sort=newest&api-key=a3fce5abfa034957aaa27116e00e4ea1';

    $.getJSON(nytURL, data => {
        $nytHeaderElem.text('New York Times Articles About ' + userCity);
        const articles = data.response.docs;
        for(const article of articles) {
            $nytElem.append('<li class="article"> '+
            '<a href="' + article.web_url + '">' + article.headline.main + '</a>'+
            '<p>' + article.snippet + '</p>'+'</li>');
        };
    // Error handlikng
    }).done(result => {
        console.log('\nNYT_SUCCESS', result)
    }).fail(err => {
        $nytHeaderElem.text('New York Times Articles Could Not Be Loaded')
    });

    // handle the WIKI api request w/ JSONP
    const wikiURL = 'https://en.wikipedia.org/w/api.php?action=opensearch&search='+
    userCity + '&format=json&callback=wikiCallback';

    // Wiki error handling
    const wikiRequestTimeout = setTimeout(_ => {
        $wikiElem.text('Failed to get wikipedia resources');
    }, 8000);

    $.ajax(wikiURL,{
        dataType: 'jsonp',
        success: data => {
            const articles = data[1];
            for(const article of articles) {
                const artURL = 'https://en.wikipedia.org/wiki/' + article;
                $wikiElem.append('<li><a href="' + artURL + '">' +
                article + '</a></li>');
            };
            clearTimeout(wikiRequestTimeout);
        }
    }).done(res => console.log('WIKI_SUCCESS',res));

    // load and appedn streetview
    $body.append("<img class='bgimg' src='" + url +"'>");
    return false;
};

$('#form-container').submit(loadData);