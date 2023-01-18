console.log("service worker a demarré");
console.log(self);//
self.addEventListener("install",(ev)=>{
    console.log("installed");
})
self.addEventListener("activate",(ev)=>{
    console.log("activated nnn");
})
self.addEventListener("fetch",(ev)=>{
    console.log(ev.request);
})