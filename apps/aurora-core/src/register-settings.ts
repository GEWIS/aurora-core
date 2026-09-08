// Side-effect imports that register each module's settings defaults on `ISettings`
// via declaration merging. Every host/bootstrap (see index.ts and
// integration-test/shared/test-app.ts) must import this before calling
// `ServerSettingsStore.getInstance().initialize()`.
import './modules/sudosos/sudosos-settings';
import './modules/modes/mode-settings';
import './modules/handlers/screen/screen-handler-settings';
import './modules/handlers/screen/poster/poster-screen-handler-settings';
import './modules/handlers/screen/info/info-screen-settings';
import './modules/orders/order-settings';
