# Task: Fix missing src/utils/toast import in BalanceSheet.jsx

## Steps:

- ✅ 1. Created `src/utils/toast.js` re-exporting `{ errorToast, successToast, confirmToast }` from `../../toastify.js`

- ⏳ 2. Verify resolution: Restart Vite dev server (`npm run dev`) and confirm no more import error in BalanceSheet.jsx

- ⏳ 3. Test errorToast: Load BalanceSheet without login or trigger API error to see toast

- ⏳ 4. Scan for other missing toast imports if any

- ⏳ 5. Complete
