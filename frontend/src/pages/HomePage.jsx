// frontend/src/pages/HomePage.jsx

import React, { useState, useEffect } from "react";
import ItemList from "../components/ItemList";
import CreateItem from "../components/CreateItem";
import MyItems from "../components/MyItems";

function HomePage({ token }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <>
      {/* Se o usuário está logado (tem token), mostra os componentes de criar e ver "meus itens" */}
      {token && (
        <>
          <CreateItem token={token} onItemCreated={triggerRefresh} />
          <MyItems token={token} refreshKey={refreshKey} />
          <hr style={{ margin: "40px 0" }} />
        </>
      )}

      {/* A lista pública é sempre exibida */}
      <ItemList refreshKey={refreshKey} />
    </>
  );
}

export default HomePage;
