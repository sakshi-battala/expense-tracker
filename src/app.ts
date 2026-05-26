interface Expense {
  id: number;
  title: string;
  amount: number;
  category: string;
  date: string;
}

const titleInput = document.getElementById("title") as HTMLInputElement;
const amountInput = document.getElementById("amount") as HTMLInputElement;
const categoryInput = document.getElementById("category") as HTMLSelectElement;
const addBtn = document.getElementById("addBtn") as HTMLButtonElement;

const expenseList = document.getElementById("expenseList") as HTMLDivElement;
const totalElement = document.getElementById("total") as HTMLSpanElement;

const filterCategory = document.getElementById(
  "filterCategory",
) as HTMLSelectElement;

const searchInput = document.getElementById("searchInput") as HTMLInputElement;

let expenses: Expense[] = JSON.parse(localStorage.getItem("expenses") || "[]");

function saveToLocalStorage(): void {
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

function renderExpenses(): void {
  expenseList.innerHTML = "";

  const searchValue = searchInput.value.toLowerCase();
  const selectedCategory = filterCategory.value;

  let filteredExpenses = expenses.filter((expense) => {
    const matchesSearch = expense.title.toLowerCase().includes(searchValue);

    const matchesCategory =
      selectedCategory === "All" || expense.category === selectedCategory;

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
      const id = Number((button as HTMLButtonElement).dataset.id);

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

  const newExpense: Expense = {
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
  categoryInput.value = ""
});

filterCategory.addEventListener("change", renderExpenses);

searchInput.addEventListener("input", renderExpenses);

renderExpenses();
