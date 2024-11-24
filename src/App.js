import './App.css';
import {Route, Routes, Navigate} from 'react-router-dom';
import {Login} from "./user/Login.tsx";
import { Signup } from './user/Signup.tsx';
import Messaging from './user/Messaging.js';

function App() {
  const sw = navigator.serviceWorker;
if (sw != null) {
    sw.onmessage = (event) => {
        console.log("Got event from sw : " + event.data);
    }
}
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/messaging' element={<Messaging />} />
      <Route path="/messages/room/:roomId" element={<Messaging />} />
      <Route path="/messages/user/:userId" element={<Messaging />} />
    </Routes>
  );
}

export default App;
