import "./App.css";
import { Route, Routes } from "react-router-dom";
import { GamePicker } from "./pages/game-picker/GamePicker.page";
import { Ti4ToolPicker } from "./pages/ti4-tool-picker/Ti4ToolPicker.page";
import { Ti4CombatCalculator } from "./pages/ti4-combat-calculator/Ti4CombatCalculator.page";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<GamePicker />} />
        <Route path="ti4" element={<Ti4ToolPicker />} />
        <Route path="ti4/combat-calc" element={<Ti4CombatCalculator />} />
      </Routes>
    </div>
  );
}

export default App;
