// //Sweet alert definition
// const Toast = Swal.mixin({
//   toast: true,
//   position: "center",
//   showConfirmButton: false,
//   timer: 3000,
//   timerProgressBar: true,
// });

// const passwordSuccess = Toast.fire({
//   icon: "success",
//   title: "Password updated successfully",
// });

// const passwordError = Toast.fire({
//   icon: "error",
//   title: "You can't use the same password. Please, choose another one",
// });

const newPass = document.getElementById("newPass");

newPass.addEventListener("submit", (event) => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");

  event.preventDefault();
  const formData = new FormData(newPass);
  const formPayload = Object.fromEntries(formData);
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(formPayload),
  };

  fetch(
    `http://localhost:8080/api/users/createNewPassword?token=${token}`,
    requestOptions
  )
    .then((res) => console.log(res))
    .catch((error) => console.log(error));

  newPass.reset();
});
