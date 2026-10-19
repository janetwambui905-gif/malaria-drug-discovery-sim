# CADD Pipeline Simulator

This is a static website: open `index.html` with Live Server, or serve this
folder from a local web server. The dashboard uses Tailwind CSS, Lucide Icons,
and Chart.js from CDNs, so those libraries need an internet connection.

## Where the code lives

- `index.html` — page structure and the order that styles and scripts load.
- `css/styles.css` — custom dark theme and dashboard-specific styling.
- `js/tailwind.config.js` — custom font and color settings for Tailwind.
- `js/data.js` — example compounds, pipeline messages, and shared state.
- `js/molecular-visualizer.js` — candidate selection and canvas drawings.
- `js/charts.js` — binding-energy and ADMET charts.
- `js/pipeline.js` — simulated run steps, progress bar, and console messages.
- `js/app.js` — event handlers and initial setup.

The JavaScript files are included at the end of `index.html` in dependency
order: data first, then the visualizer and charts, pipeline controls, and
application setup. Keep that order if you change the script tags.

All candidate measurements and pipeline results are illustrative demo data;
this site does not run actual docking, RDKit, or ADMET calculations.
