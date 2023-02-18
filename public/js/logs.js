const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

// Events Listeners
loginForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const loginFormData = new FormData(loginForm);
  const loginPayload = Object.fromEntries(loginFormData);
  fetch("http://localhost:8080/api/sessions/login", {
    method: "post",
    body: JSON.stringify(loginPayload),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => (window.location.href = "http://localhost:8080/products"));
  loginForm.reset();
});

registerForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const registerFormData = new FormData(registerForm);
  const registerPayload = Object.fromEntries(registerFormData);
  fetch("http://localhost:8080/api/sessions/register", {
    method: "post",
    body: JSON.stringify(registerPayload),
    headers: {
      "Content-Type": "application/json",
    },
  }).then(() => (window.location.href = "http://localhost:8080/products"));
  registerForm.reset();
});

const logout = () => {
  window.location.href = "http://localhost:8080/api/sessions/logout";
};