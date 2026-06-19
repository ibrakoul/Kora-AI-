import 'package:freezed_annotation/freezed_annotation.dart';

part 'user_model.freezed.dart';
part 'user_model.g.dart';

@freezed
class UserModel with _$UserModel {
  const factory UserModel({
    required String id,
    required String email,
    required String displayName,
    String? avatarUrl,
    @Default(0) int xp,
    @Default(1) int level,
    @Default(0) int streak,
    @Default(0) int longestStreak,
    required DateTime createdAt,
    required DateTime lastActive,
    @Default(false) bool isPremium,
    @Default('en') String preferredLanguage,
    @Default('zh-CN') String learningLanguage,
    @Default([]) List<String> completedLessons,
    @Default(0) int totalLessonsCompleted,
    @Default(0) int totalExercisesCompleted,
    @Default(0) int totalPracticeMinutes,
    @Default(20) int dailyGoalXp,
    @Default(0) int todayXp,
    DateTime? lastStreakDate,
    @Default(0) int streakFreezes,
    @Default('HSK 1') String currentHskLevel,
    @Default([]) List<String> unlockedAchievements,
    @Default(1) int currentLeagueRank,
    @Default('Bronze') String currentLeague,
    @Default(0) int weeklyXp,
    String? fcmToken,
    @Default(true) bool notificationsEnabled,
    DateTime? premiumExpiresAt,
    String? subscriptionType,
  }) = _UserModel;

  const UserModel._();

  factory UserModel.fromJson(Map<String, dynamic> json) => _$UserModelFromJson(json);

  factory UserModel.empty() => UserModel(
        id: '',
        email: '',
        displayName: '',
        createdAt: DateTime.now(),
        lastActive: DateTime.now(),
      );

  // Computed properties
  int get xpToNextLevel {
    final thresholds = [
      0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
      4000, 5000, 6200, 7600, 9200, 11000, 13000, 15500, 18500, 22000,
    ];

    if (level >= thresholds.length) return 0;
    final currentThreshold = level < thresholds.length ? thresholds[level - 1] : thresholds.last;
    final nextThreshold = level < thresholds.length ? thresholds[level] : thresholds.last + 5000;
    return nextThreshold - currentThreshold;
  }

  int get xpProgressInCurrentLevel {
    final thresholds = [
      0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
      4000, 5000, 6200, 7600, 9200, 11000, 13000, 15500, 18500, 22000,
    ];

    if (level <= 0 || level >= thresholds.length) return xp;
    final currentThreshold = thresholds[level - 1];
    return xp - currentThreshold;
  }

  double get levelProgressPercent {
    final toNext = xpToNextLevel;
    if (toNext == 0) return 1.0;
    return (xpProgressInCurrentLevel / toNext).clamp(0.0, 1.0);
  }

  double get dailyGoalProgress {
    if (dailyGoalXp == 0) return 0.0;
    return (todayXp / dailyGoalXp).clamp(0.0, 1.0);
  }

  bool get isDailyGoalComplete => todayXp >= dailyGoalXp;

  bool get hasActiveStreak => streak > 0;

  bool get isPremiumActive {
    if (!isPremium) return false;
    if (premiumExpiresAt == null) return true;
    return premiumExpiresAt!.isAfter(DateTime.now());
  }

  String get initials {
    final parts = displayName.trim().split(' ');
    if (parts.isEmpty) return '?';
    if (parts.length == 1) return parts[0][0].toUpperCase();
    return '${parts[0][0]}${parts[parts.length - 1][0]}'.toUpperCase();
  }

  String get levelTitle {
    switch (level) {
      case 1:
      case 2:
        return 'Beginner';
      case 3:
      case 4:
      case 5:
        return 'Elementary';
      case 6:
      case 7:
      case 8:
        return 'Intermediate';
      case 9:
      case 10:
      case 11:
      case 12:
        return 'Upper Intermediate';
      case >= 13:
        return 'Advanced';
      default:
        return 'Learner';
    }
  }

  UserModel copyWithXp(int additionalXp) {
    final newXp = xp + additionalXp;
    final newLevel = _calculateLevel(newXp);
    return copyWith(
      xp: newXp,
      level: newLevel,
      todayXp: todayXp + additionalXp,
      weeklyXp: weeklyXp + additionalXp,
    );
  }

  static int _calculateLevel(int totalXp) {
    const thresholds = [
      0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200,
      4000, 5000, 6200, 7600, 9200, 11000, 13000, 15500, 18500, 22000,
    ];

    for (int i = thresholds.length - 1; i >= 0; i--) {
      if (totalXp >= thresholds[i]) {
        return i + 1;
      }
    }
    return 1;
  }
}
