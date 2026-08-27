import {MainAppTemplate} from "./components/appTemplates/MainAppTemplate.tsx";
import {I18nLocaleEnum} from "lys-front/types";
import {generateRouteFromDescription, generateRouteTable} from "lys-front/tools";
import lys from "./index.ts";
import {homePage} from "./components/pages/HomePage/config.ts";
import {loginPage} from "./components/pages/LoginPage/config.ts";
import ThemeProvider from "./components/providers/ThemeProvider";
import AlertMessageFeature from "./components/features/AlertMessageFeature";

// TODO: Set your default locale
const defaultLocale: string = I18nLocaleEnum.fr;

function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <div className="app h-100">
        <MainAppTemplate
            routes={generateRouteTable(lys)}
            defaultLocale={defaultLocale}
            defaultPublicRoute={generateRouteFromDescription(loginPage)}
            defaultPrivateRoute={generateRouteFromDescription(homePage)}
            alertGenerator={(messages, onRemove) => (
                <AlertMessageFeature messages={messages} onRemove={onRemove} />
            )}
          />
      </div>
    </ThemeProvider>
  )
}

export default App
