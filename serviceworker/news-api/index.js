import './components/news-article.js';
import { topHeadlinesUrl } from './api.js';
/**window.addEventListener('load', () => {
    fetchNews();
    registerSW();
});**/
document.addEventListener("DOMContentLoaded",function(){
    fetchNews();
    registerSW();
});
async function fetchNews() {
    const res = await fetch(topHeadlinesUrl);
    const json = await res.json();

    const main = document.querySelector('main');

    json.articles.forEach(article => {
        const el = document.createElement('news-article');
        el.article = article;
        main.appendChild(el);
    });
}

function registerSW() {
    if ('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('./sw.js').then((registration)=>{
                //NEXTAPP.SW  = registration.installing || registration.waiting || registration.active;
                console.log("service worker is registred");
            })
            //verifier que le service worker est installé
            if(navigator.serviceWorker.controller){
                console.log("on a installé notre service worker");
            }
            navigator.serviceWorker.oncontrollerchange=(ev)=>{
              console.log("Le service worker est activé");
            }
        } catch (e) {
            console.log(`SW registration failed`);
        }
    }
}