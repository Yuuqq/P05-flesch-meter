# Code Review Findings: P05-flesch-meter

This document summarizes the findings from the code review of the `P05-flesch-meter` repository. Findings are categorized by severity.

## 🔴 HIGH / CRITICAL (Real User Issues)

### 1. Initialization Race Condition & Overwrite
- **File:** `app.js`
- **Impact:**
  - **Auto-load failure:** `loadSampleBtn.click()` (Line 215) is called before its event listener is attached (Line 222), meaning the initial sample text fails to load automatically.
  - **Input override:** A legacy 1-second `setTimeout` (Lines 261-269) can overwrite what the user types if they begin inputting text immediately after the page loads.
- **Fix Suggestion:** Move the `loadSampleBtn.click()` call below its listener registration and remove the obsolete 1-second timeout block.

### 2. Accessibility Issue with ARIA Labels
- **File:** `index.html` (Lines 37-39)
- **Impact:** The `aria-label="load Sample"`, `aria-label="calc"`, and `aria-label="clear"` attributes on the action buttons mask the visible, descriptive Chinese text for screen readers.
- **Fix Suggestion:** Remove the `aria-label` attributes to allow assistive technologies to read the button's native text content.

### 3. "Difficult Character" Heuristic is Too Narrow
- **File:** `app.js` (Line 142)
- **Impact:** The Chinese difficult character detection uses the regex `/[龘齉饕鬣]/g`, which only flags 4 specific characters. This makes the readability heuristic extremely limited.
- **Fix Suggestion:** Expand the regex to include a broader range of complex characters, such as CJK Unified Ideographs Extension A (`[\u3400-\u4DBF]`).

### 4. Specification Discrepancy
- **File:** `SPEC.md`
- **Impact:** The specification document claims the tool uses the "Flesch-Kincaid" metric, but the source code correctly implements the "Flesch Reading Ease" formula.
- **Fix Suggestion:** Update `SPEC.md` to reflect the actual implemented formula (Flesch Reading Ease).
