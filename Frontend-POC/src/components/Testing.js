import axios from "axios";
import React, { useState } from "react";
import configData from "./../config.json";

function Testing() {
  const [selectedFile, setSelectedFile] = useState();
  const [isFilePicked, setIsFilePicked] = useState(false);

  const changeHandler = (file) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      // console.log(event.target.result);
      setSelectedFile(file);
      setIsFilePicked(true);
    };
    reader.readAsText(file);
  };
  const baseUrl = configData.url.baseURL;
  const handleSubmission = () => {
    const formData = new FormData();
    // console.log("Selected File: ", selectedFile);
    formData.append("file", selectedFile);
    // console.log(selectedFile);
    let data = new FormData();
    data.append("file", selectedFile);
    // you can omit multipart/form-data header
    axios.post(`${baseUrl}/order-history-import/upload`, data);
  };

  return (
    <div>
      <input
        type="file"
        name="file"
        onChange={(event) => changeHandler(event.target.files[0])}
      />
      {isFilePicked ? (
        <div>
          <p>FileData: {console.log("file", selectedFile)}</p>
          <p>Filename: {selectedFile.name}</p>
          <p>Filetype: {selectedFile.type}</p>
          <p>Size in bytes: {selectedFile.size}</p>
          <p>
            lastModifiedDate:{" "}
            {selectedFile.lastModifiedDate.toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p>Select a file to show details</p>
      )}
      <div>
        <button onClick={handleSubmission}>Submit</button>
      </div>
    </div>
  );
}
export default Testing;
