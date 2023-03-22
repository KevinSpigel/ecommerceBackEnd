// delete product from cart button

function removeFromCart(pid) {
  fetch(`http://localhost:8080/api/carts/products/${pid}`, {
    method: "DELETE",
  }).then(alert("Product deleted from cart"));
}
