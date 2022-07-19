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
let classItemQuantity = document.getElementsByClassName("itemQuantity");
//console.log(classItemQuantity);
//classItemQuantity.forEach(element => {
   /* element.addEventListener('change', function(element){
        console.log("test1")
        let dataId = element.closest("article").dataset-id;
        */
        //console.log("test2");
    
 //   });

let deleteItem = document.getElementsByClassName("deleteItem");
/*deleteItem.addEventListener('click' , function(){

});
*/ 

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
                        <p>${canape.price}</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${tabAchat[i].quantity}" ">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`
}

