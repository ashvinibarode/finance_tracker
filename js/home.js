// Check login
if(!localStorage.getItem("isLogin")){
  window.location.href = "pages/login.html";
}

// Show user profile
const userName = document.getElementById("userName");
const user = JSON.parse(localStorage.getItem("user"));
if(user) userName.textContent = user.name;

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', ()=> navLinks.classList.toggle('open'));

// Logout
document.getElementById("logout").addEventListener("click", ()=>{
  localStorage.removeItem("isLogin");
  window.location.href = "pages/login.html";
});
