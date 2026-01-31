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

// Expense elements
const expenseForm = document.getElementById("expenseForm");
const expenseList = document.getElementById("expenseList");

// Fetch expenses from backend
async function fetchExpenses(){
  try{
    const res = await fetch(`${API_URL}/expenses?userId=${user.email}`);
    const expenses = await res.json();
    displayExpenses(expenses);
  }catch(err){
    console.error(err);
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    displayExpenses(expenses);
  }
}

// Display expenses
function displayExpenses(expenses){
  expenseList.innerHTML = "";
  expenses.forEach((exp, idx)=>{
    const li = document.createElement("li");
    li.innerHTML = `${exp.date} - ${exp.description} : ₹${exp.amount} <button onclick="deleteExpense('${exp.id || idx}')">Delete</button>`;
    expenseList.appendChild(li);
  });
}

// Add expense
expenseForm.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const expense = {
    description: document.getElementById("expenseDesc").value,
    amount: parseFloat(document.getElementById("expenseAmount").value),
    date: document.getElementById("expenseDate").value
  };

  try{
    await fetch(`${API_URL}/expenses`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({...expense, userId:user.email})
    });
  }catch(err){
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  expenseForm.reset();
  fetchExpenses();
});

window.deleteExpense = async (id)=>{
  try{
    await fetch(`${API_URL}/expenses/${id}`, { method:'DELETE' });
  }catch(err){
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.splice(id,1);
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }
  fetchExpenses();
};

// Initial fetch
fetchExpenses();
