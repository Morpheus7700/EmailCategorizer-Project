document.addEventListener('DOMContentLoaded', scanNow);
document.getElementById('refreshBtn').addEventListener('click', scanNow);

async function scanNow() {
  const container = document.getElementById('listContainer');
  container.innerHTML = '<div class="loader">Scanning Inbox...</div>';

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Check if we are on Gmail
    if (!tab.url.includes("mail.google.com")) {
      container.innerHTML = '<div class="empty-state">Please open Gmail to use this tool.</div>';
      return;
    }

    chrome.tabs.sendMessage(tab.id, { action: "scan_inbox" }, (response) => {
      if (chrome.runtime.lastError) {
        container.innerHTML = '<div class="empty-state">Please refresh your Gmail tab first.</div>';
        return;
      }
      
      if (!response || response.length === 0) {
        container.innerHTML = '<div class="empty-state">No emails found in this view.</div>';
        return;
      }

      renderEmails(response);
    });
  } catch (e) {
    container.innerHTML = '<div class="empty-state">Error connecting to browser.</div>';
  }
}

function renderEmails(emails) {
  const container = document.getElementById('listContainer');
  container.innerHTML = '';

  // Sort: Urgent (Score Desc) -> Important -> Routine
  emails.sort((a, b) => b.score - a.score);

  // Groups
  const groups = {
    "URGENT": [],
    "Important": [],
    "Routine": []
  };

  emails.forEach(email => {
    if (groups[email.category]) {
      groups[email.category].push(email);
    } else {
      groups["Routine"].push(email);
    }
  });

  // Render Groups
  ['URGENT', 'Important', 'Routine'].forEach(category => {
    const items = groups[category];
    if (items.length > 0) {
      const title = document.createElement('div');
      title.className = 'section-title';
      title.innerText = category;
      title.style.color = items[0].color; // Use the color of the category
      container.appendChild(title);

      items.forEach(email => {
        const card = document.createElement('div');
        card.className = 'email-card';
        card.style.borderLeftColor = email.color;
        
        card.innerHTML = `
          <div class="email-sender">${escapeHtml(email.sender)}</div>
          <div class="email-subject">${escapeHtml(email.subject)}</div>
          <div class="email-snippet">${escapeHtml(email.snippet)}</div>
        `;
        
        card.addEventListener('click', () => {
           openEmailInTab(email.id);
        });

        container.appendChild(card);
      });
    }
  });
}

function openEmailInTab(id) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "open_email", index: id }, () => {
       // Wait a tiny bit just in case, then close
       setTimeout(() => window.close(), 100);
    });
  });
}

function escapeHtml(text) {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
