{
  "id": "app",
  "paths": [
    "."
  ],
  "mode": "ADVANCED",
  //"mode" : "SIMPLE",
  "level": "VERBOSE",
  "modules": {
    "app": {
      "inputs": ["app.js"],
      "deps": []
    },
    "community": {
      "inputs": "community/app.js",
      "deps": "app"
    },
    "account": {
      "inputs": "account/app.js",
      "deps": "app"
    }
  },
  "module-output-path": "demo/output/module/module_%s.js",

  // For a local HTML page, production_uri happens to have the same value as
  // output_path, but for a production system, they would likely be different.
  "module-production-uri": "module/module_%s.js",

  // This enables an experimental modules feature, and may not be
  // appropriate for most users. Be sure you understand what this does
  // before enabling it: http://plovr.com/options.html#global-scope-name
  // "global-scope-name": "__plovr__",

  // "fingerprint" : true,
  "pretty-print" : true,
  // "output-wrapper" : "(function(){%output%})()",
  "css-output-file" : "demo/output/app.css",
  "css-directory-in" : ".",
  "tpl-output-file" : "demo/output/tpl.html",
  "tpl-directory-in" : ".",
  "ambiguate-properties" : false,
  "disambiguate-properties" : false,
  "generate-exports" : true,
  "variable-renaming" : "OFF",
  "property-renaming" : "OFF",
  "name-suffixes-to-strip" : [
    "console.log", "console.dir", "console.debug", 
    "console.error", "console.warn", "console.info"
  ]
}
