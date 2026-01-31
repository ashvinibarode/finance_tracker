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

// Elements
const totalIncomeEl = document.getElementById("totalIncome");
const totalExpenseEl = document.getElementById("totalExpense");
const totalSavingsEl = document.getElementById("totalSavings");
const ctx = document.getElementById("financeChart").getContext("2d");

async function fetchFinance(){
  try{
    const [incRes, expRes, recRes] = await Promise.all([
      fetch(`${API_URL}/incomes?userId=${user.email}`),
      fetch(`${API_URL}/expenses?userId=${user.email}`),
      fetch(`${API_URL}/recurring-payments?userId=${user.email}`)
    ]);
    const incomes = await incRes.json();
    const expenses = await expRes.json();
    const recurring = await recRes.json();

    updateDashboard(incomes, expenses, recurring);
  }catch(err){
    console.error(err);
    const incomes = JSON.parse(localStorage.getItem("incomes")) || [];
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const recurring = JSON.parse(localStorage.getItem("recurring")) || [];
    updateDashboard(incomes, expenses, recurring);
  }
}

function updateDashboard(incomes, expenses, recurring){
  const totalIncome = incomes.reduce((sum,i)=>sum+parseFloat(i.amount),0);
  const totalExpense = expenses.reduce((sum,e)=>sum+parseFloat(e.amount),0) 
                     + recurring.filter(r=>r.status==="Paid").reduce((sum,r)=>sum+parseFloat(r.amount),0);
  const totalSavings = totalIncome - totalExpense;

  totalIncomeEl.textContent = totalIncome.toFixed(2);
  totalExpenseEl.textContent = totalExpense.toFixed(2);
  totalSavingsEl.textContent = totalSavings.toFixed(2);

  new Chart(ctx, {
    type:'bar',
    data:{
      labels:['Income','Expense','Savings'],
      datasets:[{
        label:'Amount',
        data:[totalIncome, totalExpense, totalSavings],
        backgroundColor:['#4ade80','#f87171','#60a5fa']
      }]
    },
    options:{ responsive:true, plugins:{ legend:{display:false}, title:{display:true,text:'Financial Overview'}}}
  });
}

// Initial fetch
fetchFinance();
