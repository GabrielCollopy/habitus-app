import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { getComentariosByReceita } from '../../services/ComentariosService';
import { getUserById } from '../../services/UserService';
import { COLORS } from '../../constants/Colors';

const Container = styled.View`
  margin-top: 15px;
  padding-top: 10px;
  border-top-width: 1px;
  border-top-color: rgba(255, 255, 255, 0.1);
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
  color: ${COLORS.textLight};
`;

const CommentItem = styled.View`
  margin-bottom: 10px;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
`;

const UsernameText = styled.Text`
  color: ${COLORS.primary};
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 2px;
`;

const CommentText = styled.Text`
  color: ${COLORS.textLight};
  font-size: 14px;
`;

const NoCommentsText = styled.Text`
  color: ${COLORS.textLight};
  font-style: italic;
  font-size: 14px;
  margin-top: 5px;
`;

const ErrorText = styled.Text`
  color: ${COLORS.error || 'red'};
  font-size: 14px;
  margin-top: 5px;
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

    const toggleExpanded = () => {
        setExpanded(!expanded);
    };

    useEffect(() => {
        let isMounted = true;

        const fetchComentarios = async () => {
            if (!expanded || fetched) return;

            setLoading(true);
            try {
                const data = await getComentariosByReceita(receitaId);
                if (isMounted) {
                    setComentarios(data);
                    setFetched(true);
                }
            } catch (err) {
                if (isMounted) {
                    console.error("Erro ao carregar comentários:", err);
                    setError("Não foi possível carregar os comentários.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchComentarios();

        return () => {
            isMounted = false;
        };
    }, [expanded, receitaId, fetched]);

    return (
        <Container>
            <Header onPress={toggleExpanded} activeOpacity={0.7}>
                <SectionTitle>Comentários</SectionTitle>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={COLORS.textLight}
                />
            </Header>

            {expanded && (
                <View>
                    {loading ? (
                        <ActivityIndicator size="small" color={COLORS.primary} style={{ marginTop: 10 }} />
                    ) : error ? (
                        <ErrorText>{error}</ErrorText>
                    ) : comentarios && comentarios.length > 0 ? (
                        <View style={{ marginTop: 10 }}>
                            {comentarios.map((comentario) => (
                                <CommentItemWithUser key={comentario.id || Math.random()} comentario={comentario} />
                            ))}
                        </View>
                    ) : (
                        <NoCommentsText>Nenhum comentário ainda.</NoCommentsText>
                    )}
                </View>
            )}
        </Container>
    );
}
