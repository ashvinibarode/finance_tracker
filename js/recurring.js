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
const form = document.getElementById("recurringForm");
const list = document.getElementById("recurringList");

// Fetch recurring payments
async function fetchRecurring(){
  try{
    const res = await fetch(`${API_URL}/recurring-payments?userId=${user.email}`);
    const payments = await res.json();
    displayPayments(payments);
  }catch(err){
    console.error(err);
    let payments = JSON.parse(localStorage.getItem("recurring")) || [];
    displayPayments(payments);
  }
}

// Display payments with Pay Now button
function displayPayments(payments){
  list.innerHTML = "";
  payments.forEach((p, idx)=>{
    const li = document.createElement("li");
    li.innerHTML = `
      ${p.date} - ${p.description} : ₹${p.amount} 
      [${p.status || "Pending"}]
      <button onclick="payNow('${p.id || idx}')">Pay Now</button>
      <button onclick="deletePayment('${p.id || idx}')">Delete</button>
    `;
    list.appendChild(li);
  });
}

// Add payment
form.addEventListener("submit", async (e)=>{
  e.preventDefault();
  const payment = {
    description: document.getElementById("recurringType").value,
    amount: parseFloat(document.getElementById("recurringAmount").value),
    date: document.getElementById("recurringDate").value,
    status: "Pending"
  };

  try{
    await fetch(`${API_URL}/recurring-payments`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({...payment,userId:user.email})
    });
  }catch(err){
    let payments = JSON.parse(localStorage.getItem("recurring")) || [];
    payments.push(payment);
    localStorage.setItem("recurring",JSON.stringify(payments));
  }

  form.reset();
  fetchRecurring();
});

// Pay Now button click
async function payNow(id){
  try{
    const res = await fetch(`${API_URL}/recurring-payments/initiate`, {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({userId:user.email, paymentId:id})
    });
    const data = await res.json();
    // open payment link in new tab
    window.open(data.paymentLink, "_blank");
  }catch(err){
    alert("Payment initiation failed. This is a demo.");
  }
}

// Delete
window.deletePayment = async (id)=>{
  try{
    await fetch(`${API_URL}/recurring-payments/${id}`, { method:'DELETE' });
  }catch(err){
    let payments = JSON.parse(localStorage.getItem("recurring")) || [];
    payments.splice(id,1);
    localStorage.setItem("recurring",JSON.stringify(payments));
  }
  fetchRecurring();
};

// Initial fetch
fetchRecurring();
