import { useState, useEffect } from 'react';
import NavBar from '../pages/NavBar.tsx';
import Chat from './Chat.js';
import { useNavigate } from 'react-router-dom';

function Messaging() {
    const [users, setUsers] = useState([]);
    const [chatRooms, setChatRooms] = useState([]);
    const [selectedRecipient, setSelectedRecipient] = useState(null); 
    const [selectedType, setSelectedType] = useState(null); // "user" ou "room"
    const [error, setError] = useState('');
    const userId = sessionStorage.getItem('userId');
    const userName = sessionStorage.getItem('username');
    const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('token'));
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            const token = sessionStorage.getItem('token');

            if (!token) {
                setError("Utilisateur non authentifié");
                return;
            }

            try {
                const response = await fetch('/api/users', {
                    headers: {
                        'Authentication': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des utilisateurs");
                }

                const data = await response.json();
                const filteredUsers = data.filter(user => String(user.user_id) !== String(userId));                
                setUsers(filteredUsers);
            } catch (err) {
                setError("Impossible de récupérer la liste des utilisateurs");
            }
        };

        const fetchChatRooms = async () => {
            const token = sessionStorage.getItem('token');

            if (!token) {
                setError("Utilisateur non authentifié");
                return;
            }

            try {
                const response = await fetch('/api/chatrooms', {
                    headers: {
                        'Authentication': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération des salons");
                }

                const data = await response.json();
                setChatRooms(data);
            } catch (err) {
                setError("Impossible de récupérer la liste des salons");
            }
        };

        fetchUsers();
        fetchChatRooms();
    }, [userId]);

    const handleLogout = () => {
        sessionStorage.clear();
        setIsAuthenticated(false);
        navigate("/login");
    };

    useEffect(() => {
        if (!sessionStorage.getItem('token')) {
            setIsAuthenticated(false);
        }
    }, []);

    return (
        <>
        <NavBar handleLogout={handleLogout} />
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Barre latérale */}
            <div style={{ width: '250px', padding: '10px', borderRight: '1px solid #ddd', background: '#f4f4f4' }}>
                <h3>Utilisateurs</h3>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {users.map((user) => (
                        <li key={user.user_id} style={{ margin: '10px 0' }}>
                            <button
                                onClick={() => {
                                    setSelectedRecipient(user.user_id);
                                    setSelectedType("user");
                                    navigate(`/messages/user/${user.user_id}`);
                                }}
                                style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                            >
                                {user.username} - Dernière connexion : {user.last_login}
                            </button>
                        </li>
                    ))}
                </ul>
                <h3>Salons</h3>
                <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {chatRooms.map((room) => (
                        <li key={room.room_id} style={{ margin: '10px 0' }}>
                            <button
                                onClick={() => {
                                    setSelectedRecipient(room.room_id);
                                    setSelectedType("room");
                                    navigate(`/messages/room/${room.room_id}`);
                                }}
                                style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                            >
                                {room.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Contenu principal */}
            <div style={{ flex: 1, padding: '20px' }}>
                {selectedRecipient ? (
                    <Chat
                        recipientId={selectedRecipient}
                        recipientType={selectedType}
                        currentUserId={userId}
                        userName={userName}
                    />
                ) : (
                    <p>Sélectionnez un utilisateur ou un salon pour commencer à discuter.</p>
                )}
            </div>
        </div>
        </>
    );
}

export default Messaging;
