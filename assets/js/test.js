const firebase = require("@firebase/testing");
const fs = require("fs");

const projectId = "dzikwa-trust-test";
const rules = fs.readFileSync("database.rules.json", "utf8");

// Helper function for authenticated context
const getAuthedDb = async (uid, role = null) => {
  const auth = uid ? { uid, email_verified: true } : null;
  if (role) {
    await firebase.loadDatabaseRules({
      databaseName: projectId,
      rules: {
        "admins": {
          [uid]: { role, email: "test@dzikwa.org" }
        }
      }
    });
  }
  return firebase.initializeTestApp({ databaseName: projectId, auth }).database();
};

describe("Dzikwa Trust Security Rules", () => {
  beforeAll(async () => {
    await firebase.loadDatabaseRules({ databaseName: projectId, rules });
  });

  test("Admin can read donors", async () => {
    const db = await getAuthedDb("admin1", "admin");
    await firebase.assertSucceeds(db.ref("donors").once("value"));
  });

  test("Non-admin cannot write to donors", async () => {
    const db = await getAuthedDb("user1");
    await firebase.assertFails(db.ref("donors/donor1").set({
      name: "Test",
      email: "test@example.com"
    }));
  });

  test("Donation amounts must be positive integers", async () => {
    const db = await getAuthedDb("admin1", "admin");
    await firebase.assertFails(db.ref("donations/2023-11").set(-100));
    await firebase.assertFails(db.ref("donations/2023-11").set(10.5));
    await firebase.assertSucceeds(db.ref("donations/2023-11").set(1000));
  });

  test("Only superadmin can manage admin accounts", async () => {
    const adminDb = await getAuthedDb("admin1", "admin");
    const superadminDb = await getAuthedDb("super1", "superadmin");
    
    await firebase.assertFails(adminDb.ref("admins/newadmin").set({
      email: "new@dzikwa.org",
      role: "admin"
    }));
    
    await firebase.assertSucceeds(superadminDb.ref("admins/newadmin").set({
      email: "new@dzikwa.org",
      role: "admin"
    }));
  });
});