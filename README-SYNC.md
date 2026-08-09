# CRM cross-device sync — setup

Until these steps are done, the CRM saves **on each device separately**. The
sync pill in the top right will read "Sync off". Nothing is lost, but your Mac
and your phone will not see each other's changes.

Everything below is done once, takes about ten minutes, and needs no code.

---

## Where the live site actually runs — read this first

`advonmedia.com` is served by **Netlify**, not Vercel. This was verified against
the live site: responses come back with `server: Netlify`.

There *is* also a Vercel project (`advon-media-visual`) building this same repo,
and it serves `advon-media-visual.vercel.app`. It is not your live site.
**Environment variables set in Vercel have no effect on advonmedia.com.**

So: set the variables below in **Netlify**.

> Two of them (`CRM_GH_REPO`, `CRM_GH_BRANCH`) were already set in the Vercel
> project before the hosting was identified. They are harmless there. Delete
> them if you want the Vercel copy to keep behaving exactly as before, or leave
> them if you use that URL as a staging environment.

---

## How it works, briefly

The browser encrypts your data with AES-256-GCM **before** it leaves the device.
The serverless function at `/api/crm` stores that encrypted blob in a private
GitHub repo and hands it back on request. The server never sees your client
data, and neither would anyone who stole the server, the token or the repo.
Only your passphrase decrypts.

Every save is a git commit, so every version is recoverable, and a dated
snapshot file is kept for 30 days.

---

## Step 1 — the private data repo ✅ already done

`agelmet/advon-crm-data` has been created, set to **Private**, with a README.
Nothing else should ever go in it.

## Step 2 — create a token

github.com → your avatar → Settings → Developer settings →
**Personal access tokens** → **Fine-grained tokens** → Generate new token.

- Name: `advon-crm-sync`
- Expiration: whatever you are willing to renew. If you pick an expiry, put a
  reminder in your calendar — sync stops working the day it lapses.
- Repository access: **Only select repositories** → `advon-crm-data`
- Permissions → Repository permissions → **Contents: Read and write**
- Generate, and copy the token. GitHub shows it once.

GitHub will ask you to confirm your identity by email before it lets you do
this. That is expected.

**Paste the token straight into Netlify in step 4. Do not paste it into a chat,
a note, or a file in this repo.**

## Step 3 — get your auth hash from the CRM

Open the CRM, sign in, then **Export** button → **Sync setup…**

It shows a long value labelled `CRM_AUTH_HASH`. Click **Copy the value**.

This is a one-way fingerprint. It cannot be turned back into your passphrase,
and it cannot decrypt anything — it only proves a request came from someone who
knows the passphrase. It is different for every passphrase, which is why nobody
but you can produce it.

## Step 4 — add the variables in Netlify

Netlify → your site (the one serving advonmedia.com) → **Site configuration** →
**Environment variables** → **Add a variable**.

| Name | Value |
|---|---|
| `CRM_GH_TOKEN` | the token from step 2 |
| `CRM_GH_REPO` | `agelmet/advon-crm-data` |
| `CRM_GH_BRANCH` | `main` |
| `CRM_AUTH_HASH` | the value from step 3 |

Scope them to **all deploy contexts** (or at least Production).

## Step 5 — redeploy and test

Netlify → **Deploys** → **Trigger deploy** → **Deploy site**. Environment
variables only take effect on a new deploy.

Then open the CRM → **Export** → **Sync setup…** → **Test connection**.

- *"Working. No data stored yet."* — correct. Make any small edit and it seeds.
- *"not configured yet. Missing: …"* — that variable didn't save, or you didn't
  redeploy, or you set it in Vercel instead of Netlify.
- *"CRM_AUTH_HASH does not match this passphrase"* — you pasted the hash from a
  different passphrase, or it got truncated. Copy it again from Sync setup.
- *"Could not reach the server"* — you are offline, or the deploy failed.

## Step 6 — confirm it actually works across devices

**Take a backup first:** Export → **Export backup (encrypted)** and Export →
**Plain CSV — every client**. Keep both files. Then:

1. On the device that holds your data, change a client's notes. Watch the pill
   go **Syncing…** then **Synced just now**.
2. Check `github.com/agelmet/advon-crm-data` — there should be a new commit
   named `crm: save from …`, plus a file under `snapshots/`.
3. Open the CRM on your phone. It should show the change immediately on load.
4. Change something on the phone, then switch back to the Mac tab. Within a
   moment of the tab regaining focus it should update by itself.

If step 3 shows old data, you are looking at a cached page: pull down to refresh
once. The app sends no-store headers, so this should not happen after the first
load following deployment.

---

## What if the token leaks?

Delete it on GitHub and make a new one. Someone holding the token can read and
overwrite the encrypted blob, which is a nuisance — every version is still in
git history — but they cannot read a single client name without your passphrase.

## What if I change my passphrase?

The `CRM_AUTH_HASH` changes with it. Sign in with the new passphrase, open
**Sync setup…**, copy the new value, update it in Netlify, redeploy. Export a
backup first.
