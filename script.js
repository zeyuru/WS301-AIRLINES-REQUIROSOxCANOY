
const oneWayFlights = [
  { flightNo: "5J 560", from: "MNL", to: "CEB", departDate: "2025-10-21", time: "08:00 AM", hours: "1h 15m", price: 2499, seats: 20, fare: "Promo Fare", terminal: "Terminal 3" },
  { flightNo: "5J 561", from: "MNL", to: "DVO", departDate: "2025-10-22", time: "02:30 PM", hours: "2h 00m", price: 2999, seats: 25, fare: "Regular", terminal: "Terminal 2" },
  { flightNo: "5J 562", from: "CEB", to: "MNL", departDate: "2025-10-23", time: "09:00 AM", hours: "1h 20m", price: 2599, seats: 22, fare: "None", terminal: "Terminal 1" }
];

const roundTripFlights = [
  { flightNo: "5J 700", from: "MNL", to: "CEB", departTime: "07:00 AM", returnTime: "05:00 PM", departDate: "2025-10-21", returnDate: "2025-10-28", price: 4999, seats: 25, hours: "1h 20m", fare: "Regular", terminal: "Terminal 3" },
  { flightNo: "5J 701", from: "CEB", to: "DVO", departTime: "08:30 AM", returnTime: "06:30 PM", departDate: "2025-10-22", returnDate: "2025-10-29", price: 5599, seats: 18, hours: "1h 45m", fare: "Promo Fare", terminal: "Terminal 2" },
  { flightNo: "5J 702", from: "MNL", to: "ILO", departTime: "09:15 AM", returnTime: "04:30 PM", departDate: "2025-10-23", returnDate: "2025-10-30", price: 4799, seats: 20, hours: "1h 00m", fare: "Regular", terminal: "Terminal 1" }
];


const page = window.location.pathname.split("/").pop();

if (page === "booking.html") initBooking();
if (page === "select.html") initSelect();
if (page === "passenger.html") initPassenger();
if (page === "success.html") initSuccess();




function initBooking() {
  const flightType = document.getElementById("flightType");
  const returnDiv = document.getElementById("returnDiv");

  flightType.addEventListener("change", () => {
    returnDiv.style.display = (flightType.value === "oneway") ? "none" : "block";
  });

  document.getElementById("searchFlights").addEventListener("click", () => {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const type = document.getElementById("flightType").value;
    const depart = document.getElementById("departDate").value;
    const ret = document.getElementById("returnDate").value;
    const passengers = document.getElementById("passengers").value;

    if (!from || !to) return alert("Please select origin and destination.");
    if (from === to) return alert("Origin and destination cannot be the same.");
    if (!depart) return alert("Please select a departure date.");
    if (type === "round" && !ret) return alert("Please select a return date.");
    if (passengers < 1 || passengers > 9) return alert("Passengers must be between 1 and 9.");

    const flightData = { from, to, type, depart, ret, passengers };
    localStorage.setItem("flightData", JSON.stringify(flightData));
    window.location.href = "select.html";
  });
}


function initSelect() {
  const data = JSON.parse(localStorage.getItem("flightData"));
  const container = document.getElementById("flightsContainer");
  const title = document.getElementById("selectTitle");
  const proceedBtn = document.getElementById("proceedToPassenger");
  const backBtn = document.getElementById("backToBooking");

  if (!data) {
    window.location.href = "booking.html";
    return;
  }

  title.textContent = `${data.type === "round" ? "Round Trip" : "One Way"} Flights: ${data.from} → ${data.to}`;
  container.innerHTML = "";

  if (data.type === "oneway") {
    const available = oneWayFlights.filter(f => f.from === data.from && f.to === data.to && f.departDate === data.depart);

    if (available.length === 0) {
      container.innerHTML = `<div class="no-flights">No available flights on ${data.depart}.</div>`;
    } else {
      available.forEach(f => {
        const div = document.createElement("div");
        div.classList.add("flight-card");
        div.innerHTML = `
          <div class="left">${f.flightNo}<br>${f.from} → ${f.to}</div>
          <div class="details">
            <p><b>Departure:</b> ${f.departDate} | ${f.time}</p>
            <p><b>Duration:</b> ${f.hours}</p>
            <p><b>Terminal:</b> ${f.terminal}</p>
            <p><b>Seats:</b> ${f.seats}</p>
            <p><b>Fare Type:</b> ${f.fare}</p>
            <p><b>Price:</b> ₱${f.price.toLocaleString()}</p>
          </div>
          <div class="action">
            <button class="btn-primary selectBtn">Select Flight</button>
          </div>
        `;
        container.appendChild(div);

        div.querySelector(".selectBtn").addEventListener("click", () => {
          document.querySelectorAll(".flight-card").forEach(c => c.classList.remove("selected"));
          div.classList.add("selected");
          localStorage.setItem("selectedFlight", JSON.stringify(f));
          proceedBtn.disabled = false;
        });
      });
    }
  } else {
    const available = roundTripFlights.filter(f =>
      f.from === data.from && f.to === data.to &&
      f.departDate === data.depart && f.returnDate === data.ret
    );

    if (available.length === 0) {
      container.innerHTML = `<div class="no-flights">No available round trip flights for these dates.</div>`;
    } else {
      available.forEach(f => {
        const div = document.createElement("div");
        div.classList.add("flight-card");
        div.innerHTML = `
          <div class="left">${f.flightNo}<br>${f.from} → ${f.to}</div>
          <div class="details">
            <p><b>Departure:</b> ${f.departDate} (${f.departTime})</p>
            <p><b>Return:</b> ${f.returnDate} (${f.returnTime})</p>
            <p><b>Duration:</b> ${f.hours}</p>
            <p><b>Terminal:</b> ${f.terminal}</p>
            <p><b>Seats:</b> ${f.seats}</p>
            <p><b>Fare:</b> ${f.fare}</p>
            <p><b>Total Price:</b> ₱${f.price.toLocaleString()}</p>
          </div>
          <div class="action">
            <button class="btn-primary selectBtn">Select Flight</button>
          </div>
        `;
        container.appendChild(div);

        div.querySelector(".selectBtn").addEventListener("click", () => {
          document.querySelectorAll(".flight-card").forEach(c => c.classList.remove("selected"));
          div.classList.add("selected");
          localStorage.setItem("selectedFlight", JSON.stringify(f));
          proceedBtn.disabled = false;
        });
      });
    }
  }

  backBtn.addEventListener("click", () => {
    window.location.href = "booking.html";
  });

  proceedBtn.addEventListener("click", () => {
    if (!localStorage.getItem("selectedFlight")) {
      alert("Please select a flight first.");
      return;
    }
    window.location.href = "passenger.html";
  });
}


