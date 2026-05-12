import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import MainGame from "./pages/MainGame";
import ScanPage from "./pages/ScanPage";
import FinalPage from "./pages/FinalPage";

export default function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route path="/" element={<MainGame />} />

        <Route path="/scan" element={<ScanPage />} />

        <Route path="/final" element={<FinalPage />} />

      </Routes>

    </BrowserRouter>
  );
}