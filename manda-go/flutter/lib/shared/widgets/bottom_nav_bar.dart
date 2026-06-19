import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../core/theme/app_theme.dart';

class MandaBottomNavBar extends StatelessWidget {
  final int currentIndex;

  const MandaBottomNavBar({super.key, required this.currentIndex});

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.colorSurface,
        border: Border(top: BorderSide(color: AppTheme.colorBorder, width: 1)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.2),
            blurRadius: 20,
            offset: const Offset(0, -5),
          ),
        ],
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _NavItem(icon: Icons.home_outlined, activeIcon: Icons.home, label: 'Accueil', index: 0, currentIndex: currentIndex, route: '/home'),
              _NavItem(icon: Icons.map_outlined, activeIcon: Icons.map, label: 'Parcours', index: 1, currentIndex: currentIndex, route: '/lessons'),
              _NavItem(icon: Icons.smart_toy_outlined, activeIcon: Icons.smart_toy, label: 'IA', index: 2, currentIndex: currentIndex, route: '/ai-chat'),
              _NavItem(icon: Icons.leaderboard_outlined, activeIcon: Icons.leaderboard, label: 'Classement', index: 3, currentIndex: currentIndex, route: '/leaderboard'),
              _NavItem(icon: Icons.person_outline, activeIcon: Icons.person, label: 'Profil', index: 4, currentIndex: currentIndex, route: '/profile'),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavItem extends StatelessWidget {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  final int index;
  final int currentIndex;
  final String route;

  const _NavItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
    required this.index,
    required this.currentIndex,
    required this.route,
  });

  @override
  Widget build(BuildContext context) {
    final isActive = currentIndex == index;
    return GestureDetector(
      onTap: () => context.go(route),
      behavior: HitTestBehavior.opaque,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        decoration: isActive
            ? BoxDecoration(
                color: AppTheme.colorPrimary.withOpacity(0.15),
                borderRadius: BorderRadius.circular(12),
              )
            : null,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              isActive ? activeIcon : icon,
              color: isActive ? AppTheme.colorPrimary : AppTheme.colorTextSecondary,
              size: 24,
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.normal,
                color: isActive ? AppTheme.colorPrimary : AppTheme.colorTextSecondary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
