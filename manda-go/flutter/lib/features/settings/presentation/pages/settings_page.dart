import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_theme.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<SettingsPage> createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  // Apprentissage
  double _dailyGoalMinutes = 20;
  String _difficulty = 'Intermédiaire';
  TimeOfDay _reminderTime = const TimeOfDay(hour: 20, minute: 0);

  // Notifications
  bool _pushNotifications = true;
  bool _streakReminder = true;
  bool _newContent = false;
  bool _leaderboardUpdates = true;

  // Apparence
  String _themeMode = 'Sombre';
  double _textScale = 1.0;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.colorBackground,
      appBar: AppBar(
        backgroundColor: AppTheme.colorBackground,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textOnDark),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Paramètres',
          style: TextStyle(
            color: AppColors.textOnDark,
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
      ),
      body: ListView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
        children: [
          // --- Compte ---
          _SectionHeader(title: 'Compte'),
          _buildCard([
            _buildNavTile(
              icon: Icons.email_outlined,
              title: 'Email',
              subtitle: 'vous@email.com',
              onTap: () {},
            ),
            _divider(),
            _buildNavTile(
              icon: Icons.lock_outline,
              title: 'Changer le mot de passe',
              onTap: () => _showChangePasswordDialog(context),
            ),
            _divider(),
            _buildNavTile(
              icon: Icons.delete_outline,
              title: 'Supprimer le compte',
              color: AppColors.error,
              onTap: () => _showDeleteAccountDialog(context),
            ),
          ]),

          const SizedBox(height: 16),

          // --- Apprentissage ---
          _SectionHeader(title: 'Apprentissage'),
          _buildCard([
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.timer_outlined, color: AppTheme.colorTextSecondary, size: 20),
                          const SizedBox(width: 12),
                          Text(
                            'Objectif quotidien',
                            style: TextStyle(color: AppTheme.colorTextPrimary, fontSize: 14, fontWeight: FontWeight.w500),
                          ),
                        ],
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.colorPrimary.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          '${_dailyGoalMinutes.round()} min',
                          style: TextStyle(
                            color: AppTheme.colorPrimary,
                            fontSize: 13,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ),
                  Slider(
                    value: _dailyGoalMinutes,
                    min: 5,
                    max: 60,
                    divisions: 11,
                    activeColor: AppTheme.colorPrimary,
                    inactiveColor: AppTheme.colorBorder,
                    onChanged: (v) => setState(() => _dailyGoalMinutes = v),
                  ),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text('5 min', style: TextStyle(color: AppTheme.colorTextSecondary, fontSize: 11)),
                      Text('60 min', style: TextStyle(color: AppTheme.colorTextSecondary, fontSize: 11)),
                    ],
                  ),
                ],
              ),
            ),
            _divider(),
            ListTile(
              leading: Icon(Icons.alarm_outlined, color: AppTheme.colorTextSecondary, size: 20),
              title: Text('Rappel quotidien', style: TextStyle(color: AppTheme.colorTextPrimary, fontSize: 14, fontWeight: FontWeight.w500)),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(
                    _reminderTime.format(context),
                    style: TextStyle(color: AppTheme.colorPrimary, fontSize: 14, fontWeight: FontWeight.w600),
                  ),
                  const SizedBox(width: 4),
                  Icon(Icons.chevron_right, color: AppColors.textTertiary, size: 20),
                ],
              ),
              onTap: () => _pickReminderTime(context),
              dense: true,
            ),
            _divider(),
            ListTile(
              leading: Icon(Icons.speed_outlined, color: AppTheme.colorTextSecondary, size: 20),
              title: Text('Niveau de difficulté', style: TextStyle(color: AppTheme.colorTextPrimary, fontSize: 14, fontWeight: FontWeight.w500)),
              trailing: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Text(_difficulty, style: TextStyle(color: AppTheme.colorPrimary, fontSize: 14, fontWeight: FontWeight.w600)),
                  const SizedBox(width: 4),
                  Icon(Icons.chevron_right, color: AppColors.textTertiary, size: 20),
                ],
              ),
              onTap: () => _showDifficultyPicker(context),
              dense: true,
            ),
          ]),

          const SizedBox(height: 16),

          // --- Notifications ---
          _SectionHeader(title: 'Notifications'),
          _buildCard([
            SwitchListTile(
              secondary: Icon(Icons.notifications_outlined, color: AppTheme.colorTextSecondary, size: 20),
              title: Text('Notifications push', style: TextStyle(color: AppTheme.colorTextPrimary, fontSize: 14, fontWeight: FontWeight.w500)),
              value: _pushNotifications,
              onChanged: (v) => setState(() => _pushNotifications = v),
              activeColor: AppTheme.colorPrimary,
              dense: true,
            ),
            _divider(),
            SwitchListTile(
              secondary: Icon(Icons.local_fire_department_outlined, color: AppTheme.colorTextSecondary, size: 20),
              title: Text('Rappel streak', style: TextStyle(color: AppTheme.colorTextPrimary, fontSize: 14, fontWeight: FontWeight.w500)),
              value: _streakReminder,
              onChanged: _pushNotifications ? (v) => setState(() => _streakReminder = v) : null,
              activeColor: AppTheme.colorPrimary,
              dense: true,
            ),
            _divider(),
            SwitchListTile(
              secondary: Icon(Icons.new_releases_outlined, color: AppTheme.colorTextSecondary, size: 20),
              title: Text('Nouveaux contenus', style: TextStyle(color: AppTheme.colorTextPrimary, fontSize: 14, fontWeight: FontWeight.w500)),
              value: _newContent,
              onChanged: _pushNotifications ? (v) => setState(() => _newContent = v) : null,
              activeColor: AppTheme.colorPrimary,
              dense: true,
            ),
            _divider(),
            SwitchListTile(
              secondary: Icon(Icons.emoji_events_outlined, color: AppTheme.colorTextSecondary, size: 20),
              title: Text('Classements', style: TextStyle(color: AppTheme.colorTextPrimary, fontSize: 14, fontWeight: FontWeight.w500)),
              value: _leaderboardUpdates,
              onChanged: _pushNotifications ? (v) => setState(() => _leaderboardUpdates = v) : null,
              activeColor: AppTheme.colorPrimary,
              dense: true,
            ),
          ]),

          const SizedBox(height: 16),

          // --- Apparence ---
          _SectionHeader(title: 'Apparence'),
          _buildCard([
            Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.brightness_6_outlined, color: AppTheme.colorTextSecondary, size: 20),
                      const SizedBox(width: 12),
                      Text('Mode d\'affichage', style: TextStyle(color: AppTheme.colorTextPrimary, fontSize: 14, fontWeight: FontWeight.w500)),
                    ],
                  ),
                  const SizedBox(height: 12),
                  SegmentedButton<String>(
                    style: SegmentedButton.styleFrom(
                      backgroundColor: AppTheme.colorBackground,
                      selectedBackgroundColor: AppTheme.colorPrimary.withOpacity(0.2),
                      selectedForegroundColor: AppTheme.colorPrimary,
                      foregroundColor: AppTheme.colorTextSecondary,
                      side: BorderSide(color: AppTheme.colorBorder),
                    ),
                    segments: const [
                      ButtonSegment(value: 'Clair', label: Text('Clair'), icon: Icon(Icons.light_mode, size: 14)),
                      ButtonSegment(value: 'Sombre', label: Text('Sombre'), icon: Icon(Icons.dark_mode, size: 14)),
                      ButtonSegment(value: 'Système', label: Text('Système'), icon: Icon(Icons.auto_mode, size: 14)),
                    ],
                    selected: {_themeMode},
                    onSelectionChanged: (s) => setState(() => _themeMode = s.first),
                  ),
                ],
              ),
            ),
            _divider(),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Row(
                        children: [
                          Icon(Icons.text_fields, color: AppTheme.colorTextSecondary, size: 20),
                          const SizedBox(width: 12),
                          Text('Taille du texte', style: TextStyle(color: AppTheme.colorTextPrimary, fontSize: 14, fontWeight: FontWeight.w500)),
                        ],
                      ),
                      Text('${(_textScale * 100).round()}%', style: TextStyle(color: AppTheme.colorPrimary, fontWeight: FontWeight.w600)),
                    ],
                  ),
                  Slider(
                    value: _textScale,
                    min: 0.8,
                    max: 1.4,
                    divisions: 6,
                    activeColor: AppTheme.colorPrimary,
                    inactiveColor: AppTheme.colorBorder,
                    onChanged: (v) => setState(() => _textScale = v),
                  ),
                ],
              ),
            ),
          ]),

          const SizedBox(height: 16),

          // --- À propos ---
          _SectionHeader(title: 'À propos'),
          _buildCard([
            _buildInfoTile(icon: Icons.info_outline, title: 'Version', value: '1.0.0 MVP'),
            _divider(),
            _buildNavTile(icon: Icons.gavel_outlined, title: 'Mentions légales', onTap: () {}),
            _divider(),
            _buildNavTile(icon: Icons.privacy_tip_outlined, title: 'Politique de confidentialité', onTap: () {}),
            _divider(),
            _buildNavTile(icon: Icons.support_agent_outlined, title: 'Contacter le support', onTap: () {}),
          ]),

          const SizedBox(height: 24),

          // --- Danger zone ---
          _SectionHeader(title: 'Zone dangereuse', color: AppColors.error),
          ElevatedButton.icon(
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
          const SizedBox(height: 10),
          OutlinedButton.icon(
            onPressed: () => _showDeleteAccountDialog(context),
            icon: const Icon(Icons.delete_forever_outlined, size: 18),
            label: const Text('Supprimer mon compte'),
            style: OutlinedButton.styleFrom(
              foregroundColor: AppColors.error,
              side: const BorderSide(color: AppColors.error, width: 1.5),
              minimumSize: const Size(double.infinity, 52),
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildCard(List<Widget> children) {
    return Container(
      decoration: BoxDecoration(
        color: AppTheme.colorSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.colorBorder),
      ),
      child: Column(children: children),
    );
  }

  Widget _divider() => Divider(height: 1, color: AppTheme.colorBorder, indent: 16, endIndent: 16);

  Widget _buildNavTile({
    required IconData icon,
    required String title,
    String? subtitle,
    Color? color,
    required VoidCallback onTap,
  }) {
    return ListTile(
      leading: Icon(icon, color: color ?? AppTheme.colorTextSecondary, size: 20),
      title: Text(
        title,
        style: TextStyle(color: color ?? AppTheme.colorTextPrimary, fontSize: 14, fontWeight: FontWeight.w500),
      ),
      subtitle: subtitle != null
          ? Text(subtitle, style: TextStyle(color: AppTheme.colorTextSecondary, fontSize: 12))
          : null,
      trailing: Icon(Icons.chevron_right, color: AppColors.textTertiary, size: 20),
      onTap: onTap,
      dense: true,
    );
  }

  Widget _buildInfoTile({required IconData icon, required String title, required String value}) {
    return ListTile(
      leading: Icon(icon, color: AppTheme.colorTextSecondary, size: 20),
      title: Text(title, style: TextStyle(color: AppTheme.colorTextPrimary, fontSize: 14, fontWeight: FontWeight.w500)),
      trailing: Text(value, style: TextStyle(color: AppTheme.colorTextSecondary, fontSize: 13)),
      dense: true,
    );
  }

  Future<void> _pickReminderTime(BuildContext context) async {
    final picked = await showTimePicker(context: context, initialTime: _reminderTime);
    if (picked != null) setState(() => _reminderTime = picked);
  }

  void _showDifficultyPicker(BuildContext context) {
    const options = ['Débutant', 'Intermédiaire', 'Avancé'];
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.colorSurface,
      shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(20),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(width: 40, height: 4, decoration: BoxDecoration(color: AppTheme.colorBorder, borderRadius: BorderRadius.circular(2))),
            const SizedBox(height: 16),
            Text('Niveau de difficulté', style: TextStyle(color: AppTheme.colorTextPrimary, fontSize: 16, fontWeight: FontWeight.w700)),
            const SizedBox(height: 12),
            ...options.map((o) => ListTile(
              title: Text(o, style: TextStyle(color: AppTheme.colorTextPrimary)),
              trailing: _difficulty == o ? Icon(Icons.check_circle, color: AppTheme.colorPrimary) : null,
              onTap: () {
                setState(() => _difficulty = o);
                Navigator.pop(context);
              },
            )),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }

  void _showChangePasswordDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: AppTheme.colorSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('Changer le mot de passe', style: TextStyle(color: AppTheme.colorTextPrimary)),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Mot de passe actuel'),
            ),
            const SizedBox(height: 12),
            TextField(
              obscureText: true,
              decoration: const InputDecoration(labelText: 'Nouveau mot de passe'),
            ),
          ],
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Annuler', style: TextStyle(color: AppTheme.colorTextSecondary))),
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Confirmer', style: TextStyle(color: AppTheme.colorPrimary))),
        ],
      ),
    );
  }

  void _showDeleteAccountDialog(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: AppTheme.colorSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Supprimer le compte', style: TextStyle(color: AppColors.error)),
        content: Text(
          'Cette action est irréversible. Toute votre progression sera perdue.',
          style: TextStyle(color: AppTheme.colorTextSecondary),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Annuler', style: TextStyle(color: AppTheme.colorTextSecondary))),
          TextButton(onPressed: () => Navigator.pop(context), child: const Text('Supprimer', style: TextStyle(color: AppColors.error))),
        ],
      ),
    );
  }

  void _confirmLogout(BuildContext context) {
    showDialog(
      context: context,
      builder: (_) => AlertDialog(
        backgroundColor: AppTheme.colorSurface,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Text('Se déconnecter', style: TextStyle(color: AppTheme.colorTextPrimary)),
        content: Text('Êtes-vous sûr?', style: TextStyle(color: AppTheme.colorTextSecondary)),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context), child: Text('Annuler', style: TextStyle(color: AppTheme.colorTextSecondary))),
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
}

class _SectionHeader extends StatelessWidget {
  final String title;
  final Color? color;

  const _SectionHeader({required this.title, this.color});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8, top: 4, left: 4),
      child: Text(
        title.toUpperCase(),
        style: TextStyle(
          color: color ?? AppTheme.colorTextSecondary,
          fontSize: 11,
          fontWeight: FontWeight.w700,
          letterSpacing: 1.2,
        ),
      ),
    );
  }
}
