let cache = [];

const fetchLinks = () => {
    fetch("https://woopy.alexiis.fr/websites.json").then(res => {
        res.json().then(j => {
            cache = j;
            console.log("Links as been fetched !")
        })
    }).catch(err => {
        console.log("Error : ", err);
    })
}

function checkurl(link){
    let is = false;

    for (let u of cache) {
        if (u.link == link) is = u.redirect;
    }

    return is;
}

function getURL(domain, cleared) {
    var count = cleared.length;
    var data = domain.substring(count);

    if(checkurl(cleared)) {
        return checkurl(cleared) + data;
    } else {
        return false;   
    }
}

fetchLinks();
setInterval(fetchLinks, 60*60*1000);

chrome.tabs.onUpdated.addListener(function(activeInfo) { //When tab is updated
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => { //We get the current URL
        const {tabId} = activeInfo;
        if(!tabs[0]) return;
        const {url} = tabs[0];

        if(url.startsWith("https://www.")) { //If starts by https://www.
            var domain = url.substring(12); //Remove 12 characters
            var cleared = domain.split('/')[0];

            if(checkurl(cleared)) {
                chrome.tabs.update(tabId ,{url:getURL(domain, cleared)});
            }
        } if(url.startsWith("https://")) { //Same
            var domain = url.substring(8); 
            var cleared = domain.split('/')[0];

            if(checkurl(cleared)) {
                chrome.tabs.update(tabId ,{url:getURL(domain, cleared)});
            }
        } else if(url.startsWith("http://www.")) { 
            var domain = url.substring(11); 
            var cleared = domain.split('/')[0];

            if(checkurl(cleared)) {
                chrome.tabs.update(tabId ,{url:getURL(domain, cleared)});
            }
        } else if(url.startsWith("http://")) { 
            var domain = url.substring(7); 
            var cleared = domain.split('/')[0];

            if(checkurl(cleared)) {
                chrome.tabs.update(tabId ,{url:getURL(domain, cleared)});
            }
        }  else if(url.startsWith("www.")) { 
            var domain = url.substring(4); 
            var cleared = domain.split('/')[0];

            if(checkurl(cleared)) {
                chrome.tabs.update(tabId ,{url:getURL(domain, cleared)});
            }
        } 
    });
});
