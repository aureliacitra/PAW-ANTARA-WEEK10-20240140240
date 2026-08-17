const chatScroll = document.getElementById("chat-scroll");
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const typingIndicator = document.getElementById("typing-indicator");
const bubbleTemplate = document.getElementById("bubble-template");
const saveHistoryToggle = document.getElementById("save-history-toggle");

const STORAGE_KEY = "cs-bot-save-history";

// state consent disimpan di localStorage biar keingetan tiap buka halaman lagi
let saveHistoryEnabled = localStorage.getItem(STORAGE_KEY) === "true";
saveHistoryToggle.checked = saveHistoryEnabled;

function addBubble(role, content) {
  const node = bubbleTemplate.content.cloneNode(true);
  const wrapper = node.querySelector(".flex");
  const bubble = node.querySelector(".bubble");

  bubble.textContent = content;

  if (role === "user") {
    wrapper.classList.add("justify-end");
    bubble.classList.add("bubble-user");
  } else {
    wrapper.classList.add("justify-start");
    bubble.classList.add("bubble-bot");
  }

  chatScroll.appendChild(node);
  chatScroll.scrollTop = chatScroll.scrollHeight;
}

function clearWelcomeNote() {
  const note = chatScroll.querySelector(".bubble-system");
  if (note) note.remove();
}

async function loadHistory() {
  if (!saveHistoryEnabled) return;

  try {
    const res = await fetch("/api/chat/history", { credentials: "include" });
    const data = await res.json();

    if (data.success && data.data && data.data.length > 0) {
      clearWelcomeNote();
      data.data.forEach((msg) => addBubble(msg.role, msg.content));
    }
  } catch (err) {
    console.error("Gagal load riwayat:", err);
  }
}

async function saveToHistory(role, content) {
  if (!saveHistoryEnabled) return;

  try {
    await fetch("/api/chat/history", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ role, content, save_history: true }),
    });
  } catch (err) {
    console.error("Gagal simpan riwayat:", err);
  }
}

saveHistoryToggle.addEventListener("change", () => {
  saveHistoryEnabled = saveHistoryToggle.checked;
  localStorage.setItem(STORAGE_KEY, saveHistoryEnabled);

  if (saveHistoryEnabled) {
    loadHistory();
  }
});

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = chatInput.value.trim();
  if (!message) return;

  clearWelcomeNote();
  addBubble("user", message);
  saveToHistory("user", message);

  chatInput.value = "";
  chatInput.disabled = true;
  sendBtn.disabled = true;
  typingIndicator.classList.remove("hidden");
  chatScroll.scrollTop = chatScroll.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ message }),
    });
    const data = await res.json();

    typingIndicator.classList.add("hidden");

    if (data.success) {
      addBubble("assistant", data.data.reply);
      saveToHistory("assistant", data.data.reply);
    } else {
      addBubble("assistant", data.message || "Maaf, ada gangguan di server.");
    }
  } catch (err) {
    typingIndicator.classList.add("hidden");
    addBubble("assistant", "Gagal terhubung ke server, coba lagi ya.");
  } finally {
    chatInput.disabled = false;
    sendBtn.disabled = false;
    chatInput.focus();
  }
});

loadHistory();
