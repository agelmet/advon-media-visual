# If something goes wrong with the CRM — read this

This page is for a bad day. Work through it calmly, top to bottom. Nothing here
can make things worse, and none of it requires you to be technical.

---

## ⚠️ READ THIS FIRST — the one thing nobody can fix for you

**Your passphrase cannot be recovered. Not by Anthropic, not by Netlify, not by
GitHub, not by a developer, not by anyone.**

Your client data is encrypted with a key made from your username and passphrase.
Nobody stores that key. If you forget the passphrase, every copy of your
data — on your Mac, on your phone, on the server, in every backup file, in every
snapshot — becomes permanently unreadable. There is no reset link and no
support line.

**Write it on paper. Right now, if you haven't.**

- One copy at home, somewhere fireproof or locked.
- One copy in a **different physical building** — office safe, a relative's
  house, a safe deposit box.
- Write the **username too**, not just the passphrase. Both are needed.
- Do not store it in this repo, in a note on your computer, in email, or in a
  password manager as the only copy. Paper in two places.

Two locations, because one house fire or one burglary should not end your
business records.

---

## The five-second version

| What happened | Go to |
|---|---|
| A client or some data has vanished | [Restore from a backup file](#1-restore-from-a-backup-file) |
| I made a bad edit and want yesterday's version | [Go back to an earlier version](#2-go-back-to-an-earlier-version) |
| The app won't open / shows an error | [Get your data out when the app is broken](#3-get-your-data-out-when-the-app-is-broken) |
| My phone or laptop was lost or stolen | [A device is lost](#4-a-device-is-lost) |
| The red "SYNC FAILED" bar is showing | [The sync bar is red](#5-the-sync-bar-is-red) |

---

## 0. Before anything else: take a copy

Whatever the problem, do this first. It takes ten seconds and it means you can
never make the situation worse.

1. Open the CRM on the device that still shows your data.
2. Top right → the **Export** button (the download icon).
3. Click **Backup everything**.

You now have ONE file in your Downloads folder — `ADVON-FULL-BACKUP-<date>.zip`. It holds the whole CRM, every chat with its
files, the leads and two spreadsheets you can open in Excel. Put it somewhere safe (it is not locked with a password).
Now you can experiment freely.

---

## 1. Restore from a backup file

Use this when data has gone missing and you have a backup file.

1. Find your backup file. It will be in Downloads and named something like
   `ADVON-FULL-BACKUP-2026-09-20_1830.zip` (older ones: `advon-crm-encrypted-….json` or `advon-crm-backup-….json` — all three work). The date in the name is the day it
   was made — pick the newest one from **before** things went wrong.
2. Open the CRM and sign in.
3. Top right → **Export** button → **Restore from a backup…**.
4. Choose the file.
5. The CRM tells you how many clients are in it and what date it was made.
   Read that line. If it looks right, confirm.
6. Everything is replaced with the backup, and it syncs to your other devices.

**If it says "Could not restore":** the file is either damaged, or it was made
with a different passphrase than the one you just signed in with. Try another
backup file.

**Chats, leads and client files:** the restore window has a second tick — «Also put back the chats, leads and client
files on the server». Leave it off unless those were lost too. Before anything is replaced the CRM downloads a copy of
what it holds right now (`advon-crm-BEFORE-restore-….json`), so a restore can always be undone.

**The net under the net:** every Monday the server e-mails you `ADVON-SAFETY-COPY-<date>.zip` by itself (Export →
«E-mail me a safety copy now» sends one on the spot). If everything else is gone, give that file — or the full backup — to Claude.

---

## 2. Go back to an earlier version

Every time the CRM saves to the server, it keeps a dated copy. Copies are kept
for at least 30 days. So a mistake from last Tuesday is recoverable.

### The easy way — ask for help with this bit

If you have someone technical available, hand them this section. If not, follow
it slowly; it is copy-and-paste.

Open the **Terminal** app on your Mac and paste these lines one at a time,
pressing Enter after each.

**Step 1 — get a copy of the data repo** (only needed the first time):

```
cd ~/Desktop
git clone https://github.com/YOUR-USERNAME/advon-crm-data.git
cd advon-crm-data
```

Replace `YOUR-USERNAME/advon-crm-data` with your actual private data repo.

**Step 2 — see the list of saves:**

```
git log --oneline -- crm-data.json
```

You get a list like:

```
a1b2c3d crm: save from Mac-x9f2k at 2026-08-09T09:14:22.104Z
9e8d7c6 crm: save from Phone-k22ab at 2026-08-08T18:02:11.900Z
```

The newest is at the top. Find the last one from **before** the problem, and
copy its short code (the `9e8d7c6` part).

**Step 3 — pull that version out to your Desktop:**

```
git show 9e8d7c6:crm-data.json > ~/Desktop/recovered.json
```

Use your own code instead of `9e8d7c6`.

**Step 4 — put it back into the CRM:**

You now have `recovered.json` on your Desktop. Open it in TextEdit — it will
look like scrambled letters, which is correct; that is the encryption. Rename it
to end in `.json` if it doesn't already, then in the CRM use **Export** →
**Restore from a backup…** and choose it.

> The dated snapshots are also sitting in the `snapshots/` folder of that same
> repo, one file per save, named by date and time. If the steps above feel like
> too much, just open that folder on github.com, find the file with the date you
> want, download it, and import it the same way.

**This has been tested.** The drill in `scripts/restore-drill.mjs` performs
exactly these steps automatically and confirms an older version comes back
intact, including after a deliberately destructive edit.

---

## 3. Get your data out when the app is broken

If the CRM won't load at all, your data is still there. It is in two places, and
neither of them needs the app to work.

### Option A — you have a CSV export

Open the `advon-crm-all-clients-….csv` file from your Downloads in Excel or
Numbers. That is your full client list — names, values, stages, phone numbers,
emails, notes — in plain readable form. **This works with no app, no internet
and no passphrase.**

This is why it is worth clicking **Backup everything** once a week (the zip has `crm/clients.csv` inside) and
keeping the file. It is the copy that survives everything.

### Option B — you have no CSV

1. Your data is still on the server, in the private data repo, as
   `crm-data.json`. It is encrypted, so you need the app or a developer to read
   it — but it is not lost.
2. An older working version of the CRM app itself is in the website repo's
   history. A developer can restore the app with:

   ```
   git log --oneline -- public/crm/index.html
   git checkout <code-from-that-list> -- public/crm/index.html
   ```

   Then push, and the CRM works again with your data untouched. The data and the
   app are stored separately on purpose, so breaking one never harms the other.

---

## 4. A device is lost

Your data is encrypted on every device. Someone who steals your phone cannot
read your clients unless they can also unlock the phone **and** the CRM session
is still signed in.

Do this, in order:

1. **Remote-wipe the device if you can.** iPhone: Find My → Erase. Mac: iCloud →
   Find My → Erase. This is the strongest step and it is enough on its own.
2. **Change your CRM passphrase** if you cannot wipe the device. This is a code
   change — the `VAULT` value in `public/crm/index.html` has to be regenerated,
   and `CRM_AUTH_HASH` in Netlify updated to match. Ask a developer. Until this
   is done, a signed-in stolen device can still read your data.
3. **Check nothing was destroyed.** Open the CRM on a device you still have. If
   anything is missing, use section 1 to restore.

Two things that limit the damage automatically:

- A signed-in session locks itself after **12 hours** with no activity.
- The key is stored in a form the browser will use but no code can read or copy
  off the device, so it cannot be extracted and used elsewhere.

**A lost device cannot delete your data for good.** Every version is on the
server and in git history, and a thief cannot reach either without your GitHub
account.

---

## 5. The sync bar is red

A red **SYNC FAILED** bar across the top means your most recent change reached
this device but not the server.

**Your change is not lost.** It is saved on this device and the CRM keeps
retrying by itself, backing off gradually, and it retries immediately when you
come back online.

What to do:

1. Check your internet connection.
2. Click **Retry now** in the red bar.
3. If it keeps failing, click **Backup everything** so the change exists
   in a file too. Then carry on working — nothing is being lost.
4. **Do not open the CRM on your other device and edit there** while the bar is
   red. That is how two versions drift apart. If you do, the CRM will notice and
   ask you which one to keep rather than silently overwriting — but it is
   simpler to avoid.

### "Two devices changed the data"

If you see this message, both versions still exist. Choose one. **Before it
changes anything, the CRM downloads both versions as files**, so if you pick
wrong you can import the other one back with section 1.

### The pill says "Sync off"

Sync is not configured on the server. Data is saving on this device only. Click
the pill for setup instructions, and see `README-SYNC.md`.

---

## What is stored where — plain version

| Thing | Where it lives | Readable without your passphrase? |
|---|---|---|
| Your client data, on your device | Inside the browser, encrypted | No |
| Your client data, on the server | Private GitHub data repo, encrypted | No |
| Dated snapshots, 30 days | Same repo, `snapshots/` folder | No |
| Encrypted backup files | Your Downloads folder | No |
| CSV export | Your Downloads folder | **Yes — treat it carefully** |
| Your passphrase | Only on your paper copies | — |

The CSV is the one file that is readable by anyone who gets hold of it. That is
the point of it — it is your emergency copy — but don't leave it on a shared
computer or email it around.

---

## A five-minute habit that makes all of this unnecessary

Once a week:

1. **Export** → **Backup everything** → keep the file.
2. Check your inbox has a recent «Advon safety copy» e-mail (it arrives every Monday).
3. Glance at the sync pill in the top right. It should say **Synced** with a
   recent time.

Once a year:

- Check your two paper copies of the passphrase are still where you think they
  are, and still legible.
