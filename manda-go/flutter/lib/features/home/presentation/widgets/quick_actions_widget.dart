import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_theme.dart';

class QuickActionsWidget extends StatelessWidget {
  const QuickActionsWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.6,
      children: [
        _ActionCard(
          title: 'Professeur IA',
          subtitle: 'Chat avec MandaBot',
          icon: '🤖',
          color: const Color(0xFF7C3AED),
          onTap: () => context.push('/ai-chat'),
        ),
        _ActionCard(
          title: 'Mini-Jeux',
          subtitle: '35 jeux disponibles',
          icon: '🎮',
          color: AppTheme.colorGold,
          onTap: () => context.push('/mini-games'),
        ),
        _ActionCard(
          title: 'Prononciation',
          subtitle: 'Pratiquer les tons',
          icon: '🎤',
          color: AppTheme.colorPrimary,
          onTap: () => context.push('/pronunciation'),
        ),
        _ActionCard(
          title: 'Classement',
          subtitle: 'Ligue Bronze',
          icon: '🏆',
          color: const Color(0xFFCD7F32),
          onTap: () => context.push('/leaderboard'),
        ),
      ],
    );
  }
}

class _ActionCard extends StatelessWidget {
  final String title;
  final String subtitle;
  final String icon;
  final Color color;
  final VoidCallback onTap;

  const _ActionCard({
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.color,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppTheme.colorSurface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.3), width: 1),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(icon, style: const TextStyle(fontSize: 24)),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppTheme.colorTextPrimary,
                  ),
                ),
                Text(
                  subtitle,
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: color,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
