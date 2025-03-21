import React from "react";
import Header from "./Header";

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      <main className="flex-1 flex flex-col overflow-hidden container mx-auto max-w-4xl px-4 md:px-6 pt-6 pb-4">
        <div className="bg-white rounded-2xl shadow-lg flex-1 flex flex-col overflow-hidden border border-gray-100">
          {children}
        </div>
      </main>
      <footer className="py-3 px-6 text-center">
        <p className="text-xs text-gray-500">
          WhisperTalk • {new Date().getFullYear()} •{" "}
          <span className="text-love">Made with love</span>
        </p>
      </footer>
    </div>
  );
};

export default Layout;
