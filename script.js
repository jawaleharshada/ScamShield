/* =====================================================
   SCAMSHIELD JAVASCRIPT
   ===================================================== */


/* =====================================================
   SCANNER SWITCH
   ===================================================== */

function selectScanner(type) {

    const messageScanner =
        document.getElementById("messageScanner");

    const urlScanner =
        document.getElementById("urlScanner");

    const buttons =
        document.querySelectorAll(".tab-button");


    buttons.forEach(button => {
        button.classList.remove("active");
    });


    if (type === "message") {

        messageScanner.classList.remove("hidden");

        urlScanner.classList.add("hidden");

        buttons[0].classList.add("active");

    } else {

        messageScanner.classList.add("hidden");

        urlScanner.classList.remove("hidden");

        buttons[1].classList.add("active");

    }

}


/* =====================================================
   MESSAGE SCANNER
   ===================================================== */

function scanMessage() {

    const message =
        document
        .getElementById("messageInput")
        .value
        .toLowerCase()
        .trim();


    if (message === "") {

        alert("Please enter a message to analyze.");

        return;
    }


    let score = 0;

    let reasons = [];


    /* ---------- SCAM KEYWORDS ---------- */

    const scamKeywords = [

        "you have won",
        "congratulations",
        "lottery",
        "prize",
        "reward",
        "claim now",
        "free money",
        "cash prize",
        "winner",
        "gift card",
        "investment opportunity",
        "double your money",
        "guaranteed profit"

    ];


    scamKeywords.forEach(keyword => {

        if (message.includes(keyword)) {

            score += 2;

            reasons.push(
                "Suspicious reward or financial language detected."
            );

        }

    });


    /* ---------- URGENCY ---------- */

    const urgencyWords = [

        "urgent",
        "immediately",
        "act now",
        "hurry",
        "last chance",
        "expires today",
        "within 24 hours",
        "limited time"

    ];


    urgencyWords.forEach(word => {

        if (message.includes(word)) {

            score += 2;

            reasons.push(
                "Urgency or pressure tactics detected."
            );

        }

    });


    /* ---------- SENSITIVE INFORMATION ---------- */

    const sensitiveWords = [

        "otp",
        "password",
        "pin",
        "cvv",
        "bank account",
        "credit card",
        "debit card",
        "verification code"

    ];


    sensitiveWords.forEach(word => {

        if (message.includes(word)) {

            score += 3;

            reasons.push(
                "Request for sensitive financial or personal information detected."
            );

        }

    });


    /* ---------- SUSPICIOUS LINK ---------- */

    if (
        message.includes("http://") ||
        message.includes("https://") ||
        message.includes("www.")
    ) {

        score += 2;

        reasons.push(
            "A website link was detected. Verify the website before opening it."
        );

    }


    /* ---------- FREE / MONEY ---------- */

    if (
        message.includes("free") ||
        message.includes("money") ||
        message.includes("cash")
    ) {

        score += 1;

        reasons.push(
            "Financial incentive or free-offer language detected."
        );

    }


    showResult(score, reasons);

}


/* =====================================================
   URL SCANNER
   ===================================================== */

function scanURL() {

    const url =
        document
        .getElementById("urlInput")
        .value
        .trim();


    if (url === "") {

        alert("Please enter a URL.");

        return;
    }


    let score = 0;

    let reasons = [];


    /* ---------- HTTP ---------- */

    if (url.toLowerCase().startsWith("http://")) {

        score += 2;

        reasons.push(
            "The website is using HTTP instead of HTTPS."
        );

    }


    /* ---------- SUSPICIOUS WORDS ---------- */

    const suspiciousWords = [

        "login",
        "verify",
        "account",
        "update",
        "secure",
        "claim",
        "free",
        "reward",
        "winner"

    ];


    suspiciousWords.forEach(word => {

        if (url.toLowerCase().includes(word)) {

            score += 1;

            reasons.push(
                "The URL contains a commonly used phishing-related keyword: " + word
            );

        }

    });


    /* ---------- @ SYMBOL ---------- */

    if (url.includes("@")) {

        score += 3;

        reasons.push(
            "The URL contains an @ symbol, which can be used to disguise the actual destination."
        );

    }


    /* ---------- LONG URL ---------- */

    if (url.length > 100) {

        score += 2;

        reasons.push(
            "The URL is unusually long."
        );

    }


    /* ---------- IP ADDRESS ---------- */

    const ipPattern =
        /https?:\/\/(\d{1,3}\.){3}\d{1,3}/;


    if (ipPattern.test(url)) {

        score += 3;

        reasons.push(
            "The URL uses an IP address instead of a normal domain name."
        );

    }


    showResult(score, reasons);

}


/* =====================================================
   SHOW RESULT
   ===================================================== */

