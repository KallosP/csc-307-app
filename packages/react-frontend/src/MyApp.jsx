// src/MyApp.jsx
import React, { useState } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  // Contains our data in the character state by the MyApp component
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const updated = characters.filter((character, i) => {
      return i !== index;
    });
    setCharacters(updated);
  }

  return (
    <div className="container">
      <Table 
        characterData={characters} 
        removeCharacter={removeOneCharacter} 
      />
      <Form />
    </div>
  );
}

export default MyApp;
