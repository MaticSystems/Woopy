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

function getinURL(url) {
	url = url.substring(url.indexOf("?q=") + 3);
  url = url.split("&oq=")[0];
  
  path_int = url.split("/")[0];
  data_int = url.substring(url.indexOf("/") + 1);
  
  rep = {path:path_int,data:data_int};
  
  return rep;
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
            chrome.tabs.create({url: 'internal/fr/update.html'});
        } else {
            chrome.tabs.create({url: 'internal/en/update.html'});
        }
        
    }
})

console.log(navigator.language)