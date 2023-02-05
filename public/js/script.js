// Socket Client side
// Socket server connection --> connection event
const socket = io();


//DOM elements
const form = document.getElementById("newProductForm");
const productListContainer = document.getElementById("product-list-container");

//Socket Emitters

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const requestOptions = {
    method: "POST",
    body: formData,
    redirect: "manual",
  };

  fetch("http://localhost:8080/realtimeproducts", requestOptions)  //Send formData object within the body request, to be received in req.body from newProduct function
  
  form.reset();
});

//Socket listeners

socket.on("newProduct", (data) => {
  const newProductDiv = document.createElement("div");
  newProductDiv.innerHTML = 
      `<div class="card card-product" style="width: 18rem;">
            <img
              class="card-img-top"
              src="/static/img/${data.thumbnail}"
              alt="${data.title}"
            />
            <div class="card-body">
              <h3 class="card-title">${data.title}</h3>
              <h5 class="card-title">$${data.price}</h5>
              <p class="card-text">${data.description}</p>
            </div>
          </div>`;

  productListContainer.append(newProductDiv);
  
  window.location.reload()
});

