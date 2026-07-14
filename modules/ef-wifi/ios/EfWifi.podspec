require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'EfWifi'
  s.version        = package['version']
  s.summary        = package['description']
  s.license        = 'MIT'
  s.author         = 'Eurofurence'
  s.homepage       = 'https://eurofurence.org'
  s.platforms      = { :ios => '15.1' }
  s.source         = { git: '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
    'SWIFT_COMPILATION_MODE' => 'wholemodule'
  }
  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
