import 'package:flutter/foundation.dart';

import '../../../../core/errors/failures.dart';
import '../../../../core/services/api_service.dart';
import '../../../../core/services/storage_service.dart';
import '../../../../core/constants/app_constants.dart';
import '../models/user_model.dart';

class AuthResult {
  final UserModel? user;
  final String? accessToken;
  final String? refreshToken;
  final Failure? failure;

  const AuthResult({
    this.user,
    this.accessToken,
    this.refreshToken,
    this.failure,
  });

  bool get isSuccess => failure == null && user != null;

  factory AuthResult.success({
    required UserModel user,
    required String accessToken,
    required String refreshToken,
  }) {
    return AuthResult(
      user: user,
      accessToken: accessToken,
      refreshToken: refreshToken,
    );
  }

  factory AuthResult.failure(Failure failure) {
    return AuthResult(failure: failure);
  }
}

class AuthRepository {
  final ApiService _apiService;
  final StorageService _storageService;

  AuthRepository({
    required ApiService apiService,
    required StorageService storageService,
  })  : _apiService = apiService,
        _storageService = storageService;

  /// Sign in with email and password
  Future<AuthResult> signInWithEmail({
    required String email,
    required String password,
  }) async {
    try {
      final response = await _apiService.post<Map<String, dynamic>>(
        AppConstants.loginEndpoint,
        data: {
          'email': email.trim().toLowerCase(),
          'password': password,
        },
      );

      if (response.statusCode == 401) {
        return AuthResult.failure(const InvalidCredentialsFailure());
      }

      if (response.data == null) {
        return AuthResult.failure(const ServerFailure());
      }

      final data = response.data!;
      final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
      final accessToken = data['access_token'] as String;
      final refreshToken = data['refresh_token'] as String;

      await _persistAuthData(user, accessToken, refreshToken);
      _apiService.setAuthToken(accessToken);

      return AuthResult.success(
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      );
    } on Failure catch (f) {
      return AuthResult.failure(f);
    } catch (e) {
      debugPrint('SignIn error: $e');
      return AuthResult.failure(const UnknownFailure());
    }
  }

  /// Register a new account
  Future<AuthResult> register({
    required String email,
    required String password,
    required String displayName,
    String preferredLanguage = 'en',
  }) async {
    try {
      final response = await _apiService.post<Map<String, dynamic>>(
        AppConstants.registerEndpoint,
        data: {
          'email': email.trim().toLowerCase(),
          'password': password,
          'display_name': displayName.trim(),
          'preferred_language': preferredLanguage,
        },
      );

      if (response.statusCode == 409) {
        return AuthResult.failure(const EmailAlreadyExistsFailure());
      }

      if (response.data == null) {
        return AuthResult.failure(const ServerFailure());
      }

      final data = response.data!;
      final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
      final accessToken = data['access_token'] as String;
      final refreshToken = data['refresh_token'] as String;

      await _persistAuthData(user, accessToken, refreshToken);
      _apiService.setAuthToken(accessToken);

      return AuthResult.success(
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      );
    } on Failure catch (f) {
      return AuthResult.failure(f);
    } catch (e) {
      debugPrint('Register error: $e');
      return AuthResult.failure(const UnknownFailure());
    }
  }

  /// Sign in with Google OAuth token
  Future<AuthResult> signInWithGoogle({required String idToken}) async {
    try {
      final response = await _apiService.post<Map<String, dynamic>>(
        AppConstants.googleAuthEndpoint,
        data: {'id_token': idToken},
      );

      if (response.data == null) {
        return AuthResult.failure(const AuthFailure(message: 'Google sign-in failed'));
      }

      final data = response.data!;
      final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
      final accessToken = data['access_token'] as String;
      final refreshToken = data['refresh_token'] as String;

      await _persistAuthData(user, accessToken, refreshToken);
      _apiService.setAuthToken(accessToken);

      return AuthResult.success(
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      );
    } on Failure catch (f) {
      return AuthResult.failure(f);
    } catch (e) {
      debugPrint('Google sign-in error: $e');
      return AuthResult.failure(const AuthFailure(message: 'Google sign-in failed'));
    }
  }