function showResult(score, reasons) {

    const result =
        document.getElementById("result");

    const resultIcon =
        document.getElementById("resultIcon");

    const resultTitle =
        document.getElementById("resultTitle");

    const resultText =
        document.getElementById("resultText");

    const reasonsContainer =
        document.getElementById("reasons");

    const riskScore =
        document.getElementById("riskScore");

    const riskBar =
        document.getElementById("riskBar");


    result.classList.remove("hidden");

    reasonsContainer.innerHTML = "";


    /* =================================================
       RISK SCORE
       ================================================= */

    const percentage =
        Math.min(score * 10, 100);


    if (riskScore) {

        riskScore.textContent =
            percentage + "/100";

    }


    if (riskBar) {

        riskBar.style.width =
            percentage + "%";


        if (percentage <= 20) {

            riskBar.style.background =
                "#63E6D5";

        }

        else if (percentage <= 50) {

            riskBar.style.background =
                "#F2C94C";

        }

        else {

            riskBar.style.background =
                "#FF6B6B";

        }

    }


    /* =================================================
       RESULT TYPE
       ================================================= */

    if (score <= 2) {

        resultIcon.innerHTML = "🟢";

        resultTitle.innerHTML = "Likely Safe";

        resultText.innerHTML =
            "No major scam indicators were detected. However, always stay cautious.";

    }


    else if (score <= 5) {

        resultIcon.innerHTML = "🟡";

        resultTitle.innerHTML = "Suspicious";

        resultText.innerHTML =
            "Some suspicious indicators were detected. Verify the information before taking action.";

    }


    else {

        resultIcon.innerHTML = "🔴";

        resultTitle.innerHTML = "Potential Scam";

        resultText.innerHTML =
            "Multiple scam indicators were detected. Avoid clicking links or sharing personal information.";

    }


    /* =================================================
       DISPLAY REASONS
       ================================================= */

    if (reasons.length === 0) {

        reasonsContainer.innerHTML =
            "<div class='reason'>No specific warning indicators detected.</div>";

    }

    else {

        const uniqueReasons =
            [...new Set(reasons)];


        uniqueReasons.forEach(reason => {

            const div =
                document.createElement("div");

            div.className = "reason";

            div.innerHTML =
                "⚠️ " + reason;

            reasonsContainer.appendChild(div);

        });

    }


    /* =================================================
       SAVE SCAN
       ================================================= */

    saveScan(score);

}


/* =====================================================
   SAVE SCAN
   ===================================================== */

function saveScan(score) {

    const history =
        JSON.parse(
            localStorage.getItem("scamShieldHistory")
        ) || [];


    const scan = {

        score: score,

        date:
            new Date().toLocaleString()

    };


    history.push(scan);


    localStorage.setItem(
        "scamShieldHistory",
        JSON.stringify(history)
    );


    /* Update history immediately */

    loadHistory();

}


/* =====================================================
   LOAD HISTORY
   ===================================================== */

function loadHistory() {

    const historyList =
        document.getElementById("historyList");


    /* If history section doesn't exist,
       don't cause an error */

    if (!historyList) {

        return;

    }


    const history =
        JSON.parse(
            localStorage.getItem("scamShieldHistory")
        ) || [];


    if (history.length === 0) {

        historyList.innerHTML =
            '<div class="empty-history">No scans yet.</div>';

        return;

    }


    historyList.innerHTML = "";


    /* Show newest first */

    const recentScans =
        history
        .slice()
        .reverse()
        .slice(0, 10);


    recentScans.forEach(scan => {

        const item =
            document.createElement("div");


        item.className =
            "history-item";


        let title;

        let icon;


        if (scan.score <= 2) {

            title = "Likely Safe";

            icon = "🟢";

        }

        else if (scan.score <= 5) {

            title = "Suspicious";

            icon = "🟡";

        }

        else {

            title = "Potential Scam";

            icon = "🔴";

        }


        const percentage =
            Math.min(scan.score * 10, 100);


        item.innerHTML = `

            <div class="history-left">

                <div class="history-icon">
                    ${icon}
                </div>

                <div>

                    <div class="history-title">
                        ${title}
                    </div>

                    <div class="history-date">
                        ${scan.date}
                    </div>

                </div>

            </div>

            <div class="history-score">
                ${percentage}/100
            </div>

        `;


        historyList.appendChild(item);

    });

}


/* =====================================================
   CLEAR HISTORY
   ===================================================== */

function clearHistory() {

    localStorage.removeItem(
        "scamShieldHistory"
    );


    loadHistory();

}


/* =====================================================
   LOAD HISTORY WHEN PAGE OPENS
   ===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    loadHistory
);
/* =====================================================
   SCAM EXAMPLES
   ===================================================== */

function tryExample(type) {

    const messageInput =
        document.getElementById("messageInput");


    const examples = {

        prize:
            "Congratulations! You have won ₹50,000. Act now immediately to claim your prize. Share your OTP to receive your reward.",

        bank:
            "URGENT: Your bank account will be suspended today. Verify your account immediately by providing your OTP and password.",

        job:
            "Congratulations! You have been selected for a work-from-home job earning ₹50,000 per month. Pay a small registration fee immediately to start.",

        delivery:
            "Your package could not be delivered. Pay ₹49 immediately and verify your card details using the link below: http://delivery-example.com"

    };


    messageInput.value =
        examples[type];


    /* Switch to Message Scanner */

    selectScanner("message");


    /* Scroll to scanner */

    document
        .getElementById("scanner")
        .scrollIntoView({
            behavior: "smooth"
        });

}