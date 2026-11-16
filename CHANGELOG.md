# Changes

Major updates get a new version. Small fixes and tweaks between versions are not listed.

## v0.2 (November 2026)

Renamed from Cracking Test Analyzer to Mix Test Analyzer, since the tool now covers rutting too.

- Tests: HT-IDT (ASTM D8666-26) and IDEAL-RT (ASTM D8360-22) at high temperature. IDEAL-RT can also report RT<sub>Index</sub> at 7% air voids for field cores (D8360 Note 11).
- Test step: the temperature domain is a Low, Intermediate and High slider (thermal cracking, fatigue cracking, rutting). HWTT and APA are shown as coming soon.
- Examples: lab records for SLT-SCB, and synthetic SCB and IDT strength sets back-calculated from published means.
- Upload: a Clear files button in the steps bar. Time is optional for every test.
- New link: akashto.com/mix-test-analyzer. The old link forwards to it.

## v0.1 (November 2026)

First release.

- Tests: I-FIT (AASHTO T 393-21), IDEAL-CT (ASTM D8225-19), DONUT (Draft ASTM), SCB (AASHTO T 394-21), SLT-SCB (Draft ASTM), DCT (ASTM D7313-20) and IDT strength (AASHTO T 322-07).
- Upload: reads CSV, TXT and XLSX files, finds time, load, LLD and CMOD columns and their units, and checks loading and sampling rates.
- Process: raw or fitted data, trims, seating energy, load tare, fit preview and specimen dimensions.
- Results: summary statistics, one-outlier option, manual exclusion, and other indices from the literature (CRI and BCI for I-FIT, N<sub>flex</sub> for IDEAL-CT, FST for DCT).
- Export: one Excel workbook per replicate, a batch summary, a PDF report and a settings file.
- Runs in the browser. Files are not uploaded.
