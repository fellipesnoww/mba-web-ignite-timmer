import { ThemeProvider } from "styled-components";
import { defaulTheme } from "./styles/theme/default";
import { GlobalStyle } from "./styles/theme/global";

export function App() {

  return (
    <ThemeProvider theme={defaulTheme}>
      <GlobalStyle>
        <h1>
          Hello
        </h1>
      </GlobalStyle>
    </ThemeProvider>
  )
}
