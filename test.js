const { PKPass } = require('passkit-generator');
try {
  new PKPass({
    "passTypeIdentifier": "pass.com.uniquecreations.contactpass",
    "teamIdentifier": "QALYWQD245 ", // space added!
    "organizationName": "Test Org",
    "description": "Test Desc",
    "logoText": "Test Logo",
    "backgroundColor": "#677b5a",
    "foregroundColor": "#ffffff",
    "labelColor": "#cccccc",
    "serialNumber": "1234",
    "formatVersion": 1,
    "storeCard": { "primaryFields": [] }
  }, {
    signerCert: "mock",
    signerKey: "mock",
    wwdr: "mock",
    signerKeyPassphrase: "mock"
  });
  console.log("Success");
} catch (e) {
  console.log("Error:", e.message);
}
