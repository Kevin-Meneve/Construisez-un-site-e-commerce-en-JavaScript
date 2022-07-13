for ( let i=0 ; i < localStorage.length ; i++){

    let local = JSON.parse(localStorage.getItem(`article ${i}`));
    fetch (`http://localhost:3000/api/products/${local.id}`)
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

function affichagePanier(i, canape){
    let local = JSON.parse(localStorage.getItem(`article ${i}`));
    document.getElementById("cart__items").innerHTML +=
            `<article class="cart__item" data-id="${local.id}" data-color="${local.color}">
                <div class="cart__item__img">
                    <img src="${canape.imageUrl}" alt="${canape.altTxt}">
                </div>
                <div class="cart__item__content">
                    <div class="cart__item__content__description">
                        <h2>${canape.name}</h2>
                        <p>${local.color}</p>
                        <p>${canape.price}</p>
                    </div>
                    <div class="cart__item__content__settings">
                        <div class="cart__item__content__settings__quantity">
                            <p>Qté : </p>
                            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${local.quantity}">
                        </div>
                        <div class="cart__item__content__settings__delete">
                            <p class="deleteItem">Supprimer</p>
                        </div>
                    </div>
                </div>
            </article>`
}

