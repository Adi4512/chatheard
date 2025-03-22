import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      <main className="flex-1 bg-white w-full max-w-5xl mx-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
