# Vendored wheels

openpyxl and et_xmlfile are pure Python and are not part of the Pyodide distribution.
The browser worker loads these wheels to write Excel files.

- openpyxl 3.1.5, MIT License, https://foss.heptapod.net/openpyxl/openpyxl
- et_xmlfile 2.0.0, MIT License, https://foss.heptapod.net/openpyxl/et_xmlfile

## pyodide/

Pyodide 0.29.4 (https://pyodide.org, Mozilla Public License 2.0) and the wheels the engine loads:
numpy, scipy, matplotlib and their dependencies, as listed in `pyodide-lock.json`. Each wheel matches
the SHA-256 in that lock file. They are served from this site so the tool does not depend on a CDN.
The other packages in the lock file are not included and are never requested.
