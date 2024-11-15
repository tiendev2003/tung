/** @format */
import { Windmill } from "@windmill/react-ui";
import { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { registerSW } from "virtual:pwa-register";

// internal import
import App from "@/App";
import "@/assets/css/custom.css";
import "@/assets/css/tailwind.css";
import myTheme from "@/assets/theme/myTheme";
import ThemeSuspense from "@/components/theme/ThemeSuspense";
import { AdminProvider } from "@/context/AdminContext";
import { SidebarProvider } from "@/context/SidebarContext";
import store from "@/reduxStore/store";
import "rc-tree/assets/index.css";
import "react-loading-skeleton/dist/skeleton.css";
 

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
});

let persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AdminProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SidebarProvider>
          <Suspense fallback={<ThemeSuspense />}>
            <Windmill usePreferences theme={myTheme}>
              <App />
            </Windmill>
          </Suspense>
        </SidebarProvider>
      </PersistGate>
    </Provider>
  </AdminProvider>
);
 