import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Bienvenue sur l&apos;application</h1>
      <Link to="/login">Se connecter</Link>
    </div>
  );
}

export default Home;
