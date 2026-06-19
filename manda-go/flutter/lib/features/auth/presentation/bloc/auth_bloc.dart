import 'package:equatable/equatable.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/services/analytics_service.dart';
import '../../data/models/user_model.dart';
import '../../data/repositories/auth_repository.dart';

// ==================== Events ====================

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class AuthCheckRequested extends AuthEvent {
  const AuthCheckRequested();
}

class AuthSignInRequested extends AuthEvent {
  final String email;
  final String password;

  const AuthSignInRequested({required this.email, required this.password});

  @override
  List<Object?> get props => [email, password];
}

class AuthSignUpRequested extends AuthEvent {
  final String email;
  final String password;
  final String displayName;
  final String preferredLanguage;

  const AuthSignUpRequested({
    required this.email,
    required this.password,
    required this.displayName,
    this.preferredLanguage = 'en',
  });

  @override
  List<Object?> get props => [email, password, displayName, preferredLanguage];
}

class AuthGoogleSignInRequested extends AuthEvent {
  final String idToken;

  const AuthGoogleSignInRequested({required this.idToken});

  @override
  List<Object?> get props => [idToken];
}

class AuthAppleSignInRequested extends AuthEvent {
  final String identityToken;
  final String? fullName;
  final String? email;

  const AuthAppleSignInRequested({
    required this.identityToken,
    this.fullName,
    this.email,
  });

  @override
  List<Object?> get props => [identityToken, fullName, email];
}

class AuthSignOutRequested extends AuthEvent {
  const AuthSignOutRequested();
}

class AuthPasswordResetRequested extends AuthEvent {
  final String email;

  const AuthPasswordResetRequested({required this.email});

  @override
  List<Object?> get props => [email];
}

class AuthProfileUpdateRequested extends AuthEvent {
  final String? displayName;
  final String? avatarUrl;
  final String? preferredLanguage;
  final int? dailyGoalXp;

  const AuthProfileUpdateRequested({
    this.displayName,
    this.avatarUrl,
    this.preferredLanguage,
    this.dailyGoalXp,
  });

  @override
  List<Object?> get props => [displayName, avatarUrl, preferredLanguage, dailyGoalXp];
}

class AuthUserUpdated extends AuthEvent {
  final UserModel user;

  const AuthUserUpdated({required this.user});

  @override
  List<Object?> get props => [user];
}

// ==================== States ====================

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

class AuthInitial extends AuthState {
  const AuthInitial();
}

class AuthLoading extends AuthState {
  const AuthLoading();
}

class AuthAuthenticated extends AuthState {
  final UserModel user;

  const AuthAuthenticated({required this.user});

  @override
  List<Object?> get props => [user];
}

class AuthUnauthenticated extends AuthState {
  const AuthUnauthenticated();
}

class AuthError extends AuthState {
  final Failure failure;

  const AuthError({required this.failure});

  @override
  List<Object?> get props => [failure];
}

class AuthPasswordResetSent extends AuthState {
  final String email;

  const AuthPasswordResetSent({required this.email});

  @override
  List<Object?> get props => [email];
}

