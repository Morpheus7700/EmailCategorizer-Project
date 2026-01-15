// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "scan_inbox") {
    const data = scanInbox();
    sendResponse(data);
  } else if (request.action === "open_email") {
    openEmail(request.index);
  }
});

function scanInbox() {
  // Gmail inbox rows usually have class 'zA'
  const rows = document.querySelectorAll('tr.zA');
  const results = [];

  rows.forEach((row, index) => {
    // 1. Assign a temporary ID so we can find it later to click
    row.setAttribute('data-ext-id', index);

    // 2. Extract Data
    // Subject is usually in a span with class 'bog'
    const subjectEl = row.querySelector('.bog');
    const subject = subjectEl ? subjectEl.innerText : "No Subject";

    // Snippet (body preview) is usually in a span with class 'y2' - strip the " - " prefix if present
    const snippetEl = row.querySelector('.y2');
    let snippet = snippetEl ? snippetEl.innerText : "";
    snippet = snippet.replace(/^ - /, ""); // Remove leading dash often found in Gmail snippets

    // Sender
    const senderEl = row.querySelector('.yW span'); // .yW is the sender column
    const sender = senderEl ? senderEl.innerText : "Unknown";

    // 3. Simple Classification (Reusing logic here or in popup - let's do it here for speed)
    const analysis = classifyText(subject, snippet);

    results.push({
      id: index,
      sender: sender,
      subject: subject,
      snippet: snippet,
      category: analysis.category,
      score: analysis.score,
      color: analysis.color
    });
  });

  return results;
}

function openEmail(index) {
  const row = document.querySelector(`tr.zA[data-ext-id="${index}"]`);
  if (row) {
    // Priority 1: The Subject Text (.bog) - this is usually the direct link
    // Priority 2: The Subject Wrapper (.xS)
    // Priority 3: The Row itself (fallback)
    const clickTarget = row.querySelector('.bog') || row.querySelector('.xS') || row;
    
    // Gmail often expects a full click sequence
    const events = ['mousedown', 'mouseup', 'click'];
    
    events.forEach(eventType => {
        const event = new MouseEvent(eventType, {
            bubbles: true,
            cancelable: true,
            view: window,
            buttons: 1 // Left mouse button
        });
        clickTarget.dispatchEvent(event);
    });
  }
}

function classifyText(subject, body) {
  const text = (subject + " " + body).toLowerCase();
  let score = 0;

  const urgentKeywords = ["urgent", "asap", "immediate", "deadline", "emergency", "alert", "overdue"];
  const importantKeywords = ["invoice", "meeting", "schedule", "contract", "offer", "payment", "required", "action"];

  urgentKeywords.forEach(word => {
      if (text.includes(word)) score += 3;
  });
          
  importantKeywords.forEach(word => {
      if (text.includes(word)) score += 2;
  });

  let category = "Routine";
  let color = "#4caf50"; // Green

  if (score >= 3) {
      category = "URGENT";
      color = "#f44336"; // Red
  } else if (score >= 1) {
      category = "Important";
      color = "#ff9800"; // Orange
  }

  return { category, color, score };
}