  /// Sign in with Apple OAuth token
  Future<AuthResult> signInWithApple({
    required String identityToken,
    String? fullName,
    String? email,
  }) async {
    try {
      final response = await _apiService.post<Map<String, dynamic>>(
        AppConstants.appleAuthEndpoint,
        data: {
          'identity_token': identityToken,
          if (fullName != null) 'full_name': fullName,
          if (email != null) 'email': email,
        },
      );

      if (response.data == null) {
        return AuthResult.failure(const AuthFailure(message: 'Apple sign-in failed'));
      }

      final data = response.data!;
      final user = UserModel.fromJson(data['user'] as Map<String, dynamic>);
      final accessToken = data['access_token'] as String;
      final refreshToken = data['refresh_token'] as String;

      await _persistAuthData(user, accessToken, refreshToken);
      _apiService.setAuthToken(accessToken);

      return AuthResult.success(
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
      );
    } on Failure catch (f) {
      return AuthResult.failure(f);
    } catch (e) {
      debugPrint('Apple sign-in error: $e');
      return AuthResult.failure(const AuthFailure(message: 'Apple sign-in failed'));
    }
  }

  /// Sign out the current user
  Future<void> signOut() async {
    try {
      await _apiService.post<void>(AppConstants.logoutEndpoint);
    } catch (e) {
      debugPrint('Signout API error (ignored): $e');
    } finally {
      _apiService.clearAuthToken();
      await _storageService.clearSecureStorage();
      await _storageService.clearUserData();
    }
  }

  /// Get the currently authenticated user from cache or API
  Future<UserModel?> getCurrentUser() async {
    try {
      final token = await _storageService.getAccessToken();
      if (token == null) return null;

      // Try local cache first
      final cachedData = _storageService.getUserData();
      if (cachedData != null) {
        _apiService.setAuthToken(token);
        return UserModel.fromJson(cachedData);
      }

      // Fetch from API
      _apiService.setAuthToken(token);
      final response = await _apiService.get<Map<String, dynamic>>(
        AppConstants.userEndpoint,
      );

      if (response.data == null) return null;

      final user = UserModel.fromJson(response.data!);
      await _storageService.saveUserData(response.data!);
      return user;
    } catch (e) {
      debugPrint('GetCurrentUser error: $e');
      return null;
    }
  }

  /// Update the user profile
  Future<AuthResult> updateProfile({
    String? displayName,
    String? avatarUrl,
    String? preferredLanguage,
    int? dailyGoalXp,
  }) async {
    try {
      final response = await _apiService.patch<Map<String, dynamic>>(
        AppConstants.profileEndpoint,
        data: {
          if (displayName != null) 'display_name': displayName,
          if (avatarUrl != null) 'avatar_url': avatarUrl,
          if (preferredLanguage != null) 'preferred_language': preferredLanguage,
          if (dailyGoalXp != null) 'daily_goal_xp': dailyGoalXp,
        },
      );

      if (response.data == null) {
        return AuthResult.failure(const ServerFailure());
      }

      final user = UserModel.fromJson(response.data!);
      await _storageService.saveUserData(response.data!);

      final token = await _storageService.getAccessToken() ?? '';
      final refreshToken = await _storageService.getRefreshToken() ?? '';

      return AuthResult.success(
        user: user,
        accessToken: token,
        refreshToken: refreshToken,
      );
    } on Failure catch (f) {
      return AuthResult.failure(f);
    } catch (e) {
      debugPrint('UpdateProfile error: $e');
      return AuthResult.failure(const UnknownFailure());
    }
  }

  /// Send password reset email
  Future<bool> resetPassword({required String email}) async {
    try {
      final response = await _apiService.post<void>(
        AppConstants.resetPasswordEndpoint,
        data: {'email': email.trim().toLowerCase()},
      );
      return response.statusCode == 200 || response.statusCode == 204;
    } catch (e) {
      debugPrint('ResetPassword error: $e');
      return false;
    }
  }

  /// Refresh the FCM token on the server
  Future<void> updateFcmToken(String token) async {
    try {
      await _apiService.post<void>(
        '${AppConstants.userEndpoint}/fcm-token',
        data: {'fcm_token': token},
      );
    } catch (e) {
      debugPrint('UpdateFcmToken error: $e');
    }
  }

  Future<void> _persistAuthData(
    UserModel user,
    String accessToken,
    String refreshToken,
  ) async {
    await _storageService.saveAccessToken(accessToken);
    await _storageService.saveRefreshToken(refreshToken);
    await _storageService.saveUserId(user.id);
    await _storageService.saveUserData(user.toJson());
  }
}
