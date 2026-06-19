import 'dart:convert';

import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../constants/app_constants.dart';

class StorageService {
  final FlutterSecureStorage _secureStorage;

  StorageService({required FlutterSecureStorage secureStorage})
      : _secureStorage = secureStorage;

  // ==================== SECURE STORAGE (Tokens & Sensitive Data) ====================

  Future<void> saveAccessToken(String token) async {
    await _secureStorage.write(key: AppConstants.accessTokenKey, value: token);
  }

  Future<String?> getAccessToken() async {
    return _secureStorage.read(key: AppConstants.accessTokenKey);
  }

  Future<void> saveRefreshToken(String token) async {
    await _secureStorage.write(key: AppConstants.refreshTokenKey, value: token);
  }

  Future<String?> getRefreshToken() async {
    return _secureStorage.read(key: AppConstants.refreshTokenKey);
  }

  Future<void> saveUserId(String userId) async {
    await _secureStorage.write(key: AppConstants.userIdKey, value: userId);
  }

  Future<String?> getUserId() async {
    return _secureStorage.read(key: AppConstants.userIdKey);
  }

  Future<void> setBiometricEnabled(bool enabled) async {
    await _secureStorage.write(
      key: AppConstants.biometricEnabledKey,
      value: enabled.toString(),
    );
  }

  Future<bool> getBiometricEnabled() async {
    final value = await _secureStorage.read(key: AppConstants.biometricEnabledKey);
    return value == 'true';
  }

  Future<void> clearSecureStorage() async {
    await _secureStorage.deleteAll();
  }

  Future<void> saveSecureString(String key, String value) async {
    await _secureStorage.write(key: key, value: value);
  }

  Future<String?> getSecureString(String key) async {
    return _secureStorage.read(key: key);
  }

  Future<void> deleteSecureKey(String key) async {
    await _secureStorage.delete(key: key);
  }

  // ==================== HIVE STORAGE (App Data) ====================

  Box<dynamic> get _settingsBox => Hive.box<dynamic>(AppConstants.hiveSettingsBox);
  Box<dynamic> get _lessonsBox => Hive.box<dynamic>(AppConstants.hiveLessonsBox);
  Box<dynamic> get _progressBox => Hive.box<dynamic>(AppConstants.hiveProgressBox);
  Box<dynamic> get _cacheBox => Hive.box<dynamic>(AppConstants.hiveCacheBox);
  Box<dynamic> get _userBox => Hive.box<dynamic>(AppConstants.hiveUserBox);

  // Settings
  Future<void> saveOnboardingCompleted(bool completed) async {
    await _settingsBox.put(AppConstants.onboardingCompletedKey, completed);
  }

  bool getOnboardingCompleted() {
    return _settingsBox.get(AppConstants.onboardingCompletedKey, defaultValue: false) as bool;
  }

  Future<void> saveNotificationsEnabled(bool enabled) async {
    await _settingsBox.put(AppConstants.notificationsEnabledKey, enabled);
  }

  bool getNotificationsEnabled() {
    return _settingsBox.get(AppConstants.notificationsEnabledKey, defaultValue: true) as bool;
  }

  Future<void> saveDailyGoalXp(int xp) async {
    await _settingsBox.put(AppConstants.dailyGoalXpKey, xp);
  }

  int getDailyGoalXp() {
    return _settingsBox.get(AppConstants.dailyGoalXpKey, defaultValue: 20) as int;
  }

  Future<void> saveAppLanguage(String languageCode) async {
    await _settingsBox.put(AppConstants.appLanguageKey, languageCode);
  }

  String getAppLanguage() {
    return _settingsBox.get(AppConstants.appLanguageKey, defaultValue: 'en') as String;
  }

  // User Data
  Future<void> saveUserData(Map<String, dynamic> userData) async {
    await _userBox.put('current_user', json.encode(userData));
  }

  Map<String, dynamic>? getUserData() {
    final data = _userBox.get('current_user') as String?;
    if (data == null) return null;
    try {
      return json.decode(data) as Map<String, dynamic>;
    } catch (e) {
      debugPrint('Error parsing user data: $e');
      return null;
    }
  }

  Future<void> clearUserData() async {
    await _userBox.clear();
  }

