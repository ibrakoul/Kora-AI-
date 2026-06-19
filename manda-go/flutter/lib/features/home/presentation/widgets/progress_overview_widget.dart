import 'package:flutter/material.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/manda_card.dart';

class ProgressOverviewWidget extends StatelessWidget {
  const ProgressOverviewWidget({super.key});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(child: _buildStatCard(context, '142', 'Mots appris', Icons.book_outlined, AppTheme.colorPrimary)),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard(context, '12', 'Leçons', Icons.school_outlined, AppTheme.colorGold)),
        const SizedBox(width: 12),
        Expanded(child: _buildStatCard(context, '85%', 'Précision', Icons.mic_outlined, const Color(0xFF7C3AED))),
      ],
    );
  }

  Widget _buildStatCard(BuildContext context, String value, String label, IconData icon, Color color) {
    return MandaCard(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 36,
            height: 36,
            decoration: BoxDecoration(
              color: color.withOpacity(0.15),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.w800,
              color: AppTheme.colorTextPrimary,
            ),
          ),
          Text(
            label,
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: AppTheme.colorTextSecondary,
              fontSize: 11,
            ),
          ),
        ],
      ),
    );
  }
}
