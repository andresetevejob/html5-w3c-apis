console.log("service worker a demarré");
console.log(self);
self.addEventListener("install",(ev)=>{
    //self.skipWaiting();
    test1();
    test2();
    console.log("installed v9");

})
function test1(){
    console.log("hello");
}
function test2(){
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            console.log("asynchrone");
            resolve();
        },2000)
    })
    console.log("hello 2");
}
self.addEventListener("activate",(ev)=>{
    console.log("activated nnn");
})
self.addEventListener("fetch",(ev)=>{
    console.log(ev.request);
})