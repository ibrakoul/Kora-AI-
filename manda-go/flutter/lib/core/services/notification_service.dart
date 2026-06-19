import 'dart:convert';

import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';

import '../constants/app_constants.dart';

class NotificationService {
  final FirebaseMessaging _messaging = FirebaseMessaging.instance;
  final FlutterLocalNotificationsPlugin _localNotifications =
      FlutterLocalNotificationsPlugin();

  String? _fcmToken;
  Function(String? route, Map<String, dynamic>? data)? _onNotificationTap;

  String? get fcmToken => _fcmToken;

  Future<void> initialize({
    Function(String? route, Map<String, dynamic>? data)? onNotificationTap,
  }) async {
    _onNotificationTap = onNotificationTap;

    await _requestPermissions();
    await _initLocalNotifications();
    await _setupFCMHandlers();
    await _getFCMToken();
  }

  Future<bool> _requestPermissions() async {
    final settings = await _messaging.requestPermission(
      alert: true,
      announcement: false,
      badge: true,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );

    debugPrint('Notification permission: ${settings.authorizationStatus}');
    return settings.authorizationStatus == AuthorizationStatus.authorized ||
        settings.authorizationStatus == AuthorizationStatus.provisional;
  }

  Future<void> _initLocalNotifications() async {
    const androidSettings = AndroidInitializationSettings('@mipmap/ic_launcher');
    const iosSettings = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    const initSettings = InitializationSettings(
      android: androidSettings,
      iOS: iosSettings,
    );

    await _localNotifications.initialize(
      initSettings,
      onDidReceiveNotificationResponse: _onLocalNotificationTap,
      onDidReceiveBackgroundNotificationResponse: _onBackgroundNotificationTap,
    );

    await _createNotificationChannels();
  }

  Future<void> _createNotificationChannels() async {
    const channels = [
      AndroidNotificationChannel(
        AppConstants.dailyReminderChannelId,
        'Daily Reminders',
        description: 'Daily practice reminders to maintain your streak',
        importance: Importance.high,
        enableVibration: true,
        playSound: true,
      ),
      AndroidNotificationChannel(
        AppConstants.streakAlertChannelId,
        'Streak Alerts',
        description: 'Alerts when your streak is at risk',
        importance: Importance.max,
        enableVibration: true,
        playSound: true,
      ),
      AndroidNotificationChannel(
        AppConstants.achievementChannelId,
        'Achievements',
        description: 'Notifications when you unlock achievements',
        importance: Importance.defaultImportance,
        enableVibration: true,
      ),
      AndroidNotificationChannel(
        AppConstants.generalChannelId,
        'General',
        description: 'General app notifications',
        importance: Importance.defaultImportance,
      ),
    ];

    final androidPlugin = _localNotifications.resolvePlatformSpecificImplementation<
        AndroidFlutterLocalNotificationsPlugin>();

    for (final channel in channels) {
      await androidPlugin?.createNotificationChannel(channel);
    }
  }

  Future<void> _setupFCMHandlers() async {
    // Handle messages when app is in foreground
    FirebaseMessaging.onMessage.listen(_handleForegroundMessage);

    // Handle when app is opened from background notification
    FirebaseMessaging.onMessageOpenedApp.listen(_handleNotificationOpenedApp);

    // Handle initial notification (app opened from terminated state)
    final initialMessage = await _messaging.getInitialMessage();
    if (initialMessage != null) {
      _handleNotificationOpenedApp(initialMessage);
    }

    // Subscribe to default topics
    await _messaging.subscribeToTopic('all_users');
  }

  void _handleForegroundMessage(RemoteMessage message) {
    debugPrint('Foreground message: ${message.notification?.title}');
    final notification = message.notification;
    if (notification == null) return;

    final channelId = message.data['channel_id'] as String? ?? AppConstants.generalChannelId;
    _showLocalNotification(
      id: message.hashCode,
      title: notification.title ?? 'Manda Go',
      body: notification.body ?? '',
      payload: json.encode(message.data),
      channelId: channelId,
    );
  }

