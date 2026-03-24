import { useState } from "react";

const lines = {
  yellow: {
    name: "Yellow Line",
    color: "#F5A800",
    stations: [
      "Samaypur Badli", "Jahangirpuri", "Adarsh Nagar", "Azadpur",
      "GTB Nagar", "Vishwa Vidyalaya", "Kashmere Gate", "Chandni Chowk",
      "New Delhi", "Rajiv Chowk", "Central Secretariat", "INA",
      "Hauz Khas", "Saket", "Qutab Minar", "HUDA City Centre"
    ]
  },
  blue: {
    name: "Blue Line",
    color: "#1B4FD8",
    stations: [
      "Dwarka", "Janakpuri West", "Rajouri Garden", "Kirti Nagar",
      "Karol Bagh", "Rajiv Chowk", "Mandi House", "Yamuna Bank",
      "Laxmi Nagar", "Preet Vihar", "Anand Vihar", "Vaishali"
    ]
  },
  red: {
    name: "Red Line",
    color: "#E63946",
    stations: [
      "Rithala", "Pitampura", "Netaji Subhash Place", "Inderlok",
      "Tis Hazari", "Kashmere Gate", "Welcome", "Shahdara", "Dilshad Garden"
    ]
  },
  violet: {
    name: "Violet Line",
    color: "#7B2D8B",
    stations: [
      "Kashmere Gate", "ITO", "Mandi House", "Central Secretariat",
      "Khan Market", "Lajpat Nagar", "Nehru Place", "Kalkaji Mandir",
      "Sarita Vihar", "Badarpur Border"
    ]
  }
};

const stationLines = {};
Object.entries(lines).forEach(([key, line]) => {
  line.stations.forEach(s => {
    if (!stationLines[s]) stationLines[s] = [];
    stationLines[s].push(key);
  });
});

const allStations = Object.keys(stationLines).sort();

function getRoute(from, to) {
  if (!from || !to || from === to) return null;

  for (const lk of (stationLines[from] || [])) {
    if ((stationLines[to] || []).includes(lk)) {
      const arr = lines[lk].stations;
      const i = arr.indexOf(from);
      const j = arr.indexOf(to);
      const slice = i < j ? arr.slice(i, j + 1) : [...arr.slice(j, i + 1)].reverse();
      return [{ lineKey: lk, stations: slice }];
    }
  }

  for (const lk1 of (stationLines[from] || [])) {
    for (const lk2 of (stationLines[to] || [])) {
      const mid = lines[lk1].stations.find(s => lines[lk2].stations.includes(s));
      if (mid) {
        const a1 = lines[lk1].stations.indexOf(from);
        const b1 = lines[lk1].stations.indexOf(mid);
        const a2 = lines[lk2].stations.indexOf(mid);
        const b2 = lines[lk2].stations.indexOf(to);
        const seg1 = a1 < b1 ? lines[lk1].stations.slice(a1, b1 + 1) : [...lines[lk1].stations.slice(b1, a1 + 1)].reverse();
        const seg2 = a2 < b2 ? lines[lk2].stations.slice(a2, b2 + 1) : [...lines[lk2].stations.slice(b2, a2 + 1)].reverse();
        return [{ lineKey: lk1, stations: seg1 }, { lineKey: lk2, stations: seg2 }];
      }
    }
  }

  return null;
}

