import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';
import { AppleIcon, GoogleIcon } from '../../../assets';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export const SignupScreen = () => {
  // now I am adding the validation schema for the signup form using yup

  const SignupSchema = Yup.object().shape({
    fullName: Yup.string().required('Required'),
    email: Yup.string()
      .email('Please enter a valid email')
      .required('Required'),
    password: Yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Required'),
  });

  // Add the formik validation here
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    errors,
    touched,
    isValid,
    dirty,
  } = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
    },
    validationSchema: SignupSchema,
    onSubmit: val => {
      Alert.alert(JSON.stringify(val, null, 2));
    },
  });
  // now I am adding the errors and touched properties to the formik hook to show the error messages when the user submits the form without filling the required fields or with invalid email or password less than 8 characters

  const isInvalidEmail = errors.email && touched.email;
  const isInvalidPassword = errors.password && touched.password;
  const isInvalidFullName = errors.fullName && touched.fullName;

  // now I am adding the input fields error styles

  // now I am adding the validation of submit button to disable it when the form is invalid or not touched

  const isSubmitDisabled = !(isValid && dirty);

  console.log('values', values, errors);
  return (
    <View style={styles.formContainer}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Full Name</Text>
        <TextInput
          placeholder="Enter your full name"
          style={
            isInvalidFullName ? styles.errorInputStyle : styles.textInputStyle
          }
          onChangeText={handleChange('fullName')}
          onBlur={handleBlur('fullName')}
          value={values.fullName}
        />
        {isInvalidFullName && (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        )}
      </View>
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
          style={
            isInvalidPassword ? styles.errorInputStyle : styles.textInputStyle
          }
          placeholder="Enter your password"
          secureTextEntry
          onChangeText={handleChange('password')}
          onBlur={handleBlur('password')}
          value={values.password}
        />
        {isInvalidPassword && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}
      </View>
      <TouchableOpacity
        onPress={handleSubmit}
        style={
          isSubmitDisabled ? styles.disabledContainer : styles.buttonContainer
        }
      >
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>or login with</Text>
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
        Already have an account? <Text style={styles.signupText}>Sign in</Text>
      </Text>
    </View>
  );
};