  void _handleNotificationOpenedApp(RemoteMessage message) {
    debugPrint('Notification opened app: ${message.data}');
    final route = message.data['route'] as String?;
    _onNotificationTap?.call(route, message.data);
  }

  Future<void> _getFCMToken() async {
    _fcmToken = await _messaging.getToken();
    debugPrint('FCM Token: $_fcmToken');

    _messaging.onTokenRefresh.listen((token) {
      _fcmToken = token;
      debugPrint('FCM Token refreshed: $token');
    });
  }

  void _onLocalNotificationTap(NotificationResponse response) {
    if (response.payload != null) {
      try {
        final data = json.decode(response.payload!) as Map<String, dynamic>;
        final route = data['route'] as String?;
        _onNotificationTap?.call(route, data);
      } catch (e) {
        debugPrint('Error parsing notification payload: $e');
      }
    }
  }

  @pragma('vm:entry-point')
  static void _onBackgroundNotificationTap(NotificationResponse response) {
    debugPrint('Background notification tapped: ${response.payload}');
  }

  Future<void> _showLocalNotification({
    required int id,
    required String title,
    required String body,
    String? payload,
    String channelId = AppConstants.generalChannelId,
  }) async {
    final androidDetails = AndroidNotificationDetails(
      channelId,
      channelId,
      importance: Importance.high,
      priority: Priority.high,
      styleInformation: BigTextStyleInformation(body),
    );

    const iosDetails = DarwinNotificationDetails(
      presentAlert: true,
      presentBadge: true,
      presentSound: true,
    );

    final details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _localNotifications.show(id, title, body, details, payload: payload);
  }

  Future<void> scheduleDailyReminder({
    required TimeOfDay time,
    required String title,
    required String body,
  }) async {
    await _localNotifications.cancelAll();

    final now = DateTime.now();
    var scheduledDate = DateTime(
      now.year,
      now.month,
      now.day,
      time.hour,
      time.minute,
    );

    if (scheduledDate.isBefore(now)) {
      scheduledDate = scheduledDate.add(const Duration(days: 1));
    }

    final androidDetails = AndroidNotificationDetails(
      AppConstants.dailyReminderChannelId,
      'Daily Reminders',
      importance: Importance.high,
      priority: Priority.high,
    );

    const iosDetails = DarwinNotificationDetails();

    final details = NotificationDetails(
      android: androidDetails,
      iOS: iosDetails,
    );

    await _localNotifications.show(
      1001,
      title,
      body,
      details,
      payload: json.encode({'type': 'daily_reminder'}),
    );
  }

  Future<void> showStreakAlert(int streakCount) async {
    await _showLocalNotification(
      id: 2001,
      title: 'Don\'t break your streak!',
      body: 'You have a $streakCount-day streak. Practice now to keep it going! 🔥',
      channelId: AppConstants.streakAlertChannelId,
      payload: json.encode({'type': 'streak_alert', 'route': AppConstants.homeRoute}),
    );
  }

  Future<void> showAchievementUnlocked(String achievementName) async {
    await _showLocalNotification(
      id: DateTime.now().millisecondsSinceEpoch % 100000,
      title: 'Achievement Unlocked! 🏆',
      body: 'You unlocked "$achievementName"!',
      channelId: AppConstants.achievementChannelId,
      payload: json.encode({'type': 'achievement', 'route': AppConstants.achievementsRoute}),
    );
  }

  Future<void> subscribeToTopic(String topic) async {
    await _messaging.subscribeToTopic(topic);
  }

  Future<void> unsubscribeFromTopic(String topic) async {
    await _messaging.unsubscribeFromTopic(topic);
  }

  Future<void> cancelAllNotifications() async {
    await _localNotifications.cancelAll();
  }

  Future<void> cancelNotification(int id) async {
    await _localNotifications.cancel(id);
  }

  Future<void> updateFCMToken(String? token) async {
    _fcmToken = token;
  }
}
