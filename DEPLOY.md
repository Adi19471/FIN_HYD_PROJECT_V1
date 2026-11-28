# Deploy for ₹0 — Firebase + Render + TiDB Cloud

| Part | Service | Free limit to know |
|---|---|---|
| React frontend | Firebase Hosting | Generous; HTTPS and `*.web.app` address included |
| Spring Boot backend | Render (free web service, Docker) | 512 MB RAM; **sleeps after 15 min idle**, first request then takes ~1 min |
| MySQL database | TiDB Cloud Starter (MySQL-compatible) | 5 GiB storage, 50 M request units / month |

Files already in the repo for this:

- `render.yaml` — tells Render how to build and run the backend
- `Spring_Boot_Balaji_FInance/sri-balaji-finance/Dockerfile` — builds the jar and runs it in 320 MB heap
- `.../src/main/resources/application-cloud.properties` — cloud settings, **no secrets**; everything comes from environment variables
- `FIN_FRENTEND/Frentned_main/firebase.json` — hosting config (single-page app)
- `FIN_FRENTEND/Frentned_main/.env.production.example` — where the frontend learns the backend URL

> ⚠️ **Security first.** This GitHub repository is **public**, and
> `application.properties` contains the local database password and JWT
> secret. Never put cloud passwords in any file in this repo. In the cloud,
> use the **new** values you type into Render (steps below). Use a different
> password for TiDB than your local MySQL one.

---

## Step 1 — Database: TiDB Cloud

1. Sign up at **tidbcloud.com** → create a **Starter** cluster (free). Pick the region nearest to India that is offered.
2. Open the cluster → **Connect**:
   - Connect with: **General**, OS: your OS.
   - Click **Generate password** and save it in a password manager.
   - Note **Host** (e.g. `gateway01.xx-xxxx-1.prod.aws.tidbcloud.com`), **Port** `4000`, **User** (e.g. `xxxxxxxx.root`).
3. In TiDB's **SQL Editor**, run:
   ```sql
   CREATE DATABASE finance_db;
   ```

## Step 2 — Move your data (optional, keeps existing records)

On your PC, back up the local database, then load it into TiDB:

```powershell
mysqldump -u root -p --single-transaction --no-tablespaces --set-gtid-purged=OFF --skip-triggers finance_db > finance_db_backup.sql
```

```powershell
mysql --host <TiDB host> --port 4000 -u <TiDB user> -p --ssl-mode=VERIFY_IDENTITY finance_db < finance_db_backup.sql
```

Keep `finance_db_backup.sql` safe — it is also your restore point.
(Skip this step to start the cloud with an empty database; tables are created automatically and user `admin` / `admin` is made — change that password at once.)

## Step 3 — Backend: Render

1. Sign up at **render.com** with GitHub.
2. **New → Blueprint** → choose repository `FIN_HYD_PROJECT_V1` → Render reads `render.yaml`.
3. Fill in the values it asks for:

   | Key | Value |
   |---|---|
   | `DB_URL` | `jdbc:mysql://<TiDB host>:4000/finance_db?sslMode=VERIFY_IDENTITY` |
   | `DB_USERNAME` | TiDB user (`xxxxxxxx.root`) |
   | `DB_PASSWORD` | TiDB password |
   | `CORS_ORIGIN` | leave `https://example.web.app` for now — fixed in Step 5 |
   | `JWT_SECRET` | a **new** secret — generate it with the command below |

   ```powershell
   $b = New-Object byte[] 48; [Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b); [Convert]::ToBase64String($b)
   ```
4. **Apply**. The first build takes 5–10 minutes. When it says *Live*, note the URL,
   e.g. `https://sri-balaji-finance-api.onrender.com`. The API is under
   `/balaji-finance`.

## Step 4 — Frontend: Firebase Hosting

> **Done (live):** https://sri-balaji-finance-hyd.web.app — a separate site
> inside the existing Firebase project `test-521ab` (account akumatha@gmail.com
> had reached its project limit). `.firebaserc` pins every deploy to that site
> through the `finance` target, so the project's other site is never touched.
> Always deploy with `--only hosting:finance`.

1. Create a project at **console.firebase.google.com** (Analytics not needed).
2. In `FIN_FRENTEND/Frentned_main`, copy `.env.production.example` to `.env.production` and set your Render URL:
   ```
   VITE_API_BASE=https://<your-render-service>.onrender.com/balaji-finance
   ```
3. Install the tool, sign in, link the project, build and deploy:
   ```powershell
   npm install -g firebase-tools
   ```
   ```powershell
   firebase login
   ```
   ```powershell
   firebase use --add
   ```
   ```powershell
   npm run build
   ```
   ```powershell
   firebase deploy --only hosting:finance
   ```
4. Note the site addresses: `https://<project-id>.web.app` and `https://<project-id>.firebaseapp.com`.

## Step 5 — Connect them (CORS)

In Render → your service → **Environment**, set:

```
CORS_ORIGIN=https://<project-id>.web.app,https://<project-id>.firebaseapp.com
```

For the live site that is:

```
CORS_ORIGIN=https://sri-balaji-finance-hyd.web.app,https://sri-balaji-finance-hyd.firebaseapp.com
```

Save — Render redeploys by itself.

## Step 6 — Check it works

1. Open `https://<project-id>.web.app`. If the backend was asleep, the first sign-in can take about a minute.
2. Sign in, pick a branch, open the dashboard and a report.
3. **Create one test loan** (Daily and Monthly) and check the account number goes up by one (DF/MF numbering runs on TiDB's `LAST_INSERT_ID`).
4. Print one report.

## Day-to-day notes

- **Updating:** push to GitHub → Render rebuilds the backend automatically. For the frontend run `npm run build` and `firebase deploy --only hosting:finance --account akumatha@gmail.com` again.
- **Sleeping backend:** on the free plan the first request after 15 idle minutes is slow (~1 min). That is normal.
- **Backups:** TiDB Starter has no free automatic backup you can download — export regularly:
  ```powershell
  mysqldump --host <TiDB host> --port 4000 -u <TiDB user> -p --ssl-mode=VERIFY_IDENTITY --single-transaction --no-tablespaces finance_db > backup_YYYY-MM-DD.sql
  ```
- **Local development is unchanged:** without `SPRING_PROFILES_ACTIVE=cloud` the backend uses `application.properties` (localhost MySQL) as before.
