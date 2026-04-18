import React from 'react';

import { styles } from '../styles';

import { Text, View, TouchableOpacity, TextInput, Alert } from 'react-native';
import { AppleIcon, GoogleIcon } from '../../../assets';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const LoginScreen = () => {
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
        Don't have an account? <Text style={styles.signupText}>Sign up</Text>
      </Text>
    </View>
  );
};
