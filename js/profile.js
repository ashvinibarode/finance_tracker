const user = JSON.parse(localStorage.getItem("user"));
const API_URL = "http://localhost:8080/api";

// Elements
const profileForm = document.getElementById("profileForm");
const profileName = document.getElementById("profileName");
const profileEmail = document.getElementById("profileEmail");

// Populate fields
profileName.value = user.name;
profileEmail.value = user.email;

// Hamburger menu
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', ()=> navLinks.classList.toggle('open'));

// Logout
document.getElementById("logout").addEventListener("click", ()=>{
  localStorage.removeItem("isLogin");
  window.location.href = "login.html";
});

// Update profile
profileForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const updatedUser = {
    id: user.id,
    name: profileName.value,
    email: profileEmail.value,
    password: user.password // keep existing password
  };

  try{
    const res = await fetch(`${API_URL}/users/${user.id}`, {
      method: 'PUT',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(updatedUser)
    });
    const data = await res.json();
    localStorage.setItem("user", JSON.stringify(data));
    alert("Profile updated successfully!");
  }catch(err){
    console.error(err);
    alert("Backend error, profile not updated.");
  }
});

// Dark mode toggle
const darkModeBtn = document.getElementById("darkModeBtn");
darkModeBtn.addEventListener("click", ()=>{
  document.body.classList.toggle("dark-mode");
  darkModeBtn.textContent = document.body.classList.contains("dark-mode") ? "☀️ Light Mode" : "🌙 Dark Mode";
});
