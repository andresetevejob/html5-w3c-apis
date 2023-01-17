(function(){
  let Task = function(){
    let orientation = function(){
        setTimeout(function(){
            window.scrollTo(0,0);
        },1000)
    }
    //Gestion de la navigation
    let navigation = function(){
        switch(location.hash){
            case "#add":
                document.body.className = "add";
            break;
            case "#settings":
                document.body.className = "settings";
            break;
            default:
                document.body.className = "list"
        }
        orientation();
    }
    navigation();
    //Liaison des fonctions aux évènements de l'objet window
    window.addEventListener("hashchange",navigation,false);
    window.addEventListener("orientationchange",orientation,false);
    let localStorageAvailability = "localStorage" in window;
    let loadSettings = function(){
        if(localStorageAvailability){
            const name = localStorage.getItem("name"),
                  colorScheme = localStorage.getItem("colorScheme");
            let nameDisplay = document.getElementById("user_name");
            let nameField = document.forms.settings.name;
            doc = document.documentElement;
            colorSchemeField = document.forms.settings.color_scheme;
            if(name){
                nameDisplay.innerHTML = name + "s";
                nameField.value = name;
            }else{
                nameDisplay.innerHTML = "My";
                nameField.value = "";
            }if(colorScheme){
                doc.className = colorScheme.toLowerCase();
                colorSchemeField.value = colorScheme;
            }else{
                doc.className = 'blue';
                colorSchemeField.value = "Blue";
            }
        }else{
            alert("Le localStorage n'est pas disponible sur cet environnement");
        }
    }
    let saveSettings = function(e){
        e.preventDefault();
        if(localStorageAvailability){
            let name = document.forms.settings.name.value;
            if(name.length>0){
                let colorScheme = document.forms.settings.color_scheme.value;
                localStorage.setItem("name",name);
                localStorage.setItem("colorScheme",colorScheme);
                loadSettings();
                alert("Préférences enregitrées avec succès");
                location.hash = "#list";
            }else{
                alert("Veuillez entrez votre nom","Préférence erreure");
            }
        }else{
            alert("Le localStorage n'est pas disponible sur cet environnement");
        }
    }
    loadSettings();
    document.forms.settings.addEventListener("submit",saveSettings,false);
  };
  window.addEventListener("load",function(){
    new Task();
  },
  false
  );
})();