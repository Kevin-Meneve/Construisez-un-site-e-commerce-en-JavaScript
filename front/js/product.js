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
    .then(function(canape){
        infosCanape(canape); //Affichage des informations du produit sur la page product
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
function infosCanape(canape){
    document.querySelector(".item__img").innerHTML = `<img src="${canape.imageUrl}" alt="${canape.altTxt}">`;
    document.getElementById("title").innerHTML = `${canape.name}`;
    document.getElementById("price").innerHTML = `${canape.price}`;
    document.getElementById("description").innerHTML = `${canape.description}`;
    for(let index in canape.colors){
        document.getElementById("colors").innerHTML += `<option value="${canape.colors[index]}">${canape.colors[index]}</option>`;
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

    let tabAchat = JSON.parse(localStorage.getItem("article")); // récupère les valeurs du local storage et le met dans tabAchat

    if(tabAchat == null){
        tabAchat = []
    }
    let unique = true; //boolean qui vérifie si l'article est unique dans le local storage

    for ( let i=0 ; i < tabAchat.length ; i++){
        if(tabAchat[i].id == choix.id && tabAchat[i].color == choix.color){
            unique = false;
            tabAchat[i].quantity = parseInt(choix.quantity) + parseInt(tabAchat[i].quantity);

            //Test quantité totale 
            if (parseInt(tabAchat[i].quantity) > 101){
                alert(`Ajout refusé ! la quantité totale commandé ${choix.quantity} pour ce canapé dépasse la valeure maximale (100)`);
                return 0;
            }
            
            
            let stringAjoutPanier = JSON.stringify(tabAchat);
            localStorage.setItem(`article` , stringAjoutPanier);
            alert(`La quantité du produit selectionné a été ajouté à la quantité déjà selectionné dans le panier pour un totale de ${tabAchat[i].quantity}`);
            break;
        }
    }
    if (unique == true){
    tabAchat.push(choix);
    let stringAjoutPanier = JSON.stringify(tabAchat);
    localStorage.setItem(`article` , stringAjoutPanier);
    alert(`Le produit a bien été ajouté au panier`);
    }
}