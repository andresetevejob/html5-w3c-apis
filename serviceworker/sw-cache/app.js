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
    },
    startCaching(){
        console.log("start cache");
        return caches.open(NEXTAPP.cacheName)
                     .then((cache)=>{
                        let urlString  = "/img/paysage2022.jpeg?id=1";
                        cache.add(urlString);
                        console.log("eeee");
                        let request = new Request("/img/paysage2022.jpeg?id=2");
                        cache.add(request);
                        
                        return cache;
                     }).then((cache)=>{
                        console.log("les caches sont installés");
        })

        let urlString  = "/img/paysage2022.jpeg";
        return caches.match(urlString).then((cacheResponse)=>{
            /**
             * 
             * if(cacheResponse && cacheResponse.status <400 && cacheResponse){
            
              }
            **/
        });
    }
}
document.addEventListener("DOMContentLoaded",NEXTAPP.init());