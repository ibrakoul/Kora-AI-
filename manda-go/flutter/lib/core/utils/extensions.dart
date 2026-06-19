import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

// String Extensions
extension StringExtensions on String {
  String get capitalize {
    if (isEmpty) return this;
    return '${this[0].toUpperCase()}${substring(1).toLowerCase()}';
  }

  String get capitalizeWords {
    return split(' ').map((word) => word.capitalize).join(' ');
  }

  bool get isValidEmail {
    return RegExp(r'^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$').hasMatch(this);
  }

  bool get isValidPassword {
    return length >= 8;
  }

  bool get isStrongPassword {
    final hasUppercase = contains(RegExp(r'[A-Z]'));
    final hasDigits = contains(RegExp(r'[0-9]'));
    final hasSpecialChars = contains(RegExp(r'[!@#$%^&*(),.?":{}|<>]'));
    return length >= 8 && hasUppercase && hasDigits && hasSpecialChars;
  }

  bool get containsChinese {
    return RegExp(r'[一-龥]').hasMatch(this);
  }

  String get pinyinDisplay {
    // In a real app, this would use a pinyin conversion library
    // For now, returns the string as-is (pinyin should already be stored)
    return this;
  }

  String get truncated100 {
    if (length <= 100) return this;
    return '${substring(0, 97)}...';
  }

  String truncate(int maxLength, {String ellipsis = '...'}) {
    if (length <= maxLength) return this;
    return '${substring(0, maxLength - ellipsis.length)}$ellipsis';
  }

  String? get nullIfEmpty => isEmpty ? null : this;

  String get removeWhitespace => replaceAll(RegExp(r'\s+'), '');

  List<String> get chineseCharacters {
    return split('').where((c) => RegExp(r'[一-龥]').hasMatch(c)).toList();
  }

  int get chineseCharacterCount {
    return RegExp(r'[一-龥]').allMatches(this).length;
  }
}

// Nullable String Extensions
extension NullableStringExtensions on String? {
  bool get isNullOrEmpty => this == null || this!.isEmpty;
  bool get isNotNullOrEmpty => this != null && this!.isNotEmpty;
  String get orEmpty => this ?? '';
  String orDefault(String defaultValue) => this ?? defaultValue;
}

// BuildContext Extensions
extension BuildContextExtensions on BuildContext {
  ThemeData get theme => Theme.of(this);
  TextTheme get textTheme => Theme.of(this).textTheme;
  ColorScheme get colorScheme => Theme.of(this).colorScheme;
  MediaQueryData get mediaQuery => MediaQuery.of(this);
  Size get screenSize => MediaQuery.of(this).size;
  double get screenWidth => MediaQuery.of(this).size.width;
  double get screenHeight => MediaQuery.of(this).size.height;
  double get statusBarHeight => MediaQuery.of(this).padding.top;
  double get bottomPadding => MediaQuery.of(this).padding.bottom;
  bool get isDark => Theme.of(this).brightness == Brightness.dark;
  bool get isTablet => MediaQuery.of(this).size.shortestSide >= 600;
  double get devicePixelRatio => MediaQuery.of(this).devicePixelRatio;

  void showSnackBar(
    String message, {
    SnackBarAction? action,
    Duration duration = const Duration(seconds: 3),
    Color? backgroundColor,
  }) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        action: action,
        duration: duration,
        backgroundColor: backgroundColor,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(10),
        ),
      ),
    );
  }

  void showErrorSnackBar(String message) {
    showSnackBar(
      message,
      backgroundColor: Theme.of(this).colorScheme.error,
    );
  }

  void showSuccessSnackBar(String message) {
    showSnackBar(
      message,
      backgroundColor: const Color(0xFF2ECC71),
    );
  }

  Future<T?> showBottomSheet<T>(Widget child) {
    return showModalBottomSheet<T>(
      context: this,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (_) => child,
    );
  }

  void pop<T>([T? result]) => Navigator.of(this).pop(result);

  bool get canPop => Navigator.of(this).canPop();
}

// DateTime Extensions
extension DateTimeExtensions on DateTime {
  String get timeAgo {
    final now = DateTime.now();
    final difference = now.difference(this);

    if (difference.inSeconds < 60) {
      return 'just now';
    } else if (difference.inMinutes < 60) {
      final minutes = difference.inMinutes;
      return '$minutes ${minutes == 1 ? 'minute' : 'minutes'} ago';
    } else if (difference.inHours < 24) {
      final hours = difference.inHours;
      return '$hours ${hours == 1 ? 'hour' : 'hours'} ago';
    } else if (difference.inDays < 7) {
      final days = difference.inDays;
      return '$days ${days == 1 ? 'day' : 'days'} ago';
    } else if (difference.inDays < 30) {
      final weeks = (difference.inDays / 7).floor();
      return '$weeks ${weeks == 1 ? 'week' : 'weeks'} ago';
    } else if (difference.inDays < 365) {
      final months = (difference.inDays / 30).floor();
      return '$months ${months == 1 ? 'month' : 'months'} ago';
    } else {
      final years = (difference.inDays / 365).floor();
      return '$years ${years == 1 ? 'year' : 'years'} ago';
    }
  }

