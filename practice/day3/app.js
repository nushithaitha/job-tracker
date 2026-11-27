// =====================================================
// STAGE 2: DATA (array of objects)
// =====================================================
let applications = [
  { id: 1, company: "Zoho", role: "Software Engineer", status: "applied", source: "Career page", appliedOn: "2026-11-20" },
  { id: 2, company: "Razorpay", role: "Backend Developer", status: "interview", source: "Referral", appliedOn: "2026-11-15" },
  { id: 3, company: "Swiggy", role: "SDE 1", status: "rejected", source: "LinkedIn", appliedOn: "2026-11-10" },
  { id: 4, company: "Freshworks", role: "Full Stack Developer", status: "offer", source: "Naukri", appliedOn: "2026-11-05" },
];

let currentFilter = "all";

// =====================================================
// FIND THE ELEMENTS ON THE PAGE
// =====================================================
const statsEl = document.querySelector("#stats");
const cardsEl = document.querySelector("#cards");
const filterButtons = document.querySelectorAll(".filter-btn");   // Stage 3
const form = document.querySelector("#app-form");                 // Stage 4
const messageEl = document.querySelector("#message");             // Stage 4
const loadBtn = document.querySelector("#load-btn");              // Stage 5

// =====================================================
// HELPERS
// =====================================================
const capitalize = (word) => word[0].toUpperCase() + word.slice(1);

const formatDate = (isoDate) =>
  new Date(isoDate).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

function showMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.className = isError ? "message error" : "message";
}

// =====================================================
// STAGE 2: STATS (reduce)
// =====================================================
function renderStats() {
  const counts = applications.reduce(
    (totals, app) => {
      totals[app.status] += 1;
      return totals;
    },
    { applied: 0, interview: 0, offer: 0, rejected: 0 }
  );

  statsEl.innerHTML = Object.entries(counts)
    .map(([status, count]) => `
      <div class="stat-card">
        <span class="stat-number">${count}</span>
        <span class="stat-label">${capitalize(status)}</span>
      </div>`)
    .join("");
}

// =====================================================
// STAGE 2: CARDS (filter + map)
// =====================================================
function renderCards() {
  const visible =
    currentFilter === "all"
      ? applications
      : applications.filter((app) => app.status === currentFilter);

  if (visible.length === 0) {
    cardsEl.innerHTML = `<p class="empty">No applications here yet.</p>`;
    return;
  }

  cardsEl.innerHTML = visible
    .map(({ company, role, status, source, appliedOn }) => `
      <article class="app-card">
        <div class="app-top">
          <h3>${company}</h3>
          <span class="badge ${status}">${capitalize(status)}</span>
        </div>
        <p class="role">${role}</p>
        <p class="meta">Applied on ${formatDate(appliedOn)} · Source: ${source}</p>
      </article>`)
    .join("");
}

function render() {
  renderStats();
  renderCards();
}

// =====================================================
// STAGE 3: FILTER BUTTONS (events)
// =====================================================
filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.status;                     // e.g. "interview"
    filterButtons.forEach((b) => b.classList.remove("active")); // un-highlight all
    button.classList.add("active");                             // highlight the clicked one
    renderCards();                                              // redraw only the cards
  });
});

// =====================================================
// STAGE 4: ADD APPLICATION FORM
// =====================================================
form.addEventListener("submit", (event) => {
  event.preventDefault();   // stop the browser from reloading the page

  const data = new FormData(form);   // reads every input by its name=""
  const newApp = {
    id: Date.now(),                                         // quick unique number
    company: data.get("company").trim(),                    // trim removes extra spaces
    role: data.get("role").trim(),
    status: data.get("status"),
    source: data.get("source").trim() || "Other",           // fallback if empty
    appliedOn: new Date().toLocaleDateString("en-CA"),      // today as YYYY-MM-DD
  };

  if (!newApp.company || !newApp.role) {
    showMessage("Company and role are required.", true);
    return;
  }

  applications = [newApp, ...applications];   // spread: new one goes first
  form.reset();                               // clear the inputs
  showMessage(`Added ${newApp.company} ✔`);
  render();                                   // redraw stats AND cards
});

// =====================================================
// STAGE 5: LOAD FROM YOUR BACKEND (async/await + fetch)
// =====================================================
async function loadFromServer() {
  showMessage("Loading from server…");
  try {
    const response = await fetch("http://localhost:5001/api/applications");

    if (!response.ok) {
      throw new Error(`Server replied with ${response.status}`);
    }

    const data = await response.json();
    applications = data;
    render();
    showMessage(`Loaded ${data.length} applications from the server ✔`);
  } catch (error) {
    showMessage(`Could not load: ${error.message}. Is the server running?`, true);
  }
}

loadBtn.addEventListener("click", loadFromServer);

// =====================================================
// FIRST DRAW WHEN THE PAGE OPENS
// =====================================================
render();