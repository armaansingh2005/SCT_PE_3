/* ==========================================
   PromptFlow AI Studio
   script.js - Part 1
   Core Setup + Theme + Analytics
========================================== */

/* ==========================================
   DOM Elements
========================================== */

const themeToggle =
    document.getElementById("themeToggle");

const userInput =
    document.getElementById("userInput");

const outputBox =
    document.getElementById("outputBox");

const modeSelect =
    document.getElementById("modeSelect");

const generateBtn =
    document.getElementById("generateBtn");

const clearBtn =
    document.getElementById("clearBtn");

const copyBtn =
    document.getElementById("copyBtn");

const downloadJsonBtn =
    document.getElementById("downloadJsonBtn");

const downloadTxtBtn =
    document.getElementById("downloadTxtBtn");

const progressFill =
    document.getElementById("progressFill");

const processingStatus =
    document.getElementById("processingStatus");

const historyContainer =
    document.getElementById("historyContainer");

const generateReportBtn =
    document.getElementById("generateReportBtn");

const promptCountEl =
    document.getElementById("promptCount");

const jsonCountEl =
    document.getElementById("jsonCount");

const summaryCountEl =
    document.getElementById("summaryCount");

const transformCountEl =
    document.getElementById("transformCount");

/* ==========================================
   Analytics State
========================================== */

let analytics = {

    promptsProcessed: 0,

    jsonGenerated: 0,

    summariesCreated: 0,

    transformations: 0
};

/* ==========================================
   Theme Handling
========================================== */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem("pf_theme");

    if (savedTheme === "light") {

        document.body.classList.add("light");

        themeToggle.textContent = "☀️";

    } else {

        themeToggle.textContent = "🌙";
    }
}

themeToggle.addEventListener(
    "click",
    toggleTheme
);

function toggleTheme() {

    document.body.classList.toggle(
        "light"
    );

    const isLight =
        document.body.classList.contains(
            "light"
        );

    localStorage.setItem(
        "pf_theme",
        isLight ? "light" : "dark"
    );

    themeToggle.textContent =
        isLight ? "☀️" : "🌙";
}

/* ==========================================
   Analytics Storage
========================================== */

function loadAnalytics() {

    const saved =
        localStorage.getItem(
            "pf_analytics"
        );

    if (saved) {

        analytics =
            JSON.parse(saved);
    }

    updateAnalyticsUI();
}

function saveAnalytics() {

    localStorage.setItem(
        "pf_analytics",
        JSON.stringify(analytics)
    );
}

function updateAnalyticsUI() {

    promptCountEl.textContent =
        analytics.promptsProcessed;

    jsonCountEl.textContent =
        analytics.jsonGenerated;

    summaryCountEl.textContent =
        analytics.summariesCreated;

    transformCountEl.textContent =
        analytics.transformations;
}

/* ==========================================
   Utility Functions
========================================== */

function showStatus(
    message,
    progress
) {

    processingStatus.textContent =
        message;

    progressFill.style.width =
        progress + "%";
}

function sleep(ms) {

    return new Promise(
        resolve =>
            setTimeout(resolve, ms)
    );
}

/* ==========================================
   Typing Animation
========================================== */

async function typeWriter(
    text
) {

    outputBox.textContent = "";

    let index = 0;

    while (index < text.length) {

        outputBox.textContent +=
            text.charAt(index);

        index++;

        await sleep(8);
    }
}

/* ==========================================
   Category Detection
========================================== */

function detectCategory(
    text
) {

    const lower =
        text.toLowerCase();

    if (
        lower.includes("meeting")
    ) {
        return "Meeting";
    }

    if (
        lower.includes("project")
    ) {
        return "Project";
    }

    if (
        lower.includes("research")
    ) {
        return "Research";
    }

    if (
        lower.includes("task")
    ) {
        return "Task";
    }

    if (
        lower.includes("bug")
    ) {
        return "Bug Report";
    }

    return "General";
}

/* ==========================================
   Priority Detection
========================================== */

function detectPriority(
    text
) {

    const lower =
        text.toLowerCase();

    if (
        lower.includes("urgent") ||
        lower.includes("critical") ||
        lower.includes("asap") ||
        lower.includes("high priority")
    ) {
        return "High";
    }

    if (
        lower.includes("medium")
    ) {
        return "Medium";
    }

    return "Normal";
}

/* ==========================================
   Input Cleaning
========================================== */

function getCleanLines(
    text
) {

    return text
        .split("\n")
        .map(line => line.trim())
        .filter(
            line => line !== ""
        );
}

/* ==========================================
   PromptFlow AI Studio
   script.js - Part 2
   Processing Engines + Generation Logic
========================================== */

/* ==========================================
   JSON Extraction Engine
========================================== */

function generateJSON(text) {

    const lines =
        getCleanLines(text);

    const result = {

        title: lines[0] || "Extracted Data",

        category:
            detectCategory(text),

        priority:
            detectPriority(text),

        items: lines.slice(1)
    };

    return JSON.stringify(
        result,
        null,
        4
    );
}

