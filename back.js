let woopy_cache = [];

const fetchLinks = () => {
    fetch("https://woopy.alexiis.fr/websites.json").then(res => {
        res.json().then(j => {
            woopy_cache = j;
            console.log("Links have been fetched and set to cache.");
        })
    }).catch(err => {
        console.error("An error occured:", err);
    })
}

function checkurl(url){
    let is_in_cache = false;

    for (let u of woopy_cache) {
        if (u.link == url) is_in_cache = u.redirect;
    }

    return is_in_cache;
}


function getURL(domain, cleared) {
    var count = cleared.length;
    var data = domain.substring(count);

    /** Custom support for adfoc.us */
    if (domain.startsWith("adfoc.us")) {
        if (data !== "/") {
            function redirect () {
                var el = document.querySelectorAll("script")[3];
                var arr = el.innerHTML.replaceAll("\n            ", "").split("var ").slice(1);
                var url = arr[3].split("= ")[1].replaceAll("\"", "").replace(";", "");

                window.location.replace(url);
                return true;
            }

            chrome.tabs.query({
                currentWindow: true,
                active: true
            }, (tabs) => {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: redirect,
                }, (data) => {
                    var { result } = data[0];
                    if (!result) {
                        console.error("An error occured when trying to find the non-advertised URL.");
                    }
                });
            });

            return false;
        }
    }
    
    if(domain.startsWith("d.s")){
        if(data == "/woopy") {
            return "https://discord.gg/QzSQgsn";
        }
    }

    if(checkurl(cleared)) {
        return checkurl(cleared) + data;
    }
    return false;
}

function getinURL(url) {
    return {path:url.substring(url.indexOf("?q=") + 3).split("&")[0].split("/")[0],data:url.substring(url.indexOf("?q=") + 3).split("&")[0]}.substring(url.indexOf("/") + 1);
}

fetchLinks();
setInterval(fetchLinks, 60*60*1000);

chrome.tabs.onUpdated.addListener(function(activeInfo) { //When tab is updated
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => { //We get the current URL
        const {tabId} = activeInfo;
        if(!tabs[0]) return;
        const {url} = tabs[0];

        let domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
        let path = domain.split("/")[0];
        
        if(getURL(domain, path)) {
            chrome.tabs.update(tabId, {url: getURL(domain, path)});
        }else{
            console.log(getinURL(url));
            chrome.tabs.update(tabId, {url: getURL(getinURL(url).path, getinURL(url).data)});
        }
        
    });
});

chrome.runtime.onInstalled.addListener(function(installation) {
    if(installation.reason === "install"){
        if(navigator.language === "fr-FR") {
            chrome.tabs.create({url: 'internal/fr/install.html'});
        } else {
            chrome.tabs.create({url: 'internal/en/install.html'});
        }
    } else if(installation.reason === "update"){
        if(navigator.language === "fr-FR") {
            //chrome.tabs.create({url: 'internal/fr/update.html'});
        } else {
            chrome.tabs.create({url: 'internal/en/update.html'});
        }
        
    }
})

