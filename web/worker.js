/* Mix Test Analyzer: runs the Python engine (engine/*.py) in the browser with Pyodide.
   The page sends {id, path, body}; the worker answers {id, out} where out is a JSON string.
   Files never leave this tab. */
const q = new URL(self.location.href).searchParams;
// Pyodide 0.29.4 and the packages the engine needs are served from this site (vendor/pyodide/),
// so the tool does not depend on a third-party CDN. ?pyodide=<url> points to another copy.
const BASE = q.get("pyodide") || new URL("../vendor/pyodide/", self.location.href).href;
const VER = q.get("v") || "";
const FILES = ["core.py", "parse.py", "specs.py", "methods.py", "report.py", "routes.py"];
importScripts(BASE + "pyodide.js");

// openpyxl is pure Python and not part of the Pyodide distribution, so its wheels ship in vendor/.
const VENDOR = { openpyxl: ["et_xmlfile-2.0.0-py3-none-any.whl", "openpyxl-3.1.5-py2.py3-none-any.whl"] };
let py;
const loading = new Map();  // package -> promise, so each one loads once
function need(pkgs) {
  return Promise.all(pkgs.map((p) => {
    if (!loading.has(p)) {
      const urls = VENDOR[p] ? VENDOR[p].map((w) => new URL("../vendor/" + w, self.location.href).href) : [p];
      const errs = [];
      loading.set(p, py.loadPackage(urls, { errorCallback: (m) => errs.push(m), messageCallback: () => {} }).then(() => {
        if (errs.length) throw new Error("Could not load " + p + ". " + errs.join(" "));
      }).catch((err) => { loading.delete(p); throw err; }));  // a later request tries again
    }
    return loading.get(p);
  }));
}

// Start-up loads only what the first steps need (Pyodide, numpy and the engine), so the page opens fast.
const ready = (async () => {
  py = await loadPyodide({ indexURL: BASE });
  await need(["numpy"]);
  const root = new URL("../engine/", self.location.href);
  for (const f of FILES) {
    const r = await fetch(new URL(f, root).href + (VER ? "?v=" + VER : ""));
    if (!r.ok) throw new Error(`Could not load ${f} (${r.status})`);
    py.FS.writeFile("/home/pyodide/" + f, await r.text());
  }
  py.runPython("import os, sys\nos.environ['MPLBACKEND'] = 'Agg'\nsys.path.insert(0, '/home/pyodide')\nimport routes");
  return py.globals.get("routes").handle_json;
})();

// Then, while the user picks a test and adds files: scipy for the fits, and the Excel and PDF
// packages for export. A route that needs one of them waits for it.
const later = ready.then(() => need(["scipy"]));
later.then(() => need(["openpyxl"])).then(() => need(["matplotlib"])).catch(() => {});
const NEEDS = { preview: ["scipy"], run: ["scipy"], export: ["scipy", "openpyxl", "matplotlib"] };

self.onmessage = async (e) => {
  const { id, path, body, xlsx } = e.data;
  try {
    const handle = await ready;
    await need((NEEDS[path] || []).concat(path === "parse" && xlsx ? ["openpyxl"] : []));
    self.postMessage({ id, out: handle(path, body || "") });
  } catch (err) {
    self.postMessage({ id, out: JSON.stringify({ ok: false, error: "The calculation engine did not load. " + (err && err.message ? err.message : err) }) });
  }
};
