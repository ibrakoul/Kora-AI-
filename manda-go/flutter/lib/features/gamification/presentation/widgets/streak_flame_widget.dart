import 'package:flutter/material.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/manda_card.dart';

class StreakFlameWidget extends StatelessWidget {
  const StreakFlameWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return MandaCard(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      child: Row(
        children: [
          _buildFlameIcon(),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '7 jours consécutifs',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                    fontWeight: FontWeight.w700,
                    color: AppTheme.colorTextPrimary,
                  ),
                ),
                Text(
                  'Continuez aujourd\'hui pour maintenir votre série !',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(
                    color: AppTheme.colorTextSecondary,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
          _buildStreakBadge(context, 7),
        ],
      ),
    );
  }

  Widget _buildFlameIcon() {
    return ShaderMask(
      shaderCallback: (Rect bounds) {
        return const LinearGradient(
          colors: [Color(0xFFFFB800), Color(0xFFFF6B35)],
          begin: Alignment.bottomCenter,
          end: Alignment.topCenter,
        ).createShader(bounds);
      },
      child: const Text('🔥', style: TextStyle(fontSize: 36)),
    );
  }

  Widget _buildStreakBadge(BuildContext context, int days) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFFB800), Color(0xFFFF6B35)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        '$days 🔥',
        style: const TextStyle(
          color: Colors.white,
          fontWeight: FontWeight.w800,
          fontSize: 16,
        ),
      ),
    );
  }
}
