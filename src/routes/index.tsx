import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import AppLayout from "layout";

// Pages
import Home from "pages/Home";
import Markets from "pages/Markets";
import Event from "pages/Event";

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
        <Route
          path="markets"
          element={
            <AppLayout>
              <Markets />
            </AppLayout>
          }
        />
        <Route path="events/:ipfsUrl" element={
          <AppLayout>
            <Event />
          </AppLayout>
        } />
      </Routes>
    </Router>
  );
};

export default AppRouter;
