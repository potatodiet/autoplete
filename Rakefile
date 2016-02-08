task(:build_doc) do
  `node_modules/.bin/jsdoc lib/`
end

task(:compile) do
  lib_dir = 'lib/'
  out_dir = 'compiled/'

  files = %w(Autoplete)

  ts_files = files.map { |file| lib_dir + file + '.ts'}.join(' ')
  `node_modules/.bin/tslint #{ts_files}`
  puts `node_modules/.bin/tsc --outDir #{out_dir} #{ts_files}`

  js_files = files.map {|file| out_dir + file }
  js_files.each do |file|
    `node_modules/.bin/babel #{file + '.js'} |
     node_modules/.bin/uglifyjs > #{file + '.min.js'}`
  end
end

