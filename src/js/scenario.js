

let divAdh=document.getElementById("listeAdherents");
let divDispo=document.getElementById("listeLivresDisponibles");
let divEmprunt=document.getElementById("listeLivresEmpruntes");
let inputNomAjoutAdh=document.getElementById("nomAdherent");
let inputValiderAjoutAdh=document.getElementById("ajouterAdherent");
let inputTitreAjoutLivre=document.getElementById("titreLivre");
let inputValiderAjoutLivre=document.getElementById("ajouterLivre");
let divInfo=document.getElementById("info");
let divInfoLivre= document.getElementById("infoLivre");

let tabAdherent=[];
let tabDispo=[];
let tabEmprunt=[];
let tabGlobaleLivre=[];

//Fonction initialisation affichage
async function miseAJourAffichage() {
    tabGlobaleLivre = [];
    tabDispo = [];
    tabEmprunt = [];
    tabAdherent = [];
    await requeteLivreFetch();
    await requeteAdherentFetch();

}

document.addEventListener("DOMContentLoaded",miseAJourAffichage);

async function get(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        // si une promesse est rejetée pendant un await, une exception est levée contenant l'erreur de la promesse
        console.log("Erreur :" + error);
    }
}


async function tabLivreEmprunte(adherent){
    let promiseLivreEmprunt= await get("php/Controller/ControllerEmprunt.php?action=readAll");
    for (const datum of promiseLivreEmprunt) {
        if(datum.idAdherent===adherent.id){
            for (const livres of tabGlobaleLivre) {
                if(livres._id===datum.idLivre){
                    adherent._livres.push(livres);
                }
            }
        }
    }
    return adherent;
}

async function requeteAdherentFetch(){
    let data = await get("php/Controller/ControllerAdherent.php?action=readAll");
    for (let i = 0; i < data.length; i++) {
        let adh=new Adherent(data[i].idAdherent,data[i].nomAdherent);
        adh=await tabLivreEmprunte(adh);
        tabAdherent.push(adh);
    }
    affichageAdherentFetch();
}




function affichageAdherentFetch(){
    clearAdherent();
    for (const tabElement of tabAdherent) {
        let pAdh = document.createElement("li");
        let buttomSupprimer=document.createElement("button");
        let img=document.createElement("img");
        img.setAttribute("src","img/x.svg");
        buttomSupprimer.appendChild(img);
        buttomSupprimer.addEventListener("click",supprimerAdherent);
        pAdh.appendChild(buttomSupprimer);
        if (tabElement._livres.length>0){
            pAdh.innerText = tabElement+"( "+tabElement._livres.length+" emprunts )";
            pAdh.appendChild(buttomSupprimer);
        }
        else {
            pAdh.innerText = tabElement;
            pAdh.appendChild(buttomSupprimer);
        }
        pAdh.addEventListener("click",liAdherentClicker)
        divAdh.appendChild(pAdh);
    }
}

function clearAdherent(){
    while (divAdh.hasChildNodes()){
        divAdh.removeChild(divAdh.firstChild);
    }
}

async function supprimerAdherent(event) {
    let textBaliseTextLi;
    //on recupère le text du li
    if (event.target.localName === "img") {
        textBaliseTextLi = event.target.parentElement.parentElement.innerText;
    } else {
        textBaliseTextLi = event.target.parentElement.innerText;
    }
    //on récupère l'id de l'adherent
    let idAdh = "";
    for (let i = 0; i < textBaliseTextLi.length; i++) {
        let char = textBaliseTextLi.charAt(i);
        if (char !== ' ') {
            idAdh = idAdh.concat(char);
        } else {
            break;
        }
    }
    let url = "php/Controller/ControllerAdherent.php?action=delete&id="+idAdh;
    await fetch(url)
        .then(async function (result) {
            alert("Adherent supprimé");
            await miseAJourAffichage();
        })
}

async function supprimerLivre(event) {
    let textBaliseTextLi;
    //on recupère le text du li
    if (event.target.localName === "img") {
        textBaliseTextLi = event.target.parentElement.parentElement.innerText;
    } else {
        textBaliseTextLi = event.target.parentElement.innerText;
    }
    //on récupère l'id du livre
    let idLivre = "";
    for (let i = 0; i < textBaliseTextLi.length; i++) {
        let char = textBaliseTextLi.charAt(i);
        if (char !== ' ') {
            idLivre = idLivre.concat(char);
        } else {
            break;
        }
    }
    let url = "php/Controller/ControllerLivre.php?action=delete&id="+idLivre;
    await fetch(url)
        .then(async function (result) {
            alert("Livre supprimé");
            await miseAJourAffichage();
        })
}




