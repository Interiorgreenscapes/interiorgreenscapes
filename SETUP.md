# Setup Guide — Interior Greenscapes Website

This walks you through installing everything you need on a fresh Windows machine, cloning this site, and publishing changes to the live URL.

The site is at https://interiorgreenscapes.github.io/interiorgreenscapes/.

---

## Step 1 — Make a GitHub account

If you don't already have one: go to https://github.com, sign up, and verify your email.

The repo will be transferred to your account, so you'll own it once setup is done.

---

## Step 2 — Install the tools

Open **PowerShell** (right-click the Start menu → "Terminal" or "Windows PowerShell") and paste this whole block:

```powershell
winget install --id Git.Git -e --source winget
winget install --id OpenJS.NodeJS.LTS -e --source winget
winget install --id Microsoft.VisualStudioCode -e --source winget
winget install --id GitHub.cli -e --source winget
```

What you just installed:

| Tool | Purpose |
|---|---|
| Git | Saves and shares code changes |
| Node.js | Runs the dev server and build |
| VS Code | The editor |
| GitHub CLI | Easy GitHub login from the terminal |

> **If you get `'winget' is not recognized`:** your Windows is missing the App Installer. Open the **Microsoft Store**, search for **App Installer**, click Install/Update, then close and reopen PowerShell. If that still doesn't work, skip winget entirely and install each tool manually from its website:
>
> - Git: https://git-scm.com/download/win
> - Node.js LTS: https://nodejs.org/en/download
> - VS Code: https://code.visualstudio.com/download
> - GitHub CLI: https://cli.github.com
>
> Click "Next" through the defaults on all four. Then continue with Step 3 below.

> **If winget runs but says "package not found":** update App Installer from the Microsoft Store and try again.

---

## Step 3 — Verify the installs

**Close PowerShell and open it again** (this lets it find the new tools), then run:

```powershell
git --version
node --version
npm --version
code --version
gh --version
```

Each should print a version number. If anything errors, close and reopen the terminal one more time.

---

## Step 4 — Sign in to GitHub

```powershell
gh auth login
```

When prompted, pick:
- **GitHub.com**
- **HTTPS**
- **Login with a web browser**

It'll show you a code, open your browser, and ask you to paste the code. Done — `git push` will now work without prompting for passwords.

Then set your Git identity (replace the placeholders):

```powershell
git config --global user.name "Your Name"
git config --global user.email "your-github-email@example.com"
```

---

## Step 5 — Clone the site

```powershell
cd $HOME\Documents
git clone https://github.com/interiorgreenscapes/interiorgreenscapes.git
cd interiorgreenscapes
npm install
```

`npm install` downloads all the libraries the site uses. Takes a minute the first time.

---

## Step 6 — Install Claude Code (the AI assistant)

Open VS Code from the terminal:

```powershell
code .
```

Inside VS Code:
1. Click the **Extensions** icon in the left sidebar (or press `Ctrl+Shift+X`)
2. Search for **Claude Code**
3. Click **Install**
4. Once installed, click the Claude Code icon in the sidebar and follow the sign-in prompts

The repo already has a [CLAUDE.md](CLAUDE.md) at the root with edit recipes — Claude Code reads it automatically when you open the project, so it knows where things live.

---

## Daily workflow

### Preview the site locally

In the VS Code terminal (`Ctrl+\``), run:

```powershell
npm run dev
```

Open http://localhost:5173 in a browser. The page reloads automatically as you save files. `Ctrl+C` in the terminal stops the server.

### Make a change

Two ways:

**A. Use Claude Code** (easier — just describe what you want)
- Open the Claude Code panel
- Say things like *"update the phone number to 208-555-1234"* or *"add a new portfolio category called Restaurants with these images: ..."*
- It reads CLAUDE.md to find the right files

**B. Edit files directly**
- See [CLAUDE.md](CLAUDE.md) for the recipes — every common edit (phone, email, services, portfolio additions, hero swap) is documented with the exact file to edit.

### Publish the change live

Three steps, in order:

1. **Save and commit your changes.** In VS Code's Source Control panel (the branch icon in the sidebar):
   - Type a short message describing what changed (e.g. "Update phone number")
   - Click **Commit**
   - Click **Sync Changes** to push to GitHub

2. **Deploy.** Back in the terminal:
   ```powershell
   npm run deploy
   ```
   This builds the site and publishes it. Takes about 30 seconds.

3. **Verify.** Wait 1–2 minutes, then refresh https://interiorgreenscapes.github.io/interiorgreenscapes/ in your browser.

> **Important:** always commit *before* you deploy. If you deploy uncommitted changes, the live site will be ahead of the source code, which gets confusing fast.

---

## Useful Claude Code commands

The repo bundles design tooling. With Claude Code open, you can type:

| Command | What it does |
|---|---|
| `/impeccable polish` | Final cleanup pass on a page or component |
| `/impeccable audit` | Check for accessibility / responsive / quality issues |
| `/impeccable critique` | UX design review |
| `/impeccable typeset` | Fix typography problems |

Or just describe what you want in plain English — it'll figure out which one fits.

---

## Troubleshooting

**`npm install` fails with permission errors.**
Run PowerShell as Administrator and try again.

**Site looks broken locally but fine on production (or vice versa).**
Stop the dev server (`Ctrl+C`), run `npm install` again, then `npm run dev`.

**Pushed a change but the live site doesn't update.**
You forgot `npm run deploy`. The Source Control sync only updates the source code on GitHub — the *live site* updates only when you run `npm run deploy`.

**Accidentally broke something.**
Tell Claude Code "revert my last change" or run `git restore .` in the terminal to throw away uncommitted edits. If you already committed, run `git revert HEAD`.

**Lost? Need a refresher on the project structure.**
Read [CLAUDE.md](CLAUDE.md) — it's the cheat sheet for where everything lives.
