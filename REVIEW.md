# Code Review Findings: P05-flesch-meter

This document summarizes the findings from the code review of the `P05-flesch-meter` repository. Findings are categorized by severity.

## 🔴 CRITICAL

### 1. External Dependency Resolution Risk
- **File:** `index.html` (Lines 11, 62)
- **Impact:** The application relies on assets outside the repository bounds (`../shared/design-tokens.css`, `../shared/dark-toggle.js`, `../shared/releases/v2.6/loader.js`). This tightly couples the project to an external directory structure, breaking local development and standalone deployments if the `shared` folder is missing. It also introduces a supply chain risk if the external directory is compromised.
- **Fix Suggestion:** Bundle the shared dependencies into the repository (e.g., in a `vendor` or `shared` folder) or load them via a trusted, versioned CDN.

## 🟠 HIGH

### 1. Missing Automated Test Coverage
- **File:** Overall Repository
- **Impact:** Despite mentions of manual QA in `QA.md`, there are absolutely no automated unit or integration tests for the core logic (e.g., the Flesch algorithm, syllable counting). Future refactoring has a high risk of introducing undetected regressions.
- **Fix Suggestion:** Introduce a testing framework (like Jest or Mocha) and add tests for `countSyllables`, `splitSentences`, `englishReadability`, and `chineseReadability` functions in `app.js`.

### 2. Flawed Natural Language Processing Heuristics
- **File:** `app.js`
  - *Line 77 (`countSyllables`):* The regex `/[aeiouy]+/g` is too naive for English syllable counting. It fails on words with silent vowels or complex structures (e.g., "rhythm").
  - *Line 84 (`splitSentences`):* Splitting purely by `.` will falsely identify abbreviations ("Mr.", "U.S.A.") as sentence boundaries, severely skewing the Average Sentence Length (ASL).
  - *Line 103 (`chineseReadability`):* The regex `[\u4e00-\u9fff]` covers only the basic CJK Unified Ideographs block, ignoring extensions (Ext-A through I) commonly found in modern Chinese text.
- **Impact:** Inaccurate Flesch readability scores, which undermines the core value proposition of the tool.
- **Fix Suggestion:**
  - For English: Integrate a robust NLP library or a dictionary-based syllable counter, and use a sentence tokenizer that respects abbreviations.
  - For Chinese: Expand the Unicode regex to include CJK Extensions (e.g., `\p{Ideographic}` if using ES2018 regex `u` flag).

## 🟡 MEDIUM

### 1. Service Worker Stale-While-Revalidate Race Condition
- **File:** `sw.js` (Line 48)
- **Impact:** The background fetch promise inside the cache-first strategy is not wrapped in `event.waitUntil()`. The browser might terminate the Service Worker before the background network request finishes and updates the cache, leading to persistently stale assets.
- **Fix Suggestion:** Wrap the background caching logic in `event.waitUntil(fetchPromise)` to ensure the browser keeps the Service Worker alive until the cache is updated.

### 2. Global Scope Pollution
- **File:** `app.js` (Lines 1-10)
- **Impact:** Variables like `textInput`, `sampleSelect`, and all utility functions are declared in the global scope. This risks namespace collisions with other scripts (like the injected `loader.js` or future analytics).
- **Fix Suggestion:** Wrap the entire contents of `app.js` inside an IIFE (Immediately Invoked Function Expression) or use ES6 modules (`type="module"` in the HTML script tag).

### 3. LocalStorage Quota & I/O Performance Risk
- **File:** `pm-metrics.js` (Line 29)
- **Impact:** The metrics script parses, modifies, and stringifies up to 500 events in `localStorage` sequentially on every user interaction (like button clicks). This synchronous I/O on the main thread can cause UI stuttering and eventually hit quota limits if not carefully managed.
- **Fix Suggestion:** Debounce/batch the `localStorage` writes, or use `IndexedDB` for non-blocking storage.

## 🟢 LOW

### 1. Accessibility (A11y) Language Attributes
- **File:** `index.html` (Line 2)
- **Impact:** The `<html>` element is hardcoded to `lang="zh-CN"`. When English sample texts are loaded, screen readers might attempt to pronounce English words using Chinese phonetics, degrading accessibility.
- **Fix Suggestion:** Dynamically update a `lang="en"` attribute on the output or input container when an English sample is loaded or detected.

### 2. Developer Experience (DX) & Documentation Gaps
- **File:** `README.md`
- **Impact:** The documentation lacks instructions for running the project locally, running tests, or building the app.
- **Fix Suggestion:** Add a "Developer Guide" section to the README with clear `npm start` (or equivalent python/http-server) and testing instructions.

### 3. Use of Legacy `var` Declarations
- **File:** `app.js` (Line 185)
- **Impact:** Minor code quality inconsistency. The project uses ES6 `const`/`let` in most places, but falls back to `var` in the auto-analyze script block.
- **Fix Suggestion:** Update `var` to `const` or `let` for consistency.
