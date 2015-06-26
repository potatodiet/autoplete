task(:build_doc) do
  `node_modules/.bin/jsdoc lib/`
end

task(:compile) do
  LIB_DIR = "lib/"
  OUT_DIR = "compiled/"

  %w(autoplete.js).each do |filename|
    `node_modules/.bin/babel #{LIB_DIR + filename} |
     node_modules/.bin/uglifyjs > #{OUT_DIR + filename}`
  end
end

