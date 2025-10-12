import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import MetasList from '../components/Metas/MetasList';
import Button from '../components/Global/CustomButton';
import { COLORS } from '../constants/Colors';

const MetasScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    if (isFocused) setRefreshTrigger(prev => !prev);
  }, [isFocused]);

  return (
    <View style={styles.container}>
      <View style={styles.buttonWrapper}>
        <Button
          title="Adicionar Meta"
          onPress={() => navigation.navigate('MetaForm')}
        />
      </View>
      <MetasList refreshTrigger={refreshTrigger} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  buttonWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: COLORS.background,
  },
});

export default MetasScreen;

