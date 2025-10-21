document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.querySelector(".open-chat-btn");
  const chatModal = document.getElementById("chat-modal");
  const closeBtn = document.getElementById("chat-close");
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  let awaitingGender = false, lastQ = "";

  function addMessage(msg, sender) {
    const d = document.createElement("div");
    d.className = `message ${sender}`;
    d.innerHTML = `<div class="message-content">${msg}</div>`;
    chatBox.appendChild(d);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  openBtn.addEventListener("click", () => chatModal.classList.toggle("open"));
  closeBtn.addEventListener("click", () => chatModal.classList.remove("open"));

  sendBtn.addEventListener("click", () => {
    const txt = userInput.value.trim();
    if (!txt) return;
    addMessage(txt, "user");
    userInput.value = "";
    const payload = awaitingGender
      ? { question: lastQ, gender: txt }
      : { question: txt };
    if (!awaitingGender) lastQ = txt;

    fetch("/ask", {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(payload)
    })
    .then(r => r.json())
    .then(data => {
      if (data.ask_gender) {
        addMessage(data.response, "bot");
        awaitingGender = true;
      } else {
        addMessage(data.response, "bot");
        awaitingGender = false;
      }
    })
    .catch(() => addMessage("Fehler bei der Anfrage.","bot"));
  });

  userInput.addEventListener("keydown", e => {
    if (e.key === "Enter") sendBtn.click();
  });

  // Initialgruß
  addMessage("Hallo! Wie kann ich helfen?", "bot");
});
