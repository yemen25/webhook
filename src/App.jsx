import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import AddLead from "./components/AddLead";
import DataTable from "./components/Table";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/add-lead" element={<AddLead />} />
        <Route path="/" element={<DataTable />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
