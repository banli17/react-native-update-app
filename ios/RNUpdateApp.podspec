
Pod::Spec.new do |s|
  s.name         = "RNUpdateApp"
  s.version      = "1.0.0"
  s.summary      = "RNUpdateApp"
  s.description  = <<-DESC
                  RNUpdateApp
                   DESC
  s.homepage     = ""
  s.license      = "MIT"
  # s.license      = { :type => "MIT", :file => "FILE_LICENSE" }
  s.author             = { "author" => "author@domain.cn" }
  s.platform     = :ios, "7.0"
  s.source       = { :git => "https://github.com/author/RNUpdateApp.git", :tag => "master" }
  s.source_files  = "RNUpdateApp/**/*.{h,m}"
  s.requires_arc = true


  s.dependency "React"
  #s.dependency "others"

end

  