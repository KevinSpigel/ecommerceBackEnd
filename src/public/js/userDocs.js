// Sweet alert definition
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
});

const userDocumentForm = document.getElementById("userDocument-form");

userDocumentForm?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const documentsFormData = new FormData(userDocumentForm);

  try {
    const response = await fetch(
      "http://localhost:8080/api/user/:uid/documents",
      {
        method: "POST",
        body: documentsFormData,
        redirect: "manual",
        headers: {
          type: "documents",
        },
      }
    );

    if (response.ok) {
      Toast.fire({
        icon: "success",
        title: "Now, you are a Premium User!",
      });
      window.location.href = "http://localhost:8080/products";
      userDocumentForm.reset();
    } else {
      Toast.fire({
        icon: "error",
        title:
          "Ups, something happend. Please try again. If the error persist, please contact with the Administrator",
      });
    }
  } catch (error) {
    console.log(error);
    window.location.href = "http://localhost:8080/becomePremium";
  }
});
