// frontend/src/components/CreateItem.jsx

import React, { useState } from "react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

function CreateItem({ token, onItemCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!imageFile) {
      alert("Por favor, selecione uma imagem para o item.");
      return;
    }

    setIsUploading(true);

    const imageRef = ref(storage, `items/${Date.now()}-${imageFile.name}`);
    try {
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      const response = await fetch("http://localhost:3001/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          quantity: Number(quantity),
          imageUrl: imageUrl,
          category: "Geral",
          type: "troca",
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Falha ao criar item.");
      }

      alert("Item criado com sucesso!");
      setTitle("");
      setDescription("");
      setQuantity(1);
      setImageFile(null);
      if (document.getElementById("file-input")) {
        document.getElementById("file-input").value = "";
      }

      if (onItemCreated) {
        onItemCreated();
      }
    } catch (error) {
      alert(`Erro: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "20px", marginTop: "20px" }}
    >
      <h2>Criar Novo Item</h2>
      <form onSubmit={handleSubmit}>
        {/* OS CAMPOS QUE ESTAVAM FALTANDO ESTÃO AQUI */}
        <div>
          <label>Título:</label>
          <br />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Descrição:</label>
          <br />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Quantidade:</label>
          <br />
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Imagem do Item:</label>
          <br />
          <input
            id="file-input"
            type="file"
            onChange={handleImageChange}
            required
          />
        </div>
        <button
          type="submit"
          style={{ marginTop: "20px" }}
          disabled={isUploading}
        >
          {isUploading ? "Enviando..." : "Anunciar Item"}
        </button>
      </form>
    </div>
  );
}

export default CreateItem;