/* ==========================================
   Smart Summarizer
========================================== */

function generateSummary(text) {

    const lines =
        getCleanLines(text);

    const summaryLines =
        lines.slice(0, 5);

    let summary =
        "Summary\n\n";

    summaryLines.forEach(
        line => {

            summary +=
                "• " + line + "\n";
        }
    );

    if (
        lines.length > 5
    ) {

        summary +=
            "\nAdditional Notes: " +
            (lines.length - 5);
    }

    return summary;
}

/* ==========================================
   Format Transformer
========================================== */

function generateTransformation(
    text
) {

    const lines =
        getCleanLines(text);

    const transformed = {};

    lines.forEach(line => {

        const parts =
            line.split(":");

        if (
            parts.length >= 2
        ) {

            const key =
                parts[0]
                .trim()
                .toLowerCase()
                .replaceAll(
                    " ",
                    "_"
                );

            const value =
                parts
                .slice(1)
                .join(":")
                .trim();

            if (
                value.includes(",")
            ) {

                transformed[key] =
                    value
                    .split(",")
                    .map(item =>
                        item.trim()
                    );

            } else {

                transformed[key] =
                    value;
            }
        }
    });

    return JSON.stringify(
        transformed,
        null,
        4
    );
}

/* ==========================================
   Confidence Score
========================================== */

function calculateConfidence(
    text
) {

    let score = 70;

    const length =
        text.length;

    if (length > 50)
        score += 5;

    if (length > 150)
        score += 5;

    if (length > 300)
        score += 5;

    if (
        text.includes(":")
    ) {
        score += 5;
    }

    if (
        text.includes("\n")
    ) {
        score += 5;
    }

    if (score > 98)
        score = 98;

    return score;
}

function updateConfidence(
    value
) {

    const confidenceValue =
        document.getElementById(
            "confidenceValue"
        );

    const confidenceFill =
        document.getElementById(
            "confidenceFill"
        );

    confidenceValue.textContent =
        value + "%";

    confidenceFill.style.width =
        value + "%";
}

/* ==========================================
   AI Processing Simulation
========================================== */

async function simulateProcessing() {

    showStatus(
        "Analyzing Input...",
        25
    );

    await sleep(500);

    showStatus(
        "Extracting Information...",
        50
    );

    await sleep(500);

    showStatus(
        "Applying Prompt Rules...",
        75
    );

    await sleep(500);

    showStatus(
        "Generating Output...",
        100
    );

    await sleep(300);
}

/* ==========================================
   Output Generator
========================================== */

async function generateOutput() {

    const text =
        userInput.value.trim();

    if (!text) {

        outputBox.textContent =
            "Please enter some text first.";

        return;
    }

    generateBtn.disabled = true;

    await simulateProcessing();

    const mode =
        modeSelect.value;

    let output = "";

    if (
        mode === "json"
    ) {

        output =
            generateJSON(text);

        analytics.jsonGenerated++;
    }

    else if (
        mode === "summary"
    ) {

        output =
            generateSummary(text);

        analytics.summariesCreated++;
    }

    else if (
        mode === "transform"
    ) {

        output =
            generateTransformation(
                text
            );

        analytics.transformations++;
    }

    analytics.promptsProcessed++;

    saveAnalytics();

    updateAnalyticsUI();

    const confidence =
        calculateConfidence(
            text
        );

    updateConfidence(
        confidence
    );

    await typeWriter(
        output
    );

    saveHistory(
        text,
        output,
        mode
    );

    showStatus(
        "Complete",
        100
    );

    generateBtn.disabled =
        false;
}

/* ==========================================
   Clear Function
========================================== */

function clearWorkspace() {

    userInput.value = "";

    outputBox.textContent =
        "Waiting for input...";

    showStatus(
        "Ready",
        0
    );

    updateConfidence(
        95
    );
}

/* ==========================================
   Event Listeners
========================================== */

generateBtn.addEventListener(
    "click",
    generateOutput
);

clearBtn.addEventListener(
    "click",
    clearWorkspace
);

/* ==========================================
   PromptFlow AI Studio
   script.js - Part 3
   History + Downloads + Examples + Init
========================================== */

/* ==========================================
   History System
========================================== */

let historyData = [];

function loadHistory() {

    const savedHistory =
        localStorage.getItem(
            "pf_history"
        );

    if (savedHistory) {

        historyData =
            JSON.parse(savedHistory);
    }

    renderHistory();
}

function saveHistory(
    input,
    output,
    mode
) {

    const historyItem = {

        id: Date.now(),

        mode,

        input,

        output,

        createdAt:
            new Date().toLocaleString()
    };

    historyData.unshift(
        historyItem
    );

    if (
        historyData.length > 15
    ) {

        historyData =
            historyData.slice(
                0,
                15
            );
    }

    localStorage.setItem(
        "pf_history",
        JSON.stringify(
            historyData
        )
    );

    renderHistory();
}

