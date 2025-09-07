# Somnia Claim Web (Next.js + thirdweb)

Production-ready template to connect a wallet on **Somnia Shannon Testnet (Chain ID 50312)** and claim from a **DropERC20 (Token Drop)** contract.

## Quickstart
```bash
cp .env.example .env.local
# put your values in .env.local
npm i
npm run dev
```

Open http://localhost:3000

## Env
- `NEXT_PUBLIC_THIRDWEB_CLIENT_ID` — get one free from the thirdweb dashboard.
- `NEXT_PUBLIC_DROP_ERC20` — your deployed DropERC20 (Token Drop) address on Somnia **testnet**.

## Scripts
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm start` — run production build

## Notes
- If your claim phase has a price in native token, the `claimTo` helper auto-attaches the right value.
- If your phase uses an ERC-20 currency or is free, it also Just Works™.
