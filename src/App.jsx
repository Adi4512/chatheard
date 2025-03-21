import React from "react";
import Layout from "./components/Layout";
import ChatContainer from "./components/ChatContainer";
import { ChatProvider } from "./context/ChatContext";

function App() {
  return (
    <ChatProvider>
      <Layout>
        <ChatContainer />
      </Layout>
    </ChatProvider>
  );
}

export default App;
