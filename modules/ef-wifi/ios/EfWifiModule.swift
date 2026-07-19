import ExpoModulesCore

public class EfWifiModule: Module {
  public func definition() -> ModuleDefinition {
    Name("EfWifi")

    AsyncFunction("addEnterpriseNetwork") { (_: [String: Any?]) in
      throw Exception(name: "EfWifiUnsupported", description: "iOS configures WiFi via a configuration profile, not this module.")
    }
  }
}
