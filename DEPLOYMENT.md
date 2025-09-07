# Deploying to Vercel (Next.js)

1. **Push to GitHub** (this repo). Make sure you do **not** commit any `.env*` files.
2. In **Vercel → New Project → Import from GitHub**, select this repo.
3. In **Settings → Environment Variables** add:
   - `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` = your Thirdweb client ID
   - `NEXT_PUBLIC_DROP_ERC20` = your Somnia (50312) DropERC20 address
   - `NEXT_PUBLIC_TOKEN_SYMBOL` = `STT` (or your token symbol)
   - **One** of the following for Pinata uploads:
     - `PINATA_JWT` *or*
     - `PINATA_KEY` and `PINATA_SECRET`
4. Keep the default build settings (Framework detected: **Next.js**).
5. Click **Deploy**. Vercel will run `npm install`, `next build`, and host the app.

> Pro tip: If you ever see a warning like "You should not upload the `.next` directory",
> it means `.next` was accidentally committed. This repo's `.gitignore` prevents that.
