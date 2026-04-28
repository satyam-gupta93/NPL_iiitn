import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import AuctionRoom from './pages/AuctionRoom.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Teams from './pages/Teams.jsx';

const App = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/auction" element={<AuctionRoom />} />
      <Route path="/teams" element={<Teams />} />
    </Routes>
  </Layout>
);

export default App;
