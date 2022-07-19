let tabAchat = JSON.parse(localStorage.getItem("article")); // récupère les valeurs du local storage et le met dans tabAchat

for ( let i=0 ; i < tabAchat.length ; i++){

    fetch (`http://localhost:3000/api/products/${tabAchat[i].id}`)
        .then(function(res) {
            if (res.ok) {
            return res.json();
            }
        })
        .then(function(canape){
            affichagePanier(i, canape); //Affichage des informations du produit sur la page product
        })
        .catch(function(err) {
            // Une erreur est survenue
        });
}

document.addEventListener("DOMContentLoaded", function(e) {
    let itemQuantity = document.getElementsByClassName("itemQuantity");
    console.log(itemQuantity, itemQuantity.length);
    for (let i = 0; i < itemQuantity.length; i++) {
        console.log(itemQuantity[i]);
    }
});

    /*element.addEventListener("change", (e) => {
        console.log("changement fait ");
    });*/
//let deleteItem = document.querySelectorAll(".deleteItem"); 
//console.log(deleteItem);
/*
deleteItem.forEach(element => {

    element.addEventListener('click' , function(){
        console.log("test");
    });
});*/


//Gestion de l'envoit de l'a commande
let commande = document.getElementById("order");
commande.addEventListener('click',function (event) {
    event.preventDefault();  
    passageCommande();
}   );

//Affiche le panier
function affichagePanier(i, canape){
    let tabAchat = JSON.parse(localStorage.getItem("article")); // récupère les valeurs du local storage et le met dans tabAchat
    document.getElementById("cart__items").innerHTML +=
            `<article class="cart__item" data-id="${tabAchat[i].id}" data-color="${tabAchat[i].color}">
                <div class="cart__item__img">
                    <img src="${canape.imageUrl}" alt="${canape.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${canape.name}</h2>
                        <p>${tabAchat[i].color}</p>
                        <p>${canape.price}€</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${tabAchat[i].quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`
}

async function passageCommande(){
    let contact = {
        firstName : document.getElementById("firstName").value,
        lastName : document.getElementById("lastName").value,
        address : document.getElementById("address").value,
        city : document.getElementById("city").value,
        email : document.getElementById("email").value
    }
    let tabArticle = JSON.parse(localStorage.getItem("article"));
    let tabProduct = [];
    for (i = 0; i<tabArticle.length; i++){
        tabProduct.push(tabArticle[i].id);
    }
    console.log(tabProduct);

    let response = await fetch("http://localhost:3000/api/products/order", {
        method : "POST",
        headers: { 
            'Content-Type': 'application/json' 
            },
        contact : JSON.stringify(contact),
        productID : JSON.stringify(tabProduct)
    });

    let result = await response.json();
    alert(result.message);
}
