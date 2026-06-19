import 'package:firebase_analytics/firebase_analytics.dart';
import 'package:flutter/foundation.dart';

import '../constants/app_constants.dart';

class AnalyticsService {
  final FirebaseAnalytics _firebaseAnalytics = FirebaseAnalytics.instance;

  bool _isEnabled = true;

  void setEnabled(bool enabled) {
    _isEnabled = enabled;
    _firebaseAnalytics.setAnalyticsCollectionEnabled(enabled);
  }

  // ==================== User Identification ====================

  Future<void> identifyUser({
    required String userId,
    required String email,
    String? displayName,
    int? xp,
    int? level,
    bool? isPremium,
    String? preferredLanguage,
    DateTime? createdAt,
  }) async {
    if (!_isEnabled) return;

    await _firebaseAnalytics.setUserId(id: userId);
    await _firebaseAnalytics.setUserProperty(name: 'email', value: email);

    if (displayName != null) {
      await _firebaseAnalytics.setUserProperty(
        name: 'display_name',
        value: displayName,
      );
    }

    if (isPremium != null) {
      await _firebaseAnalytics.setUserProperty(
        name: 'is_premium',
        value: isPremium.toString(),
      );
    }

    if (level != null) {
      await _firebaseAnalytics.setUserProperty(
        name: 'user_level',
        value: level.toString(),
      );
    }

    if (preferredLanguage != null) {
      await _firebaseAnalytics.setUserProperty(
        name: 'preferred_language',
        value: preferredLanguage,
      );
    }

    debugPrint('[Analytics] User identified: $userId');
  }

  Future<void> resetUser() async {
    if (!_isEnabled) return;
    await _firebaseAnalytics.setUserId(id: null);
    debugPrint('[Analytics] User reset');
  }

  // ==================== Screen Tracking ====================

  Future<void> trackScreenView(String screenName, {String? screenClass}) async {
    if (!_isEnabled) return;

    await _firebaseAnalytics.logScreenView(
      screenName: screenName,
      screenClass: screenClass ?? screenName,
    );

    debugPrint('[Analytics] Screen view: $screenName');
  }

  // ==================== Lesson Events ====================

  Future<void> trackLessonStarted({
    required String lessonId,
    required String lessonTitle,
    required String lessonType,
    required int lessonLevel,
  }) async {
    if (!_isEnabled) return;

    await _logEvent(AppConstants.eventLessonStarted, {
      'lesson_id': lessonId,
      'lesson_title': lessonTitle,
      'lesson_type': lessonType,
      'lesson_level': lessonLevel,
    });
  }

  Future<void> trackLessonCompleted({
    required String lessonId,
    required String lessonTitle,
    required int xpEarned,
    required int score,
    required int durationSeconds,
    required bool isPerfect,
  }) async {
    if (!_isEnabled) return;

    await _logEvent(AppConstants.eventLessonCompleted, {
      'lesson_id': lessonId,
      'lesson_title': lessonTitle,
      'xp_earned': xpEarned,
      'score': score,
      'duration_seconds': durationSeconds,
      'is_perfect': isPerfect,
    });

    // Also log to Firebase as purchase-like event for lesson completion
    await _firebaseAnalytics.logEvent(
      name: 'lesson_completed',
      parameters: {
        'lesson_id': lessonId,
        'score': score,
      },
    );
  }

  Future<void> trackExerciseAnswered({
    required String exerciseId,
    required String exerciseType,
    required bool isCorrect,
    required int attemptNumber,
  }) async {
    if (!_isEnabled) return;

    await _logEvent('exercise_answered', {
      'exercise_id': exerciseId,
      'exercise_type': exerciseType,
      'is_correct': isCorrect,
      'attempt_number': attemptNumber,
    });
  }

  // ==================== Gamification Events ====================

  Future<void> trackXpEarned({
    required int xpAmount,
    required String source,
    required int totalXp,
  }) async {
    if (!_isEnabled) return;

    await _logEvent(AppConstants.eventXpEarned, {
      'xp_amount': xpAmount,
      'source': source,
      'total_xp': totalXp,
    });
  }

  Future<void> trackStreakUpdated({
    required int streakDays,
    required bool isNewRecord,
  }) async {
    if (!_isEnabled) return;

    await _logEvent(AppConstants.eventStreakUpdated, {
      'streak_days': streakDays,
      'is_new_record': isNewRecord,
    });

    if (isNewRecord) {
      await _firebaseAnalytics.logEvent(
        name: 'streak_record',
        parameters: {'streak_days': streakDays},
      );
    }
  }

