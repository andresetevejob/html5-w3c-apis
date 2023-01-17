const NEXTAPP = {
    SW: null,
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
    }
}
document.addEventListener("DOMContentLoaded",NEXTAPP.init());