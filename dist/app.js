"use strict";
const titleInput = document.getElementById("title");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const addBtn = document.getElementById("addBtn");
const expenseList = document.getElementById("expenseList");
const totalElement = document.getElementById("total");
const filterCategory = document.getElementById("filterCategory");
const searchInput = document.getElementById("searchInput");
let expenses = JSON.parse(localStorage.getItem("expenses") || "[]");
function saveToLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
}
function renderExpenses() {
    expenseList.innerHTML = "";
    const searchValue = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value;
    let filteredExpenses = expenses.filter((expense) => {
        const matchesSearch = expense.title.toLowerCase().includes(searchValue);
        const matchesCategory = selectedCategory === "All" || expense.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    let total = 0;
    if (filteredExpenses.length === 0) {
        expenseList.innerHTML = "<p>No expenses found</p>";
        totalElement.textContent = "0";
        return;
    }
    filteredExpenses.forEach((expense) => {
        total += expense.amount;
        const div = document.createElement("div");
        div.classList.add("expense-item");
        div.innerHTML = `
      <div>
        <h3>${expense.title}</h3>
        <p>₹${expense.amount} - ${expense.category}</p>
        <small>${expense.date}</small>
      </div>

      <button class="delete-btn" data-id="${expense.id}">
        Delete
      </button>
    `;
        expenseList.appendChild(div);
    });
    totalElement.textContent = total.toString();
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = Number(button.dataset.id);
            expenses = expenses.filter((expense) => expense.id !== id);
            saveToLocalStorage();
            renderExpenses();
        });
    });
}
addBtn.addEventListener("click", () => {
    const title = titleInput.value.trim();
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    if (!title || !amount) {
        alert("Please fill all fields");
        return;
    }
    const newExpense = {
        id: Date.now(),
        title,
        amount,
        category,
        date: new Date().toLocaleDateString(),
    };
    expenses.push(newExpense);
    saveToLocalStorage();
    renderExpenses();
    titleInput.value = "";
    amountInput.value = "";
    categoryInput.value = "";
});
filterCategory.addEventListener("change", renderExpenses);
searchInput.addEventListener("input", renderExpenses);
renderExpenses();
