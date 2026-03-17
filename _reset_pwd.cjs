const bcrypt = require(
  require.resolve("bcryptjs", { paths: [require.resolve("@strapi/strapi")] }),
);
const hash = bcrypt.hashSync("Test1234!", 10);
const db = require("better-sqlite3")(".tmp/data.db");
db.prepare("UPDATE admin_users SET password = ? WHERE id = 1").run(hash);
console.log("Password updated to Test1234!");
db.close();
