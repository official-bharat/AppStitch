import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  safeareaView: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerText: {
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    backgroundColor: '#f8f8f8',
    marginHorizontal: 30,
    borderRadius: 40,
    alignItems: 'center',
    width: 340,
  },
  toggleView: {
    backgroundColor: '#41b9A1',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 40,
    width: 170,
    alignItems: 'center',
    margin: 5,
  },
  toggleUnselectView: {
    width: 170,
    alignItems: 'center',
    margin: 5,
  },
  activeText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  inactiveText: {
    color: '#000',
    fontSize: 16,
  },
  formContainer: {
    marginHorizontal: 40,
    marginTop: 20,
  },
  inputContainer: {
    marginTop: 20,
  },
  textInputStyle: {
    backgroundColor: '#f8f8f8',
    marginTop: 8,
    padding: 15,
    borderRadius: 10,
  },
  inputLabel: {
    color: '#000',
    fontSize: 16,
  },
  forgotPasswordText: {
    textAlign: 'right',
    marginTop: 15,
    color: '#C6C6C6',
  },
  buttonContainer: {
    backgroundColor: '#41b9A1',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 30,
  },
  disabledContainer: {
    backgroundColor: '#C6C6C6',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 30,
    color: '#000',
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    gap: 10,
    borderWidth: 0.3,
    borderRadius: 10,
    width: 150,
    padding: 5,
    borderColor: '#C6C6C6',
  },
  mainSocialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 5,
  },
  noAccountText: {
    color: '#C6C6C6',
    marginTop: 30,
    textAlign: 'center',
    fontSize: 16,
  },
  signupText: {
    color: '#000',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
  errorInputStyle: {
    borderColor: 'red',
    borderWidth: 1,
    marginTop: 8,
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
  },
});
