import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import { CustomButton } from '../components/CustomButton';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { DifyApiService } from '../services/difyApi';
import { colors, globalStyles } from '../styles/globalStyles';

type InputScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Input'>;

interface Props {
  navigation: InputScreenNavigationProp;
}

export const InputScreen: React.FC<Props> = ({ navigation }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!question.trim()) {
      Alert.alert('提示', '请输入你的困惑');
      return;
    }

    setIsLoading(true);

    try {
      // 先导航到答案页面，然后开始流式输出
      navigation.navigate('Answer', {
        question: question.trim(),
        answer: '', // 初始为空，将通过流式更新
        isStreaming: true,
      });

      // 清空输入框
      setQuestion('');
    } catch (error) {
      Alert.alert('错误', error instanceof Error ? error.message : '获取答案失败，请稍后再试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={globalStyles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={globalStyles.title}>卡点解惑</Text>
            
            <View style={globalStyles.card}>
              <TextInput
                style={[globalStyles.input, styles.textInput]}
                placeholder="请输入你遇到的困惑，宇宙将为你解答"
                placeholderTextColor={colors.textPlaceholder}
                value={question}
                onChangeText={setQuestion}
                multiline
                textAlignVertical="top"
                maxLength={500}
              />
              
              <Text style={globalStyles.waitingText}>
                请耐心等待，宇宙正在为你准备答案。
              </Text>
            </View>
            
            <View style={styles.buttonContainer}>
              <CustomButton
                title="提交问题"
                onPress={handleSubmit}
                disabled={isLoading || !question.trim()}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <LoadingIndicator visible={isLoading} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  textInput: {
    minHeight: 150,
    fontSize: 16,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
});
