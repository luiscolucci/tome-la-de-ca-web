// frontend/src/pages/ChatPage.jsx

import React from "react";
import { useParams } from "react-router-dom";

function ChatPage() {
  const { conversationId } = useParams();

  return (
    <div>
      <h2>Página de Chat</h2>
      <p>Exibindo conversa com ID: {conversationId}</p>
      <p>(Em breve, as mensagens aparecerão aqui em tempo real!)</p>
    </div>
  );
}

export default ChatPage;
