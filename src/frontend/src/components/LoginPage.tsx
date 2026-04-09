import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { KeyRound, Loader2, Lock, User, UserPlus } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const LOGO_PATH =
  "/assets/jmd_fincap_logo-removebg-preview-019d58bd-7f9a-73da-8a9d-5536a76c7a36.png";

const NAVY = "#001F3F";
const GOLD = "#E68A00";
const GOLD_LIGHT = "#E8B84B";

// Admin key required to create a new account
const ADMIN_CREATION_KEY = "JMD@ADMIN2024";

// Stored accounts (in-memory for this session; real apps would use a backend)
const ACCOUNTS: Record<string, string> = {
  admin: "jmdfincap@123",
};

type Mode = "login" | "forgot" | "create";

interface Props {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: Props) {
  const [mode, setMode] = useState<Mode>("login");

  // Login state
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot password state
  const [forgotContact, setForgotContact] = useState("");
  const [forgotMsg, setForgotMsg] = useState("");

  // Create account state
  const [newUserId, setNewUserId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [createMsg, setCreateMsg] = useState("");
  const [createError, setCreateError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    const stored = ACCOUNTS[userId.trim()];
    if (stored && stored === password) {
      onLogin();
    } else {
      setError("Invalid User ID or Password. Please try again.");
      setLoading(false);
    }
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotContact.trim()) return;
    setForgotMsg(
      "Password reset request submitted. Please contact JMD Fincap admin at info@jmdfincap.com or call 8889956204 with your registered details.",
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCreateError("");
    setCreateMsg("");
    if (adminKey !== ADMIN_CREATION_KEY) {
      setCreateError("Invalid Admin Key. Contact your system administrator.");
      return;
    }
    if (!newUserId.trim()) {
      setCreateError("Please enter a User ID.");
      return;
    }
    if (ACCOUNTS[newUserId.trim()]) {
      setCreateError("This User ID already exists.");
      return;
    }
    if (newPassword.length < 6) {
      setCreateError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== newPassword2) {
      setCreateError("Passwords do not match.");
      return;
    }
    ACCOUNTS[newUserId.trim()] = newPassword;
    setCreateMsg(
      `Account '${newUserId.trim()}' created successfully. You can now log in.`,
    );
    setNewUserId("");
    setNewPassword("");
    setNewPassword2("");
    setAdminKey("");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background: `linear-gradient(135deg, ${NAVY} 0%, #002855 40%, #0a1628 100%)`,
        fontFamily: "'Montserrat', 'Roboto', Arial, sans-serif",
      }}
      data-ocid="login.page"
    >
      {/* Background decorative circles */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-120px",
          right: "-120px",
          width: "420px",
          height: "420px",
          borderRadius: "50%",
          border: "1px solid rgba(230,138,0,0.12)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "-60px",
          right: "-60px",
          width: "260px",
          height: "260px",
          borderRadius: "50%",
          border: "1px solid rgba(230,138,0,0.18)",
          pointerEvents: "none",
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          bottom: "-120px",
          left: "-120px",
          width: "380px",
          height: "380px",
          borderRadius: "50%",
          border: "1px solid rgba(230,138,0,0.10)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ width: "100%", maxWidth: "420px", padding: "0 16px" }}
      >
        {/* Card */}
        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(230,138,0,0.25)",
            borderRadius: "16px",
            padding: "40px 36px 36px",
            backdropFilter: "blur(12px)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.55)",
          }}
        >
          {/* Logo + Title */}
          <div style={{ textAlign: "center", marginBottom: "28px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: `linear-gradient(135deg, ${NAVY} 0%, #002855 100%)`,
                border: "2px solid rgba(230,138,0,0.35)",
                marginBottom: "16px",
                boxShadow: "0 0 24px rgba(230,138,0,0.2)",
              }}
            >
              <img
                src={LOGO_PATH}
                alt="JMD Fincap"
                style={{
                  height: "52px",
                  width: "auto",
                  objectFit: "contain",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>

            <div
              style={{
                fontSize: "18px",
                fontWeight: 800,
                color: GOLD_LIGHT,
                letterSpacing: "0.06em",
                textTransform: "uppercase" as const,
              }}
            >
              JMD FINCAP PVT. LTD.
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.1em",
                marginTop: "4px",
                textTransform: "uppercase" as const,
              }}
            >
              Document Generation Portal
            </div>

            {/* Divider */}
            <div
              style={{
                margin: "16px auto 0",
                height: "1px",
                width: "80%",
                background:
                  "linear-gradient(90deg, transparent, rgba(230,138,0,0.5), transparent)",
              }}
            />
          </div>

          {/* Mode badge */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(230,138,0,0.12)",
                border: "1px solid rgba(230,138,0,0.25)",
                borderRadius: "20px",
                padding: "4px 16px",
              }}
            >
              {mode === "login" && (
                <Lock style={{ width: "12px", height: "12px", color: GOLD }} />
              )}
              {mode === "forgot" && (
                <KeyRound
                  style={{ width: "12px", height: "12px", color: GOLD }}
                />
              )}
              {mode === "create" && (
                <UserPlus
                  style={{ width: "12px", height: "12px", color: GOLD }}
                />
              )}
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  color: GOLD,
                  letterSpacing: "0.08em",
                }}
              >
                {mode === "login" && "ADMIN ACCESS"}
                {mode === "forgot" && "FORGOT PASSWORD"}
                {mode === "create" && "CREATE ACCOUNT"}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {/* ─── LOGIN FORM ─── */}
            {mode === "login" && (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.22 }}
                onSubmit={handleSubmit}
                className="space-y-4"
                data-ocid="login.modal"
              >
                {/* User ID */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="userId"
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}
                  >
                    USER ID
                  </Label>
                  <div className="relative">
                    <User
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "rgba(230,138,0,0.7)" }}
                    />
                    <Input
                      id="userId"
                      type="text"
                      placeholder="Enter your User ID"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      required
                      autoComplete="username"
                      className="pl-9"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "white",
                        fontSize: "13px",
                      }}
                      data-ocid="login.input"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <Label
                    htmlFor="password"
                    style={{
                      color: "rgba(255,255,255,0.75)",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                    }}
                  >
                    PASSWORD
                  </Label>
                  <div className="relative">
                    <Lock
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                      style={{ color: "rgba(230,138,0,0.7)" }}
                    />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      autoComplete="current-password"
                      className="pl-9"
                      style={{
                        background: "rgba(255,255,255,0.07)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "white",
                        fontSize: "13px",
                      }}
                      data-ocid="login.input"
                    />
                  </div>
                  {/* Forgot password link */}
                  <div style={{ textAlign: "right", marginTop: "4px" }}>
                    <button
                      type="button"
                      onClick={() => {
                        setMode("forgot");
                        setError("");
                        setForgotMsg("");
                        setForgotContact("");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "11px",
                        color: GOLD_LIGHT,
                        fontWeight: 600,
                        letterSpacing: "0.02em",
                        textDecoration: "underline",
                        fontFamily: "inherit",
                      }}
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{
                      background: "rgba(192,57,43,0.15)",
                      border: "1px solid rgba(192,57,43,0.4)",
                      borderRadius: "6px",
                      padding: "8px 12px",
                      fontSize: "12px",
                      color: "#FF6B6B",
                      fontWeight: 500,
                    }}
                    data-ocid="login.error_state"
                  >
                    ⚠ {error}
                  </motion.div>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full font-bold py-5 mt-2"
                  style={{
                    background: loading
                      ? "rgba(192,138,26,0.5)"
                      : `linear-gradient(135deg, #C08A1A 0%, ${GOLD_LIGHT} 50%, #B07A16 100%)`,
                    color: NAVY,
                    fontSize: "14px",
                    fontWeight: 800,
                    letterSpacing: "0.04em",
                    border: "none",
                    boxShadow: loading
                      ? "none"
                      : "0 4px 18px rgba(192,138,26,0.4)",
                  }}
                  data-ocid="login.submit_button"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "LOGIN TO PORTAL"
                  )}
                </Button>

                {/* Create account link */}
                <div style={{ textAlign: "center", marginTop: "12px" }}>
                  <span
                    style={{
                      fontSize: "12px",
                      color: "rgba(255,255,255,0.35)",
                    }}
                  >
                    Don&apos;t have an account?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("create");
                      setError("");
                      setCreateMsg("");
                      setCreateError("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "12px",
                      color: GOLD_LIGHT,
                      fontWeight: 700,
                      textDecoration: "underline",
                      fontFamily: "inherit",
                    }}
                  >
                    Create Account
                  </button>
                </div>
              </motion.form>
            )}

            {/* ─── FORGOT PASSWORD FORM ─── */}
            {mode === "forgot" && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
              >
                {!forgotMsg ? (
                  <form onSubmit={handleForgot} className="space-y-4">
                    <div
                      style={{
                        fontSize: "12px",
                        color: "rgba(255,255,255,0.55)",
                        marginBottom: "8px",
                        lineHeight: 1.6,
                      }}
                    >
                      Enter your registered email or mobile number. We will help
                      you reset your password.
                    </div>
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="forgotContact"
                        style={{
                          color: "rgba(255,255,255,0.75)",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                        }}
                      >
                        EMAIL / MOBILE NUMBER
                      </Label>
                      <Input
                        id="forgotContact"
                        type="text"
                        placeholder="e.g. info@jmdfincap.com or 8889956204"
                        value={forgotContact}
                        onChange={(e) => setForgotContact(e.target.value)}
                        required
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "white",
                          fontSize: "13px",
                        }}
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full font-bold py-5"
                      style={{
                        background: `linear-gradient(135deg, #C08A1A 0%, ${GOLD_LIGHT} 50%, #B07A16 100%)`,
                        color: NAVY,
                        fontSize: "13px",
                        fontWeight: 800,
                        border: "none",
                      }}
                    >
                      SUBMIT RESET REQUEST
                    </Button>
                    <div style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.45)",
                          fontFamily: "inherit",
                          textDecoration: "underline",
                        }}
                      >
                        ← Back to Login
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div
                      style={{
                        background: "rgba(46,160,67,0.15)",
                        border: "1px solid rgba(46,160,67,0.4)",
                        borderRadius: "8px",
                        padding: "14px",
                        fontSize: "12px",
                        color: "#6BCF8A",
                        fontWeight: 500,
                        lineHeight: 1.6,
                      }}
                    >
                      ✓ {forgotMsg}
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          color: GOLD_LIGHT,
                          fontFamily: "inherit",
                          textDecoration: "underline",
                          fontWeight: 600,
                        }}
                      >
                        ← Back to Login
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* ─── CREATE ACCOUNT FORM ─── */}
            {mode === "create" && (
              <motion.div
                key="create"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
              >
                {!createMsg ? (
                  <form onSubmit={handleCreate} className="space-y-3">
                    <div
                      style={{
                        fontSize: "11.5px",
                        color: "rgba(255,255,255,0.45)",
                        marginBottom: "4px",
                        lineHeight: 1.5,
                        background: "rgba(230,138,0,0.08)",
                        border: "1px solid rgba(230,138,0,0.2)",
                        borderRadius: "6px",
                        padding: "8px 10px",
                      }}
                    >
                      🔐 An{" "}
                      <strong style={{ color: GOLD_LIGHT }}>Admin Key</strong>{" "}
                      is required to create a new account.
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        style={{
                          color: "rgba(255,255,255,0.75)",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                        }}
                      >
                        NEW USER ID
                      </Label>
                      <Input
                        type="text"
                        placeholder="Choose a User ID"
                        value={newUserId}
                        onChange={(e) => setNewUserId(e.target.value)}
                        required
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "white",
                          fontSize: "13px",
                        }}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        style={{
                          color: "rgba(255,255,255,0.75)",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                        }}
                      >
                        PASSWORD
                      </Label>
                      <Input
                        type="password"
                        placeholder="Min. 6 characters"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "white",
                          fontSize: "13px",
                        }}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        style={{
                          color: "rgba(255,255,255,0.75)",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                        }}
                      >
                        CONFIRM PASSWORD
                      </Label>
                      <Input
                        type="password"
                        placeholder="Re-enter password"
                        value={newPassword2}
                        onChange={(e) => setNewPassword2(e.target.value)}
                        required
                        style={{
                          background: "rgba(255,255,255,0.07)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "white",
                          fontSize: "13px",
                        }}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        style={{
                          color: "rgba(255,255,255,0.75)",
                          fontSize: "12px",
                          fontWeight: 600,
                          letterSpacing: "0.04em",
                        }}
                      >
                        ADMIN KEY
                      </Label>
                      <div className="relative">
                        <KeyRound
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                          style={{ color: "rgba(230,138,0,0.7)" }}
                        />
                        <Input
                          type="password"
                          placeholder="Enter special Admin Key"
                          value={adminKey}
                          onChange={(e) => setAdminKey(e.target.value)}
                          required
                          className="pl-9"
                          style={{
                            background: "rgba(255,255,255,0.07)",
                            border: "1px solid rgba(255,255,255,0.15)",
                            color: "white",
                            fontSize: "13px",
                          }}
                        />
                      </div>
                    </div>

                    {createError && (
                      <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                          background: "rgba(192,57,43,0.15)",
                          border: "1px solid rgba(192,57,43,0.4)",
                          borderRadius: "6px",
                          padding: "8px 12px",
                          fontSize: "12px",
                          color: "#FF6B6B",
                          fontWeight: 500,
                        }}
                      >
                        ⚠ {createError}
                      </motion.div>
                    )}

                    <Button
                      type="submit"
                      className="w-full font-bold py-5"
                      style={{
                        background: `linear-gradient(135deg, #C08A1A 0%, ${GOLD_LIGHT} 50%, #B07A16 100%)`,
                        color: NAVY,
                        fontSize: "13px",
                        fontWeight: 800,
                        border: "none",
                        marginTop: "4px",
                      }}
                    >
                      CREATE ACCOUNT
                    </Button>

                    <div style={{ textAlign: "center" }}>
                      <button
                        type="button"
                        onClick={() => setMode("login")}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "12px",
                          color: "rgba(255,255,255,0.45)",
                          fontFamily: "inherit",
                          textDecoration: "underline",
                        }}
                      >
                        ← Back to Login
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div
                      style={{
                        background: "rgba(46,160,67,0.15)",
                        border: "1px solid rgba(46,160,67,0.4)",
                        borderRadius: "8px",
                        padding: "14px",
                        fontSize: "12px",
                        color: "#6BCF8A",
                        fontWeight: 500,
                        lineHeight: 1.6,
                      }}
                    >
                      ✓ {createMsg}
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        setMode("login");
                        setCreateMsg("");
                      }}
                      className="w-full font-bold py-5"
                      style={{
                        background: `linear-gradient(135deg, #C08A1A 0%, ${GOLD_LIGHT} 50%, #B07A16 100%)`,
                        color: NAVY,
                        fontSize: "13px",
                        fontWeight: 800,
                        border: "none",
                      }}
                    >
                      GO TO LOGIN
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer note */}
          <div
            style={{
              marginTop: "20px",
              textAlign: "center",
              fontSize: "10px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.03em",
            }}
          >
            CIN: U65929MP2022PTC059300 &nbsp;|&nbsp; RBI Reg. No.: N-07.02264
          </div>
        </div>

        {/* Attribution */}
        <div
          style={{
            textAlign: "center",
            marginTop: "16px",
            fontSize: "10px",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          &copy; {new Date().getFullYear()} JMD Fincap Pvt. Ltd. All rights
          reserved.
        </div>
      </motion.div>
    </div>
  );
}
