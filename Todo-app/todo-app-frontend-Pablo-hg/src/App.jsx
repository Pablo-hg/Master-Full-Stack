import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListTaskPage from "./components/pages/ListTaskPage";
import LoginUserPage from "./components/pages/LoginUserPage";

function App() {
  return (
    <div>
      <h1>Ejercicio Todo Pablo Horcajda</h1>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginUserPage />} />
          <Route path="/login" element={<LoginUserPage />} />
          <Route path="/tasks" element={<ListTaskPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
