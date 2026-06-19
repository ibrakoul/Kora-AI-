import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../constants/app_constants.dart';
import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/auth/presentation/pages/login_page.dart';
import '../../features/auth/presentation/pages/register_page.dart';
import '../../features/home/presentation/pages/home_page.dart';
import '../../features/lessons/presentation/pages/lesson_map_page.dart';
import '../../features/lessons/presentation/pages/lesson_detail_page.dart';
import '../../features/ai_chat/presentation/pages/ai_chat_page.dart';
import '../../features/gamification/presentation/pages/leaderboard_page.dart';
import '../../features/pronunciation/presentation/pages/pronunciation_page.dart';
import '../../features/onboarding/presentation/pages/onboarding_page.dart';
import '../../shared/widgets/bottom_nav_bar.dart';

class AppRouter {
  AppRouter._();

  static GoRouter createRouter(AuthState authState) {
    return GoRouter(
      initialLocation: AppConstants.splashRoute,
      debugLogDiagnostics: true,
      redirect: (context, state) => _handleRedirect(state, authState),
      routes: _buildRoutes(),
      errorBuilder: (context, state) => _ErrorPage(error: state.error),
    );
  }

  static String? _handleRedirect(GoRouterState state, AuthState authState) {
    final currentPath = state.uri.path;
    final isAuthenticated = authState is AuthAuthenticated;
    final isOnboardingRoute = currentPath == AppConstants.onboardingRoute;
    final isAuthRoute = currentPath == AppConstants.loginRoute ||
        currentPath == AppConstants.registerRoute;
    final isSplashRoute = currentPath == AppConstants.splashRoute;

    if (isSplashRoute) return null;

    if (!isAuthenticated && !isAuthRoute && !isOnboardingRoute) {
      return AppConstants.loginRoute;
    }

    if (isAuthenticated && isAuthRoute) {
      return AppConstants.homeRoute;
    }

    return null;
  }

  static List<RouteBase> _buildRoutes() {
    return [
      // Splash
      GoRoute(
        path: AppConstants.splashRoute,
        name: 'splash',
        pageBuilder: (context, state) => _buildFadePage(
          state: state,
          child: const _SplashPage(),
        ),
      ),

      // Onboarding
      GoRoute(
        path: AppConstants.onboardingRoute,
        name: 'onboarding',
        pageBuilder: (context, state) => _buildSlidePage(
          state: state,
          child: const OnboardingPage(),
        ),
      ),

      // Auth Routes
      GoRoute(
        path: AppConstants.loginRoute,
        name: 'login',
        pageBuilder: (context, state) => _buildFadePage(
          state: state,
          child: const LoginPage(),
        ),
        routes: [
          GoRoute(
            path: 'register',
            name: 'register',
            pageBuilder: (context, state) => _buildSlidePage(
              state: state,
              child: const RegisterPage(),
            ),
          ),
        ],
      ),

      // Main Shell with Bottom Navigation
      ShellRoute(
        builder: (context, state, child) => MainShell(child: child),
        routes: [
          // Home
          GoRoute(
            path: AppConstants.homeRoute,
            name: 'home',
            pageBuilder: (context, state) => _buildNoTransitionPage(
              state: state,
              child: const HomePage(),
            ),
          ),

          // Lessons Map
          GoRoute(
            path: AppConstants.lessonsRoute,
            name: 'lessons',
            pageBuilder: (context, state) => _buildNoTransitionPage(
              state: state,
              child: const LessonMapPage(),
            ),
            routes: [
              GoRoute(
                path: ':id',
                name: 'lesson_detail',
                pageBuilder: (context, state) => _buildSlidePage(
                  state: state,
                  child: LessonDetailPage(
                    lessonId: state.pathParameters['id'] ?? '',
                  ),
                ),
                routes: [
                  GoRoute(
                    path: 'exercise',
                    name: 'exercise',
                    pageBuilder: (context, state) => _buildScalePage(
                      state: state,
                      child: LessonDetailPage(
                        lessonId: state.pathParameters['id'] ?? '',
                        startExercise: true,
                      ),
                    ),
                  ),
                ],
              ),
            ],
          ),

          // AI Chat
          GoRoute(
            path: AppConstants.aiChatRoute,
            name: 'ai_chat',
            pageBuilder: (context, state) => _buildNoTransitionPage(
              state: state,
              child: const AiChatPage(),
            ),
          ),

          // Leaderboard
          GoRoute(
            path: AppConstants.leaderboardRoute,
            name: 'leaderboard',
            pageBuilder: (context, state) => _buildNoTransitionPage(
              state: state,
              child: const LeaderboardPage(),
            ),
          ),

          // Profile
          GoRoute(
            path: AppConstants.profileRoute,
            name: 'profile',
            pageBuilder: (context, state) => _buildNoTransitionPage(
              state: state,
              child: const _ProfilePlaceholderPage(),
            ),
          ),
        ],
      ),

      // Pronunciation (full screen)
      GoRoute(
        path: AppConstants.pronunciationRoute,
        name: 'pronunciation',
        pageBuilder: (context, state) {
          final extra = state.extra as Map<String, dynamic>?;
          return _buildSlidePage(
            state: state,
            child: PronunciationPage(
              character: extra?['character'] as String? ?? '你好',
              pinyin: extra?['pinyin'] as String? ?? 'nǐ hǎo',
              translation: extra?['translation'] as String? ?? 'Hello',
            ),
          );
        },
      ),

      // Settings
      GoRoute(
        path: AppConstants.settingsRoute,
        name: 'settings',
        pageBuilder: (context, state) => _buildSlidePage(
          state: state,
          child: const _SettingsPlaceholderPage(),
        ),
      ),
    ];
  }

