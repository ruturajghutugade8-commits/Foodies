// ----------------------------
// Capture URL Params for Payment Page
// ----------------------------
if (window.location.pathname.includes("payment.html")) {
  const params = new URLSearchParams(window.location.search);
  const product = params.get("product") || "Unknown Product";
  const price = params.get("price") || "0";

  const productName = document.getElementById("productName");
  const productPrice = document.getElementById("productPrice");

  if (productName) productName.textContent = "Order: " + product;
  if (productPrice) productPrice.textContent = "Price: ₹" + parseFloat(price).toFixed(2);
}

// ----------------------------
// Payment Function (Cash on Delivery)
// ----------------------------
function makePayment(event) {
  event.preventDefault();

  const params = new URLSearchParams(window.location.search);
  const product = params.get("product") || "Unknown Product";
  const price = params.get("price") || "0";

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  orders.push({
    product,
    price: parseFloat(price).toFixed(2),
    status: "Cash on Delivery",
    date: new Date().toLocaleString()
  });

  localStorage.setItem("orders", JSON.stringify(orders));
  localStorage.setItem("paymentDone", "true");

  // Redirect to confirmation page
  window.location.href = "confirm.html";
}

// ----------------------------
// Show Payment Success Msg on Home (index.html)
// ----------------------------
if (window.location.pathname.includes("index.html")) {
  const msgBox = document.getElementById("paymentMsg");
  if (localStorage.getItem("paymentDone") === "true") {
    if (msgBox) msgBox.classList.remove("hidden");
    localStorage.removeItem("paymentDone");
  }
}

// ----------------------------
// Admin Panel Protection
// ----------------------------
// --- PAYMENT PAGE ---
if (window.location.pathname.includes("payment.html")) {
  // Function to handle payment form submission
  function makePayment(event) {
    event.preventDefault();

    // Get product info
    const productName = document.getElementById("productName").textContent;
    const productPrice = document.getElementById("productPrice").textContent;

    // Get form values (fullName, address, phone)
    const form = event.target;
    const fullName = form[0].value;
    const street = form[1].value;
    const city = form[2].value;
    const state = form[3].value;
    const pin = form[4].value;
    const phone = form[5].value;

    // Create order object
    const order = {
      product: productName,
      price: productPrice.replace("₹", ""),
      customer: fullName,
      address: `${street}, ${city}, ${state}, ${pin}`,
      phone: phone,
      status: "Pending",
      date: new Date().toLocaleString()
    };

    // Store order in localStorage
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));

    alert("Order Placed Successfully!");
    form.reset();
    window.location.href = "confirm.html"; // redirect to home
  }

  // Attach function to window so form can access
  window.makePayment = makePayment;
}


// --- ADMIN PAGE ---
if (window.location.pathname.includes("admin.html")) {
  const pass = prompt("Enter Admin Password:");

  if (pass !== "admin123") {
    alert("Access Denied!");
    window.location.href = "index.html";
  } else {
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const list = document.getElementById("adminOrders");

    if (list) {
      if (orders.length === 0) {
        list.innerHTML = "<li>No Orders Yet</li>";
      } else {
        list.innerHTML = ""; // Clear before appending
        orders.forEach((o, i) => {
          const li = document.createElement("li");
          li.textContent = `${i + 1}) ${o.product} - ₹${o.price} - ${o.status} - ${o.customer} (${o.date}) - ${o.address} - 📞 ${o.phone}`;
          list.appendChild(li);
        });
      }
    }
  }
}
