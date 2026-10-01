import { useEffect, useState, type ReactNode } from "react";

const CORRECT_PASSWORD = "06062024"; // change this

export default function PasswordGate({ children }: { children: ReactNode }) {
  const [input, setInput] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("gate-unlocked") === "true") setUnlocked(true);
  }, []);
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() === CORRECT_PASSWORD) {
      sessionStorage.setItem("gate-unlocked", "true");
      setUnlocked(true);
    } else {
      setError(true);
    }
  };

  if (unlocked) return <>{children}</>;

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", background: "#1a0008",
      color: "#fff", fontFamily: "serif", padding: 20
    }}>
      <form onSubmit={handleSubmit} style={{ textAlign: "center" }}>
        <p style={{ marginBottom: 16, fontSize: 18 }}>Enter the passcode 💕</p>
        <input
          type="password"
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(false); }}
          style={{ padding: "10px 16px", borderRadius: 20, border: "none", textAlign: "center" }}
          autoFocus
        />
        <br />
        <button type="submit" style={{
          marginTop: 12, padding: "10px 24px", borderRadius: 20,
          background: "#b3123f", color: "#fff", border: "none"
        }}>
          Unlock
        </button>
        {error && <p style={{ color: "#ff8080", marginTop: 10 }}>Not quite — try again.</p>}
      </form>
    </div>
  );
}
