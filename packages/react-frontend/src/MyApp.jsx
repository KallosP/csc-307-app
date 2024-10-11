// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  // Contains our data in the character state by the MyApp component
  const [characters, setCharacters] = useState([]);

  function removeOneCharacter(index) {
    const idAtIndex = characters.at(index).id
    deleteUser(idAtIndex)
      .then((res) => {
        if (res.status != 204) {
          throw new Error("Unexpected status code: " + res.status);
        } 
      })
      .then(() => {
        const updated = characters.filter((character, i) => {
          return i !== index;
        });
        setCharacters(updated);
      })
      .catch((error) => {
        console.log(error)
      });
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        // Prevent table update for non-201 status
        if (res.status != 201) {
          throw new Error("Unexpected status code: " + res.status);
        }
        // Return the same new user inserted in the backend
        return res.json();
      })
      .then((newPerson) => {
        // Use the returned new user from the backend in
        // the frontend table
        setCharacters([...characters, newPerson]);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  // Make a POST request to the backend to add a new user
  function postUser(person) {
    const promise = fetch("http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    });

    return promise;
  }

  function deleteUser(id) {
    // Build URL string to delete with string interpolation
    const promise = fetch(`http://localhost:8000/users/${id}`, {
      method: "DELETE"
    });
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
