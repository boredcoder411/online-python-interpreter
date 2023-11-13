const bodyParser = require('body-parser');
const express = require('express');
const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const port = 80;
const tempFolder = path.join(__dirname, '../temp');

// Ensure the "temp" folder exists
if (!fs.existsSync(tempFolder)) {
    fs.mkdirSync(tempFolder);
}

const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.post('/', (req, res) => {
    const { code, cellId } = req.body;
    console.log(`[*] code: ${code}\n[*] cellId: ${cellId}`);

    // Generate a random file name using UUID
    const fileName = `${uuidv4()}.py`;
    const filePath = path.join(tempFolder, fileName);

    // Write the code to the file
    fs.writeFileSync(filePath, code);

    // Execute the code using child_process (for demonstration purposes)
    const output = executeCode(filePath);

    // Respond with the output and cellId
    res.json({ output, cellId });
});

function executeCode(filePath) {
    // This is a simple example; you may need to adjust this based on your requirements
    try {
        const result = child_process.execSync(`python "${filePath}"`, { encoding: 'utf-8' });
        return result;
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
