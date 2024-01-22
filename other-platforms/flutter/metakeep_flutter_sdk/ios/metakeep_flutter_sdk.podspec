#
# To learn more about a Podspec see http://guides.cocoapods.org/syntax/podspec.html.
# Run `pod lib lint metakeep_flutter_sdk.podspec` to validate before publishing.
#
Pod::Spec.new do |s|
  s.name             = 'metakeep_flutter_sdk'
  s.version          = '2.0.3'
  s.summary          = 'MetaKeep Flutter SDK'
  s.description      = <<-DESC
MetaKeep FLutter SDK.
                       DESC
  s.homepage         = 'https://metakeep.xyz'
  s.license          = { :file => '../LICENSE' }
  s.author           = { 'MetaKeep' => 'oss@metakeep.xyz' }
  s.source           = { :path => '.' }
  s.source_files = 'Classes/**/*'
  s.dependency 'Flutter'
  s.dependency 'MetaKeep', '~> 2.0.3'
  s.platform = :ios, '11.0'

  # Flutter.framework does not contain a i386 slice.
  s.pod_target_xcconfig = { 'DEFINES_MODULE' => 'YES', 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'i386' }
  s.swift_version = '5.0'
end
