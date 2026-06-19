import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/constants/app_constants.dart';
import '../../../../core/theme/app_theme.dart';
import '../../../../core/utils/extensions.dart';
import '../../../../shared/widgets/manda_button.dart';
import '../bloc/auth_bloc.dart';

class RegisterPage extends StatefulWidget {
  const RegisterPage({super.key});

  @override
  State<RegisterPage> createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final _formKey = GlobalKey<FormState>();
  final _nameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  bool _obscurePassword = true;
  bool _obscureConfirmPassword = true;
  bool _agreeToTerms = false;
  String _passwordStrength = '';
  Color _passwordStrengthColor = Colors.grey;

  @override
  void dispose() {
    _nameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    _confirmPasswordController.dispose();
    super.dispose();
  }

  void _checkPasswordStrength(String password) {
    if (password.isEmpty) {
      setState(() {
        _passwordStrength = '';
        _passwordStrengthColor = Colors.grey;
      });
      return;
    }

    bool hasUpper = password.contains(RegExp(r'[A-Z]'));
    bool hasLower = password.contains(RegExp(r'[a-z]'));
    bool hasDigit = password.contains(RegExp(r'[0-9]'));
    bool hasSpecial = password.contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'));
    int score = [
      password.length >= 8,
      hasUpper,
      hasLower,
      hasDigit,
      hasSpecial,
    ].where((b) => b).length;

    setState(() {
      if (score <= 2) {
        _passwordStrength = 'Weak';
        _passwordStrengthColor = AppColors.error;
      } else if (score == 3) {
        _passwordStrength = 'Fair';
        _passwordStrengthColor = AppColors.warning;
      } else if (score == 4) {
        _passwordStrength = 'Good';
        _passwordStrengthColor = AppColors.jadeGreen;
      } else {
        _passwordStrength = 'Strong';
        _passwordStrengthColor = AppColors.jadeGreenDark;
      }
    });
  }