//Fonction affichage de tout les livres
function affichageLivreDispo(tab){
    clearLivreDispo();
    for (const element of tab){
        let pHTML=document.createElement('li');
        pHTML.textContent=element;
        let testbouton = document.createElement("button");
        let img = document.createElement("img");
        img.setAttribute("src","img/book.ico");
        img.setAttribute("alt","imgLivre");
        img.setAttribute("id","imagelivre");
        let buttonSupprimer=document.createElement("button");
        let imgCroix=document.createElement("img");
        imgCroix.setAttribute("src","img/x.svg");
        buttonSupprimer.appendChild(imgCroix);
        pHTML.appendChild(buttonSupprimer);
        buttonSupprimer.addEventListener("click",supprimerLivre);
        testbouton.appendChild(img);
        pHTML.addEventListener("click",liDispoClicker);
        pHTML.appendChild(testbouton);
        pHTML.appendChild(buttonSupprimer);
        //titre: data["items"][0].volumeInfo.title
        //image de couverture : data["items"][0].volumeInfo.imageLinks.thumbnail
        //description : data["items"][0].volumeInfo.description
        testbouton.addEventListener("click", function (){
            chargerAPI(pHTML.textContent.split(" - ")[1]);
        });
        buttonSupprimer.addEventListener("click",supprimerLivre);



        divDispo.appendChild(pHTML);
    }
}

function clearLivreDispo(){
    while (divDispo.hasChildNodes()){
        divDispo.removeChild(divDispo.firstChild);
    }
}

function requeteLivreFetch(){
    let tabTemp=[];
    let promiseLivreGlobale=get("php/Controller/ControllerLivre.php?action=readAll");
    let promiseLivreEmprunt=get("php/Controller/ControllerEmprunt.php?action=readAll");
    Promise.all([promiseLivreGlobale,promiseLivreEmprunt])
        .then(reponses=>{
            //Remplir tableau globale
            for (const LivreGlobaux of reponses[0] ) {
                tabGlobaleLivre.push(new Livre(LivreGlobaux.idLivre,LivreGlobaux.titreLivre));
                tabTemp.push(new Livre(LivreGlobaux.idLivre,LivreGlobaux.titreLivre));
            }
            //Remplir tableau Emprunt
            for (const LivreGlobal of tabGlobaleLivre) {
                for (const LivreEmpruntes of reponses[1]){
                    if(LivreGlobal.id===LivreEmpruntes.idLivre){
                        tabEmprunt.push(new Livre(LivreGlobal.id,LivreGlobal.titre))
                    }
                }
            }
            //Remplir tableau dispo
            for (let  i=0;i<tabGlobaleLivre.length;i++) {
                for (const tabEmpruntElement of tabEmprunt) {
                    if(tabGlobaleLivre[i].id===tabEmpruntElement.id){
                        delete tabTemp[i];
                    }
                }
            }
            for (const livre of tabTemp) {
                if(livre!==undefined){
                    tabDispo.push(livre);
                }
            }

            affichageLivreDispo(tabDispo);
            affichageEmprunt(tabEmprunt);

        });
}


function affichageEmprunt(tab) {
    clearEmprunt();
    for (let i = 0; i < tab.length; i++) {
        let pEmprunt = document.createElement("li");
        pEmprunt.textContent=tab[i].toString();
        let buttonEmprunt=document.createElement("button");
        let img=document.createElement("img");
        img.setAttribute("src","img/person.svg");
        let testbouton = document.createElement("button");
        let imgLivre = document.createElement("img");
        imgLivre.setAttribute("src","img/book.ico");
        imgLivre.setAttribute("alt","imgLivre");
        imgLivre.setAttribute("id","imagelivre");
        testbouton.appendChild(imgLivre);
        let buttonSupprimer=document.createElement("button");
        let imgCroix=document.createElement("img");
        imgCroix.setAttribute("src","img/x.svg");
        buttonSupprimer.appendChild(imgCroix);
        buttonEmprunt.appendChild(img);
        pEmprunt.addEventListener("click",liEmpruntClicker);
        pEmprunt.appendChild(testbouton);
        pEmprunt.appendChild(buttonEmprunt);
        pEmprunt.appendChild(buttonSupprimer);
        testbouton.addEventListener("click", function (){
            chargerAPI(pEmprunt.textContent.split(" - ")[1]);
        });
        buttonSupprimer.addEventListener("click",supprimerLivre);
        buttonEmprunt.addEventListener("click",infoAdherentDeEmprunt);
        divEmprunt.appendChild(pEmprunt);
    }
}