  String get formatChinese {
    final formatter = DateFormat('yyyy年MM月dd日', 'zh');
    return formatter.format(this);
  }

  String get formatDate => DateFormat('MMM dd, yyyy').format(this);
  String get formatTime => DateFormat('HH:mm').format(this);
  String get formatDateTime => DateFormat('MMM dd, yyyy HH:mm').format(this);
  String get formatDayName => DateFormat('EEEE').format(this);
  String get formatShortDayName => DateFormat('EEE').format(this);

  bool get isToday {
    final now = DateTime.now();
    return year == now.year && month == now.month && day == now.day;
  }

  bool get isYesterday {
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    return year == yesterday.year && month == yesterday.month && day == yesterday.day;
  }

  bool get isTomorrow {
    final tomorrow = DateTime.now().add(const Duration(days: 1));
    return year == tomorrow.year && month == tomorrow.month && day == tomorrow.day;
  }

  String get relativeDay {
    if (isToday) return 'Today';
    if (isYesterday) return 'Yesterday';
    if (isTomorrow) return 'Tomorrow';
    return formatDate;
  }

  bool isSameDay(DateTime other) {
    return year == other.year && month == other.month && day == other.day;
  }

  DateTime get startOfDay => DateTime(year, month, day);
  DateTime get endOfDay => DateTime(year, month, day, 23, 59, 59);
}

// Int Extensions
extension IntExtensions on int {
  String get toXPString {
    if (this >= 1000000) {
      return '${(this / 1000000).toStringAsFixed(1)}M XP';
    } else if (this >= 1000) {
      return '${(this / 1000).toStringAsFixed(1)}K XP';
    }
    return '$this XP';
  }

  String get toCompact {
    if (this >= 1000000) {
      return '${(this / 1000000).toStringAsFixed(1)}M';
    } else if (this >= 1000) {
      return '${(this / 1000).toStringAsFixed(1)}K';
    }
    return toString();
  }

  String get toOrdinal {
    if (this >= 11 && this <= 13) return '${this}th';
    switch (this % 10) {
      case 1: return '${this}st';
      case 2: return '${this}nd';
      case 3: return '${this}rd';
      default: return '${this}th';
    }
  }

  Duration get seconds => Duration(seconds: this);
  Duration get minutes => Duration(minutes: this);
  Duration get hours => Duration(hours: this);
  Duration get days => Duration(days: this);

  String get toMinutesString {
    if (this < 60) return '$this min';
    final hours = this ~/ 60;
    final minutes = this % 60;
    if (minutes == 0) return '${hours}h';
    return '${hours}h ${minutes}m';
  }

  bool get isEven => this % 2 == 0;
  bool get isOdd => this % 2 != 0;

  int clampTo(int min, int max) => clamp(min, max).toInt();
}

// Double Extensions
extension DoubleExtensions on double {
  String get toPercentage => '${(this * 100).toStringAsFixed(0)}%';
  String toFixed(int decimals) => toStringAsFixed(decimals);
  bool get isWhole => this % 1 == 0;
}

// List Extensions
extension ListExtensions<T> on List<T> {
  T? get firstOrNull => isEmpty ? null : first;
  T? get lastOrNull => isEmpty ? null : last;
  T? elementAtOrNull(int index) => (index >= 0 && index < length) ? this[index] : null;

  List<T> get shuffled {
    final copy = List<T>.from(this);
    copy.shuffle();
    return copy;
  }

  List<List<T>> chunk(int size) {
    final List<List<T>> chunks = [];
    for (var i = 0; i < length; i += size) {
      chunks.add(sublist(i, i + size > length ? length : i + size));
    }
    return chunks;
  }
}

// Color Extensions
extension ColorExtensions on Color {
  Color withOpacityValue(double opacity) => withAlpha((opacity * 255).round());

  Color get lighter {
    final hsl = HSLColor.fromColor(this);
    return hsl.withLightness((hsl.lightness + 0.1).clamp(0.0, 1.0)).toColor();
  }

  Color get darker {
    final hsl = HSLColor.fromColor(this);
    return hsl.withLightness((hsl.lightness - 0.1).clamp(0.0, 1.0)).toColor();
  }

  String get toHex => '#${value.toRadixString(16).padLeft(8, '0').substring(2)}';
}
