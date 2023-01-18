const NEXTAPP = {
    SW: null,
    cacheName:"cache-assets-v1",
    init(){
        if('serviceWorker' in navigator){
            //Enregistrement service worker
            navigator.serviceWorker.register("./sw.js",{
                scope:'/'
            }).then(registration=>{
                NEXTAPP.SW  = registration.installing || registration.waiting || registration.active;
                console.log("service worker is registred");
            })
            //verifier que le service worker est installé
            if(navigator.serviceWorker.controller){
                console.log("on a installé notre service worker");
            }
            navigator.serviceWorker.oncontrollerchange=(ev)=>{
              console.log("Le service worker est activé");
            }
        }else{
            console.log("Le service worker n'est supporté comme api");
        }
        NEXTAPP.startCaching();
        document.querySelector('header>h2').addEventListener('click',NEXTAPP.deleteCache);
    },
    startCaching(){
        //console.log("start cache");
        caches.open(NEXTAPP.cacheName)
                     .then((cache)=>{
                        let urlString  = "/img/paysage2022.jpeg?id=1";
                        cache.add(urlString);
                        //console.log("eeee");
                        let request = new Request("/img/paysage2022.jpeg?id=2");
                        cache.add(request);
                        
                        return cache;
                     }).then((cache)=>{
                        //console.log("les caches sont installés");
        });

        let urlString  = "/img/paysage2022.jpeg?id=4";
        return caches.match(urlString).then((cacheResponse)=>{
           console.log(cacheResponse);
           if(cacheResponse &&
            cacheResponse.status<400 &&
            cacheResponse.headers.has('content-type') &&
            cacheResponse.headers.get('content-type').match(/^image\//i)){
                console.log("found in cache");
                return cacheResponse;
            }else{
                console.log("element not in cache");
                return fetch(urlString).then((fetchResponse)=>{
                    if(!fetchResponse.ok) throw fetchResponse.statusText;
                    caches.open(NEXTAPP.cacheName)
                     .then((cache)=>{
                        cache.put(urlString,fetchResponse.clone())
                        
                     })
                     return fetchResponse;
                })
            }
        }).then((response)=>{
            console.log(response);
            document.querySelector("outputUrl").textContent = response.url;
            return response.blob();
        }).then((blob)=>{
            let url = URL.createObjectURL(blob);
            let img = document.createElement("img");
            img.src = url;
            document.querySelector("outputImg").append(img);
        });
    },
    deleteCache(){
        caches.delete(NEXTAPP.cacheName).then((isDone)=>{
            console.log(isDone);
        })
    }
}
document.addEventListener("DOMContentLoaded",NEXTAPP.init());