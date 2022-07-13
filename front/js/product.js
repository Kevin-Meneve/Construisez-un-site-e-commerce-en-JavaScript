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
buttonAjoutPanier.addEventListener('click',function () {
    ajoutPanier();
}   );



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
    
    //Récupère les valeurs de l'ajout du pannier
    let choix = {
        id : idURL,
        quantity :  document.getElementById("quantity").value,
        color : document.getElementById("colors").value
    }

    //Test couleur 
    if(choix.color == "")
    {
        alert("Choisissez une couleur pour votre commande");
        return 0;
    }

    //Test quantité 
    if (!(0 < parseInt(choix.quantity) && parseInt(choix.quantity) < 101)){
        alert("Veuillez choisir une quantité différente pour votre commande ( entre 1 et 100 ) ");
        return 0;
    }


    let unique = true; //boolean qui vérifie si l'article est unique dans le local storage

    for ( let i=0 ; i < localStorage.length ; i++){
        let local = JSON.parse(localStorage.getItem(`article ${i}`));
        if(local.id == choix.id && local.color == choix.color){
            unique = false;
            choix.quantity = parseInt(choix.quantity) + parseInt(local.quantity);

            //Test quantité totale 
            if (parseInt(choix.quantity) > 101){
                alert("la quantité totale commandé pour ce canapé dépasse la valeure maximale (100)");
                return 0;
            }
            
            let stringAjoutPanier = JSON.stringify(choix);
            localStorage.setItem(`article ${i}` , stringAjoutPanier);
            break;
        }
    }
    if (unique == true){
    let stringAjoutPanier = JSON.stringify(choix);
    localStorage.setItem(`article ${localStorage.length}` , stringAjoutPanier);
    }
}