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
        document.getElementById("items").innerHTML += `<a href="./product.html?id=${listeCanape[index]._id}}">
        <article>
          <img src="${listeCanape[index].imageUrl}" alt="${listeCanape[index].altTxt}">
          <h3 class="productName">${listeCanape[index].name}</h3>
          <p class="productDescription">${listeCanape[index].description}</p>
        </article>
      </a>`;

    }
}