  Future<void> trackAchievementUnlocked({
    required String achievementId,
    required String achievementName,
    required String achievementType,
  }) async {
    if (!_isEnabled) return;

    await _logEvent(AppConstants.eventAchievementUnlocked, {
      'achievement_id': achievementId,
      'achievement_name': achievementName,
      'achievement_type': achievementType,
    });

    await _firebaseAnalytics.logEvent(
      name: 'unlock_achievement',
      parameters: {'achievement_id': achievementId},
    );
  }

  Future<void> trackLevelUp({
    required int newLevel,
    required int totalXp,
  }) async {
    if (!_isEnabled) return;

    await _logEvent('level_up', {
      'new_level': newLevel,
      'total_xp': totalXp,
    });

    await _firebaseAnalytics.logLevelUp(level: newLevel);
  }

  // ==================== AI Chat Events ====================

  Future<void> trackAiChatMessage({
    required String messageType,
    required int sessionMessageCount,
  }) async {
    if (!_isEnabled) return;

    await _logEvent(AppConstants.eventAiChatMessage, {
      'message_type': messageType,
      'session_message_count': sessionMessageCount,
    });
  }

  Future<void> trackVoiceMessage({
    required int durationSeconds,
    required double confidenceScore,
  }) async {
    if (!_isEnabled) return;

    await _logEvent('voice_message_sent', {
      'duration_seconds': durationSeconds,
      'confidence_score': confidenceScore,
    });
  }

  // ==================== Pronunciation Events ====================

  Future<void> trackPronunciationAttempt({
    required String character,
    required String pinyin,
    required double score,
    required bool passed,
  }) async {
    if (!_isEnabled) return;

    await _logEvent(AppConstants.eventPronunciationAttempt, {
      'character': character,
      'pinyin': pinyin,
      'score': score,
      'passed': passed,
    });
  }

  // ==================== Subscription & Revenue Events ====================

  Future<void> trackSubscriptionStarted({
    required String planId,
    required String planName,
    required double price,
    required String currency,
    required String paymentMethod,
  }) async {
    if (!_isEnabled) return;

    await _logEvent(AppConstants.eventSubscriptionStarted, {
      'plan_id': planId,
      'plan_name': planName,
      'price': price,
      'currency': currency,
      'payment_method': paymentMethod,
    });

    await _firebaseAnalytics.logPurchase(
      currency: currency,
      value: price,
      itemId: planId,
    );
  }

  Future<void> trackPaywallViewed({
    required String source,
    required String variant,
  }) async {
    if (!_isEnabled) return;

    await _logEvent('paywall_viewed', {
      'source': source,
      'variant': variant,
    });
  }

  Future<void> trackPaywallDismissed(String source) async {
    if (!_isEnabled) return;

    await _logEvent('paywall_dismissed', {'source': source});
  }

  // ==================== User Journey Events ====================

  Future<void> trackOnboardingCompleted({
    required int totalSteps,
    required int durationSeconds,
  }) async {
    if (!_isEnabled) return;

    await _logEvent('onboarding_completed', {
      'total_steps': totalSteps,
      'duration_seconds': durationSeconds,
    });

    await _firebaseAnalytics.logTutorialComplete();
  }

  Future<void> trackSignUp({
    required String method,
    required String preferredLanguage,
  }) async {
    if (!_isEnabled) return;

    await _firebaseAnalytics.logSignUp(signUpMethod: method);
    await _logEvent('user_registered', {
      'method': method,
      'preferred_language': preferredLanguage,
    });
  }

  Future<void> trackLogin({required String method}) async {
    if (!_isEnabled) return;

    await _firebaseAnalytics.logLogin(loginMethod: method);
  }

  Future<void> trackShare({
    required String contentType,
    required String contentId,
    required String method,
  }) async {
    if (!_isEnabled) return;

    await _firebaseAnalytics.logShare(
      contentType: contentType,
      itemId: contentId,
      method: method,
    );
  }

  // ==================== A/B Test Support ====================

  Future<void> setExperimentGroup({
    required String experimentId,
    required String groupName,
  }) async {
    if (!_isEnabled) return;

    await _firebaseAnalytics.setUserProperty(
      name: 'experiment_$experimentId',
      value: groupName,
    );
  }

  // ==================== Private Helpers ====================

  Future<void> _logEvent(String name, [Map<String, dynamic>? parameters]) async {
    if (!_isEnabled) return;

    try {
      // Convert all values to Firebase-compatible types
      final sanitizedParams = parameters?.map((key, value) {
        if (value is bool) return MapEntry(key, value ? 1 : 0);
        if (value is double) return MapEntry(key, value);
        if (value is int) return MapEntry(key, value);
        return MapEntry(key, value.toString());
      });

      await _firebaseAnalytics.logEvent(
        name: name,
        parameters: sanitizedParams,
      );

      debugPrint('[Analytics] Event: $name, params: $parameters');
    } catch (e) {
      debugPrint('[Analytics] Error logging event $name: $e');
    }
  }
}