  // Lesson Cache
  Future<void> saveLessons(List<Map<String, dynamic>> lessons) async {
    await _lessonsBox.put('lessons_list', json.encode(lessons));
    await _lessonsBox.put('lessons_cached_at', DateTime.now().toIso8601String());
  }

  List<Map<String, dynamic>>? getCachedLessons() {
    final cachedAt = _lessonsBox.get('lessons_cached_at') as String?;
    if (cachedAt == null) return null;

    final cacheTime = DateTime.parse(cachedAt);
    if (DateTime.now().difference(cacheTime) > AppConstants.lessonsCacheDuration) {
      return null;
    }

    final data = _lessonsBox.get('lessons_list') as String?;
    if (data == null) return null;
    try {
      final decoded = json.decode(data) as List<dynamic>;
      return decoded.cast<Map<String, dynamic>>();
    } catch (e) {
      debugPrint('Error parsing lessons: $e');
      return null;
    }
  }

  Future<void> saveLessonProgress(String lessonId, Map<String, dynamic> progress) async {
    await _progressBox.put('lesson_$lessonId', json.encode(progress));
  }

  Map<String, dynamic>? getLessonProgress(String lessonId) {
    final data = _progressBox.get('lesson_$lessonId') as String?;
    if (data == null) return null;
    try {
      return json.decode(data) as Map<String, dynamic>;
    } catch (e) {
      return null;
    }
  }

  Future<void> saveCompletedLessons(List<String> lessonIds) async {
    await _progressBox.put('completed_lessons', lessonIds);
  }

  List<String> getCompletedLessons() {
    final data = _progressBox.get('completed_lessons');
    if (data == null) return [];
    return List<String>.from(data as List<dynamic>);
  }

  // Generic Cache
  Future<void> cacheData(String key, dynamic data, {Duration? duration}) async {
    final cacheEntry = {
      'data': json.encode(data),
      'cached_at': DateTime.now().toIso8601String(),
      'expires_in_seconds': duration?.inSeconds,
    };
    await _cacheBox.put(key, json.encode(cacheEntry));
  }

  T? getCachedData<T>(String key) {
    final raw = _cacheBox.get(key) as String?;
    if (raw == null) return null;

    try {
      final cacheEntry = json.decode(raw) as Map<String, dynamic>;
      final cachedAt = DateTime.parse(cacheEntry['cached_at'] as String);
      final expiresInSeconds = cacheEntry['expires_in_seconds'] as int?;

      if (expiresInSeconds != null) {
        final expiry = cachedAt.add(Duration(seconds: expiresInSeconds));
        if (DateTime.now().isAfter(expiry)) {
          _cacheBox.delete(key);
          return null;
        }
      }

      return json.decode(cacheEntry['data'] as String) as T?;
    } catch (e) {
      debugPrint('Error reading cache for $key: $e');
      return null;
    }
  }

  Future<void> clearCache() async {
    await _cacheBox.clear();
  }

  Future<void> clearAllData() async {
    await _settingsBox.clear();
    await _lessonsBox.clear();
    await _progressBox.clear();
    await _cacheBox.clear();
    await _userBox.clear();
    await clearSecureStorage();
  }

  // Generic Hive Operations
  Future<void> put(String boxName, String key, dynamic value) async {
    final box = Hive.box<dynamic>(boxName);
    await box.put(key, value);
  }

  T? get<T>(String boxName, String key, {T? defaultValue}) {
    final box = Hive.box<dynamic>(boxName);
    return box.get(key, defaultValue: defaultValue) as T?;
  }

  Future<void> delete(String boxName, String key) async {
    final box = Hive.box<dynamic>(boxName);
    await box.delete(key);
  }

  bool has(String boxName, String key) {
    final box = Hive.box<dynamic>(boxName);
    return box.containsKey(key);
  }

  // Last sync tracking
  Future<void> updateLastSync() async {
    await _settingsBox.put(AppConstants.lastSyncKey, DateTime.now().toIso8601String());
  }

  DateTime? getLastSync() {
    final data = _settingsBox.get(AppConstants.lastSyncKey) as String?;
    if (data == null) return null;
    return DateTime.tryParse(data);
  }

  bool get needsSync {
    final lastSync = getLastSync();
    if (lastSync == null) return true;
    return DateTime.now().difference(lastSync) > const Duration(hours: 1);
  }
}
