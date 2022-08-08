//Récupération de l'id de la commande depuis l'URL
let url = new URL(window.location.href);
let orderId = url.searchParams.get("orderId");

//Affichage de l'id de la commande sur la page
document.getElementById("orderId").innerHTML = `${orderId}`;