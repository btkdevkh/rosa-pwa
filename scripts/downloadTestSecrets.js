/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-console */

// Note: this script will download secrets grom GCP secret manager.
// This is needed until the node client provides a sync API.
// See: https://github.com/googleapis/nodejs-secret-manager/issues/118

const fs = require("fs");
const path = require("path");
const util = require("util");
const { GoogleAuth } = require("google-auth-library");
const { SecretManagerServiceClient } = require("@google-cloud/secret-manager");

const writeFile = util.promisify(fs.writeFile);
const mkdir = util.promisify(fs.mkdir);
const auth = new GoogleAuth();
const client = new SecretManagerServiceClient();

const SECRETS = {
  PWD: `rospot-test-pwd`,
  USER: `rospot-test-user`,
  ENV: `rospot-env`,
};

const getSecretValue = async (name) => {
  const projectId = await auth.getProjectId();
  //const projectId = "suite-gamma";
  const secretVersionName = `projects/${projectId}/secrets/${name}/versions/latest`;

  const [secret] = await client.accessSecretVersion({
    name: secretVersionName,
  });

  const payload = secret.payload.data.toString("utf8");
  return payload;
};

async function main() {
  const envPathLocal = path.join(__dirname, "..", ".env.local");
  const prismaPathLocal = path.join(__dirname, "../prisma", ".env");

  await mkdir(path.dirname(envPathLocal), { recursive: true });
  const pwd = await getSecretValue(SECRETS["PWD"]);
  const user = "testUser";
  const ip = "10.132.0.5";
  const bdd = "rospot-test";
  const port = 5432;
  var url = `DATABASE_URL=postgresql://postgres:${pwd}@${ip}:${port}/${bdd}\n`;
  // await writeFile(envPathLocal, url);
  const env = await getSecretValue(SECRETS["ENV"]);
  await writeFile(envPathLocal, url + env);
  await writeFile(prismaPathLocal, url);
}

main().catch((err) => {
  console.log(err);
  process.exit(1);
});
