import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity, TextInput, Alert } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { getComentariosByReceita, createComentario } from '../../services/ComentariosService';
import { getUserById, getAuthenticatedUser } from '../../services/UserService';
import { useTheme } from '../../services/ThemeContext';

const Container = styled.View`
  margin-top: 15px;
  padding-top: 10px;
  border-top-width: 1px;
  border-top-color: ${props => props.theme.border || 'rgba(255, 255, 255, 0.1)'};
`;

const Header = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-vertical: 5px;
`;

const SectionTitle = styled.Text`
  font-size: 16px;
  font-weight: bold;
  color: ${props => props.theme.textLight};
`;

const CommentItem = styled.View`
  margin-bottom: 10px;
  padding: 8px;
  background-color: ${props => props.theme.cardBackground};
  border-radius: 8px;
  border: 1px solid ${props => props.theme.border || 'transparent'};
`;

const UsernameText = styled.Text`
  color: ${props => props.theme.primary};
  ${props => props.theme.primaryTextShadow && `
    text-shadow-color: ${props.theme.primaryTextShadow.textShadowColor};
    text-shadow-offset: ${props.theme.primaryTextShadow.textShadowOffset.width}px ${props.theme.primaryTextShadow.textShadowOffset.height}px;
    text-shadow-radius: ${props.theme.primaryTextShadow.textShadowRadius}px;
  `}
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 2px;
`;

const CommentText = styled.Text`
  color: ${props => props.theme.textLight};
  font-size: 14px;
`;

const NoCommentsText = styled.Text`
  color: ${props => props.theme.textLight};
  font-style: italic;
  font-size: 14px;
  margin-top: 5px;
`;

const ErrorText = styled.Text`
  color: ${props => props.theme.danger || 'red'};
  font-size: 14px;
  margin-top: 5px;
`;

const InputContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: 10px;
  margin-bottom: 10px;
`;

const CommentInput = styled.TextInput`
  flex: 1;
  background-color: ${props => props.theme.background};
  color: ${props => props.theme.textLight};
  padding: 10px;
  border-radius: 20px;
  margin-right: 10px;
  border: 1px solid ${props => props.theme.border || 'transparent'};
`;

const SendButton = styled.TouchableOpacity`
  background-color: ${props => props.theme.primary};
  padding: 10px;
  border-radius: 20px;
  justify-content: center;
  align-items: center;
`;

const CommentItemWithUser = ({ comentario }) => {
    const [username, setUsername] = useState("Carregando...");

    useEffect(() => {
        let isMounted = true;
        const fetchUser = async () => {
            if (comentario.userId) {
                try {
                    const user = await getUserById(comentario.userId);
                    if (isMounted && user && user.username) {
                        setUsername(user.username);
                    } else if (isMounted) {
                        setUsername("Usuário desconhecido");
                    }
                } catch (error) {
                    console.error("Erro ao buscar usuário do comentário:", error);
                    if (isMounted) {
                        setUsername("Usuário desconhecido");
                    }
                }
            } else {
                if (isMounted) {
                    setUsername("Anônimo");
                }
            }
        };
        fetchUser();
        return () => { isMounted = false; };
    }, [comentario.userId]);

    return (
        <CommentItem>
            <UsernameText>{username}</UsernameText>
            <CommentText>{comentario.texto || comentario.conteudo || "Comentário sem texto"}</CommentText>
        </CommentItem>
    );
};

export default function ComentariosReceita({ receitaId }) {
    const [comentarios, setComentarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [expanded, setExpanded] = useState(false);
    const [fetched, setFetched] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [currentUser, setCurrentUser] = useState(null);
    const [posting, setPosting] = useState(false);
    const { colors } = useTheme();

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const user = await getAuthenticatedUser();
                setCurrentUser(user);
            } catch (error) {
                console.error("Erro ao buscar usuário logado:", error);
            }
        };
        fetchCurrentUser();
    }, []);

    const fetchComentarios = async () => {
        setLoading(true);
        try {
            const data = await getComentariosByReceita(receitaId);
            setComentarios(data);
            setFetched(true);
            setError(null);
        } catch (err) {
            console.error("Erro ao carregar comentários:", err);
            setError("Não foi possível carregar os comentários.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (expanded && !fetched) {
            fetchComentarios();
        }
    }, [expanded, receitaId, fetched]);

    const handlePostComment = async () => {
        if (!newComment.trim()) {
            Alert.alert("Erro", "O comentário não pode estar vazio.");
            return;
        }

        if (!currentUser) {
            Alert.alert("Erro", "Você precisa estar logado para comentar.");
            return;
        }

        setPosting(true);
        try {
            const comentarioData = {
                receitaId: receitaId,
                userId: currentUser.id,
                conteudo: newComment
            };
            await createComentario(comentarioData);
            setNewComment("");
            await fetchComentarios();
        } catch (error) {
            console.error("Erro ao postar comentário:", error);
            Alert.alert("Erro", "Não foi possível postar o comentário.");
        } finally {
            setPosting(false);
        }
    };

    return (
        <Container>
            <Header onPress={toggleExpanded} activeOpacity={0.7}>
                <SectionTitle>Comentários</SectionTitle>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={colors.textLight}
                />
            </Header>

            {expanded && (
                <View>
                    {loading && !fetched ? (
                        <ActivityIndicator size="small" color={colors.primary} style={{ marginTop: 10 }} />
                    ) : error ? (
                        <ErrorText>{error}</ErrorText>
                    ) : (
                        <View style={{ marginTop: 10 }}>
                            {currentUser && (
                                <InputContainer>
                                    <CommentInput
                                        placeholder="Adicione um comentário..."
                                        placeholderTextColor={colors.textLight + "80"}
                                        value={newComment}
                                        onChangeText={setNewComment}
                                        multiline
                                    />
                                    <SendButton onPress={handlePostComment} disabled={posting}>
                                        {posting ? (
                                            <ActivityIndicator size="small" color="#FFF" />
                                        ) : (
                                            <Ionicons name="send" size={20} color="#FFF" />
                                        )}
                                    </SendButton>
                                </InputContainer>
                            )}

                            {comentarios && comentarios.length > 0 ? (
                                comentarios.map((comentario) => (
                                    <CommentItemWithUser key={comentario.id || Math.random()} comentario={comentario} />
                                ))
                            ) : (
                                <NoCommentsText>Nenhum comentário ainda. Seja o primeiro!</NoCommentsText>
                            )}
                        </View>
                    )}
                </View>
            )}
        </Container>
    );
}
