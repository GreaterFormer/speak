import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import AppLayout from "layout";

// Pages
import Home from "pages/Home";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <AppLayout>
              <Home />
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppRouter;
