import React, { useState } from 'react';

// List of languages (for now: minimal set; can be expanded later)
const LANGUAGES = [
  { code: 'auto', name: 'Auto Detect' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'zh', name: 'Chinese' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ar', name: 'Arabic' },
  { code: 'ru', name: 'Russian' }
];

// PUBLIC_INTERFACE
function TranslationUI() {
  // State for input, translation, source language, target language
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('en');
  
  // Translate function - calls MyMemory Translation API for translation
  // PUBLIC_INTERFACE
  const handleTranslate = async () => {
    if (!input.trim()) {
      setOutput('');
      return;
    }
    setOutput('Translating...');
    try {
      // MyMemory API expects langpair as e.g. "en|es"
      // If auto-detect is chosen, MyMemory allows "auto|target"
      const langpair =
        (sourceLang === 'auto' ? 'auto' : sourceLang) + '|' + targetLang;

      // API params
      let url =
        'https://api.mymemory.translated.net/get' +
        '?q=' + encodeURIComponent(input) +
        '&langpair=' + encodeURIComponent(langpair);

      // Optionally, add &de=<email> for identification if desired

      const res = await fetch(url);

      if (!res.ok) {
        throw new Error(`API error (${res.status}): ${res.statusText}`);
      }

      const data = await res.json();

      // MyMemory returns data.responseData.translatedText for translation
      if (
        data &&
        data.responseData &&
        typeof data.responseData.translatedText === 'string'
      ) {
        const result = data.responseData.translatedText.trim();
        // MyMemory sometimes returns same as input if language pair is invalid
        if (result.length === 0) {
          setOutput("No translation received.");
        } else if (
          result === input &&
          sourceLang !== targetLang &&
          sourceLang !== 'auto'
        ) {
          setOutput(
            "Translation unavailable for selected pair or already in target language."
          );
        } else {
          setOutput(result);
        }
      } else if (data && data.responseDetails) {
        setOutput(
          "API error: " + data.responseDetails
        );
      } else {
        setOutput("Unexpected response from translation API.");
      }
    } catch (err) {
      setOutput(
        "Translation failed. " +
        (err.message || "An unknown error occurred.")
      );
    }
  };
  
  // PUBLIC_INTERFACE
  const handleCopyOutput = () => {
    if (output) navigator.clipboard.writeText(output);
  };

  // Colors as per requirements
  const colors = {
    primary: "#4A90E2",
    secondary: "#50E3C2",
    accent: "#F5A623"
  };

  // Responsive & clean layout styles (inline for component isolation)
  return (
    <div style={{
      maxWidth: 540,
      margin: "40px auto",
      padding: 24,
      background: "#fff",
      borderRadius: 18,
      boxShadow: "0 4px 28px rgba(74,144,226,0.09)",
      display: "flex",
      flexDirection: "column",
      gap: 26,
      fontFamily: "'Inter','Roboto',sans-serif"
    }}>
      {/* Input Area */}
      <label style={{fontWeight: 500, color: "#333", fontSize: 16, marginBottom: 4}}>Enter Text</label>
      <textarea
        rows={5}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Type or paste text here... 😊"
        style={{
          width: "100%",
          fontSize: 17,
          border: `1.5px solid ${colors.primary}`,
          borderRadius: 8,
          resize: "vertical",
          padding: 12,
          fontFamily: "'Inter','Segoe UI Emoji','Roboto',sans-serif",
          outline: "none",
          color: "#222",
          backgroundColor: "#fafdff",
          minHeight: 80
        }}
      />

      {/* Language selectors */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 10
      }}>
        {/* Source */}
        <div style={{flex: 1, minWidth: 140}}>
          <label style={{fontSize: 14, color: "#888"}}>From</label>
          <select
            value={sourceLang}
            onChange={e => setSourceLang(e.target.value)}
            style={{
              width: "100%",
              marginTop: 2,
              padding: "10px 10px",
              border: `1.5px solid ${colors.secondary}`,
              borderRadius: 7,
              background: "#fcfcfc",
              color: "#222",
              fontSize: 15,
              fontWeight: 500
            }}>
            {LANGUAGES.map(lang =>
              <option value={lang.code} key={lang.code}>
                {lang.name}
              </option>
            )}
          </select>
        </div>
        {/* Arrow icon */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", padding: "0 10px"
        }}>
          <span style={{fontSize: 20, color: colors.primary, fontWeight: 600}}>→</span>
        </div>
        {/* Target */}
        <div style={{flex: 1, minWidth: 140}}>
          <label style={{fontSize: 14, color: "#888"}}>To</label>
          <select
            value={targetLang}
            onChange={e => setTargetLang(e.target.value)}
            style={{
              width: "100%",
              marginTop: 2,
              padding: "10px 10px",
              border: `1.5px solid ${colors.accent}`,
              borderRadius: 7,
              background: "#fcfcfc",
              color: "#222",
              fontSize: 15,
              fontWeight: 500
            }}>
            {/* Exclude auto-detect in target */}
            {LANGUAGES.filter(lang => lang.code !== 'auto').map(lang =>
              <option value={lang.code} key={lang.code}>
                {lang.name}
              </option>
            )}
          </select>
        </div>
      </div>

      {/* Translate Button */}
      <button
        onClick={handleTranslate}
        style={{
          background: colors.primary,
          color: "#fff",
          border: "none",
          borderRadius: 24,
          padding: "14px 0",
          fontWeight: 600,
          fontSize: 17,
          marginTop: 15,
          marginBottom: 5,
          cursor: input.trim() ? "pointer" : "not-allowed",
          opacity: input.trim() ? 1 : 0.55,
          transition: "opacity 0.12s"
        }}
        disabled={!input.trim()}
        className="btn btn-large"
      >
        Translate
      </button>

      {/* Output area */}
      <div style={{
        background: "#f7faff",
        borderRadius: 9,
        padding: "18px 12px",
        minHeight: 44,
        border: `1.5px solid ${colors.secondary}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
          flex: 1,
          fontSize: 17,
          color: output ? "#222" : "#999",
          paddingRight: 12
        }}>
          {output || "Translation will appear here."}
        </div>
        {/* Copy to clipboard */}
        <button
          onClick={handleCopyOutput}
          title="Copy translation"
          style={{
            marginLeft: 6,
            border: "none",
            background: colors.accent,
            color: "#fff",
            borderRadius: 18,
            padding: "7px 14px",
            fontSize: 15,
            fontWeight: 800,
            cursor: output ? "pointer" : "not-allowed",
            opacity: output ? 1 : 0.38,
            transition: "opacity 0.12s"
          }}
          disabled={!output}
        >Copy</button>
      </div>
    </div>
  );
}

export default TranslationUI;
