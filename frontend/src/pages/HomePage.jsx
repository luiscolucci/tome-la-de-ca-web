// frontend/src/pages/HomePage.jsx

import React, { useState } from "react";
import { Grid, Box } from "@mui/material";
import ItemList from "../components/ItemList";
import CreateItem from "../components/CreateItem";
import MyItems from "../components/MyItems";

function HomePage({ token }) {
  const [refreshKey, setRefreshKey] = useState(0);

  const triggerRefresh = () => {
    setRefreshKey((oldKey) => oldKey + 1);
  };

  return (
    <Box sx={{ padding: { xs: 1, sm: 2, md: 3 } }}>
      {token && (
        <>
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <CreateItem token={token} onItemCreated={triggerRefresh} />
            </Grid>
            <Grid item xs={12} md={7}>
              {/* Garanta que o token está sendo passado aqui */}
              <MyItems token={token} refreshKey={refreshKey} />
            </Grid>
          </Grid>
          <hr style={{ margin: "40px 0" }} />
        </>
      )}
      <ItemList refreshKey={refreshKey} />
    </Box>
  );
}

export default HomePage;
