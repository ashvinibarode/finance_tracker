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
const form = document.getElementById("goalForm");
const list = document.getElementById("goalList");

// Fetch goals
async function fetchGoals(){
  try{
    const res = await fetch(`${API_URL}/goals?userId=${user.email}`);
    const goals = await res.json();
    displayGoals(goals);
  }catch(err){
    console.error(err);
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    displayGoals(goals);
  }
}

// Display
function displayGoals(goals){
  list.innerHTML = "";
  goals.forEach((g, idx)=>{
    const saved = parseFloat(g.currentAmount);
    const target = parseFloat(g.targetAmount);
    const percent = Math.min(((saved/target)*100),100);

    let color = '#4ade80'; // green
    if(percent>=50 && percent<80) color='#facc15'; // yellow
    else if(percent>=80 && percent<100) color='#3b82f6'; // blue
    else if(percent>=100) color='#f59e0b'; // gold

    const li = document.createElement("li");
    li.innerHTML = `
      <span>${g.name} - ₹${saved} / ₹${target} (${percent.toFixed(1)}%)</span>
      <div class="progress-container" title="₹${saved} saved">
        <div class="progress-bar" style="width:${percent}%; background:${color}"></div>
      </div>
      <button onclick="deleteGoal('${g.id || idx}')">Delete</button>
    `;
    list.appendChild(li);
  });
}

// Add goal
form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const goal = {
    name: document.getElementById("goalName").value,
    targetAmount: parseFloat(document.getElementById("goalAmount").value),
    currentAmount: parseFloat(document.getElementById("currentAmount").value)
  };

  try{
    await fetch(`${API_URL}/goals`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({...goal, userId:user.email})
    });
  }catch(err){
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    goals.push(goal);
    localStorage.setItem("goals",JSON.stringify(goals));
  }

  form.reset();
  fetchGoals();
});

// Delete
window.deleteGoal = async (id)=>{
  try{
    await fetch(`${API_URL}/goals/${id}`, { method:'DELETE' });
  }catch(err){
    let goals = JSON.parse(localStorage.getItem("goals")) || [];
    goals.splice(id,1);
    localStorage.setItem("goals",JSON.stringify(goals));
  }
  fetchGoals();
};

// Initial fetch
fetchGoals();
