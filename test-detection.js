const { exec } = require('child_process');
const path = require('path');

// Mock data - using Notepad as a "game"
const gamesData = [
    { executablePath: "C:\\Windows\\System32\\notepad.exe" },
    { executablePath: "C:\\Windows\\System32\\calc.exe" }
];

console.log("Testing detection logic...");

exec('tasklist /FO CSV /NH', (err, stdout) => {
    if (err) {
        console.error("Error running tasklist:", err);
        return;
    }

    const processList = stdout.toLowerCase();
    console.log(`Tasklist output length: ${processList.length}`);
    // console.log("Tasklist output (first 200 chars):", processList.substring(0, 200));

    for (const game of gamesData) {
        if (game.executablePath) {
            const exeName = path.basename(game.executablePath).toLowerCase();
            const searchString = `"${exeName}"`;
            console.log(`Looking for: ${searchString}`);

            if (processList.includes(searchString)) {
                console.log(`✅ MATCH FOUND for ${exeName}!`);
            } else {
                console.log(`❌ No match for ${exeName}`);
            }
        }
    }
});
