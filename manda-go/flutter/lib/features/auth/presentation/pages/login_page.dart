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

class LoginPage extends StatefulWidget {
  const LoginPage({super.key});

  @override
  State<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _obscurePassword = true;
  bool _rememberMe = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _onLoginPressed() {
    if (!_formKey.currentState!.validate()) return;
    HapticFeedback.lightImpact();
    context.read<AuthBloc>().add(
          AuthSignInRequested(
            email: _emailController.text.trim(),
            password: _passwordController.text,
          ),
        );
  }

  void _onGoogleSignIn() {
    HapticFeedback.lightImpact();
    // In a real app, integrate google_sign_in package
    context.showSnackBar('Google Sign-In coming soon!');
  }

  void _onAppleSignIn() {
    HapticFeedback.lightImpact();
    // In a real app, integrate sign_in_with_apple package
    context.showSnackBar('Apple Sign-In coming soon!');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: context.colorScheme.surface,
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
          return SafeArea(
            child: CustomScrollView(
              slivers: [
                SliverFillRemaining(
                  hasScrollBody: false,
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 24),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 40),
                        _buildHeader(),
                        const SizedBox(height: 40),
                        _buildForm(isLoading),
                        const SizedBox(height: 16),
                        _buildForgotPassword(),
                        const SizedBox(height: 24),
                        _buildLoginButton(isLoading),
                        const SizedBox(height: 24),
                        _buildDivider(),
                        const SizedBox(height: 24),
                        _buildSocialButtons(isLoading),
                        const Spacer(),
                        _buildRegisterLink(),
                        const SizedBox(height: 32),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  Widget _buildHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Logo/Character
        Container(
          width: 64,
          height: 64,
          decoration: BoxDecoration(
            gradient: AppColors.primaryGradient,
            borderRadius: BorderRadius.circular(18),
            boxShadow: [
              BoxShadow(
                color: AppColors.vermilionRed.withAlpha(80),
                blurRadius: 20,
                offset: const Offset(0, 8),
              ),
            ],
          ),
          child: const Center(
            child: Text(
              '学',
              style: TextStyle(
                fontFamily: 'NotoSansSC',
                fontSize: 36,
                color: Colors.white,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ).animate().fadeIn(duration: 400.ms).slideY(begin: -0.3, end: 0),

        const SizedBox(height: 24),

        Text(
          'Welcome back!',
          style: context.textTheme.displaySmall?.copyWith(
            fontWeight: FontWeight.w700,
          ),
        ).animate().fadeIn(delay: 100.ms, duration: 400.ms).slideX(begin: -0.2, end: 0),

        const SizedBox(height: 8),

        Text(
          'Continue your Mandarin journey',
          style: context.textTheme.bodyLarge?.copyWith(
            color: AppColors.textSecondary,
          ),
        ).animate().fadeIn(delay: 200.ms, duration: 400.ms).slideX(begin: -0.2, end: 0),
      ],
    );
  }

  Widget _buildForm(bool isLoading) {
    return Form(
      key: _formKey,
      child: Column(
        children: [
          // Email field
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
              if (!value.isValidEmail) return 'Enter a valid email';
              return null;
            },
          ).animate().fadeIn(delay: 300.ms, duration: 400.ms),

          const SizedBox(height: 16),

          // Password field
          TextFormField(
            controller: _passwordController,
            obscureText: _obscurePassword,
            textInputAction: TextInputAction.done,
            enabled: !isLoading,
            onFieldSubmitted: (_) => _onLoginPressed(),
            decoration: InputDecoration(
              labelText: 'Password',
              hintText: 'Your password',
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
              if (value.length < 6) return 'Password must be at least 6 characters';
              return null;
            },
          ).animate().fadeIn(delay: 400.ms, duration: 400.ms),

          const SizedBox(height: 12),

          // Remember me
          Row(
            children: [
              Checkbox(
                value: _rememberMe,
                onChanged: isLoading ? null : (v) => setState(() => _rememberMe = v ?? false),
                activeColor: AppColors.vermilionRed,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(4)),
              ),
              Text('Remember me', style: context.textTheme.bodyMedium),
            ],
          ).animate().fadeIn(delay: 450.ms, duration: 300.ms),
        ],
      ),
    );
  }

  Widget _buildForgotPassword() {
    return Align(
      alignment: Alignment.centerRight,
      child: TextButton(
        onPressed: () => _showForgotPasswordDialog(),
        child: const Text('Forgot password?'),
      ),
    ).animate().fadeIn(delay: 500.ms, duration: 300.ms);
  }

  void _showForgotPasswordDialog() {
    final emailCtrl = TextEditingController(text: _emailController.text);
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Reset Password'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Enter your email to receive a reset link.'),
            const SizedBox(height: 16),
            TextField(
              controller: emailCtrl,
              keyboardType: TextInputType.emailAddress,
              decoration: const InputDecoration(
                labelText: 'Email',
                hintText: 'your@email.com',
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.read<AuthBloc>().add(
                    AuthPasswordResetRequested(email: emailCtrl.text),
                  );
            },
            child: const Text('Send Link'),
          ),
        ],
      ),
    );
  }

  Widget _buildLoginButton(bool isLoading) {
    return MandaButton(
      label: 'Sign In',
      onPressed: isLoading ? null : _onLoginPressed,
      isLoading: isLoading,
      icon: Icons.arrow_forward_rounded,
    ).animate().fadeIn(delay: 550.ms, duration: 400.ms).slideY(begin: 0.3, end: 0);
  }

  Widget _buildDivider() {
    return Row(
      children: [
        const Expanded(child: Divider()),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16),
          child: Text(
            'or continue with',
            style: context.textTheme.bodySmall,
          ),
        ),
        const Expanded(child: Divider()),
      ],
    ).animate().fadeIn(delay: 600.ms, duration: 300.ms);
  }

  Widget _buildSocialButtons(bool isLoading) {
    return Column(
      children: [
        // Google
        OutlinedButton.icon(
          onPressed: isLoading ? null : _onGoogleSignIn,
          icon: const Icon(Icons.g_mobiledata, size: 24),
          label: const Text('Continue with Google'),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(double.infinity, 52),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          ),
        ).animate().fadeIn(delay: 650.ms, duration: 400.ms),

        const SizedBox(height: 12),

        // Apple (only visible on iOS)
        OutlinedButton.icon(
          onPressed: isLoading ? null : _onAppleSignIn,
          icon: const Icon(Icons.apple, size: 24),
          label: const Text('Continue with Apple'),
          style: OutlinedButton.styleFrom(
            minimumSize: const Size(double.infinity, 52),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
          ),
        ).animate().fadeIn(delay: 700.ms, duration: 400.ms),
      ],
    );
  }

  Widget _buildRegisterLink() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Text(
          "Don't have an account? ",
          style: context.textTheme.bodyMedium,
        ),
        TextButton(
          onPressed: () => context.push(AppConstants.registerRoute),
          child: const Text(
            'Sign Up',
            style: TextStyle(fontWeight: FontWeight.w700),
          ),
        ),
      ],
    ).animate().fadeIn(delay: 750.ms, duration: 300.ms);
  }
}
