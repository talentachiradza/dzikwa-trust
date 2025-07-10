const firebase = require("@firebase/testing");
const fs = require("fs");

module.exports = () => {
  const projectId = "dzikwa-test";
  const rules = fs.readFileSync("database.rules.json", "utf8");

  beforeEach(async () => {
    await firebase.clearFirestoreData({ projectId });
  });

  beforeAll(async () => {
    await firebase.loadFirestoreRules({ projectId, rules });
  });

  afterAll(async () => {
    await Promise.all(firebase.apps().map(app => app.delete()));
  });

  test("Editor cannot manage admins", async () => {
    const db = firebase
      .initializeTestApp({ projectId, auth: { uid: "editor1", role: "editor" } })
      .firestore();
    
    await firebase.assertFails(
      db.collection("admins").doc("new").set({ email: "test@dzikwa.org" })
    );
  });
};