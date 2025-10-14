// === Cebu Pacific Airlines Booking System ===

// Sample flight schedules (arrays)
const departFlights = [
  { flightNo: "5J 560", from: "MNL", to: "CEB", time: "08:00", duration: "1h 15m", price: 2499, seats: 20, fare: "Promo Fare", terminal: "3" },
  { flightNo: "5J 561", from: "MNL", to: "DVO", time: "11:30", duration: "2h 00m", price: 2999, seats: 18, fare: "Regular", terminal: "2" },
  { flightNo: "5J 562", from: "MNL", to: "CEB", time: "15:45", duration: "1h 20m", price: 2699, seats: 25, fare: "None", terminal: "3" }
];

const returnFlights = [
  { flightNo: "5J 563", from: "CEB", to: "MNL", time: "10:15", duration: "1h 10m", price: 2599, seats: 15, fare: "Promo Fare", terminal: "2" },
  { flightNo: "5J 564", from: "DVO", to: "MNL", time: "13:30", duration: "2h 05m", price: 2899, seats: 19, fare: "Regular", terminal: "1" },
  { flightNo: "5J 565", from: "CEB", to: "MNL", time: "18:00", duration: "1h 15m", price: 2799, seats: 21, fare: "None", terminal: "3" }
];

// === ELEMENTS ===
const flightType = document.getElementById("flightType");
const returnGroup = document.getElementById("returnGroup");
const searchBtn = document.getElementById("searchFlights");
const flightsSection = document.getElementById("flights-section");
const flightsContainer = document.getElementById("flightsContainer");
const toPassengerBtn = document.getElementById("toPassenger");
const passengerSection = document.getElementById("passenger-section");
const passengerForm = document.getElementById("passengerForm");
const summarySection = document.getElementById("summary-section");
const summaryDetails = document.getElementById("summaryDetails");
const bookNowBtn = document.getElementById("bookNow");
const successMsg = document.getElementById("successMsg");

// === EVENT: show/hide return date ===
flightType.addEventListener("change", () => {
  if (flightType.value === "oneway") returnGroup.style.display = "none";
  else returnGroup.style.display = "block";
});

// === SEARCH FLIGHTS ===
searchBtn.addEventListener("click", () => {
  const type = flightType.value;
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const departDate = document.getElementById("departDate").value;
  const returnDate = document.getElementById("returnDate").value;
  const passengerCount = parseInt(document.getElementById("passengerCount").value);

  // do-while validation for passengers
  let valid = false;
  do {
    if (isNaN(passengerCount) || passengerCount < 1 || passengerCount > 9) {
      alert("Please enter a valid number of passengers (1-9).");
      break;
    } else valid = true;
  } while (!valid);

  if (!valid) return;

  flightsSection.classList.remove("hidden");
  flightsContainer.innerHTML = "";

  // while loop to render flights
  let i = 0;
  while (i < departFlights.length) {
    const f = departFlights[i];
    const card = document.createElement("div");
    card.classList.add("flight-card");
    card.innerHTML = `
      <h4>${f.flightNo} - ${f.from} → ${f.to}</h4>
      <p>Time: ${f.time} | Duration: ${f.duration}</p>
      <p>Price: ₱${f.price}</p>
      <p>Fare: ${f.fare}</p>
      <button class='btn-primary selectFlight'>Select</button>
    `;
    flightsContainer.appendChild(card);
    i++;
  }

  // if round trip → add return flights
  if (type === "round") {
    for (let j = 0; j < returnFlights.length; j++) {
      const r = returnFlights[j];
      const card = document.createElement("div");
      card.classList.add("flight-card");
      card.innerHTML = `
        <h4>${r.flightNo} - ${r.from} → ${r.to}</h4>
        <p>Time: ${r.time} | Duration: ${r.duration}</p>
        <p>Price: ₱${r.price}</p>
        <p>Fare: ${r.fare}</p>
        <button class='btn-primary selectFlight'>Select</button>
      `;
      flightsContainer.appendChild(card);
    }
  }

  document.querySelectorAll(".selectFlight").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".flight-card").forEach(c => c.classList.remove("selected"));
      btn.parentElement.classList.add("selected");
      toPassengerBtn.classList.remove("hidden");
    });
  });
});

// === NEXT TO PASSENGER INFO ===
toPassengerBtn.addEventListener("click", () => {
  passengerSection.classList.remove("hidden");
  passengerForm.innerHTML = "";

  let count = parseInt(document.getElementById("passengerCount").value);
  for (let i = 1; i <= count; i++) {
    passengerForm.innerHTML += `
      <div class='passenger'>
        <h4>Passenger ${i}</h4>
        <label>Full Name</label><input type='text' class='pname' required>
        <label>Age</label><input type='number' class='page' min='1' required>
      </div><hr>
    `;
  }
});

// === SUBMIT PASSENGER INFO ===
document.getElementById("submitPassenger").addEventListener("click", (e) => {
  e.preventDefault();

  const names = [...document.querySelectorAll(".pname")].map(x => x.value);
  const ages = [...document.querySelectorAll(".page")].map(x => x.value);

  // simple validation
  if (names.includes("") || ages.includes("")) {
    alert("Please fill out all passenger fields!");
    return;
  }

  summarySection.classList.remove("hidden");
  summaryDetails.innerHTML = `
    <h3>Passengers (${names.length})</h3>
    <ul>${names.map((n,i)=>`<li>${n} - ${ages[i]} yrs old</li>`).join("")}</ul>
    <p><b>Flight Selected:</b> ${
      document.querySelector(".flight-card.selected h4")?.textContent || "None"
    }</p>
    <p><b>Total Fare:</b> ₱${(names.length * 2499).toLocaleString()}</p>
  `;
});

// === BOOK NOW ===
bookNowBtn.addEventListener("click", () => {
  successMsg.classList.remove("hidden");
});