  static CustomTransitionPage<void> _buildFadePage({
    required GoRouterState state,
    required Widget child,
  }) {
    return CustomTransitionPage<void>(
      key: state.pageKey,
      child: child,
      transitionDuration: const Duration(milliseconds: 300),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return FadeTransition(opacity: animation, child: child);
      },
    );
  }

  static CustomTransitionPage<void> _buildSlidePage({
    required GoRouterState state,
    required Widget child,
  }) {
    return CustomTransitionPage<void>(
      key: state.pageKey,
      child: child,
      transitionDuration: const Duration(milliseconds: 300),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        const begin = Offset(1.0, 0.0);
        const end = Offset.zero;
        const curve = Curves.easeInOutCubic;
        final tween = Tween(begin: begin, end: end).chain(CurveTween(curve: curve));
        return SlideTransition(position: animation.drive(tween), child: child);
      },
    );
  }

  static CustomTransitionPage<void> _buildScalePage({
    required GoRouterState state,
    required Widget child,
  }) {
    return CustomTransitionPage<void>(
      key: state.pageKey,
      child: child,
      transitionDuration: const Duration(milliseconds: 300),
      transitionsBuilder: (context, animation, secondaryAnimation, child) {
        return ScaleTransition(
          scale: Tween<double>(begin: 0.85, end: 1.0).animate(
            CurvedAnimation(parent: animation, curve: Curves.easeOutBack),
          ),
          child: FadeTransition(opacity: animation, child: child),
        );
      },
    );
  }

  static NoTransitionPage<void> _buildNoTransitionPage({
    required GoRouterState state,
    required Widget child,
  }) {
    return NoTransitionPage<void>(key: state.pageKey, child: child);
  }
}

class _SplashPage extends StatefulWidget {
  const _SplashPage();

  @override
  State<_SplashPage> createState() => _SplashPageState();
}

class _SplashPageState extends State<_SplashPage> {
  @override
  void initState() {
    super.initState();
    _navigate();
  }

  Future<void> _navigate() async {
    await Future<void>.delayed(const Duration(milliseconds: 1500));
    if (!mounted) return;
    context.go(AppConstants.loginRoute);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFE8163C),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Text(
              '漫达',
              style: TextStyle(
                fontFamily: 'NotoSansSC',
                fontSize: 72,
                fontWeight: FontWeight.w700,
                color: Colors.white,
                letterSpacing: 8,
                shadows: [
                  Shadow(
                    color: Colors.black.withAlpha(60),
                    offset: const Offset(0, 4),
                    blurRadius: 12,
                  ),
                ],
              ),
            ),
            const SizedBox(height: 8),
            const Text(
              'MANDA GO',
              style: TextStyle(
                fontFamily: 'Inter',
                fontSize: 22,
                fontWeight: FontWeight.w300,
                color: Colors.white,
                letterSpacing: 6,
              ),
            ),
            const SizedBox(height: 48),
            const CircularProgressIndicator(
              color: Colors.white,
              strokeWidth: 2,
            ),
          ],
        ),
      ),
    );
  }
}

class _ProfilePlaceholderPage extends StatelessWidget {
  const _ProfilePlaceholderPage();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Profile')),
      body: const Center(child: Text('Profile Page')),
    );
  }
}

class _SettingsPlaceholderPage extends StatelessWidget {
  const _SettingsPlaceholderPage();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Settings')),
      body: const Center(child: Text('Settings Page')),
    );
  }
}

class _ErrorPage extends StatelessWidget {
  final Exception? error;

  const _ErrorPage({this.error});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.error_outline, size: 64, color: Color(0xFFE8163C)),
            const SizedBox(height: 16),
            const Text('Page Not Found', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Text(error?.toString() ?? 'Unknown error', textAlign: TextAlign.center),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => context.go(AppConstants.homeRoute),
              child: const Text('Go Home'),
            ),
          ],
        ),
      ),
    );
  }
}
