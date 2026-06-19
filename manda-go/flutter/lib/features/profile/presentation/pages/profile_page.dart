import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/manda_card.dart';

class ProfilePage extends StatelessWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.colorBackground,
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(context),
          SliverPadding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            sliver: SliverList(
              delegate: SliverChildListDelegate([
                const SizedBox(height: 20),
                _buildQuickStats(context),
                const SizedBox(height: 24),
                _buildHskProgress(context),
                const SizedBox(height: 24),
                _buildBadges(context),
                const SizedBox(height: 24),
                _buildQuickSettings(context),
                const SizedBox(height: 24),
                _buildLogoutButton(context),
                const SizedBox(height: 40),
              ]),
            ),
          ),
        ],
      ),
    );
  }

  SliverAppBar _buildSliverAppBar(BuildContext context) {
    return SliverAppBar(
      backgroundColor: AppTheme.colorBackground,
      expandedHeight: 220,
      pinned: true,
      leading: IconButton(
        icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textOnDark),
        onPressed: () => context.pop(),
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.share_outlined, color: AppColors.textOnDark),
          onPressed: () {},
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF12121A), Color(0xFF0A0A0F)],
              begin: Alignment.topCenter,
              end: Alignment.bottomCenter,
            ),
          ),
          child: SafeArea(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const SizedBox(height: 40),
                Stack(
                  alignment: Alignment.bottomRight,
                  children: [
                    Container(
                      width: 80,
                      height: 80,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        gradient: AppColors.primaryGradient,
                        boxShadow: [AppTheme.glowShadowRed],
                      ),
                      child: const Center(
                        child: Text(
                          'Vs',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 28,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ),
                    Container(
                      width: 26,
                      height: 26,
                      decoration: BoxDecoration(
                        shape: BoxShape.circle,
                        color: AppTheme.colorSurface,
                        border: Border.all(color: AppTheme.colorBorder, width: 1.5),
                      ),
                      child: IconButton(
                        icon: const Icon(Icons.edit, size: 12, color: AppColors.textOnDark),
                        onPressed: () {},
                        padding: EdgeInsets.zero,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                const Text(
                  'Vous',
                  style: TextStyle(
                    color: AppColors.textOnDark,
                    fontSize: 22,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppTheme.colorPrimary.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppTheme.colorPrimary.withOpacity(0.4)),
                      ),
                      child: const Text(
                        '12 · 学者',
                        style: TextStyle(
                          color: AppColors.vermilionRed,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.coralOrange.withOpacity(0.2),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: AppColors.coralOrange.withOpacity(0.4)),
                      ),
                      child: const Text(
                        '🔥 7 jours',
                        style: TextStyle(
                          color: AppColors.coralOrange,
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildQuickStats(BuildContext context) {
    final stats = [
      _StatData(label: 'XP Total', value: '12 740', icon: '⭐'),
      _StatData(label: 'Streak', value: '7j', icon: '🔥'),
      _StatData(label: 'Mots appris', value: '384', icon: '📚'),
      _StatData(label: 'Leçons', value: '42', icon: '🎯'),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionTitle(context, 'Statistiques'),
        const SizedBox(height: 12),
        Row(
          children: stats.map((s) {
            return Expanded(
              child: Container(
                margin: EdgeInsets.only(right: stats.indexOf(s) < stats.length - 1 ? 8 : 0),
                padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
                decoration: BoxDecoration(
                  color: AppTheme.colorSurface,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.colorBorder),
                ),
                child: Column(
                  children: [
                    Text(s.icon, style: const TextStyle(fontSize: 20)),
                    const SizedBox(height: 6),
                    Text(
                      s.value,
                      style: const TextStyle(
                        color: AppColors.textOnDark,
                        fontSize: 16,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      s.label,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        color: AppTheme.colorTextSecondary,
                        fontSize: 10,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }).toList(),
        ),
      ],
    );
  }

  Widget _buildHskProgress(BuildContext context) {
    final hskLevels = [
      _HskLevel(level: 'HSK 1', percent: 0.95, label: '95%', color: AppColors.jadeGreen),
      _HskLevel(level: 'HSK 2', percent: 0.72, label: '72%', color: AppColors.skyBlue),
      _HskLevel(level: 'HSK 3', percent: 0.38, label: '38%', color: AppColors.gold),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionTitle(context, 'Progression HSK'),
        const SizedBox(height: 12),
        MandaCard(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: hskLevels.map((hsk) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 14),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Text(
                          hsk.level,
                          style: const TextStyle(
                            color: AppColors.textOnDark,
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        Text(
                          hsk.label,
                          style: TextStyle(
                            color: hsk.color,
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(6),
                      child: LinearProgressIndicator(
                        value: hsk.percent,
                        backgroundColor: AppTheme.colorBorder,
                        valueColor: AlwaysStoppedAnimation<Color>(hsk.color),
                        minHeight: 8,
                      ),
                    ),
                  ],
                ),
              );
            }).toList(),
          ),
        ),
      ],
    );
  }

  Widget _buildBadges(BuildContext context) {
    final badges = [
      _BadgeData(emoji: '🔥', label: 'Flamme'),
      _BadgeData(emoji: '🏆', label: 'Champion'),
      _BadgeData(emoji: '📚', label: 'Lecteur'),
      _BadgeData(emoji: '🎯', label: 'Précision'),
      _BadgeData(emoji: '⭐', label: 'Étoile'),
      _BadgeData(emoji: '🐉', label: 'Dragon'),
      _BadgeData(emoji: '🎮', label: 'Joueur'),
      _BadgeData(emoji: '🌟', label: 'Expert'),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            _sectionTitle(context, 'Badges récents'),
            TextButton(
              onPressed: () {},
              child: Text(
                'Voir tout',
                style: TextStyle(
                  color: AppTheme.colorPrimary,
                  fontSize: 13,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 8),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 4,
            crossAxisSpacing: 10,
            mainAxisSpacing: 10,
            childAspectRatio: 0.85,
          ),
          itemCount: badges.length,
          itemBuilder: (context, i) {
            return Container(
              decoration: BoxDecoration(
                color: AppTheme.colorSurface,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppTheme.colorBorder),
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(badges[i].emoji, style: const TextStyle(fontSize: 28)),
                  const SizedBox(height: 4),
                  Text(
                    badges[i].label,
                    style: TextStyle(
                      color: AppTheme.colorTextSecondary,
                      fontSize: 10,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildQuickSettings(BuildContext context) {
    final items = [
      _SettingItem(icon: Icons.notifications_outlined, label: 'Notifications', onTap: () => context.push('/settings')),
      _SettingItem(icon: Icons.language_outlined, label: 'Langue', onTap: () => context.push('/settings')),
      _SettingItem(icon: Icons.person_outline, label: 'Compte', onTap: () => context.push('/settings')),
      _SettingItem(icon: Icons.workspace_premium_outlined, label: 'Premium', color: AppColors.gold, onTap: () => _showPremiumSheet(context)),
    ];

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _sectionTitle(context, 'Paramètres'),
        const SizedBox(height: 12),
        MandaCard(
          padding: EdgeInsets.zero,
          child: Column(
            children: List.generate(items.length, (i) {
              final item = items[i];
              return Column(
                children: [
                  ListTile(
                    leading: Icon(item.icon, color: item.color ?? AppTheme.colorTextSecondary, size: 22),
                    title: Text(
                      item.label,
                      style: TextStyle(
                        color: item.color ?? AppTheme.colorTextPrimary,
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                    trailing: const Icon(Icons.chevron_right, color: AppColors.textTertiary, size: 20),
                    onTap: item.onTap,
                    dense: true,
                  ),
                  if (i < items.length - 1)
                    Divider(
                      height: 1,
                      color: AppTheme.colorBorder,
                      indent: 16,
                      endIndent: 16,
                    ),
                ],
              );
            }),
          ),
        ),
      ],
    );
  }

  void _showPremiumSheet(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.colorSurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40, height: 4,
              decoration: BoxDecoration(
                color: AppTheme.colorBorder,
                borderRadius: BorderRadius.circular(2),
              ),
            ),
            const SizedBox(height: 24),
            const Text('💎', style: TextStyle(fontSize: 48)),
            const SizedBox(height: 12),
            Text(
              'Manda Go Premium',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                color: AppColors.textOnDark,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Débloquez tous les jeux, leçons et contenu illimité.',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppTheme.colorTextSecondary, fontSize: 14),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.gold,
                foregroundColor: Colors.black,
                minimumSize: const Size(double.infinity, 52),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text('Commencer l\'essai gratuit', style: TextStyle(fontWeight: FontWeight.w700)),
            ),
            const SizedBox(height: 12),
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: Text('Pas maintenant', style: TextStyle(color: AppTheme.colorTextSecondary)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLogoutButton(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      child: ElevatedButton.icon(
        onPressed: () => _confirmLogout(context),
        icon: const Icon(Icons.logout, size: 18),
        label: const Text('Se déconnecter'),
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.error,
          foregroundColor: Colors.white,
          minimumSize: const Size(double.infinity, 52),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        ),
      ),
    );
  }

  void _confirmLogout(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: AppTheme.colorSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Se déconnecter', style: TextStyle(color: AppColors.textOnDark)),
        content: Text(
          'Êtes-vous sûr de vouloir vous déconnecter?',
          style: TextStyle(color: AppTheme.colorTextSecondary),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: Text('Annuler', style: TextStyle(color: AppTheme.colorTextSecondary)),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              context.go('/auth/login');
            },
            child: const Text('Déconnecter', style: TextStyle(color: AppColors.error)),
          ),
        ],
      ),
    );
  }

  Widget _sectionTitle(BuildContext context, String title) {
    return Text(
      title,
      style: Theme.of(context).textTheme.titleMedium?.copyWith(
        color: AppTheme.colorTextPrimary,
        fontWeight: FontWeight.w700,
      ),
    );
  }
}

class _StatData {
  final String label;
  final String value;
  final String icon;
  const _StatData({required this.label, required this.value, required this.icon});
}

class _HskLevel {
  final String level;
  final double percent;
  final String label;
  final Color color;
  const _HskLevel({required this.level, required this.percent, required this.label, required this.color});
}

class _BadgeData {
  final String emoji;
  final String label;
  const _BadgeData({required this.emoji, required this.label});
}

class _SettingItem {
  final IconData icon;
  final String label;
  final Color? color;
  final VoidCallback onTap;
  const _SettingItem({required this.icon, required this.label, required this.onTap, this.color});
}
