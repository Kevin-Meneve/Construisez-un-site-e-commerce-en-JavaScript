//Récupération de l'id du produit depuis l'URL
let url = new URL(window.location.href);
let idURL = url.searchParams.get("id");

//Récupération des données du produit ciblé par l'URL
fetch (`http://localhost:3000/api/products/${idURL}`)
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(Canape){
        infosCanape(Canape); //Affichage des informations du produit sur la page product
    })
    .catch(function(err) {
        // Une erreur est survenue
    });

//Gestion d'ajout au panier
let buttonAjoutPanier = document.getElementById("addToCart");
buttonAjoutPanier.addEventListener('click',ajoutPanier());



//Affichage des informations du produit sur la page product
function infosCanape(Canape){
    document.querySelector(".item__img").innerHTML = `<img src="${Canape.imageUrl}" alt="${Canape.altTxt}">`;
    document.getElementById("title").innerHTML = `${Canape.name}`;
    document.getElementById("price").innerHTML = `${Canape.price}`;
    document.getElementById("description").innerHTML = `${Canape.description}`;
    for(let index in Canape.colors){
        document.getElementById("colors").innerHTML += `<option value="${Canape.colors[index]}">${Canape.colors[index]}</option>`;
    }
}

//Ajoute les information du cannapé dans le local storage
function ajoutPanier(){
    
    
    //let infosChoix = {
        //id = idURL,
        //quantite = 
        //color = 
    //}
    //let stringAjoutPanier = JSON.stringify(ajoutPanier);
    //localStorage.setItem("article" , stringAjoutPanier);
}