import './App.css';
import {Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import {Login} from "./user/Login";
import { Signup } from './user/Signup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path='/signup' element={<Signup />} />
    </Routes>
  );
}

export default App;
