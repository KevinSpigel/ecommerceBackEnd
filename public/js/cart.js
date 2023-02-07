// delete product from cart button

// const removeProduct = async (event) =>{
//     const pid = event.target.parentNode.getAttribute('id')
//     const cid = event.target.parentNode.parentNode.getAttribute('id')
//     console.log(cid)
//     console.log(productId)
//     await fetch(`/api/carts/${cid}/products/${pid}`, {
//         method: 'DELETE'
//     })
//     .then(alert('product deleted from cart'))
//     .then( window.location.reload())
// }