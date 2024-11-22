import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Button, Typography, Paper, Grid } from '@mui/material';

function Chat({ recipientId, recipientType, currentUserId, userName }) {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [error, setError] = useState('');
    const scrollRef = useRef(null);
    useEffect(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
      }, [messages]);

    // Fonction pour récupérer les messages depuis Redis
    const fetchMessages = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const url =
                recipientType === 'room'
                    ? `/api/roomMessages?roomId=${recipientId}`
                    : `/api/message?recipientId=${recipientId}`;

            const response = await fetch(url, {
                headers: {
                    'Authentication': `Bearer ${token}`,
                },
            });

            if (!response.ok) throw new Error('Impossible de récupérer les messages');

            const data = await response.json();

            const sortedMessages = data.sort(
                (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );
            setMessages(sortedMessages);
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        if (recipientId) {
            fetchMessages();
        }
    }, [recipientId, recipientType]);

    const sendMessage = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const url =
                recipientType === 'room'
                    ? `/api/roomMessages`
                    : `/api/message`;

            const body =
                recipientType === 'room'
                    ? { roomId: recipientId, sender: userName, messageContent: newMessage }
                    : { recipientId, sender: userName, messageContent: newMessage };

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authentication': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) throw new Error("Erreur lors de l'envoi du message");

            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    senderId: currentUserId,
                    sender: userName,
                    content: newMessage,
                    timestamp: new Date().toISOString(),
                },
            ]);
            setNewMessage('');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                p: 2,
                bgcolor: '#f5f5f5',
                borderRadius: 2,
                boxShadow: 1,
            }}
        >
            {/* Liste des messages */}
            <Box
                sx={{
                    flexGrow: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    mb: 2,
                }}
            >
                {messages.length > 0 ? (
                    messages.map((msg, index) => (
                        <Grid
                            container
                            justifyContent={
                                String(msg.senderId) === String(currentUserId)
                                    ? 'flex-end'
                                    : 'flex-start'
                            }
                            key={index}
                            sx={{ mb: 1 }}
                        >
                            <Paper
                                elevation={2}
                                sx={{
                                    p: 1.5,
                                    maxWidth: '70%',
                                    bgcolor:
                                        String(msg.senderId) === String(currentUserId)
                                            ? '#DCF8C6'
                                            : '#FFFFFF',
                                    borderRadius: 2,
                                }}
                            >
                                {/* Afficher le nom de l'expéditeur (si disponible) */}
                                {msg.sender && (
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: 'gray',
                                            display: 'block',
                                            mb: 0.5,
                                        }}
                                    >
                                        {msg.sender}
                                    </Typography>
                                )}
    
                                {/* Contenu du message */}
                                <Typography variant="body1" sx={{ wordWrap: 'break-word' }}>
                                    {msg.content}
                                </Typography>
                                {index === messages.length - 1 && <div ref={scrollRef} />}

                                {/* Timestamp */}
                                <Typography
                                    variant="caption"
                                    sx={{ color: 'gray', mt: 0.5, display: 'block' }}
                                >
                                    {new Date(msg.timestamp).toLocaleString()}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))
                ) : (
                    <Typography variant="body2" color="textSecondary">
                        Aucun message à afficher
                    </Typography>
                )}
            </Box>
    
            {/* Zone de saisie des messages */}
            <Box
                sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                }}
            >
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Écrivez un message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={sendMessage}
                    disabled={!newMessage.trim()}
                >
                    Envoyer
                </Button>
            </Box>
    
            {/* Message d'erreur */}
            {error && (
                <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {error}
                </Typography>
            )}
        </Box>
    );    
}

export default Chat;
