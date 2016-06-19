tsc && \
  uglifyjs --compress --mangle --output app/static/js/app.js -- ./typescript/lib/zepto.1.1.6.min.js typescript/lib/magnific-popup.1.1.0.min.js ./typescript/lib/selectivity-full.2.1.0.min.js ./typescript/lib/snapsvg.0.4.1.min.js ./typescript/lib/mustache.2.2.1.min.js ./typescript/lib/app.js && \
  SETTINGS=app/settings.py python ./app/app.py
