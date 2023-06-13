const socket = io()
const formProducts = document.getElementById("form-products");
const inputTitle = document.getElementById("form-title");
const inputPrice = document.getElementById("form-price");
const inputThumbnail = document.getElementById("form-thumbnail");
const inputDescription = document.getElementById("form-description");
const inputCategory = document.getElementById("form-category");
const inputStock = document.getElementById("form-stock");
const inputCode = document.getElementById("form-code");
 





formProducts.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!inputTitle.value == "" && !inputPrice.value == "" && !inputThumbnail.value == "" && !inputDescription.value == "" && !inputCategory.value == "" && !inputStock.value == "" && !inputCode.value == "") {
        const newProduct = {
            title: inputTitle.value,
            price: inputPrice.value,
            thumbnail: inputThumbnail.value,
            description: inputDescription.value,
            category: inputCategory.value,
            stock: inputStock.value,
            code: inputCode.value
        };
        socket.emit("newProduct", newProduct);
        inputTitle.value = "";
        inputPrice.value = "";
        inputThumbnail.value = "";
        inputDescription.value = "";
        inputCategory.value = "";
        inputStock.value = "";
        inputCode.value = "";

        window.location.reload();
        
    } else {
        alert("Please complete the requested fields!")
    }
});


socket.on("newProduct", (products) => {
    console.log(products)
    const newProduct = `
    <div class="card" style="width: 18rem;">
    <img src=${products.thumbnail} class="card-img-top" alt="..." />
    <div class="card-body">
      <h5 class="card-title">${products.title}</h5>
      <p class="card-text">${products.price}</p>
      <p class="card-description">${products.description}</p>
      <p class="card-category">${products.category}</p>
      <p class="card-stock">${products.stock}</p>
      <p class="card-code">${products.code}</p>
      <input type="submit" value="add to cart" onclick="" class="btn btn-primary">
      <input type="submit" value="delete" onclick="deleteProduct(${products.id})" class="btn btn-danger">
    </div>
  </div>
    `;
    document.getElementById("products").innerHTML += newProduct;
});



function deleteProduct(id) {
  fetch(`/api/products/${id}`, {
    method: "DELETE",
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      
      window.location.reload();
    })
    .catch((err) => console.log(err));
}