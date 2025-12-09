// lib/api.js
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function submitEducationPlan(data, token) {
  const res = await fetch(`${API_BASE}/students/education-plan`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function getMatchedNBFCs(token) {
  const res = await fetch(`${API_BASE}/loan/matched-nbfcs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.json();
}
