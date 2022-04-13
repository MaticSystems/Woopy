let cache = [];

const fetchLinks = () => {
    fetch("https://woopy.alexiis.fr/websites.json").then(res => {
        res.json().then(j => {
            cache = j;
            console.log("Links have been fetched and set to cache.");
        })
    }).catch(err => {
        console.error("An error occured:", err);
    })
}

function checkurl(url){
    let is = false;

    for (let u of cache) {
        if (u.link == url) is = u.redirect;
    }

    return is;
}


function getURL(domain, cleared) {
    var count = cleared.length;
    var data = domain.substring(count);

    if(domain.startsWith("d.s")){
        if(data == "/woopy") {
            return "https://discord.gg/bD5uzpBCCt";
        }
    }

    if(checkurl(cleared)) {
        return checkurl(cleared) + data;
    }
    return false;
}

fetchLinks();
setInterval(fetchLinks, 60*60*1000);

chrome.tabs.onUpdated.addListener(function(activeInfo) { //When tab is updated
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => { //We get the current URL
        const {tabId} = activeInfo;
        if(!tabs[0]) return;
        const {url} = tabs[0];

        let domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
        let path = domain.split("/")[0];chrome.tabs.update(tabId, {url: getURL(domain, path)});
    });
});
