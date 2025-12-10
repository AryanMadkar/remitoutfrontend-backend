"use client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const buttonStyle = {
    padding: "15px 30px",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#fff",
    border: "none",
    borderRadius: "0px", // Sharp corners
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "background-color 0.3s ease, transform 0.2s ease",
    textDecoration: "none", // In case Link renders an <a>
    display: "inline-block", // To ensure padding and box-shadow work correctly with Link
  };

  const primaryButton = {
    ...buttonStyle,
    backgroundColor: "#007bff", // A professional blue
  };

  const secondaryButton = {
    ...buttonStyle,
    backgroundColor: "#28a745", // A professional green
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f0f2f5", // Light background for a clean look
        fontFamily: "Arial, sans-serif",
        color: "#333",
      }}
    >
      <h1
        style={{ marginBottom: "40px", fontSize: "2.5em", fontWeight: "bold" }}
      >
        Welcome
      </h1>
      <div style={{ display: "flex", gap: "30px" }}>
        <button
          style={primaryButton}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#0056b3")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#007bff")
          }
          onClick={() => router.push("/student/application/education")}
          onMouseDown={(e) =>
            (e.currentTarget.style.transform = "scale(0.98)")
          }
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Application Form
        </button>
        <button
          style={secondaryButton}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#218838")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#28a745")
          }
          onClick={() => router.push("/student/dashboard")}
          onMouseDown={(e) =>
            (e.currentTarget.style.transform = "scale(0.98)")
          }
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          Dashboard
        </button>
      </div>
    </div>
  );
}