// ==================== BLoC ====================

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthRepository _authRepository;
  final AnalyticsService _analyticsService;

  AuthBloc({
    required AuthRepository authRepository,
    required AnalyticsService analyticsService,
  })  : _authRepository = authRepository,
        _analyticsService = analyticsService,
        super(const AuthInitial()) {
    on<AuthCheckRequested>(_onAuthCheckRequested);
    on<AuthSignInRequested>(_onSignInRequested);
    on<AuthSignUpRequested>(_onSignUpRequested);
    on<AuthGoogleSignInRequested>(_onGoogleSignInRequested);
    on<AuthAppleSignInRequested>(_onAppleSignInRequested);
    on<AuthSignOutRequested>(_onSignOutRequested);
    on<AuthPasswordResetRequested>(_onPasswordResetRequested);
    on<AuthProfileUpdateRequested>(_onProfileUpdateRequested);
    on<AuthUserUpdated>(_onUserUpdated);
  }

  Future<void> _onAuthCheckRequested(
    AuthCheckRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    try {
      final user = await _authRepository.getCurrentUser();
      if (user != null) {
        await _analyticsService.identifyUser(
          userId: user.id,
          email: user.email,
          displayName: user.displayName,
          xp: user.xp,
          level: user.level,
          isPremium: user.isPremium,
        );
        emit(AuthAuthenticated(user: user));
      } else {
        emit(const AuthUnauthenticated());
      }
    } catch (e) {
      emit(const AuthUnauthenticated());
    }
  }

  Future<void> _onSignInRequested(
    AuthSignInRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    final result = await _authRepository.signInWithEmail(
      email: event.email,
      password: event.password,
    );

    if (result.isSuccess) {
      final user = result.user!;
      await _analyticsService.trackLogin(method: 'email');
      await _analyticsService.identifyUser(
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
        isPremium: user.isPremium,
        level: user.level,
      );
      emit(AuthAuthenticated(user: user));
    } else {
      emit(AuthError(failure: result.failure!));
    }
  }

  Future<void> _onSignUpRequested(
    AuthSignUpRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    final result = await _authRepository.register(
      email: event.email,
      password: event.password,
      displayName: event.displayName,
      preferredLanguage: event.preferredLanguage,
    );

    if (result.isSuccess) {
      final user = result.user!;
      await _analyticsService.trackSignUp(
        method: 'email',
        preferredLanguage: event.preferredLanguage,
      );
      await _analyticsService.identifyUser(
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt,
      );
      emit(AuthAuthenticated(user: user));
    } else {
      emit(AuthError(failure: result.failure!));
    }
  }

  Future<void> _onGoogleSignInRequested(
    AuthGoogleSignInRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    final result = await _authRepository.signInWithGoogle(idToken: event.idToken);

    if (result.isSuccess) {
      final user = result.user!;
      await _analyticsService.trackLogin(method: 'google');
      await _analyticsService.identifyUser(
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
        isPremium: user.isPremium,
        level: user.level,
      );
      emit(AuthAuthenticated(user: user));
    } else {
      emit(AuthError(failure: result.failure!));
    }
  }

  Future<void> _onAppleSignInRequested(
    AuthAppleSignInRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    final result = await _authRepository.signInWithApple(
      identityToken: event.identityToken,
      fullName: event.fullName,
      email: event.email,
    );

    if (result.isSuccess) {
      final user = result.user!;
      await _analyticsService.trackLogin(method: 'apple');
      await _analyticsService.identifyUser(
        userId: user.id,
        email: user.email,
        displayName: user.displayName,
        isPremium: user.isPremium,
        level: user.level,
      );
      emit(AuthAuthenticated(user: user));
    } else {
      emit(AuthError(failure: result.failure!));
    }
  }

  Future<void> _onSignOutRequested(
    AuthSignOutRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());
    await _authRepository.signOut();
    await _analyticsService.resetUser();
    emit(const AuthUnauthenticated());
  }

  Future<void> _onPasswordResetRequested(
    AuthPasswordResetRequested event,
    Emitter<AuthState> emit,
  ) async {
    emit(const AuthLoading());

    final success = await _authRepository.resetPassword(email: event.email);

    if (success) {
      emit(AuthPasswordResetSent(email: event.email));
    } else {
      emit(const AuthError(failure: ServerFailure(message: 'Failed to send reset email')));
    }
  }

  Future<void> _onProfileUpdateRequested(
    AuthProfileUpdateRequested event,
    Emitter<AuthState> emit,
  ) async {
    final currentState = state;
    if (currentState is! AuthAuthenticated) return;

    emit(const AuthLoading());

    final result = await _authRepository.updateProfile(
      displayName: event.displayName,
      avatarUrl: event.avatarUrl,
      preferredLanguage: event.preferredLanguage,
      dailyGoalXp: event.dailyGoalXp,
    );

    if (result.isSuccess) {
      emit(AuthAuthenticated(user: result.user!));
    } else {
      emit(AuthError(failure: result.failure!));
      emit(currentState);
    }
  }

  void _onUserUpdated(AuthUserUpdated event, Emitter<AuthState> emit) {
    emit(AuthAuthenticated(user: event.user));
  }

  UserModel? get currentUser {
    final currentState = state;
    if (currentState is AuthAuthenticated) return currentState.user;
    return null;
  }
}
