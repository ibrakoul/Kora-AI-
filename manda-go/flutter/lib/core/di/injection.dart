import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:get_it/get_it.dart';

import '../services/analytics_service.dart';
import '../services/api_service.dart';
import '../services/notification_service.dart';
import '../services/storage_service.dart';
import '../../features/auth/data/repositories/auth_repository.dart';
import '../../features/auth/presentation/bloc/auth_bloc.dart';
import '../../features/lessons/presentation/bloc/lesson_bloc.dart';
import '../../features/ai_chat/presentation/bloc/ai_chat_bloc.dart';

final GetIt getIt = GetIt.instance;

Future<void> setupDependencies() async {
  // ==================== External Dependencies ====================

  // Secure Storage
  getIt.registerLazySingleton<FlutterSecureStorage>(
    () => const FlutterSecureStorage(
      aOptions: AndroidOptions(encryptedSharedPreferences: true),
      iOptions: IOSOptions(
        accessibility: KeychainAccessibility.first_unlock_this_device,
      ),
    ),
  );

  // ==================== Core Services ====================

  // Storage Service
  getIt.registerLazySingleton<StorageService>(
    () => StorageService(secureStorage: getIt<FlutterSecureStorage>()),
  );

  // API Service
  getIt.registerLazySingleton<ApiService>(
    () => ApiService(secureStorage: getIt<FlutterSecureStorage>()),
  );

  // Notification Service
  getIt.registerLazySingleton<NotificationService>(() => NotificationService());

  // Analytics Service
  getIt.registerLazySingleton<AnalyticsService>(() => AnalyticsService());

  // ==================== Repositories ====================

  // Auth Repository
  getIt.registerLazySingleton<AuthRepository>(
    () => AuthRepository(
      apiService: getIt<ApiService>(),
      storageService: getIt<StorageService>(),
    ),
  );

  // ==================== BLoCs ====================

  // Auth BLoC (singleton - needed throughout app)
  getIt.registerLazySingleton<AuthBloc>(
    () => AuthBloc(
      authRepository: getIt<AuthRepository>(),
      analyticsService: getIt<AnalyticsService>(),
    ),
  );

  // Lesson BLoC (factory - new instance each time)
  getIt.registerFactory<LessonBloc>(
    () => LessonBloc(
      apiService: getIt<ApiService>(),
      storageService: getIt<StorageService>(),
      analyticsService: getIt<AnalyticsService>(),
    ),
  );

  // AI Chat BLoC (factory)
  getIt.registerFactory<AiChatBloc>(
    () => AiChatBloc(
      apiService: getIt<ApiService>(),
      analyticsService: getIt<AnalyticsService>(),
    ),
  );

  // Initialize notification service
  await getIt<NotificationService>().initialize(
    onNotificationTap: (route, data) {
      // Navigation will be handled by router
    },
  );
}

// Extension for easier access
extension GetItExtension on GetIt {
  T getService<T extends Object>() => get<T>();
}
