import { StyleSheet } from 'react-native';

export const colors = {
  primary: '#8B7355',
  secondary: '#A0937D',
  background: '#F5F5F5',
  white: '#FFFFFF',
  text: '#333333',
  textLight: '#666666',
  textPlaceholder: '#999999',
  gradientStart: '#E8E2DB',
  gradientEnd: '#F5F1EC',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 30,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  waitingText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    marginTop: 16,
    fontStyle: 'italic',
  },
  guideText: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 20,
  },
});
