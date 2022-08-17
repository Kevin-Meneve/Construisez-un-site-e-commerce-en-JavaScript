let tabAchat = JSON.parse(localStorage.getItem("article")); // récupère les valeurs du local storage et le met dans tabAchat

//Verifie si le pannier est vide
if(tabAchat.length == 0){
    document.getElementById("cart__items").innerHTML = "<h2>Votre pannier est vide</h2>";
}
else{
    affichage()
        .then(function(){
            modifyQuantity();
            deleteItem();
            printTotalPrice();
        });

    //validation de la commande
    let commande = document.getElementById("order");
    commande.addEventListener('click',function (event) {
        event.preventDefault();  
        passageCommande();
    });
}


//affichage de la page 
async function affichage(){
    for ( let i=0 ; i < tabAchat.length ; i++){
        await fetch (`http://localhost:3000/api/products/${tabAchat[i].id}`)
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
}

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
                <p>${canape.price*tabAchat[i].quantity}€</p>
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

//Modification de la quantité d'un article
function modifyQuantity(){
    let modifyQuantity = document.querySelectorAll(".itemQuantity");
    modifyQuantity.forEach(function (article){
        article.addEventListener("change", (e) => {
            let color = e.target.closest(".cart__item").dataset.color;
            let id = e.target.closest(".cart__item").dataset.id;
            let quantity = parseInt(e.target.value);
            if(0 < quantity && quantity < 101){
                let i = 0;
                while(tabAchat[i].id != id && tabAchat[i].color != color){
                    i++;
                }
                tabAchat[i].quantity = quantity.toString();
                let stringAjoutPanier = JSON.stringify(tabAchat);
                localStorage.setItem(`article` , stringAjoutPanier);
                alert(`La quantité a bien été modifier`);
                window.location.reload(); //rafraichis la page pour mettre à jour le prix totale de l'article et du pannier
            }
            else
            {
                alert("Veuillez entrer une quantité entre 1 et 100");
            }
        });
    });

}

//Suppression d'un article
function deleteItem(){
    let deleteItem = document.querySelectorAll(".deleteItem");
    deleteItem.forEach(function (article){
        article.addEventListener("click", (e) => {
            let color = e.target.closest(".cart__item").dataset.color;
            let id = e.target.closest(".cart__item").dataset.id;
            let i = 0;
            while(tabAchat[i].id != id || tabAchat[i].color != color){
                i++;
            }
            e.target.closest(".cart__item").remove();
            tabAchat.splice(i , 1);
            let stringAjoutPanier = JSON.stringify(tabAchat);
            localStorage.setItem(`article` , stringAjoutPanier);
            alert(`L'article a bien été supprimé`);
            printTotalPrice();
            if(tabAchat.length == 0){
                window.location.reload(); // Rafraichis la page pour empecher l'envois du formulaire quand on a plus d'article
            }
        });
    });

}

//Affichage du prix total 
async function printTotalPrice(){
    let priceTotal = 0;
    let quantityTotal = 0;
    for ( let i=0 ; i < tabAchat.length ; i++){
        await fetch (`http://localhost:3000/api/products/${tabAchat[i].id}`)
        .then(function(res) {
            if (res.ok) {
                return res.json();
            }
        })
        .then(function(canape){
            priceTotal += parseInt(canape.price) * parseInt(tabAchat[i].quantity);
            quantityTotal += parseInt(tabAchat[i].quantity);
            
        })
        .catch(function(err) {
            // Une erreur est survenue
        });
    }
    document.getElementById("totalQuantity").innerText = quantityTotal;
    document.getElementById("totalPrice").innerText = priceTotal;

}

//Envoit de la commande à l'API
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

    //Test les valeures insérés dans le formulaire
    let test = testForm(order.contact);
    if(test == false){
        return;
    }
    
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

//Fonction qui test le formulaire
function testForm(form){
    isValid = true; //Booléen qui est changé à faux si un des champs du formulaire n'est pas valide
    

    /*Test regexName
        1. Le nom ne doit pas contenir de chiffre
        2. Le nom ne doit pas contenir de caractière spéciaux 
        3. Le nom peut ne pas commencer par une majuscule 
        4. Le nom peut avoir des espaces ou des tirets  (comme Jean Michel)
        5. Les tirets et les espaces ne peuvent pas se trouver au début ou à la fin du nom
    */
    const regexName = /^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/;

    //Test firstName
    if ( regexName.test(form.firstName) == false)
    {
        document.getElementById("firstNameErrorMsg").innerHTML = "Veullez entrer un prénom valide";
        isValid = false;
    }
    else{
        document.getElementById("firstNameErrorMsg").innerHTML = "";
    }

    //Test lastName
    if ( regexName.test(form.lastName) == false)
    {
        document.getElementById("lastNameErrorMsg").innerHTML = "Veullez entrer un nom valide";
        isValid = false;
    }
    else{
        document.getElementById("lastNameErrorMsg").innerHTML = "";
    }

    //Test city
    if ( regexName.test(form.city) == false)
    {
        document.getElementById("cityErrorMsg").innerHTML = "Veullez entrer une ville valide";
        isValid = false;
    }
    else{
        document.getElementById("cityErrorMsg").innerHTML = "";
    }

    /* Test regexAddress
        1. Il doit commencer par au moins un chiffre 
        2. Ensuite il doit contenir une chaine de caractère pouvant commencer par un espace ou une virgule 
        3. Après il doit contenir 5 chiffres 
    */ 
    const regexAddress = /([0-9]+) ?([a-zA-Z,\. ]+) ?([0-9]{5})/

    //Test address
    if ( regexAddress.test(form.address) == false)
    {
        document.getElementById("addressErrorMsg").innerHTML = "Veullez entrer une adresse valide";
        isValid = false;
    }
    else{
        document.getElementById("addressErrorMsg").innerHTML = "";
    }

    /*Test regexMail
        1. L'email ne peut pas commencer ou finir par un point
        2. L'email peut contenir un point avant le @ au milieu de la chaine de caractère
        3. L'email peut contenir un double domaine (exemple : .de.org)   
    */
    const regexMail =/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gm;
    if (regexMail.test(form.email) == false)
    {
        document.getElementById("emailErrorMsg").innerHTML = "Veullez entrer une adresse mail valide";
        isValid = false;
    }
    else{
        document.getElementById("emailErrorMsg").innerHTML = "";
    }
    return isValid;
}
