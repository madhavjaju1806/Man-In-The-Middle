function callAPI(url) {
    const statusArea = document.getElementById("statusArea");
    const detailsArea = document.getElementById("detailsArea");

    statusArea.className = "status-box";
    statusArea.innerHTML = "Processing...";
    detailsArea.innerHTML = '<div class="info-card">Please wait...</div>';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateStatus(data);
            updateDetails(data);
        })
        .catch(error => {
            statusArea.className = "status-box status-error";
            statusArea.innerHTML = "Error while connecting to server.";
            detailsArea.innerHTML = `
                <div class="info-card">
                    <strong>Error:</strong> ${error}
                </div>
            `;
        });
}

function updateStatus(data) {
    const statusArea = document.getElementById("statusArea");

    let className = "status-box ";

    if (data.status === "success") {
        className += "status-success";
    } else if (data.status === "warning") {
        className += "status-warning";
    } else if (data.status === "danger") {
        className += "status-danger";
    } else if (data.status === "reset") {
        className += "status-reset";
    } else {
        className += "status-error";
    }

    statusArea.className = className;
    statusArea.innerHTML = data.msg || "Action completed.";
}

function updateDetails(data) {
    const detailsArea = document.getElementById("detailsArea");
    let html = "";

    if (data.message) {
        html += `
            <div class="info-card">
                <strong>Original Message:</strong><br>
                <span class="mono">${escapeHtml(data.message)}</span>
            </div>
        `;
    }

    if (data.hash) {
        html += `
            <div class="info-card">
                <strong>SHA-256 Hash:</strong><br>
                <span class="mono">${escapeHtml(data.hash)}</span>
            </div>
        `;
    }

    if (data.signature) {
        html += `
            <div class="info-card">
                <strong>Digital Signature:</strong><br>
                <span class="mono">${escapeHtml(data.signature)}</span>
            </div>
        `;
    }

    if (data.received_hash) {
        html += `
            <div class="info-card">
                <strong>Received Hash:</strong><br>
                <span class="mono">${escapeHtml(data.received_hash)}</span>
            </div>
        `;
    }

    if (data.verification_result) {
        html += `
            <div class="info-card">
                <strong>Verification Result:</strong><br>
                <span class="mono">${escapeHtml(data.verification_result)}</span>
            </div>
        `;
    }

    if (
        data.changed_byte_index !== undefined &&
        data.old_byte_value !== undefined &&
        data.new_byte_value !== undefined
    ) {
        html += `
            <div class="info-card">
                <strong>Attack Details:</strong><br>
                Changed byte index: <span class="mono">${data.changed_byte_index}</span><br>
                Old value: <span class="mono">${data.old_byte_value}</span><br>
                New value: <span class="mono">${data.new_byte_value}</span>
            </div>
        `;
    }

    if (!html) {
        html = `<div class="info-card">No detailed output available for this action.</div>`;
    }

    detailsArea.innerHTML = html;
}

function escapeHtml(text) {
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}