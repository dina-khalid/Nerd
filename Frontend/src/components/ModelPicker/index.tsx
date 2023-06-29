import React, { createRef, useCallback, useEffect, useState } from "react";
import {
  StyledModelPicker,
  ModelButton,
  ModelPickerContainer,
  ModelOption,
  UploadButtonContainer,
  UploadButtonInput,
} from "./styles";

type Props = {
  modelSetter: (model: string) => void;
  fileUploader: (e: React.ChangeEvent<HTMLInputElement>) => void; // Update the type here
};


const ModelPicker: React.FC<Props> = ({ modelSetter, fileUploader }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const divRef = createRef<HTMLDivElement>();

  // Closing the model picker on click outside
  const menuCloseHandler = useCallback(
    (e: MouseEvent) => {
      if (!divRef.current) return;
      if (isOpen && !divRef.current.contains(e.target as HTMLDivElement))
        setIsOpen(false);
    },
    [divRef, isOpen]
  );

  useEffect(() => {
    window.addEventListener("click", menuCloseHandler);
    return () => {
      window.removeEventListener("click", menuCloseHandler);
    };
  }, [menuCloseHandler]);

  const models = ["LlamaCpp", "GPT4All"]; // Add more model options as needed

  const handleModelSelection = (model: string) => {
    if (selectedModel !== model) {
      setSelectedModel(model);
      modelSetter(model);

      // Make API call to initialize the QA
      fetch("http://localhost:5000/initialize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ model_type: model }),
      })
        .then((response) => {
          if (response.ok) {
            console.log("QA initialized successfully.");
          } else {
            console.error("Failed to initialize QA:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Failed to initialize QA:", error);
        });
    }
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
    <StyledModelPicker ref={divRef}>
      <ModelButton onClick={() => setIsOpen((prev) => !prev)}>
        {selectedModel || "Select Model"}
      </ModelButton>
      {isOpen && (
        <ModelPickerContainer>
          <ul>
            {models.map((model) => (
              <ModelOption
                key={model}
                onClick={() => handleModelSelection(model)}
                isSelected={selectedModel === model}
              >
                {model}
              </ModelOption>
            ))}
          </ul>
        </ModelPickerContainer>
      )}
       <UploadButtonContainer>
        <UploadButtonInput
          type="file"
          accept=".pdf,.csv,.txt"
          onChange={handleFileUpload}
        />
        Upload File
      </UploadButtonContainer>
    </StyledModelPicker>
  );
};

export default ModelPicker;
