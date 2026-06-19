class AppConstants {
  AppConstants._();

  // API Configuration
  static const String baseUrl = 'https://api.mandago.app/v1';
  static const String wsBaseUrl = 'wss://ws.mandago.app/v1';
  static const int connectTimeout = 30000;
  static const int receiveTimeout = 30000;
  static const int sendTimeout = 30000;

  // API Endpoints
  static const String authEndpoint = '/auth';
  static const String loginEndpoint = '/auth/login';
  static const String registerEndpoint = '/auth/register';
  static const String googleAuthEndpoint = '/auth/google';
  static const String appleAuthEndpoint = '/auth/apple';
  static const String refreshTokenEndpoint = '/auth/refresh';
  static const String logoutEndpoint = '/auth/logout';
  static const String resetPasswordEndpoint = '/auth/reset-password';

  static const String lessonsEndpoint = '/lessons';
  static const String exercisesEndpoint = '/exercises';
  static const String progressEndpoint = '/progress';
  static const String userEndpoint = '/user';
  static const String profileEndpoint = '/user/profile';
  static const String achievementsEndpoint = '/achievements';
  static const String leaderboardEndpoint = '/leaderboard';
  static const String aiChatEndpoint = '/ai/chat';
  static const String pronunciationEndpoint = '/pronunciation/score';
  static const String vocabularyEndpoint = '/vocabulary';
  static const String subscriptionEndpoint = '/subscription';

  // Hive Box Names
  static const String hiveSettingsBox = 'settings_box';
  static const String hiveLessonsBox = 'lessons_box';
  static const String hiveProgressBox = 'progress_box';
  static const String hiveCacheBox = 'cache_box';
  static const String hiveUserBox = 'user_box';
  static const String hiveAchievementsBox = 'achievements_box';
  static const String hiveVocabularyBox = 'vocabulary_box';

  // Secure Storage Keys
  static const String accessTokenKey = 'access_token';
  static const String refreshTokenKey = 'refresh_token';
  static const String userIdKey = 'user_id';
  static const String biometricEnabledKey = 'biometric_enabled';

  // Shared Preferences Keys
  static const String onboardingCompletedKey = 'onboarding_completed';
  static const String selectedThemeKey = 'selected_theme';
  static const String notificationsEnabledKey = 'notifications_enabled';
  static const String dailyReminderTimeKey = 'daily_reminder_time';
  static const String lastSyncKey = 'last_sync';
  static const String appLanguageKey = 'app_language';
  static const String dailyGoalXpKey = 'daily_goal_xp';

  // Route Names
  static const String splashRoute = '/';
  static const String onboardingRoute = '/onboarding';
  static const String loginRoute = '/login';
  static const String registerRoute = '/register';
  static const String homeRoute = '/home';
  static const String lessonsRoute = '/lessons';
  static const String lessonDetailRoute = '/lessons/:id';
  static const String exerciseRoute = '/lessons/:id/exercise';
  static const String aiChatRoute = '/ai-chat';
  static const String profileRoute = '/profile';
  static const String leaderboardRoute = '/leaderboard';
  static const String miniGamesRoute = '/mini-games';
  static const String shopRoute = '/shop';
  static const String premiumRoute = '/premium';
  static const String settingsRoute = '/settings';
  static const String statsRoute = '/stats';
  static const String pronunciationRoute = '/pronunciation';
  static const String achievementsRoute = '/achievements';
  static const String notificationsRoute = '/notifications';

  // Asset Paths
  static const String imagesPath = 'assets/images/';
  static const String animationsPath = 'assets/animations/';
  static const String audioPath = 'assets/audio/';

  // Specific Assets
  static const String logoImage = '${imagesPath}logo.png';
  static const String splashBg = '${imagesPath}splash_bg.png';
  static const String onboarding1 = '${imagesPath}onboarding_1.png';
  static const String onboarding2 = '${imagesPath}onboarding_2.png';
  static const String onboarding3 = '${imagesPath}onboarding_3.png';
  static const String onboarding4 = '${imagesPath}onboarding_4.png';
  static const String streakFlame = '${animationsPath}streak_flame.json';
  static const String celebrationAnim = '${animationsPath}celebration.json';
  static const String loadingAnim = '${animationsPath}loading.json';
  static const String emptyStateAnim = '${animationsPath}empty_state.json';
  static const String successAnim = '${animationsPath}success.json';
  static const String errorAnim = '${animationsPath}error.json';
  static const String correctSound = '${audioPath}correct.mp3';
  static const String incorrectSound = '${audioPath}incorrect.mp3';
  static const String levelUpSound = '${audioPath}level_up.mp3';
  static const String streakSound = '${audioPath}streak.mp3';

  // Gamification Constants
  static const int maxStreakFreezeCount = 2;
  static const int xpPerLesson = 20;
  static const int xpPerCorrectAnswer = 5;
  static const int xpBonusPerfectLesson = 10;
  static const int xpStreakBonus = 5;
  static const List<int> levelThresholds = [
    0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
    4000, 5000, 6200, 7600, 9200, 11000, 13000, 15500, 18500, 22000,
  ];

  // Daily Goals XP Options
  static const List<int> dailyGoalOptions = [10, 20, 50, 100];

  // HSK Levels
  static const List<String> hskLevels = [
    'HSK 1', 'HSK 2', 'HSK 3', 'HSK 4', 'HSK 5', 'HSK 6',
  ];

  // Feature Flags
  static const bool enableVoiceChat = true;
  static const bool enablePremiumFeatures = true;
  static const bool enableMiniGames = true;
  static const bool enableLeaderboard = true;
  static const bool enableOfflineMode = true;
  static const bool enableAR = false;

  // Pagination
  static const int defaultPageSize = 20;
  static const int defaultLessonPageSize = 10;

  // Cache Duration
  static const Duration lessonsCacheDuration = Duration(hours: 24);
  static const Duration leaderboardCacheDuration = Duration(minutes: 15);
  static const Duration userCacheDuration = Duration(hours: 1);

  // Notification Channel IDs
  static const String dailyReminderChannelId = 'daily_reminder';
  static const String streakAlertChannelId = 'streak_alert';
  static const String achievementChannelId = 'achievement';
  static const String generalChannelId = 'general';

  // Analytics Events
  static const String eventLessonStarted = 'lesson_started';
  static const String eventLessonCompleted = 'lesson_completed';
  static const String eventXpEarned = 'xp_earned';
  static const String eventStreakUpdated = 'streak_updated';
  static const String eventAchievementUnlocked = 'achievement_unlocked';
  static const String eventAiChatMessage = 'ai_chat_message';
  static const String eventPronunciationAttempt = 'pronunciation_attempt';
  static const String eventSubscriptionStarted = 'subscription_started';
  static const String eventScreenView = 'screen_view';
}
