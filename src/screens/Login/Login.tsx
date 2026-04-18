import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppleIcon, GoogleIcon } from '../../assets';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const LoginScreen = () => {
  const [activeTab, setActiveTab] = useState('login');

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
  };
  const handleLoginPress = () => {
    handleTabPress('login');
  };
  const handleRegisterPress = () => {
    handleTabPress('register');
  };
  const isRegister = activeTab === 'register';
  const isLogin = activeTab === 'login';

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Required'),
  });

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    isValid,
    dirty,
    touched,
  } = useFormik({
    initialValues: {
      password: '',
      email: '',
    },
    validationSchema: LoginSchema,
    onSubmit: (val: { email: string; password: string }) => {
      Alert.alert(JSON.stringify(val, null, 2));
    },
  });

  const isInvalidEmail = errors.email && touched.email;
  const isInvalidPassword = errors.password && touched.password;

  return (
    <SafeAreaView style={styles.safeareaView}>
      <View style={styles.container}>
        <Text style={styles.headerText}>Login to your account</Text>
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            onPress={handleLoginPress}
            style={isLogin ? styles.toggleView : styles.toggleUnselectView}
          >
            <Text style={isLogin ? styles.activeText : styles.inactiveText}>
              Login
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleRegisterPress}
            style={isRegister ? styles.toggleView : styles.toggleUnselectView}
          >
            <Text style={isRegister ? styles.activeText : styles.inactiveText}>
              Register
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              placeholder="Enter your email"
              style={
                isInvalidEmail ? styles.errorInputStyle : styles.textInputStyle
              }
              onChangeText={handleChange('email')}
              onBlur={handleBlur('email')}
              value={values.email}
            />
            {isInvalidEmail && (
              <Text style={styles.errorText}>{errors.email}</Text>
            )}
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Password</Text>
            <TextInput
              placeholder="Enter your password"
              secureTextEntry
              style={
                isInvalidPassword
                  ? styles.errorInputStyle
                  : styles.textInputStyle
              }
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
            />
            {isInvalidPassword && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}
          </View>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          <TouchableOpacity
            onPress={handleSubmit}
            style={
              !isValid || !dirty
                ? styles.disabledContainer
                : styles.buttonContainer
            }
          >
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.subtitle}>or continue with</Text>
          <View style={styles.mainSocialLoginContainer}>
            <View style={styles.socialLoginContainer}>
              <GoogleIcon />
              <Text>Google</Text>
            </View>
            <View style={styles.socialLoginContainer}>
              <AppleIcon />
              <Text>Apple</Text>
            </View>
          </View>
          <Text style={styles.noAccountText}>
            Don't have an account?{' '}
            <Text style={styles.signupText}>Sign up</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
