-- Manual fallback for the indexes Hibernate's ddl-auto=update will also create
-- automatically on next application boot (see @Table(indexes=...) on the
-- corresponding entities in src/main/java/com/balaji/finance/entity).
--
-- Run this by hand against the live MySQL `finance_db` if you'd rather control
-- exactly when index creation happens (e.g. during a maintenance window) than
-- rely on next-boot auto-DDL. Index names match the @Index(name=...) values in
-- the entities, so whichever mechanism runs first is correctly recognized by
-- the other and the second one becomes a no-op-by-intent (see note below).
--
-- NOTE: MySQL's CREATE INDEX has no IF NOT EXISTS. This script is intended to
-- run ONCE. Running it a second time (or running it after Hibernate has
-- already created the same-named indexes on boot) will fail with
-- "ERROR 1061 (42000): Duplicate key name '...'" on each already-existing
-- index -- that error is harmless and just means that index already exists;
-- it does not corrupt data or the table.

-- CASH_BOOK -- highest-traffic, continuously-growing ledger table
CREATE INDEX idx_cb_member_code  ON CASH_BOOK (BUSINESS_MEMBER_ID, ACCOUNT_MASTER_CODE);
CREATE INDEX idx_cb_code_date    ON CASH_BOOK (ACCOUNT_MASTER_CODE, TRANS_DATE);
CREATE INDEX idx_cb_date_type    ON CASH_BOOK (TRANS_DATE, ACCOUNT_MASTER_TYPE);
CREATE INDEX idx_cb_person_code  ON CASH_BOOK (PERSONAL_INFO_ID, ACCOUNT_MASTER_CODE);
CREATE INDEX idx_cb_user_date    ON CASH_BOOK (ENTRY_USER, TRANS_DATE);
CREATE INDEX idx_cb_payment_ref  ON CASH_BOOK (PAYMENT_REF_ID);

-- BUSINESS_MEMBER
CREATE INDEX idx_bm_status_start ON BUSINESS_MEMBER (LOAN_STATUS, START_DATE);
CREATE INDEX idx_bm_status_end   ON BUSINESS_MEMBER (LOAN_STATUS, END_DATE);
CREATE INDEX idx_bm_loan_type    ON BUSINESS_MEMBER (LOAN_TYPE);

-- EMI
CREATE INDEX idx_emi_duedate       ON EMI (due_date);
CREATE INDEX idx_emi_member_status ON EMI (business_member_id, status);

-- PERSONAL_INFO
CREATE INDEX idx_pi_category_disable ON PERSONAL_INFO (CATEGORY, DISABLE);

-- accountmaster
CREATE INDEX idx_am_mastercode_code ON accountmaster (MASTER_CODE, code);
CREATE INDEX idx_am_visibility      ON accountmaster (VISIBILITY);

-- PAYMENT_ALLOCATION
CREATE INDEX idx_pa_payment_ref ON PAYMENT_ALLOCATION (PAYMENT_REF_ID);

-- CASH_BOOK_BACKUP
CREATE INDEX idx_cbb_trans_date ON CASH_BOOK_BACKUP (TRANS_DATE);

-- REFRESH_TOKEN -- new table, created fresh by ddl-auto=update; only needed here
-- if you create the table by hand instead of letting Hibernate do it.
-- CREATE INDEX idx_rt_user ON REFRESH_TOKEN (user_id);
