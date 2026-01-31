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

const aiList = document.getElementById("aiList");
const ctx = document.getElementById("aiChart").getContext("2d");

async function fetchAIInsights(){
  try{
    const [incRes, expRes, goalsRes, recRes] = await Promise.all([
      fetch(`${API_URL}/incomes?userId=${user.email}`),
      fetch(`${API_URL}/expenses?userId=${user.email}`),
      fetch(`${API_URL}/goals?userId=${user.email}`),
      fetch(`${API_URL}/recurring-payments?userId=${user.email}`)
    ]);
    const incomes = await incRes.json();
    const expenses = await expRes.json();
    const goals = await goalsRes.json();
    const recurring = await recRes.json();

    generateInsights(incomes, expenses, goals, recurring);
  }catch(err){
    console.error(err);
    const incomes = JSON.parse(localStorage.getItem("incomes")) || [];
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const goals = JSON.parse(localStorage.getItem("goals")) || [];
    const recurring = JSON.parse(localStorage.getItem("recurring")) || [];
    generateInsights(incomes, expenses, goals, recurring);
  }
}

function generateInsights(incomes, expenses, goals, recurring){
  aiList.innerHTML = "";

  const totalIncome = incomes.reduce((sum,i)=>sum+parseFloat(i.amount),0);
  const totalExpense = expenses.reduce((sum,e)=>sum+parseFloat(e.amount),0) 
                     + recurring.filter(r=>r.status==="Paid").reduce((sum,r)=>sum+parseFloat(r.amount),0);
  const totalSavings = totalIncome - totalExpense;

  // Suggestion 1
  if(totalSavings<0) aiList.innerHTML += "<li>Your expenses exceed income! Consider reducing spending.</li>";
  else aiList.innerHTML += `<li>You can save approximately ₹${totalSavings.toFixed(2)} this month.</li>`;

  // Goal suggestions
  goals.forEach(g=>{
    const remaining = g.targetAmount - g.currentAmount;
    aiList.innerHTML += `<li>To reach goal "${g.name}", you need to save ₹${remaining.toFixed(2)} more.</li>`;
  });

  // Chart
  new Chart(ctx,{
    type:'doughnut',
    data:{
      labels:['Income','Expense','Savings'],
      datasets:[{
        data:[totalIncome,totalExpense,totalSavings],
        backgroundColor:['#4ade80','#f87171','#60a5fa']
      }]
    },
    options:{ responsive:true, plugins:{ legend:{position:'bottom'}, title:{display:true,text:'Financial Overview'}} }
  });
}

// Initial fetch
fetchAIInsights();