function infoAdherentDeEmprunt(event){
    clearFenetreInfo();
    divInfo.style.visibility="visible";
    let textBaliseTextLi;
    let adherent;

    //on recupère le text du li
    if(event.target.localName==="img"){
        textBaliseTextLi=event.target.parentElement.parentElement.innerText;
    }
    else {
        textBaliseTextLi=event.target.parentElement.innerText;
    }
    //on récupère l'id du livre
    let idLivre="";
    for(let i=0;i<textBaliseTextLi.length;i++){
        let char=textBaliseTextLi.charAt(i);
        if(char!==' '){
            idLivre=idLivre.concat(char);
        }
        else {
            break;
        }
    }
    //on récupère l'adhérent qui a ce livre et le titre du livre
    let titreLivre="";
    for (const adh of tabAdherent) {
        for (const livreAdh of adh._livres) {
            if(livreAdh._id.toString()===idLivre){
                adherent=adh;
                titreLivre=livreAdh._nom;
            }
        }
    }
    let pAdh = document.createElement("p");
    pAdh.id="popup";
    let span=document.createElement("span");
    span.innerText = "Le livre \""+ titreLivre+ "\" est actuellement emprunté par l'adhérent de numéro "+ adherent._id+" et de nom "+ adherent._nom;
    let bottomFermer=document.createElement("button");
    bottomFermer.innerText="Fermer";
    bottomFermer.addEventListener("click",fermerFenetre);
    pAdh.append(span);
    pAdh.append(bottomFermer);
    divInfo.append(pAdh);


}
function clearEmprunt(){
    while (divEmprunt.hasChildNodes()){
        divEmprunt.removeChild(divEmprunt.firstChild);
    }
}

async function ajoutAdherentFetch() {
    let url = "php/Controller/ControllerAdherent.php?action=create";
    let nomAdh = encodeURIComponent(inputNomAjoutAdh.value);
    if(nomAdh.length !== 0){
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "nom=" + nomAdh
        })
            .then(async function (result) {
                let json = await result.json();
                alert("Un nouveau adhérent de numéro " + json + " a été créé");
                await miseAJourAffichage();
                inputNomAjoutAdh.value="";
            });
    }
    else {
        alert("Le nom est vide");
    }

}

inputValiderAjoutAdh.addEventListener("click",ajoutAdherentFetch);


async function ajoutLivreFetch() {
    let url = "php/Controller/ControllerLivre.php?action=create";
    let titreLivre = encodeURIComponent(inputTitreAjoutLivre.value);
    if (titreLivre.length !== 0){
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: "titre="+titreLivre
        })
            .then(async function (result) {
                let json = await result.json();
                alert("Un nouveau de numéro " + json + " a été créé");
                await miseAJourAffichage();
                inputTitreAjoutLivre.value="";
            })
    }
    else{
        alert("Le titre est vide");
    }

}

inputValiderAjoutLivre.addEventListener("click",ajoutLivreFetch);


//pour la fin du nom vérifier que i de charat différent de <
async function liEmpruntClicker(event){
    if(event.target.localName==="li"){
        let textBalise=event.target.innerHTML;
        let idLivre="";
        for(let i=0;i<textBalise.length;i++){
            let char=textBalise.charAt(i);
            if(char!==' '){
                idLivre=idLivre.concat(char);
            }
            else {
                break;
            }
        }
        let urldelete="php/Controller/ControllerEmprunt.php?action=delete&idLivre="+idLivre;
        let textConfirm="Retour de ce livre ?";
        if (confirm(textConfirm)===true) {
            await fetch(urldelete)
                .then( async function () {
                    alert("Retour confirmé");
                    await miseAJourAffichage();
                });
        }

        else{
            alert("Retour annulé");
        }
    }

}


