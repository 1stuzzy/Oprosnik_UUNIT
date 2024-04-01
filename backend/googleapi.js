const { google } = require('googleapis');
const settings = require('../config/settings.json');

const credentialsPath = settings.googleSheets.credentialsPath;
const spreadsheetId = settings.googleSheets.spreadsheetId;
const credentials = require(credentialsPath);

const client = new google.auth.GoogleAuth({
    credentials: credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth: client });

async function sendDataToGoogleSheet(name, phone, specialization) {
    try {
        const response = await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId,
            range: 'Основной!A:A',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[name, phone, specialization]],
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error adding data to Google Sheet:', error);
        throw error;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { sendDataToGoogleSheet };
}