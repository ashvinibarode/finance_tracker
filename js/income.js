const user = JSON.parse(localStorage.getItem("user"));  
const API_URL = "http://localhost:8080/api";  
  
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
  
// Income elements  
const incomeForm = document.getElementById("incomeForm");  
const incomeList = document.getElementById("incomeList");  
  
// Fetch incomes from backend  
async function fetchIncomes(){  
  try{  
    const res = await fetch(`${API_URL}/incomes?userId=${user.email}`);  
    const incomes = await res.json();  
    displayIncomes(incomes);  
  }catch(err){  
    console.error(err);  
    let incomes = JSON.parse(localStorage.getItem("incomes")) || [];  
    displayIncomes(incomes);  
  }  
}  
  
// Display incomes  
function displayIncomes(incomes){  
  incomeList.innerHTML = "";  
  incomes.forEach((inc, idx)=>{  
    const li = document.createElement("li");  
    li.innerHTML = `${inc.date} - ${inc.description} : ₹${inc.amount} <button onclick="deleteIncome('${inc.id || idx}')">Delete</button>`;  
    incomeList.appendChild(li);  
  });  
}  
  
// Add income  
incomeForm.addEventListener("submit", async (e)=>{  
  e.preventDefault();  
  const income = {  
    description: document.getElementById("incomeDesc").value,  
    amount: parseFloat(document.getElementById("incomeAmount").value),  
    date: document.getElementById("incomeDate").value  
  };  
  
  try{  
    await fetch(`${API_URL}/incomes`, {  
      method:'POST',  
      headers:{'Content-Type':'application/json'},  
      body: JSON.stringify({...income, userId:user.email})  
    });  
  }catch(err){  
    let incomes = JSON.parse(localStorage.getItem("incomes")) || [];  
    incomes.push(income);  
    localStorage.setItem("incomes", JSON.stringify(incomes));  
  }  
  
  incomeForm.reset();  
  fetchIncomes();  
});  
  
window.deleteIncome = async (id)=>{  
  try{  
    await fetch(`${API_URL}/incomes/${id}`, { method:'DELETE' });  
  }catch(err){  
    let incomes = JSON.parse(localStorage.getItem("incomes")) || [];  
    incomes.splice(id,1);  
    localStorage.setItem("incomes", JSON.stringify(incomes));  
  }  
  fetchIncomes();  
};  
  
// Initial fetch  
fetchIncomes();  
  