# CRM cross-device sync — setup

Until these steps are done, the CRM saves **on each device separately**. The
sync pill in the top right will read "Sync off". Nothing is lost, but your Mac
and your phone will not see each other's changes.

Everything below is done once, takes about ten minutes, and needs no code.

---

## How it works, briefly

The browser encrypts your data with AES-256-GCM **before** it leaves the device.
The Vercel function at `/api/crm` stores that encrypted blob in a private GitHub
repo and hands it back on request. The server never sees your client data, and
neither would anyone who stole the server, the token or the repo. Only your
passphrase decrypts.

Every save is a git commit, so every version is recoverable, and a dated
snapshot file is kept for 30 days.

---

## Step 1 — create the private data repo

On github.com → **New repository**.

- Name: `advon-crm-data`
- **Private** — this is not optional
- Tick "Add a README file" so the repo is not empty
- Create

Do **not** put anything else in this repo. It exists only to hold the encrypted
data file and its history.

## Step 2 — create a token

github.com → your avatar → Settings → Developer settings →
**Personal access tokens** → **Fine-grained tokens** → Generate new token.

- Name: `advon-crm-sync`
- Expiration: whatever you are willing to renew. If you pick an expiry, put a
  reminder in your calendar — sync stops working the day it lapses.
- Repository access: **Only select repositories** → `advon-crm-data`
- Permissions → Repository permissions → **Contents: Read and write**
- Generate, and copy the token. GitHub shows it once.

## Step 3 — get your auth hash from the CRM

Open the CRM, sign in, then **Export** button → **Sync setup…**

It shows a long value labelled `CRM_AUTH_HASH`. Click **Copy the value**.

This is a one-way fingerprint. It cannot be turned back into your passphrase,
and it cannot decrypt anything — it only proves a request came from someone who
knows the passphrase.

## Step 4 — add four values to Vercel

Vercel → your project → **Settings** → **Environment Variables**. Add each for
Production, Preview and Development:

| Name | Value |
|---|---|
| `CRM_GH_TOKEN` | the token from step 2 |
| `CRM_GH_REPO` | `your-username/advon-crm-data` |
| `CRM_GH_BRANCH` | `main` |
| `CRM_AUTH_HASH` | the value from step 3 |

## Step 5 — redeploy and test

Vercel → Deployments → the latest one → **Redeploy**.

Then open the CRM → **Export** → **Sync setup…** → **Test connection**.

- *"Working. No data stored yet."* — correct. Make any small edit and it seeds.
- *"not configured yet. Missing: …"* — that variable didn't save, or you didn't
  redeploy.
- *"CRM_AUTH_HASH does not match this passphrase"* — you pasted the hash from a
  different passphrase, or it got truncated. Copy it again from Sync setup.
- *"Could not reach the server"* — you are offline, or the deployment failed.

## Step 6 — confirm it actually works across devices

1. On your Mac, change a client's notes. Watch the pill go **Syncing…** then
   **Synced just now**.
2. Open the CRM on your phone. It should show the change immediately on load.
3. Change something on the phone, then switch back to the Mac tab. Within a
   moment of the tab regaining focus it should update by itself.

If step 2 shows old data, you are looking at a cached page: pull down to refresh
once. The app sends no-store headers, so this should not happen after the first
load following deployment.

---

## What if the token leaks?

Delete it on GitHub and make a new one. Someone holding the token can read and
overwrite the encrypted blob, which is a nuisance — every version is still in
git history — but they cannot read a single client name without your passphrase.

## What if I change my passphrase?

The `CRM_AUTH_HASH` changes with it. Sign in with the new passphrase, open
**Sync setup…**, copy the new value, update it in Vercel, redeploy. Export a
backup first.