//pour la fin du nom vérifier que i de charat différent de <
async function liDispoClicker(event){
    if(event.target.localName==="li") {
        let urlCreateEmprunt = "php/Controller/ControllerEmprunt.php?action=create";
        let textBalise = event.target.innerHTML;
        console.log(textBalise);
        let idLivre = "";
        let titreLivre = "";
        for (let i = 0; i < textBalise.length; i++) {
            let char = textBalise.charAt(i);
            if (char !== ' ') {
                idLivre = idLivre.concat(char);
            } else {
                break;
            }
        }
        for (const livre of tabGlobaleLivre) {
            if (livre._id.toString() === idLivre) {
                titreLivre = livre._nom;
            }
        }
        let person = prompt("Veuillez entrer l'identifiant de l'adhérent qui empruntera \"" + titreLivre + "\"");
        const body = "idAdherent=" + person + "&idLivre=" + encodeURIComponent(idLivre);
        console.log(body);
        if (person !== null) {
            await fetch(urlCreateEmprunt, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: body
            })
                .then(async function () {
                    alert("Nouvel emprunt effectué");
                    await miseAJourAffichage();
                })
        } else {
            alert("Emprunt annulé")
        }
    }
}




function clearFenetreInfo(){
    while (divInfo.hasChildNodes()){
        divInfo.removeChild(divInfo.firstChild);
    }
}

function fermerFenetre(){
    clearFenetreInfo();
    divInfo.style.visibility="hidden";
}

async function liAdherentClicker(event){
    clearFenetreInfo();
    if(event.target.localName==="li"){
        divInfo.style.visibility="visible";
        let textBalise=event.target.innerHTML;
        let id="";
        for(let i=0;i<textBalise.length;i++){
            let char=textBalise.charAt(i);
            if(char!==' '){
                id=id.concat(char);
            }
            else {
                break;
            }
        }
        for (const adh of tabAdherent) {
            if(adh._id.toString()===id){
                let nom=adh._nom;
                let livres=adh._livres;
                let pAdh = document.createElement("p");
                pAdh.id="popup";
                let span=document.createElement("span");
                span.style.top="50%";
                if(livres.length>0){
                    span.innerText = nom+ " a emprunté : ";
                }else {
                    span.innerText = nom+ " n'a pas encore emprunté de livre ";
                }
                let bottomFermer=document.createElement("button");
                bottomFermer.innerText="Fermer";
                bottomFermer.addEventListener("click",fermerFenetre);
                span.append(bottomFermer);
                for (const livre of livres) {
                    let liLivres=document.createElement("li");
                    liLivres.innerHTML=livre;
                    span.append(liLivres);
                }
                pAdh.append(span);
                divInfo.append(pAdh);

            }
        }
    }


}




function chargerAPI(titre){

    let url = "https://www.googleapis.com/books/v1/volumes?key=AIzaSyCNr9DAODfUnQy2iCe_tjy9P1uVBjZ0C8Y&q="+encodeURIComponent(titre);


    let request = new XMLHttpRequest()
    request.open("GET", url, true);
    request.addEventListener('load', function () {
        clearFenetreInfo()

        let jsonreq = JSON.parse(request.responseText);
        console.log(jsonreq);
        console.log(jsonreq);
        let pAdh = document.createElement("p");
        let titre = document.createElement("p");
        let span = document.createElement("span");
        let bottomFermer = document.createElement("button");

        bottomFermer.innerText = "Fermer";
        bottomFermer.addEventListener("click", fermerFenetre);
        divInfo.style.visibility = "visible";

        pAdh.id = "popup";

        if(jsonreq["items"]===undefined){
            titre.innerText = "Oups une erreur est survenue :/";
            span.innerText = "Aucune information valide pour ce livre...";
            pAdh.append(titre);
        }
        else {

            let couverture = document.createElement("img");
            let gauche = document.createElement("div");
            if(jsonreq["items"][0].volumeInfo.imageLinks!==undefined){
                couverture.setAttribute("src", jsonreq["items"][0].volumeInfo.imageLinks.thumbnail);
            }
            else {
                couverture.setAttribute("src", "img/book.ico");

            }
            if(jsonreq["items"][0].volumeInfo.description!==undefined){
                span.innerText = jsonreq["items"][0].volumeInfo.description;
            }
            else{
                span.innerText = "Aucune description"
            }


            if(jsonreq["items"][0].volumeInfo.title!==undefined){
                titre.innerText = jsonreq["items"][0].volumeInfo.title;
            }
            else{
                titre.innerText= "Aucun titre"
            }
            couverture.setAttribute("alt", "couverture livre");


            gauche.style.display = "flex";
            gauche.style.flexDirection = "column";
            gauche.style.paddingRight = "10px"
            gauche.style.paddingLeft = "10px"
            couverture.style.width = "180px";
            gauche.append(titre)
            gauche.append(couverture)

            pAdh.append(gauche);
        }

        pAdh.append(span);
        pAdh.append(bottomFermer);
        divInfo.append(pAdh);
    })

    request.send(null)


}