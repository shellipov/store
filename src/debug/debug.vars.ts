export const DebugVars = !__DEV__ ? undefined : {
  showScreenNames: false,
  enableToggleThemeButton: false,
  useMockData: false,
  enableReactotron: true,
};

if (DebugVars) {
  DebugVars.showScreenNames = true;
  DebugVars.enableToggleThemeButton = true;
  DebugVars.useMockData = true;
}
