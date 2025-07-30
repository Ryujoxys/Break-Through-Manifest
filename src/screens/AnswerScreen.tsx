import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import { CustomButton } from '../components/CustomButton';
import { DifyApiService } from '../services/difyApi';
import { colors, globalStyles } from '../styles/globalStyles';

type AnswerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Answer'>;
type AnswerScreenRouteProp = RouteProp<RootStackParamList, 'Answer'>;

interface Props {
  navigation: AnswerScreenNavigationProp;
  route: AnswerScreenRouteProp;
}

export const AnswerScreen: React.FC<Props> = ({ navigation, route }) => {
  const { question, answer: initialAnswer, isStreaming = false } = route.params;
  const [answer, setAnswer] = useState(initialAnswer);
  const [isLoading, setIsLoading] = useState(isStreaming);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // 淡入动画
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  useEffect(() => {
    // 如果是流式模式，开始获取答案
    if (isStreaming && !answer) {
      const startStreaming = async () => {
        try {
          await DifyApiService.askQuestionStream(
            question,
            (chunk) => {
              setAnswer(chunk);
            },
            (fullAnswer) => {
              setAnswer(fullAnswer);
              setIsLoading(false);
            }
          );
        } catch (error) {
          console.error('流式输出错误:', error);
          Alert.alert('错误', error instanceof Error ? error.message : '获取答案失败');
          setIsLoading(false);
        }
      };

      startStreaming();
    }
  }, [isStreaming, question, answer]);

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.content}>
            <Text style={globalStyles.title}>卡点解惑</Text>
            
            <Animated.View
              style={[
                styles.answerContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              <View style={styles.questionSection}>
                <Text style={styles.sectionLabel}>问题：</Text>
                <Text style={styles.questionText}>"{question}"</Text>
              </View>
              
              <View style={styles.answerSection}>
                <Text style={styles.sectionLabel}>宇宙的智慧：</Text>
                {isLoading && !answer ? (
                  <Text style={styles.loadingText}>正在接收宇宙的智慧...</Text>
                ) : (
                  <Text style={styles.answerText}>
                    {answer}
                    {isLoading && <Text style={styles.cursor}>|</Text>}
                  </Text>
                )}
              </View>
            </Animated.View>
            
            <Animated.View
              style={[
                styles.guideContainer,
                {
                  opacity: fadeAnim,
                },
              ]}
            >
              <Text style={globalStyles.guideText}>
                答案来自宇宙的智慧。请静心思考它与你的问题的关联，相信你的直觉会帮助你理解其中的深意。
              </Text>
            </Animated.View>
          </View>
        </ScrollView>
        
        <View style={styles.buttonContainer}>
          <CustomButton
            title="返回提问"
            onPress={handleGoBack}
            variant="secondary"
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
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
    paddingHorizontal: 20,
  },
  answerContainer: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  questionSection: {
    marginBottom: 20,
  },
  answerSection: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 24,
    fontStyle: 'italic',
  },
  answerText: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 26,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textLight,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  cursor: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  guideContainer: {
    paddingHorizontal: 10,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
});