function initPassenger() {
  const flightData = JSON.parse(localStorage.getItem("flightData"));
  const passengerDiv = document.getElementById("passengerFormWrap");
  const submitBtn = document.getElementById("submitPassengers");
  const editBtn = document.getElementById("editFlights");

  if (!flightData) {
    alert("No booking details found. Returning to booking page.");
    window.location.href = "booking.html";
    return;
  }

  const passengerCount = parseInt(flightData.passengers) || 1;
  passengerDiv.innerHTML = "";

  for (let i = 1; i <= passengerCount; i++) {
    passengerDiv.innerHTML += `
      <div class="passenger-block">
        <h3>Passenger ${i}</h3>
        <label>Full Name:</label><input type="text" class="pname" required>
        <label>Passport No.:</label><input type="text" class="ppassport" required>
        <label>Nationality:</label><input type="text" class="pnationality" required>
        <label>Date of Birth:</label><input type="date" class="pdob" required>
        <label>Phone:</label><input type="text" class="pphone" required>
        <label>Email:</label><input type="email" class="pemail" required>
      </div>
    `;
  }

  editBtn.addEventListener("click", () => window.location.href = "select.html");

  submitBtn.addEventListener("click", () => {
    const names = document.querySelectorAll(".pname");
    const passports = document.querySelectorAll(".ppassport");
    const emails = document.querySelectorAll(".pemail");

    for (let i = 0; i < passengerCount; i++) {
      if (!names[i].value.trim() || !passports[i].value.trim() || !emails[i].value.trim()) {
        alert(`Please complete all fields for Passenger ${i + 1}.`);
        return;
      }
    }

    const passengers = [];
    for (let i = 0; i < passengerCount; i++) {
      passengers.push({
        name: names[i].value.trim(),
        passport: passports[i].value.trim(),
        nationality: document.querySelectorAll(".pnationality")[i].value.trim(),
        dob: document.querySelectorAll(".pdob")[i].value.trim(),
        phone: document.querySelectorAll(".pphone")[i].value.trim(),
        email: emails[i].value.trim()
      });
    }

    localStorage.setItem("passengerData", JSON.stringify(passengers));
    window.location.href = "success.html";
  });
}


function initSuccess() {
  const flight = JSON.parse(localStorage.getItem("selectedFlight"));
  const passengers = JSON.parse(localStorage.getItem("passengerData"));
  const content = document.getElementById("successContent");
  const bookBtn = document.getElementById("bookNow");

  if (!flight || !passengers) {
    alert("Missing booking data. Redirecting...");
    window.location.href = "booking.html";
    return;
  }

  
  let html = `
    <h3>Flight Summary</h3>
    <p><b>Flight:</b> ${flight.flightNo} — ${flight.from} → ${flight.to}</p>
    <p><b>Departure:</b> ${flight.departDate} (${flight.departTime || flight.time})</p>
  `;

  if (flight.returnDate) {
    html += `<p><b>Return:</b> ${flight.returnDate} (${flight.returnTime})</p>`;
  }

  html += `
    <hr><h3>Passengers (${passengers.length})</h3>
    <ul>${passengers.map(p => 
      `<li><b>${p.name}</b> — ${p.passport}, ${p.nationality}, ${p.dob}, ${p.email}</li>`
    ).join("")}</ul>
    <hr><p><b>Total Price:</b> ₱${(flight.price * passengers.length).toLocaleString()}</p>
  `;

  content.innerHTML = html;

  
  bookBtn.addEventListener("click", () => {
    alert("✅ Booking Successful! Thank you for flying with Cebu Pacific Airlines.");
    localStorage.clear();
    window.location.href = "home.html"; 
  });
}


