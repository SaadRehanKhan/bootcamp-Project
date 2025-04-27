const pathString = decodeURIComponent(window.location.search.substring(6));
const container = document.getElementById('output');
let outputHTML = '';
const ignoreChars = [',', ']', '"', '['];
const breakChars = ['---', '**', '*', '\n'];
const boldKeywords = ['OVERVIEW', 'RESOURCES', 'TIME ALLOCATION', 'PHASE START', 'PHASE END', 'Phase '];

let currentLine = '';
for (let i = 0; i < pathString.length; i++) {
    const char = pathString[i];
    let shouldBreak = false;
    let shouldIgnore = false;

    for (const ignoreChar of ignoreChars) {
        if (char === ignoreChar) {
            shouldIgnore = true;
            break;
        }
    }

    if (!shouldIgnore) {
        for (const breakChar of breakChars) {
            if (pathString.substring(i, i + breakChar.length) === breakChar) {
                if (currentLine.trim() !== '') {
                    let formattedLine = currentLine;
                    for (const keyword of boldKeywords) {
                        if (currentLine.startsWith(keyword)) {
                            formattedLine = `<strong>${currentLine}</strong>`;
                            break;
                        }
                    }

                    let linkStartIndex = currentLine.indexOf('https://');
                    if (linkStartIndex !== -1) {
                        let linkEndIndex = currentLine.indexOf('*', linkStartIndex);
                        if (linkEndIndex === -1) {
                            linkEndIndex = currentLine.length; 
                        }
                        const url = currentLine.substring(linkStartIndex, linkEndIndex).trim();
                        const linkedText = currentLine.substring(0, linkEndIndex);
                        formattedLine = linkedText.substring(0, linkStartIndex) + `<a href="${url}" target="_blank">(Link)</a>` + linkedText.substring(linkEndIndex);
                    }
                    outputHTML += `<p>${formattedLine}</p>`; 
                }
                currentLine = '';
                i += breakChar.length - 1;
                shouldBreak = true;
                break;
            }
        }
        if (!shouldBreak) {
            currentLine += char;
        }
    }
}
if (currentLine.trim() !== '') {
    let formattedLine = currentLine;
    for (const keyword of boldKeywords) {
        if (currentLine.startsWith(keyword)) {
            formattedLine = `<strong>${currentLine}</strong>`;
            break;
        }
    }
    let linkStartIndex = currentLine.indexOf('https://');
    if (linkStartIndex !== -1) {
        let linkEndIndex = currentLine.indexOf('*', linkStartIndex);
        if (linkEndIndex === -1) {
            linkEndIndex = currentLine.length; 
        }
        const url = currentLine.substring(linkStartIndex, linkEndIndex).trim();
        const linkedText = currentLine.substring(0, linkEndIndex);
        formattedLine = linkedText.substring(0, linkStartIndex) + `<a href="${url}" target="_blank">(Link)</a>` + linkedText.substring(linkEndIndex);
    }
    outputHTML += `<p>${formattedLine}</p>`; 
}

container.innerHTML = outputHTML;