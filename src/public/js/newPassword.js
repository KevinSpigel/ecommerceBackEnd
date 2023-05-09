//Sweet alert definition
const Toast = Swal.mixin({
    toast: true,
    position: "center",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });


//   Toast.fire({
//     icon: "success",
//     title: "Password updated successfully",
//   })


//   Toast.fire({
//     icon: "error",
//     title: "You can't use the same password. Please, choose another one",
//   })


form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const requestOptions = {
      method: "PUT",
      body: formData,
      redirect: "manual",
    };
  
    fetch("http://localhost:8080/api/users/newPassword", requestOptions)
      .then((res) => console.log(res))
      .catch((error) => console.log(error)); //Send formData object within the body request, to be received in req.body from newProduct function
  
    form.reset();
  });