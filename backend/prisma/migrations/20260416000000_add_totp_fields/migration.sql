-- Add TOTP 2FA fields to admin_users table
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS totp_secret VARCHAR(255);
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS totp_enabled BOOLEAN DEFAULT FALSE;