export default function App() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [fromInput, setFromInput] = useState("");
  const [toInput, setToInput] = useState("");
  const [showFromDrop, setShowFromDrop] = useState(false);
  const [showToDrop, setShowToDrop] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const [darkMode, setDarkMode] = useState(false);

  const [favourites, setFavourites] = useState([]);

  const fromSuggestions = fromInput.length > 0
    ? allStations.filter(s => s.toLowerCase().includes(fromInput.toLowerCase())).slice(0, 5)
    : [];

  const toSuggestions = toInput.length > 0
    ? allStations.filter(s => s.toLowerCase().includes(toInput.toLowerCase())).slice(0, 5)
    : [];

  const handleSearch = () => {
    if (!from || !to) {
      setError("Please select both stations");
      return;
    }
    if (from === to) {
      setError("From and To cannot be the same!");
      return;
    }
    const route = getRoute(from, to);
    if (!route) {
      setError("No route found. Try different stations.");
      setResult(null);
    } else {
      setError("");
      setResult(route);
    }
  };

  const saveFavourite = () => {
    if (!from || !to) return;
    const already = favourites.find(f => f.from === from && f.to === to);
    if (already) { alert("Already in favourites!"); return; }
    setFavourites([...favourites, { from, to }]);
  };

  const removeFavourite = (index) => {
    const updated = favourites.filter((_, i) => i !== index);
    setFavourites(updated);
  };

  const loadFavourite = (fav) => {
    setFrom(fav.from);
    setFromInput(fav.from);
    setTo(fav.to);
    setToInput(fav.to);
    setResult(null);
    setError("");
  };

  const totalStops = result ? result.reduce((sum, seg) => sum + seg.stations.length - 1, 0) : 0;

  const bg = darkMode ? "#1a1a2e" : "#f0f4f8";
  const cardBg = darkMode ? "#16213e" : "#fff";
  const cardBorder = darkMode ? "#0f3460" : "#ddd";
  const textColor = darkMode ? "#e0e0e0" : "#111";
  const mutedColor = darkMode ? "#aaa" : "#888";
  const inputBg = darkMode ? "#0f3460" : "#fff";
  const inputBorder = darkMode ? "#1a4a8a" : "#ccc";
  const inputColor = darkMode ? "#fff" : "#222";
  const dropBg = darkMode ? "#16213e" : "#fff";
  const dropBorder = darkMode ? "#0f3460" : "#ccc";
  const dropHover = darkMode ? "#0f3460" : "#f0f0f0";

  return (
    <div style={{ fontFamily: "Arial, sans-serif", minHeight: "100vh", display: "flex", flexDirection: "column", background: bg }}>

      <header>
        <div style={{ background: "#002460", padding: "4px 20px", fontSize: 11, color: "#aac4ff", display: "flex", justifyContent: "space-between" }}>
          <span>Delhi Metro Rail Corporation Ltd.</span>
          <span>A Govt. of India Enterprise</span>
        </div>
        <div style={{ background: "#003580", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>🚇</span>
          <div>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 20, letterSpacing: 1 }}>DELHI METRO</div>
            <div style={{ color: "#aac4ff", fontSize: 11, letterSpacing: 2 }}>ROUTE FINDER</div>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{ marginLeft: "auto", background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 14px", color: "#fff", cursor: "pointer", fontSize: 13 }}>
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
        <div style={{ background: "#002f70", borderTop: "1px solid rgba(255,255,255,0.1)", padding: "0 20px", display: "flex", gap: 24 }}>
          {["Route Finder", "Metro Map", "Fare Info", "Contact Us"].map((item, i) => (
            <span key={item} style={{
              padding: "9px 0", fontSize: 12, cursor: "pointer",
              color: i === 0 ? "#F5A800" : "#aac4ff",
              borderBottom: i === 0 ? "3px solid #F5A800" : "3px solid transparent",
              fontWeight: i === 0 ? 700 : 400,
            }}>
              {item}
            </span>
          ))}
        </div>
      </header>

      <main style={{ flex: 1 }}>
        <div style={{ maxWidth: 480, margin: "32px auto", padding: 20, background: cardBg, borderRadius: 8, boxShadow: "0 2px 12px rgba(0,0,0,0.08)", border: `1px solid ${cardBorder}` }}>

          <h1 style={{ color: "#1565C0", textAlign: "center", marginBottom: 4 }}>🚇 Delhi Metro</h1>
          <p style={{ textAlign: "center", color: mutedColor, marginTop: 0, marginBottom: 24, fontSize: 14 }}>
            Find your route
          </p>

          <div style={{ marginBottom: 14, position: "relative" }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold", fontSize: 14, color: textColor }}>From:</label>
            <input
              type="text"
              value={fromInput}
              onChange={e => { setFromInput(e.target.value); setFrom(""); setShowFromDrop(true); }}
              onFocus={() => setShowFromDrop(true)}
              onBlur={() => setTimeout(() => setShowFromDrop(false), 150)}
              placeholder="e.g. Rajiv Chowk"
              style={{ width: "100%", padding: 10, fontSize: 15, border: `1px solid ${inputBorder}`, borderRadius: 6, boxSizing: "border-box", background: inputBg, color: inputColor }}
            />
            {showFromDrop && fromSuggestions.length > 0 && (
              <ul style={{ position: "absolute", background: dropBg, border: `1px solid ${dropBorder}`, borderRadius: 6, width: "100%", margin: 0, padding: 0, listStyle: "none", zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                {fromSuggestions.map(s => (
                  <li key={s} onMouseDown={() => { setFrom(s); setFromInput(s); setShowFromDrop(false); }}
                    style={{ padding: "9px 12px", cursor: "pointer", borderBottom: `1px solid ${dropBorder}`, fontSize: 14, color: textColor }}
                    onMouseEnter={e => e.currentTarget.style.background = dropHover}
                    onMouseLeave={e => e.currentTarget.style.background = dropBg}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ marginBottom: 18, position: "relative" }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "bold", fontSize: 14, color: textColor }}>To:</label>
            <input
              type="text"
              value={toInput}
              onChange={e => { setToInput(e.target.value); setTo(""); setShowToDrop(true); }}
              onFocus={() => setShowToDrop(true)}
              onBlur={() => setTimeout(() => setShowToDrop(false), 150)}
              placeholder="e.g. Hauz Khas"
              style={{ width: "100%", padding: 10, fontSize: 15, border: `1px solid ${inputBorder}`, borderRadius: 6, boxSizing: "border-box", background: inputBg, color: inputColor }}
            />
            {showToDrop && toSuggestions.length > 0 && (
              <ul style={{ position: "absolute", background: dropBg, border: `1px solid ${dropBorder}`, borderRadius: 6, width: "100%", margin: 0, padding: 0, listStyle: "none", zIndex: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                {toSuggestions.map(s => (
                  <li key={s} onMouseDown={() => { setTo(s); setToInput(s); setShowToDrop(false); }}
                    style={{ padding: "9px 12px", cursor: "pointer", borderBottom: `1px solid ${dropBorder}`, fontSize: 14, color: textColor }}
                    onMouseEnter={e => e.currentTarget.style.background = dropHover}
                    onMouseLeave={e => e.currentTarget.style.background = dropBg}>
                    {s}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, marginBottom: 0 }}>
            <button onClick={handleSearch}
              style={{ flex: 1, padding: 12, background: "#1565C0", color: "#fff", border: "none", borderRadius: 6, fontSize: 16, cursor: "pointer", fontWeight: "bold" }}>
              Search Route
            </button>
            {/* ── NEW: save favourite button */}
            <button onClick={saveFavourite}
              style={{ padding: "12px 14px", background: from && to ? "#FFF3CD" : "#f5f5f5", border: "1px solid #F5A800", borderRadius: 6, fontSize: 18, cursor: "pointer" }}
              title="Save to favourites">
              #
            </button>
          </div>

          {error && (
            <p style={{ color: "red", textAlign: "center", marginTop: 12, fontSize: 14 }}>{error}</p>
          )}

          {/* ── NEW: Favourites section */}
          {favourites.length > 0 && (
            <div style={{ marginTop: 20, borderTop: `1px solid ${cardBorder}`, paddingTop: 14 }}>
              <p style={{ fontWeight: "bold", fontSize: 13, color: textColor, marginBottom: 8 }}>⭐ Saved Routes</p>
              {favourites.map((fav, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 10px", background: darkMode ? "#0f3460" : "#f9f9f9", borderRadius: 6, marginBottom: 6, border: `1px solid ${cardBorder}` }}>
                  <span style={{ fontSize: 13, color: textColor, cursor: "pointer" }} onClick={() => loadFavourite(fav)}>
                    {fav.from} → {fav.to}
                  </span>
                  <button onClick={() => removeFavourite(i)}
                    style={{ background: "none", border: "none", color: "#E63946", cursor: "pointer", fontSize: 16, padding: "0 4px" }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {result && (
            <div style={{ marginTop: 24, border: `1px solid ${cardBorder}`, borderRadius: 8, overflow: "hidden" }}>
              <div style={{ background: "#1565C0", color: "#fff", padding: "10px 14px", fontSize: 14 }}>
                Route found! — {totalStops} stops &nbsp;|&nbsp; ~{totalStops * 2} min
              </div>

              <div style={{ padding: 14 }}>
                {result.map((seg, si) => (
                  <div key={si} style={{ marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 12, height: 12, borderRadius: "50%", background: lines[seg.lineKey].color }} />
                      <strong style={{ fontSize: 14, color: lines[seg.lineKey].color }}>{lines[seg.lineKey].name}</strong>
                    </div>

                    <div style={{ paddingLeft: 8, borderLeft: `3px solid ${lines[seg.lineKey].color}` }}>
                      {seg.stations.map((st, i) => {
                        const isEnd = i === 0 || i === seg.stations.length - 1;
                        return (
                          <div key={st} style={{ display: "flex", alignItems: "center", gap: 8, padding: "3px 0" }}>
                            <div style={{
                              width: isEnd ? 10 : 6, height: isEnd ? 10 : 6,
                              borderRadius: "50%", background: isEnd ? lines[seg.lineKey].color : "#ccc",
                              flexShrink: 0, marginLeft: -6
                            }} />
                            <span style={{ fontSize: isEnd ? 14 : 13, fontWeight: isEnd ? "bold" : "normal", color: isEnd ? textColor : mutedColor }}>
                              {st}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {si < result.length - 1 && (
                      <p style={{ fontSize: 13, color: mutedColor, marginLeft: 8, marginTop: 6 }}>
                        ↓ Change to <span style={{ color: lines[result[si + 1].lineKey].color, fontWeight: "bold" }}>{lines[result[si + 1].lineKey].name}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <footer style={{ background: "#002460", color: "#aac4ff", fontSize: 12, padding: "20px 24px", marginTop: "auto" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 14 }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, marginBottom: 6 }}>DELHI METRO RAIL CORPORATION</div>
            <div>Metro Bhawan, Fire Brigade Lane</div>
            <div>Barakhamba Road, New Delhi - 110001</div>
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, marginBottom: 6 }}>QUICK LINKS</div>
            {["Metro Map", "Fare Chart", "Timetable", "Lost & Found"].map(l => (
              <div key={l} style={{ cursor: "pointer", marginBottom: 3 }}>{l}</div>
            ))}
          </div>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, marginBottom: 6 }}>INFO</div>
            <div>Metro Timing: 5:30 AM – 11:30 PM</div>
            <div style={{ marginTop: 4 }}>New Delhi, India</div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 12, textAlign: "center" }}>
          © 2024 Delhi Metro Rail Corporation Ltd. | A Joint Venture of Govt. of India & Govt. of NCT Delhi
        </div>
      </footer>

    </div>
  );
}