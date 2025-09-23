// Prompt for admin password
const pass = prompt("Enter Admin Password:");

if (pass !== "admin123") {
  alert("Access Denied!");
  window.location.href = "index.html";
} else {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let lastDeleted = null; // Store last deleted order
  const tbody = document.querySelector("#adminOrders tbody");
  const undoBtn = document.getElementById("undoBtn");

  function renderOrders() {
    if (orders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;">No Orders Yet</td></tr>`;
      return;
    }
    tbody.innerHTML = "";
    orders.forEach((order, i) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${i + 1}</td>
        <td>${order.product}</td>
        <td>₹${order.price}</td>
        <td>${order.customer}</td>
        <td>${order.address}</td>
        <td>📞 ${order.phone}</td>
        <td>${order.status}</td>
        <td>${order.date}</td>
        <td>
          <button class="status-btn" onclick="changeStatus(${i})">Toggle Status</button>
          <button class="delete-btn" onclick="deleteOrder(${i})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  }

  // Change payment status
  window.changeStatus = function(index) {
    orders[index].status = orders[index].status === "Cash on Delivery" ? "Paid" : "Cash on Delivery";
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
  };

  // Delete an order
  window.deleteOrder = function(index) {
    lastDeleted = orders.splice(index, 1)[0]; // Remove and store last deleted
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
  };

  // Undo last delete
  undoBtn.addEventListener("click", () => {
    if (lastDeleted) {
      orders.push(lastDeleted);
      localStorage.setItem("orders", JSON.stringify(orders));
      lastDeleted = null;
      renderOrders();
    } else {
      alert("No order to undo!");
    }
  });

  renderOrders();
}
