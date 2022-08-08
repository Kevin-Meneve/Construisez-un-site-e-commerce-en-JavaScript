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
            
            if(i == tabAchat.length-1){
                modifyQuantity();
            } 
        })
        .catch(function(err) {
            // Une erreur est survenue
        });
}

//validation de la commande
let commande = document.getElementById("order");
commande.addEventListener('click',function (event) {
    event.preventDefault();  
    passageCommande();
});

//Affiche le panier
function affichagePanier(i, canape){
    document.getElementById("cart__items").innerHTML +=
        `<article class="cart__item" data-id="${tabAchat[i].id}" data-color="${tabAchat[i].color}">
            <div class="cart__item__img">
              <img src="${canape.imageUrl}" alt="${canape.altTxt}">
            </div>
            <div class="cart__item__content">
              <div class="cart__item__content__description">
                <h2>${canape.name}</h2>
                <p>${tabAchat[i].color}</p>
                <p>${canape.price} €</p>
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

function modifyQuantity(){
    let modifyQuantity = document.querySelectorAll(".itemQuantity");
    let color;
    console.log(modifyQuantity.length);
    modifyQuantity.forEach((article)=>
        console.log(article),
        //color = article.target.closest(".cart__item").dataset.color,
        //console.log(color),
    );
}

function passageCommande(){
    let tabProducts = [];
    for (i = 0; i<tabAchat.length; i++){
        tabProducts.push(tabAchat[i].id);
    }

    let order = {
        contact : {
            firstName : document.getElementById("firstName").value,
            lastName : document.getElementById("lastName").value,
            address : document.getElementById("address").value,
            city : document.getElementById("city").value,
            email : document.getElementById("email").value,
        },
        products : tabProducts,
    };
    
    fetch("http://localhost:3000/api/products/order/", {
        method : "POST",
        headers: { 
            Accept : "application/json" ,
            "Content-Type": "application/json",
            },
        body : JSON.stringify(order)
    })
        .then((response) => response.json())
        .then(data => {
            localStorage.clear();
            window.location.assign(`./confirmation.html?orderId=${data.orderId}`);
        })
        .catch(function(error) {
            console.log("une erreur est survenue");
        })

}
