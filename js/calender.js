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

const ctx = document.getElementById("calendarChart").getContext("2d");

// Fetch incomes & expenses
async function fetchFinancialData(){
  try{
    const [incRes, expRes] = await Promise.all([
      fetch(`${API_URL}/incomes?userId=${user.email}`),
      fetch(`${API_URL}/expenses?userId=${user.email}`)
    ]);
    const incomes = await incRes.json();
    const expenses = await expRes.json();
    generateChart(incomes, expenses);
  }catch(err){
    console.error(err);
    const incomes = JSON.parse(localStorage.getItem("incomes")) || [];
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    generateChart(incomes, expenses);
  }
}

function generateChart(incomes, expenses){
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const monthlyIncome = new Array(12).fill(0);
  const monthlyExpense = new Array(12).fill(0);

  incomes.forEach(i=>{
    const d = new Date(i.date);
    monthlyIncome[d.getMonth()] += parseFloat(i.amount);
  });
  expenses.forEach(e=>{
    const d = new Date(e.date);
    monthlyExpense[d.getMonth()] += parseFloat(e.amount);
  });

  new Chart(ctx,{
    type:'bar',
    data:{
      labels: monthNames,
      datasets:[
        {label:'Income', data:monthlyIncome, backgroundColor:'#4ade80'},
        {label:'Expense', data:monthlyExpense, backgroundColor:'#f87171'}
      ]
    },
    options:{ responsive:true, plugins:{ legend:{position:'bottom'}, title:{display:true,text:'Monthly Income vs Expense'}} }
  });
}

fetchFinancialData();
