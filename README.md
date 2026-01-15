# Gmail Urgency Classifier 📧🚀

A **Serverless Chrome Extension** that automatically scans your Gmail inbox, categorizes emails based on urgency and importance, and provides a quick-access dashboard.

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![Version](https://img.shields.io/badge/Version-1.1-blue)

## 🌟 Features

*   **Automatic Categorization:** Instantly analyzes email subjects and snippets using local logic.
*   **Urgency Levels:**
    *   🔴 **URGENT**: Needs immediate attention (e.g., "Deadline", "Emergency").
    *   🟠 **Important**: High value items (e.g., "Invoice", "Meeting", "Offer").
    *   🟢 **Routine**: Standard correspondence.
*   **Privacy First:** **No data leaves your browser.** All processing happens locally within the extension.
*   **Quick Navigation:** Click any email in the extension popup to instantly open it in Gmail.
*   **Visual Dashboard:** Clean, color-coded interface to triage your inbox in seconds.

## 🛠️ Installation

1.  **Clone or Download** this repository to your local machine.
    ```bash
    git clone https://github.com/your-username/GmailCategorizer.git
    ```
2.  Open **Google Chrome** and navigate to `chrome://extensions/`.
3.  Toggle **Developer mode** in the top right corner.
4.  Click **Load unpacked** (top left).
5.  Select the `extension` folder from this project (`.../GmailCategorizer/extension`).
6.  The **Gmail Urgency Classifier** is now installed! 🎉

## 📖 Usage

1.  Open [Gmail](https://mail.google.com/).
2.  Click the **Puzzle Piece** icon in Chrome's toolbar and pin the extension.
3.  Click the extension icon while viewing your inbox.
4.  The popup will automatically scan the visible emails and display them grouped by urgency.
5.  **Click on any email card** in the popup to open that specific email directly in Gmail.

## 📂 Project Structure

```text
GmailCategorizer/
│
├── extension/          # Source code for the Chrome Extension
│   ├── manifest.json   # Extension configuration & permissions
│   ├── popup.html      # UI for the extension popup
│   ├── popup.js        # Logic for the popup (UI rendering, messaging)
│   └── content.js      # Script injected into Gmail (scrapes data, simulates clicks)
│
└── README.md           # Project documentation
```

## 🧠 How It Works

1.  **Content Script (`content.js`):** Injected into `mail.google.com`. It reads the DOM to find email rows, extracts the subject and snippet, and listens for navigation commands.
2.  **Popup (`popup.js`):** Receives the scraped data, applies a keyword-based heuristic algorithm to score urgency, and renders the results.
3.  **Communication:** Uses `chrome.runtime` and `chrome.tabs` messaging to coordinate between the UI and the Gmail tab.

## 🤝 Contributing

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
