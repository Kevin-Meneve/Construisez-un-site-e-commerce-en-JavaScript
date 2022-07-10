
fetch ("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
        return res.json();
        }
    })
    .then(function(listeCanape){
        affichageCanape(listeCanape);
    })
    .catch(function(err) {
        // Une erreur est survenue
    });

function affichageCanape(listeCanape){
    for(let index in listeCanape){
        document.getElementById("items").innerHTML = "<img src='"+ listeCanape[index].imageURL+ "' />";
    }
}