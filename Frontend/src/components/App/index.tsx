import React, { useEffect, useState } from "react";
import { Nav, StyledApp } from "./styles";
import { ThemeProvider } from "styled-components";
import { Routes, Route, Navigate } from "react-router-dom";

import { getFromLocalStorage, setToLocalStorage } from "../../helpers/storage";

import { useTheme } from "../../themes/useTheme";
import { GlobalStyles } from "../../themes/gloabalStyles";
import { defaultThemes, ITheme } from "../../themes/themes";

import Chat from "../../pages/Chat";
import ThemePicker from "../ThemePicker";
import ModelPicker from "../ModelPicker"; // Update the import statement

function App() {
  // Storing default themes to the storage
  const localThemes: { [key: string]: ITheme } = getFromLocalStorage("all-themes");
  if (!localThemes) {
    setToLocalStorage("all-themes", defaultThemes);
  }

  // Setting up the themes
  const { theme, themeLoaded, setCustomTheme } = useTheme();
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [selectedModel, setSelectedModel] = useState("");

  // Storing default custom theme to the storage
  const localCustomTheme: { [key: string]: ITheme } = getFromLocalStorage("custom-theme");
  if (!localCustomTheme) {
    setCustomTheme({
      ...defaultThemes.default,
      id: "custom_theme",
      name: "Custom Theme",
    });
  }

  // Setting selected theme on theme reload
  useEffect(() => {
    setSelectedTheme(theme);
  }, [theme, themeLoaded]);

  const handleModelSelection = (model: string) => {
    setSelectedModel(model);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => {
          if (response.ok) {
            console.log("File uploaded successfully.");
          } else {
            console.error("Failed to upload file:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Failed to upload file:", error);
        });
    }
  };

  return (
    <>
      {themeLoaded && (
        <ThemeProvider theme={selectedTheme}>
          <GlobalStyles />
          <StyledApp>
            <header>
              <Nav>
                <ThemePicker themeSetter={setSelectedTheme} />
                <ModelPicker modelSetter={handleModelSelection} fileUploader={handleFileUpload} />
              </Nav>
            </header>
            <Routes>
              <Route path="/" element={<Navigate to="/chat" />} />
              <Route path="/chat" element={<Chat chatAnimationDelay={600} />} />
            </Routes>
          </StyledApp>
        </ThemeProvider>
      )}
    </>
  );
}

export default App;
