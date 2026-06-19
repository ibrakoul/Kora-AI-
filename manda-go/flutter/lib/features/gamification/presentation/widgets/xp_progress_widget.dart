import 'package:flutter/material.dart';

import '../../../../core/theme/app_theme.dart';

class XpProgressWidget extends StatelessWidget {
  const XpProgressWidget({super.key});

  @override
  Widget build(BuildContext context) {
    const int currentXp = 1420;
    const int nextLevelXp = 2000;
    const int currentLevel = 12;
    final double progress = currentXp / nextLevelXp;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Row(
              children: [
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    gradient: AppTheme.primaryGradient,
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Text(
                    'Niv. $currentLevel',
                    style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w800, fontSize: 12),
                  ),
                ),
                const SizedBox(width: 8),
                Text(
                  '学者', // Scholar
                  style: TextStyle(color: AppTheme.colorTextSecondary, fontSize: 13),
                ),
              ],
            ),
            Text(
              '$currentXp / $nextLevelXp XP',
              style: TextStyle(color: AppTheme.colorTextSecondary, fontSize: 12),
            ),
          ],
        ),
        const SizedBox(height: 8),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 8,
            backgroundColor: AppTheme.colorSurface,
            valueColor: AlwaysStoppedAnimation<Color>(AppTheme.colorPrimary),
          ),
        ),
      ],
    );
  }
}