  void _onRegisterPressed() {
    if (!_formKey.currentState!.validate()) return;
    if (!_agreeToTerms) {
      context.showErrorSnackBar('Please agree to the Terms & Privacy Policy');
      return;
    }
    HapticFeedback.lightImpact();
    context.read<AuthBloc>().add(
          AuthSignUpRequested(
            email: _emailController.text.trim(),
            password: _passwordController.text,
            displayName: _nameController.text.trim(),
          ),
        );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.colorScheme.surface,
      appBar: AppBar(
        title: const Text('Create Account'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_rounded),
          onPressed: () => context.pop(),
        ),
      ),
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state is AuthAuthenticated) {
            context.go(AppConstants.homeRoute);
          } else if (state is AuthError) {
            context.showErrorSnackBar(state.failure.userFriendlyMessage);
          }
        },
        builder: (context, state) {
          final isLoading = state is AuthLoading;
          return SingleChildScrollView(
            padding: const EdgeInsets.symmetric(horizontal: 24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 8),
                _buildSubtitle(),
                const SizedBox(height: 32),
                _buildForm(isLoading),
                const SizedBox(height: 24),
                _buildTermsCheckbox(isLoading),
                const SizedBox(height: 32),
                _buildRegisterButton(isLoading),
                const SizedBox(height: 24),
                _buildLoginLink(),
                const SizedBox(height: 40),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildSubtitle() {
    return Text(
      'Join thousands learning Mandarin with AI',
      style: context.textTheme.bodyLarge?.copyWith(
        color: AppColors.textSecondary,
      ),
    ).animate().fadeIn(duration: 300.ms);
  }

  Widget _buildForm(bool isLoading) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Display Name
          TextFormField(
            controller: _nameController,
            textInputAction: TextInputAction.next,
            enabled: !isLoading,
            textCapitalization: TextCapitalization.words,
            decoration: const InputDecoration(
              labelText: 'Display Name',
              hintText: 'How should we call you?',
              prefixIcon: Icon(Icons.person_outline),
            ),
            validator: (value) {
              if (value == null || value.trim().isEmpty) return 'Name is required';
              if (value.trim().length < 2) return 'Name must be at least 2 characters';
              if (value.trim().length > 50) return 'Name must be less than 50 characters';
              return null;
            },
          ).animate().fadeIn(delay: 100.ms, duration: 300.ms),

          const SizedBox(height: 16),

          // Email
          TextFormField(
            controller: _emailController,
            keyboardType: TextInputType.emailAddress,
            textInputAction: TextInputAction.next,
            enabled: !isLoading,
            autocorrect: false,
            decoration: const InputDecoration(
              labelText: 'Email',
              hintText: 'your@email.com',
              prefixIcon: Icon(Icons.email_outlined),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) return 'Email is required';
              if (!value.isValidEmail) return 'Enter a valid email address';
              return null;
            },
          ).animate().fadeIn(delay: 200.ms, duration: 300.ms),

          const SizedBox(height: 16),

          // Password
          TextFormField(
            controller: _passwordController,
            obscureText: _obscurePassword,
            textInputAction: TextInputAction.next,
            enabled: !isLoading,
            onChanged: _checkPasswordStrength,
            decoration: InputDecoration(
              labelText: 'Password',
              hintText: 'Min 8 characters',
              prefixIcon: const Icon(Icons.lock_outline),
              suffixIcon: IconButton(
                icon: Icon(
                  _obscurePassword ? Icons.visibility_outlined : Icons.visibility_off_outlined,
                ),
                onPressed: () => setState(() => _obscurePassword = !_obscurePassword),
              ),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) return 'Password is required';
              if (value.length < 8) return 'Password must be at least 8 characters';
              return null;
            },
          ).animate().fadeIn(delay: 300.ms, duration: 300.ms),

          // Password strength indicator
          if (_passwordStrength.isNotEmpty) ...[
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: LinearProgressIndicator(
                    value: _passwordStrength == 'Weak'
                        ? 0.25
                        : _passwordStrength == 'Fair'
                            ? 0.5
                            : _passwordStrength == 'Good'
                                ? 0.75
                                : 1.0,
                    backgroundColor: Colors.grey.shade200,
                    valueColor: AlwaysStoppedAnimation<Color>(_passwordStrengthColor),
                    minHeight: 4,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  _passwordStrength,
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: _passwordStrengthColor,
                  ),
                ),
              ],
            ),
          ],

          const SizedBox(height: 16),

          // Confirm Password
          TextFormField(
            controller: _confirmPasswordController,
            obscureText: _obscureConfirmPassword,
            textInputAction: TextInputAction.done,
            enabled: !isLoading,
            onFieldSubmitted: (_) => _onRegisterPressed(),
            decoration: InputDecoration(
              labelText: 'Confirm Password',
              hintText: 'Repeat your password',
              prefixIcon: const Icon(Icons.lock_outline),
              suffixIcon: IconButton(
                icon: Icon(
                  _obscureConfirmPassword
                      ? Icons.visibility_outlined
                      : Icons.visibility_off_outlined,
                ),
                onPressed: () =>
                    setState(() => _obscureConfirmPassword = !_obscureConfirmPassword),
              ),
            ),
            validator: (value) {
              if (value == null || value.isEmpty) return 'Please confirm your password';
              if (value != _passwordController.text) return 'Passwords do not match';
              return null;
            },
          ).animate().fadeIn(delay: 400.ms, duration: 300.ms),
        ],
      ),
    );
  }

  Widget _buildTermsCheckbox(bool isLoading) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Checkbox(
          value: _agreeToTerms,
          onChanged: isLoading ? null : (v) => setState(() => _agreeToTerms = v ?? false),
          activeColor: AppColors.vermilionRed,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
        ),
        Expanded(
          child: Padding(
            padding: const EdgeInsets.only(top: 12),
            child: RichText(
              text: TextSpan(
                style: context.textTheme.bodySmall,
                children: [
                  const TextSpan(text: 'I agree to the '),
                  TextSpan(
                    text: 'Terms of Service',
                    style: const TextStyle(
                      color: AppColors.vermilionRed,
                      fontWeight: FontWeight.w600,
                    ),
                    recognizer: TapGestureRecognizer()
                      ..onTap = () => context.showSnackBar('Terms of Service'),
                  ),
                  const TextSpan(text: ' and '),
                  TextSpan(
                    text: 'Privacy Policy',
                    style: const TextStyle(
                      color: AppColors.vermilionRed,
                      fontWeight: FontWeight.w600,
                    ),
                    recognizer: TapGestureRecognizer()
                      ..onTap = () => context.showSnackBar('Privacy Policy'),
                  ),
                ],
              ),
            ),
          ),
        ),
      ],
    ).animate().fadeIn(delay: 500.ms, duration: 300.ms);
  }

  Widget _buildRegisterButton(bool isLoading) {
    return MandaButton(
      label: 'Create Account',
      onPressed: isLoading ? null : _onRegisterPressed,
      isLoading: isLoading,
      icon: Icons.check_circle_outline,
    ).animate().fadeIn(delay: 550.ms, duration: 400.ms).slideY(begin: 0.3, end: 0);
  }

  Widget _buildLoginLink() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text('Already have an account? ', style: context.textTheme.bodyMedium),
        TextButton(
          onPressed: () => context.pop(),
          child: const Text('Sign In', style: TextStyle(fontWeight: FontWeight.w700)),
        ),
      ],
    ).animate().fadeIn(delay: 600.ms, duration: 300.ms);
  }
}
