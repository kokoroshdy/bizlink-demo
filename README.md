# BizLink ERP — interactive demo

Static, standalone presentation of the ERP workspace. All names, records and amounts are fictional. No API, credentials, database or server code is included.

Open `index.html`, or serve this directory using any static server. Deploy this directory as the root of a GitHub Pages repository (branch `main`, folder `/`). Hash routes support refreshing and direct links without server rewrites.

The demo includes the overview pages plus a comprehensive screen explorer at `#catalog`. Its generated catalog represents 624 views, partials and dialog templates across all 12 source areas, with 2,894 extracted controls and 2,063 labeled actions. The other 46 files are shared layouts/presentation components represented by the demo shell. Counts come from the 670 source UI files, not from a claim of 624 independent production routes.

`catalog.js` contains presentation metadata only: labels, field types, tabs, table headings and links between related screens. `explorer.js` renders local simulations from those definitions. Screen forms support local create/edit/delete/view, validation, search, CSV import/export and local action history. Source actions which need the server are explicitly labeled simulations. Reports use fictional records. Separate workbenches demonstrate a balanced journal, a POS invoice, a simplified salary calculation, a permission matrix and a location illustration.

The sidebar now follows the active `Mvc.sitemap` tree, preserving labels, order, nesting and the original Font Awesome icons. Its 329 nodes contain 36 expandable groups, 267 page links and 26 source placeholders without a controller. Placeholder entries are disabled rather than opening an unrelated page. Twenty controller-action variants are represented separately from the 624 physical UI files: sixteen share the personnel reports view, while four legacy menu destinations have no corresponding view in the checkout and use an explicitly simulated report definition. This matches the navigation structure; the screen bodies remain browser-local simulations, not literal execution of the MVC views or production workflows.

`navigation.js` handles accessible expansion, current-page highlighting, ancestor expansion, search, keyboard navigation and saved menu expansion. Rebuild navigation alone using `tools/build-demo-navigation.cjs`; the full catalog generator also invokes it. The demo carries the original Font Awesome stylesheet license notice and font asset.

Invoice drafts and screen records are saved only in this browser's local storage. Reset removes only this demo's two storage keys. No files, location, credentials or records are sent to a server. Use fictional CSV files only. Original Excel import, payroll rules, government integrations, payments, fingerprint devices, live maps and server-side authorization are not executed by this static demo. The production ASP.NET project is unaffected.

To regenerate metadata in the private application checkout, run `tools/build-demo-catalog.cjs` using Node.js with `jsdom` available (`DEMO_JSDOM` may point to an existing installation). Publish only the files inside `demo/`; do not publish the source application, generator, configuration or database files.

The demo is a presentation, not a replacement for the production application's server-side workflows or accounting rules.
