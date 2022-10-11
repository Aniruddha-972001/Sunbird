import "./App.css";
import SummaryYearWeekly from "./views/SummaryYearWeekly/SummaryYearWeekly";
import Year from "./views/Year/Year";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Summary from "./views/Summary/Summary";
import Ageing from "./views/Ageing/Ageing";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Summary timeFrame="summary" />} />
          {/*<Route path="/home" element={<Summary timeFrame="summary" />} /> */}
          <Route path="/summary" element={<Summary timeFrame="summary" />} />
          <Route
            path="/summary/weekly"
            element={<SummaryYearWeekly timeFrame="weekly" />}
          />
          <Route path="/summary/year" element={<Year timeFrame="year" />} />
          <Route
            path="/summary/ageing"
            element={<Ageing timeFrame="ageing" />}
          ></Route>
          <Route
            path="/summary/ageing/:owner/:name"
            element={<Ageing timeFrame="ageing" />}
          ></Route>
          <Route
            path="/summary/year/:owner/:name"
            element={<Year timeFrame="year" />}
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