function renderHistory() {

    if (
        historyData.length === 0
    ) {

        historyContainer.innerHTML =
            `
            <div class="empty-history">
                No history available.
            </div>
            `;

        return;
    }

    historyContainer.innerHTML =
        historyData
            .map(item => {

                return `
                <div
                    class="history-item"
                    data-id="${item.id}"
                >

                    <div class="history-title">
                        ${item.mode.toUpperCase()}
                    </div>

                    <div class="history-preview">
                        ${item.input.substring(
                            0,
                            100
                        )}
                    </div>

                </div>
                `;
            })
            .join("");

    attachHistoryEvents();
}

function attachHistoryEvents() {

    const historyItems =
        document.querySelectorAll(
            ".history-item"
        );

    historyItems.forEach(item => {

        item.addEventListener(
            "click",
            () => {

                const id =
                    Number(
                        item.dataset.id
                    );

                const record =
                    historyData.find(
                        entry =>
                            entry.id === id
                    );

                if (!record)
                    return;

                userInput.value =
                    record.input;

                outputBox.textContent =
                    record.output;

                modeSelect.value =
                    record.mode;

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    });
}

/* ==========================================
   Example Loader
========================================== */

const examples = {

    meeting:
`Meeting Notes

Finalize UI Design
Prepare Client Demo
Urgent Review Required
Deploy Testing Build`,

    tasks:
`Task List

Fix Login Bug
Optimize Dashboard
Update Documentation
High Priority Delivery`,

    project:
`Project Requirements

Responsive Design
Dark Mode
Analytics Dashboard
History Tracking
JSON Export`,

    research:
`Research Notes

AI improves productivity.
Structured prompts increase consistency.
Prompt iteration reduces ambiguity.
Testing improves reliability.
Documentation helps maintain quality.`
};

function initializeExamples() {

    const buttons =
        document.querySelectorAll(
            ".example-btn"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            event => {

                const card =
                    event.target.closest(
                        ".example-card"
                    );

                const exampleType =
                    card.dataset.example;

                userInput.value =
                    examples[
                        exampleType
                    ];

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }
        );
    });
}

/* ==========================================
   Copy Output
========================================== */

copyBtn.addEventListener(
    "click",
    async () => {

        try {

            await navigator
                .clipboard
                .writeText(
                    outputBox.textContent
                );

            const originalText =
                copyBtn.textContent;

            copyBtn.textContent =
                "Copied!";

            setTimeout(() => {

                copyBtn.textContent =
                    originalText;

            }, 1500);

        } catch {

            alert(
                "Unable to copy output."
            );
        }
    }
);

/* ==========================================
   File Downloads
========================================== */

function downloadFile(
    content,
    filename,
    type
) {

    const blob =
        new Blob(
            [content],
            { type }
        );

    const url =
        URL.createObjectURL(
            blob
        );

    const link =
        document.createElement(
            "a"
        );

    link.href = url;

    link.download =
        filename;

    document.body.appendChild(
        link
    );

    link.click();

    link.remove();

    URL.revokeObjectURL(
        url
    );
}

downloadJsonBtn.addEventListener(
    "click",
    () => {

        downloadFile(
            outputBox.textContent,
            "promptflow-output.json",
            "application/json"
        );
    }
);

downloadTxtBtn.addEventListener(
    "click",
    () => {

        downloadFile(
            outputBox.textContent,
            "promptflow-output.txt",
            "text/plain"
        );
    }
);

/* ==========================================
   Report Generator
========================================== */

generateReportBtn.addEventListener(
    "click",
    () => {

        const report = `
PROMPTFLOW AI STUDIO REPORT

==================================

Project:
Prompt Engineering Laboratory

Features:
- JSON Extraction
- Smart Summarization
- Format Transformation
- Analytics Dashboard
- History Tracking
- Report Generation

Analytics Summary:

Prompts Processed:
${analytics.promptsProcessed}

JSON Generated:
${analytics.jsonGenerated}

Summaries Created:
${analytics.summariesCreated}

Transformations:
${analytics.transformations}

Reflection:

Initial prompts produced inconsistent outputs.

Adding schemas, constraints and structured
formats significantly improved reliability.

Final estimated consistency:
95%

==================================
Generated by PromptFlow AI Studio
`;

        downloadFile(
            report,
            "PromptFlow-Report.txt",
            "text/plain"
        );
    }
);

/* ==========================================
   Navigation Active State
========================================== */

const navLinks =
    document.querySelectorAll(
        ".nav-link"
    );

navLinks.forEach(link => {

    link.addEventListener(
        "click",
        () => {

            navLinks.forEach(
                item =>
                    item.classList.remove(
                        "active"
                    )
            );

            link.classList.add(
                "active"
            );
        }
    );
});

/* ==========================================
   Initialization
========================================== */

function initializeApp() {

    initializeTheme();

    loadAnalytics();

    loadHistory();

    initializeExamples();

    updateConfidence(95);

    showStatus(
        "Ready",
        0
    );
}

document.addEventListener(
    "DOMContentLoaded",
    initializeApp
);