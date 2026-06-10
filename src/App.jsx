import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import "./App.css";
import MainGame from "./pages/MainGame";
import ScanPage from "./pages/ScanPage";
import FinalPage from "./pages/FinalPage";

export default function App() {

  return (
    <div className="app-shell">
      <div className="app-background-glow" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainGame />} />
          <Route path="/scan" element={<ScanPage />} />
          <Route path="/final" element={<FinalPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}