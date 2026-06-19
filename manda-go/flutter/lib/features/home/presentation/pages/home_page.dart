import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../gamification/presentation/widgets/streak_flame_widget.dart';
import '../../../gamification/presentation/widgets/xp_progress_widget.dart';
import '../widgets/daily_lesson_card.dart';
import '../widgets/progress_overview_widget.dart';
import '../widgets/quick_actions_widget.dart';

class HomePage extends StatelessWidget {
  const HomePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.colorBackground,
      body: CustomScrollView(
        slivers: [
          _buildAppBar(context),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                const SizedBox(height: 8),
                const StreakFlameWidget(),
                const SizedBox(height: 20),
                const XpProgressWidget(),
                const SizedBox(height: 24),
                _buildSectionTitle(context, 'Leçon du jour', '今日课程'),
                const SizedBox(height: 12),
                const DailyLessonCard(),
                const SizedBox(height: 24),
                _buildSectionTitle(context, 'Votre progression', '学习进度'),
                const SizedBox(height: 12),
                const ProgressOverviewWidget(),
                const SizedBox(height: 24),
                _buildSectionTitle(context, 'Actions rapides', '快速操作'),
                const SizedBox(height: 12),
                const QuickActionsWidget(),
                const SizedBox(height: 32),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  SliverAppBar _buildAppBar(BuildContext context) {
    return SliverAppBar(
      backgroundColor: AppTheme.colorBackground,
      expandedHeight: 120,
      floating: true,
      pinned: false,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          padding: const EdgeInsets.fromLTRB(20, 60, 20, 16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Column(
                mainAxisAlignment: MainAxisAlignment.end,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    _getGreeting(),
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: AppTheme.colorTextSecondary,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'Apprends le mandarin',
                    style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                      color: AppTheme.colorTextPrimary,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
              GestureDetector(
                onTap: () => context.push('/profile'),
                child: Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: AppTheme.primaryGradient,
                    boxShadow: [AppTheme.glowShadowRed],
                  ),
                  child: const Icon(Icons.person, color: Colors.white, size: 24),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(BuildContext context, String title, String titleZh) {
    return Row(
      children: [
        Text(
          title,
          style: Theme.of(context).textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w700,
            color: AppTheme.colorTextPrimary,
          ),
        ),
        const SizedBox(width: 8),
        Text(
          titleZh,
          style: Theme.of(context).textTheme.bodySmall?.copyWith(
            color: AppTheme.colorTextSecondary,
          ),
        ),
      ],
    );
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Bonjour 早上好';
    if (hour < 18) return 'Bon après-midi 下午好';
    return 'Bonsoir 晚上好';
  }
}
