import React, { useState, useEffect } from 'react';
import { Alert, View, Modal, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { postReceita, updateReceita } from '../../services/ReceitasService';
import { getAllIngredientes, getIngredienteByName, postIngrediente } from '../../services/IngredientesService';
import CustomButton from '../Global/CustomButton';
import CustomTextInput from '../Global/CustomTextInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styled from 'styled-components/native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/Colors';

const FormContainer = styled.View`
    margin: 24px;
    margin-top: 50px;
    background-color: ${COLORS.cardBackground}; 
    border-radius: 16px;
    padding: 16px;
    justify-content: center;
`;

const IngredientsContainer = styled.View`
    width: 100%;
    margin-bottom: 15px;
`;

const Label = styled.Text`
    font-weight: bold;
    margin-bottom: 5px;
    color: ${COLORS.textLight};
    font-size: 14px;
`;

const SearchInput = styled.TextInput`
    border-width: 1px;
    border-color: ${COLORS.border};
    border-radius: 8px;
    padding: 12px;
    color: ${COLORS.textLight};
    background-color: ${COLORS.background};
    font-size: 16px;
    margin-bottom: 10px;
`;

const SelectButton = styled.TouchableOpacity`
    border-width: 1px;
    border-color: ${COLORS.border};
    border-radius: 8px;
    padding: 12px;
    background-color: ${COLORS.background};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const SelectButtonText = styled.Text`
    color: ${COLORS.textLight};
    font-size: 16px;
`;

const SelectedIngredientsContainer = styled.View`
    margin-top: 10px;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
`;

const IngredientChip = styled.View`
    background-color: ${COLORS.accent};
    padding: 8px 12px;
    border-radius: 20px;
    flex-direction: row;
    align-items: center;
    gap: 6px;
`;

const IngredientChipText = styled.Text`
    color: ${COLORS.textLight};
    font-size: 14px;
`;

const RemoveButton = styled.TouchableOpacity`
    padding: 2px;
`;

const ModalContainer = styled.View`
    flex: 1;
    justify-content: flex-end;
    background-color: ${COLORS.modalBackdrop};
`;

const ModalContent = styled.View`
    background-color: ${COLORS.cardBackground};
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    max-height: 70%;
    padding: 20px;
`;

const ModalHeader = styled.View`
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    border-bottom-width: 1px;
    border-bottom-color: ${COLORS.border};
    padding-bottom: 10px;
`;

const ModalTitle = styled.Text`
    font-size: 18px;
    font-weight: bold;
    color: ${COLORS.textLight};
`;

const IngredientItem = styled.TouchableOpacity`
    padding: 15px;
    border-bottom-width: 1px;
    border-bottom-color: ${COLORS.border};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const IngredientItemText = styled.Text`
    color: ${COLORS.textLight};
    font-size: 16px;
`;

const LoadingContainer = styled.View`
    padding: 20px;
    align-items: center;
`;

const EmptyText = styled.Text`
    color: ${COLORS.textSecondary};
    font-size: 14px;
    text-align: center;
    padding: 20px;
`;

const CreateButton = styled.TouchableOpacity`
    background-color: ${COLORS.accent};
    padding: 12px;
    border-radius: 8px;
    margin-bottom: 15px;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 8px;
`;

const CreateButtonText = styled.Text`
    color: ${COLORS.textLight};
    font-size: 16px;
    font-weight: 600;
`;

const CreateFormContainer = styled.View`
    background-color: ${COLORS.background};
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 15px;
    border: 1px solid ${COLORS.border};
`;

const CreateFormTitle = styled.Text`
    color: ${COLORS.textLight};
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
`;

const CreateInput = styled.TextInput`
    border-width: 1px;
    border-color: ${COLORS.border};
    border-radius: 8px;
    padding: 12px;
    color: ${COLORS.textLight};
    background-color: ${COLORS.cardBackground};
    font-size: 16px;
    margin-bottom: 10px;
`;

const CreateButtonsRow = styled.View`
    flex-direction: row;
    gap: 10px;
`;

const CreateCancelButton = styled.TouchableOpacity`
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    background-color: ${COLORS.border};
    align-items: center;
`;

const CreateCancelButtonText = styled.Text`
    color: ${COLORS.textLight};
    font-size: 14px;
`;

const CreateConfirmButton = styled.TouchableOpacity`
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    background-color: ${COLORS.accent};
    align-items: center;
`;

const CreateConfirmButtonText = styled.Text`
    color: ${COLORS.textLight};
    font-size: 14px;
    font-weight: 600;
`;

const ReceitasFormScreen = ({ route, navigation }) => {
    const receitaExistente = route.params?.receita;
    const isEditing = !!receitaExistente;

    const [nome, setNome] = useState(receitaExistente?.nome || '');
    const [etapas, setEtapas] = useState(receitaExistente?.etapas || '');
    const [ingredientesSelecionados, setIngredientesSelecionados] = useState([]);
    const [link, setLink] = useState(receitaExistente?.link || '');
    const [isLoading, setIsLoading] = useState(false);

    // Estados para o modal de seleção de ingredientes
    const [modalVisible, setModalVisible] = useState(false);
    const [allIngredientes, setAllIngredientes] = useState([]);
    const [ingredientesFiltrados, setIngredientesFiltrados] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingIngredientes, setLoadingIngredientes] = useState(false);
    
    // Estados para criação de novo ingrediente
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [novoIngredienteNome, setNovoIngredienteNome] = useState('');
    const [creatingIngrediente, setCreatingIngrediente] = useState(false);

    // Carregar ingredientes ao montar o componente
    useEffect(() => {
        loadIngredientes();
        
        // Se estiver editando e a receita tiver ingredientes, pre-selecionar
        if (isEditing && receitaExistente?.ingredientes) {
            if (Array.isArray(receitaExistente.ingredientes)) {
                // Se os ingredientes já são objetos completos, usar diretamente
                // Caso contrário, eles vêm apenas como IDs e serão carregados depois
                const ingredientesCompletos = receitaExistente.ingredientes.every(ing => typeof ing === 'object');
                if (ingredientesCompletos) {
                    setIngredientesSelecionados(receitaExistente.ingredientes);
                }
            }
        }
    }, []);

    const loadIngredientes = async () => {
        try {
            setLoadingIngredientes(true);
            const ingredientes = await getAllIngredientes();
            setAllIngredientes(ingredientes);
            setIngredientesFiltrados(ingredientes);
        } catch (error) {
            console.error("Erro ao carregar ingredientes:", error);
            Alert.alert("Erro", "Não foi possível carregar os ingredientes.");
        } finally {
            setLoadingIngredientes(false);
        }
    };

    const handleSearch = async (text) => {
        setSearchTerm(text);
        
        if (text.trim() === '') {
            setIngredientesFiltrados(allIngredientes);
            return;
        }

        // Primeiro, filtra da lista local (case-insensitive)
        const textoBusca = text.toLowerCase().trim();
        const filtradosLocais = allIngredientes.filter(ing => 
            ing.nome.toLowerCase().includes(textoBusca)
        );

        try {
            // Tenta buscar na API (normalizando o texto para lowercase)
            const ingrediente = await getIngredienteByName(textoBusca);
            if (ingrediente) {
                // Se retornar um único objeto, transforma em array
                const resultado = Array.isArray(ingrediente) ? ingrediente : [ingrediente];
                // Garante que todos os resultados estão em lowercase para comparação
                const resultadoNormalizado = resultado.filter(ing => 
                    ing.nome.toLowerCase().includes(textoBusca)
                );
                // Combina resultados da API com filtros locais e remove duplicatas
                const todosResultados = [...resultadoNormalizado, ...filtradosLocais];
                const resultadosUnicos = todosResultados.filter((ing, index, self) =>
                    index === self.findIndex(i => i.id === ing.id)
                );
                setIngredientesFiltrados(resultadosUnicos);
            } else {
                // Se a API não retornar nada, usa apenas o filtro local
                setIngredientesFiltrados(filtradosLocais);
            }
        } catch (error) {
            // Se houver erro na API, usa apenas o filtro local (já case-insensitive)
            setIngredientesFiltrados(filtradosLocais);
        }
    };

    const handleSelectIngrediente = (ingrediente) => {
        // Verifica se já está selecionado
        if (ingredientesSelecionados.find(ing => ing.id === ingrediente.id)) {
            return;
        }
        
        setIngredientesSelecionados([...ingredientesSelecionados, ingrediente]);
        setModalVisible(false);
        setSearchTerm('');
        setIngredientesFiltrados(allIngredientes);
    };

    const handleRemoveIngrediente = (ingredienteId) => {
        setIngredientesSelecionados(
            ingredientesSelecionados.filter(ing => ing.id !== ingredienteId)
        );
    };

    const handleCreateIngrediente = async () => {
        if (!novoIngredienteNome.trim()) {
            Alert.alert("Atenção", "Por favor, digite o nome do ingrediente.");
            return;
        }

        // Verifica se já existe um ingrediente com esse nome
        const nomeNormalizado = novoIngredienteNome.toLowerCase().trim();
        const existe = allIngredientes.some(ing => 
            ing.nome.toLowerCase() === nomeNormalizado
        );

        if (existe) {
            Alert.alert("Atenção", "Este ingrediente já existe na lista.");
            setNovoIngredienteNome('');
            setShowCreateForm(false);
            return;
        }

        setCreatingIngrediente(true);
        try {
            // Cria o ingrediente com apenas o nome
            const novoIngrediente = await postIngrediente({ nome: novoIngredienteNome.trim() });
            
            // Atualiza a lista de ingredientes
            const updatedIngredientes = [...allIngredientes, novoIngrediente];
            setAllIngredientes(updatedIngredientes);
            setIngredientesFiltrados(updatedIngredientes);
            
            // Adiciona o novo ingrediente à lista de selecionados
            setIngredientesSelecionados([...ingredientesSelecionados, novoIngrediente]);
            
            // Limpa o formulário e fecha
            setNovoIngredienteNome('');
            setShowCreateForm(false);
            setModalVisible(false);
            setSearchTerm('');
            
            Alert.alert("Sucesso", "Ingrediente criado e adicionado com sucesso!");
        } catch (error) {
            console.error("Erro ao criar ingrediente:", error);
            Alert.alert("Erro", "Não foi possível criar o ingrediente. Tente novamente.");
        } finally {
            setCreatingIngrediente(false);
        }
    };

    const handleSubmit = async () => {
        if (!nome.trim()) {
            Alert.alert("Atenção", "Por favor, preencha o nome da receita.");
            return;
        }

        if (ingredientesSelecionados.length === 0) {
            Alert.alert("Atenção", "Por favor, selecione pelo menos um ingrediente.");
            return;
        }

        setIsLoading(true);
        try {
            // O backend espera a lista de objetos de ingredientes, não apenas os IDs.
            const receitaData = {
                nome,
                etapas,
                ingredientes: ingredientesSelecionados,
                link: link || null
            };

            if (isEditing) {
                await updateReceita(Number(receitaExistente.id), receitaData);
                Alert.alert("Sucesso", "Receita atualizada com sucesso!");
            } else {
                await postReceita(receitaData);
                Alert.alert("Sucesso", "Receita criada com sucesso!");
            }
            
            setNome('');
            setEtapas('');
            setIngredientesSelecionados([]);
            setLink('');
            navigation.goBack();
        } catch (err) {
            console.error("Erro ao criar receita:", err);
            Alert.alert("Erro", "Não foi possível criar a receita.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderIngredienteItem = ({ item }) => {
        const isSelected = ingredientesSelecionados.find(ing => ing.id === item.id);
        
        return (
            <IngredientItem 
                onPress={() => handleSelectIngrediente(item)}
                disabled={!!isSelected}
                style={{ opacity: isSelected ? 0.5 : 1 }}
            >
                <IngredientItemText>{item.nome}</IngredientItemText>
                {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                )}
            </IngredientItem>
        );
    };

    return (
        <KeyboardAwareScrollView
            style={{ flex: 1, backgroundColor: 'transparent' }}
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
        >
            <FormContainer>
                <CustomTextInput
                    label="Nome:"
                    value={nome}
                    onChangeText={setNome}
                    placeholder="Nome da receita"
                />

                <IngredientsContainer>
                    <Label>Ingredientes:</Label>
                    <SelectButton onPress={() => setModalVisible(true)}>
                        <SelectButtonText>
                            {allIngredientes.length > 0 
                                ? `Selecionar ingredientes (${ingredientesSelecionados.length} selecionados)`
                                : 'Carregando ingredientes...'
                            }
                        </SelectButtonText>
                        <Ionicons name="chevron-down" size={20} color={COLORS.textLight} />
                    </SelectButton>

                    {ingredientesSelecionados.length > 0 && (
                        <SelectedIngredientsContainer>
                            {ingredientesSelecionados.map((ing) => (
                                <IngredientChip key={ing.id}>
                                    <IngredientChipText>{ing.nome}</IngredientChipText>
                                    <RemoveButton onPress={() => handleRemoveIngrediente(ing.id)}>
                                        <Ionicons name="close-circle" size={18} color={COLORS.textLight} />
                                    </RemoveButton>
                                </IngredientChip>
                            ))}
                        </SelectedIngredientsContainer>
                    )}
                </IngredientsContainer>

                <CustomTextInput
                    label="Etapas:"
                    value={etapas}
                    onChangeText={setEtapas}
                    placeholder="Descreva as etapas"
                    multiline
                />

                <CustomTextInput
                    label="Link:"
                    value={link}
                    onChangeText={setLink}
                    placeholder="Link (opcional)"
                    keyboardType="url"
                />

                <CustomButton
                    title={isEditing ? "Salvar Edição" : "Adicionar Receita"}
                    onPress={handleSubmit}
                    disabled={isLoading}
                />
            </FormContainer>

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => {
                    setModalVisible(false);
                    setSearchTerm('');
                    setIngredientesFiltrados(allIngredientes);
                    setShowCreateForm(false);
                    setNovoIngredienteNome('');
                }}
            >
                <ModalContainer>
                    <ModalContent>
                        <ModalHeader>
                            <ModalTitle>Selecionar Ingredientes</ModalTitle>
                            <TouchableOpacity onPress={() => {
                                setModalVisible(false);
                                setSearchTerm('');
                                setIngredientesFiltrados(allIngredientes);
                                setShowCreateForm(false);
                                setNovoIngredienteNome('');
                            }}>
                                <Ionicons name="close-circle" size={30} color={COLORS.accent} />
                            </TouchableOpacity>
                        </ModalHeader>

                        <SearchInput
                            placeholder="Buscar por nome..."
                            placeholderTextColor={COLORS.textSecondary}
                            value={searchTerm}
                            onChangeText={handleSearch}
                            autoFocus
                        />

                        {!showCreateForm ? (
                            <CreateButton onPress={() => {
                                setShowCreateForm(true);
                                setSearchTerm('');
                                setIngredientesFiltrados(allIngredientes);
                            }}>
                                <Ionicons name="add-circle-outline" size={20} color={COLORS.textLight} />
                                <CreateButtonText>Criar Novo Ingrediente</CreateButtonText>
                            </CreateButton>
                        ) : (
                            <CreateFormContainer>
                                <CreateFormTitle>Criar Novo Ingrediente</CreateFormTitle>
                                <CreateInput
                                    placeholder="Nome do ingrediente..."
                                    placeholderTextColor={COLORS.textSecondary}
                                    value={novoIngredienteNome}
                                    onChangeText={setNovoIngredienteNome}
                                    autoFocus
                                />
                                <CreateButtonsRow>
                                    <CreateCancelButton 
                                        onPress={() => {
                                            setShowCreateForm(false);
                                            setNovoIngredienteNome('');
                                        }}
                                        disabled={creatingIngrediente}
                                    >
                                        <CreateCancelButtonText>Cancelar</CreateCancelButtonText>
                                    </CreateCancelButton>
                                    <CreateConfirmButton 
                                        onPress={handleCreateIngrediente}
                                        disabled={creatingIngrediente || !novoIngredienteNome.trim()}
                                    >
                                        {creatingIngrediente ? (
                                            <ActivityIndicator size="small" color={COLORS.textLight} />
                                        ) : (
                                            <CreateConfirmButtonText>Criar</CreateConfirmButtonText>
                                        )}
                                    </CreateConfirmButton>
                                </CreateButtonsRow>
                            </CreateFormContainer>
                        )}

                        {loadingIngredientes ? (
                            <LoadingContainer>
                                <ActivityIndicator size="large" color={COLORS.primary} />
                            </LoadingContainer>
                        ) : !showCreateForm && (
                            <FlatList
                                data={ingredientesFiltrados}
                                renderItem={renderIngredienteItem}
                                keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
                                ListEmptyComponent={
                                    <EmptyText>Nenhum ingrediente encontrado</EmptyText>
                                }
                            />
                        )}
                    </ModalContent>
                </ModalContainer>
            </Modal>
        </KeyboardAwareScrollView>
    );
};

export default ReceitasFormScreen;