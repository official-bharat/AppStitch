import React, { useState } from 'react';

import { styles } from '../styles';

import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { AppleIcon, GoogleIcon } from '../../../assets';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

export const LoginScreen = ({ onSignup }: { onSignup: () => void }) => {
  const [loading, setLoading] = useState(false);
  const { navigate } = useNavigation<
    NativeStackNavigationProp<{
      Home: { fullName: string };
    }>
  >();
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
      setLoading(true);
      axios
        .post('http://localhost:3000/auth/login', {
          email: val.email,
          password: val.password,
        })
        .then(res => {
          console.log(res.data, 'response');
          Alert.alert('User Logged in');
          if (res.data.success) {
            navigate('Home', {
              fullName: res.data.data.user.fullName,
            });
          }
        })
        .catch(err => {
          console.log(err.response.data, 'error');
          Alert.alert(err.response.data.message);
        })
        .finally(() => {
          // if the credentials is correct or not It will always goes to the final state after API response
          console.log('Finally');
          setLoading(false);
        });
    },
  });

  const isInvalidEmail = errors.email && touched.email;
  const isInvalidPassword = errors.password && touched.password;
  return (
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
        {isInvalidEmail && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          placeholder="Enter your password"
          secureTextEntry
          style={
            isInvalidPassword ? styles.errorInputStyle : styles.textInputStyle
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
          !isValid || !dirty ? styles.disabledContainer : styles.buttonContainer
        }
      >
        {loading ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
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
        <Text onPress={onSignup} style={styles.signupText}>
          Sign up
        </Text>
      </Text>
    </View>
  );
};
