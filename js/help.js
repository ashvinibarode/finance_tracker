const user = JSON.parse(localStorage.getItem("user"));

// Show user name
document.getElementById("userName").textContent = user.name;
document.getElementById("profile").textContent = user.name;

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', ()=> navLinks.classList.toggle('open'));

// Logout
document.getElementById("logout").addEventListener("click", ()=>{
  localStorage.removeItem("isLogin");
  window.location.href = "login.html";
});
