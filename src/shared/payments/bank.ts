/**
 * Bank account shown to buyers who pay by deposit / SPEI.
 *
 * `configured` is the switch every buyer-facing surface keys on: while the
 * BANK_* env vars are empty we never print placeholder account data. Instead
 * the site and the emails tell the buyer we'll send the deposit details by
 * email, and ops gets a notice to do exactly that.
 */
export interface BankDetails {
  configured: boolean;
  name: string;
  beneficiary: string;
  clabe: string;
  account: string;
}

export function getBankDetails(): BankDetails {
  const name = (process.env.BANK_NAME ?? "").trim();
  const beneficiary = (process.env.BANK_BENEFICIARY ?? "").trim();
  const clabe = (process.env.BANK_CLABE ?? "").trim();
  const account = (process.env.BANK_ACCOUNT_NUMBER ?? "").trim();
  return {
    // A bank name and CLABE are the minimum a buyer needs to send a SPEI.
    configured: name.length > 0 && clabe.length > 0,
    name,
    beneficiary,
    clabe,
    account,
  };
}
