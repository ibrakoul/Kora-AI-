import 'package:equatable/equatable.dart';

abstract class Failure extends Equatable {
  final String message;
  final String? code;
  final dynamic details;

  const Failure({
    required this.message,
    this.code,
    this.details,
  });

  @override
  List<Object?> get props => [message, code, details];
}

class NetworkFailure extends Failure {
  const NetworkFailure({
    super.message = 'No internet connection. Please check your network settings.',
    super.code = 'NETWORK_ERROR',
    super.details,
  });
}

class TimeoutFailure extends Failure {
  const TimeoutFailure({
    super.message = 'Request timed out. Please try again.',
    super.code = 'TIMEOUT_ERROR',
    super.details,
  });
}

class ServerFailure extends Failure {
  final int? statusCode;

  const ServerFailure({
    super.message = 'An unexpected server error occurred.',
    super.code = 'SERVER_ERROR',
    super.details,
    this.statusCode,
  });

  @override
  List<Object?> get props => [...super.props, statusCode];
}

class AuthFailure extends Failure {
  const AuthFailure({
    super.message = 'Authentication failed. Please sign in again.',
    super.code = 'AUTH_ERROR',
    super.details,
  });
}

class UnauthorizedFailure extends Failure {
  const UnauthorizedFailure({
    super.message = 'You are not authorized to perform this action.',
    super.code = 'UNAUTHORIZED',
    super.details,
  });
}

class InvalidCredentialsFailure extends Failure {
  const InvalidCredentialsFailure({
    super.message = 'Invalid email or password.',
    super.code = 'INVALID_CREDENTIALS',
    super.details,
  });
}

class EmailAlreadyExistsFailure extends Failure {
  const EmailAlreadyExistsFailure({
    super.message = 'An account with this email already exists.',
    super.code = 'EMAIL_EXISTS',
    super.details,
  });
}

class UserNotFoundFailure extends Failure {
  const UserNotFoundFailure({
    super.message = 'User account not found.',
    super.code = 'USER_NOT_FOUND',
    super.details,
  });
}

class CacheFailure extends Failure {
  const CacheFailure({
    super.message = 'Failed to read or write local data.',
    super.code = 'CACHE_ERROR',
    super.details,
  });
}

class ValidationFailure extends Failure {
  final Map<String, String>? fieldErrors;

  const ValidationFailure({
    super.message = 'Please check the form for errors.',
    super.code = 'VALIDATION_ERROR',
    super.details,
    this.fieldErrors,
  });

  @override
  List<Object?> get props => [...super.props, fieldErrors];
}

class NotFoundFailure extends Failure {
  const NotFoundFailure({
    super.message = 'The requested resource was not found.',
    super.code = 'NOT_FOUND',
    super.details,
  });
}

class PermissionFailure extends Failure {
  const PermissionFailure({
    super.message = 'Required permission was denied.',
    super.code = 'PERMISSION_DENIED',
    super.details,
  });
}

class PremiumRequiredFailure extends Failure {
  const PremiumRequiredFailure({
    super.message = 'This feature requires a premium subscription.',
    super.code = 'PREMIUM_REQUIRED',
    super.details,
  });
}

class LessonNotFoundFailure extends Failure {
  const LessonNotFoundFailure({
    super.message = 'Lesson not found.',
    super.code = 'LESSON_NOT_FOUND',
    super.details,
  });
}

class PronunciationFailure extends Failure {
  const PronunciationFailure({
    super.message = 'Failed to analyze pronunciation.',
    super.code = 'PRONUNCIATION_ERROR',
    super.details,
  });
}

class UnknownFailure extends Failure {
  const UnknownFailure({
    super.message = 'An unexpected error occurred.',
    super.code = 'UNKNOWN_ERROR',
    super.details,
  });
}

extension FailureExtension on Failure {
  bool get isNetworkError => this is NetworkFailure || this is TimeoutFailure;
  bool get isAuthError => this is AuthFailure || this is UnauthorizedFailure;
  bool get isServerError => this is ServerFailure;
  bool get isCacheError => this is CacheFailure;
  bool get isValidationError => this is ValidationFailure;

  String get userFriendlyMessage {
    if (isNetworkError) return 'Please check your internet connection.';
    if (isAuthError) return message;
    if (isServerError) return 'Something went wrong on our end. Please try again.';
    return message;
  }
}
