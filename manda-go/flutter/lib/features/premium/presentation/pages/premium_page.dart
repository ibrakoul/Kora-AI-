import 'package:flutter/material.dart';

// ─── Couleurs hardcodées ──────────────────────────────────────
const Color _background = Color(0xFF0A0A0F);
const Color _primary = Color(0xFFE8163C);
const Color _primaryDark = Color(0xFFC0102D);
const Color _surface = Color(0xFF1A1A26);
const Color _gold = Color(0xFFFFB800);
const Color _textPrimary = Color(0xFFF8F9FF);
const Color _textSecondary = Color(0xFF9A9AB0);
const Color _border = Color(0xFF2A2A3A);

/// Page paywall "Manda Go Plus".
///
/// Permet à l'utilisateur de choisir entre un abonnement mensuel
/// ou annuel, consulter les avantages premium, et démarrer un essai gratuit.
class PremiumPage extends StatefulWidget {
  const PremiumPage({super.key});

  @override
  State<PremiumPage> createState() => _PremiumPageState();
}

class _PremiumPageState extends State<PremiumPage> {
  bool _isYearly = false;
  bool _isLoading = false;

  static const String _monthlyPrice = '4,99€/mois';
  static const String _yearlyPrice = '39,99€/an';
  static const String _yearlyMonthlyEquiv = '3,33€/mois';

  static const List<_PremiumFeature> _features = [
    _PremiumFeature(icon: Icons.all_inclusive_rounded, label: 'Leçons illimitées'),
    _PremiumFeature(icon: Icons.smart_toy_outlined, label: 'IA MandaBot illimitée'),
    _PremiumFeature(icon: Icons.sports_esports_outlined, label: 'Tous les 35 mini-jeux'),
    _PremiumFeature(icon: Icons.download_done_rounded, label: 'Mode hors ligne'),
    _PremiumFeature(icon: Icons.record_voice_over_outlined, label: 'Prononciation avancée'),
    _PremiumFeature(icon: Icons.block_rounded, label: 'Pas de publicités'),
    _PremiumFeature(icon: Icons.leaderboard_outlined, label: 'Tous les classements'),
    _PremiumFeature(icon: Icons.workspace_premium_outlined, label: 'Badges exclusifs'),
    _PremiumFeature(icon: Icons.cloud_download_outlined, label: 'Téléchargement de cours'),
    _PremiumFeature(icon: Icons.support_agent_outlined, label: 'Support prioritaire'),
  ];

  void _onSubscribeTap() async {
    setState(() => _isLoading = true);
    // Intégration Stripe / In-App Purchase à brancher ici
    await Future.delayed(const Duration(milliseconds: 1500));
    if (mounted) setState(() => _isLoading = false);
  }

  void _onRestoreTap() {
    // Restauration des achats (RevenueCat / Stripe)
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(
        content: Text('Recherche de vos achats...'),
        backgroundColor: _surface,
        behavior: SnackBarBehavior.floating,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _background,
      body: CustomScrollView(
        slivers: [
          // ─── Header gradient ────────────────────────────────
          SliverToBoxAdapter(child: _buildHeader()),

          // ─── Corps: prix + avantages + CTA ─────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20),
              child: Column(
                children: [
                  const SizedBox(height: 24),
                  _buildPriceToggle(),
                  const SizedBox(height: 28),
                  _buildPriceDisplay(),
                  const SizedBox(height: 28),
                  _buildComparisonBadge(),
                  const SizedBox(height: 28),
                  _buildFeaturesList(),
                  const SizedBox(height: 32),
                  _buildSubscribeButton(),
                  const SizedBox(height: 12),
                  _buildLegalText(),
                  const SizedBox(height: 16),
                  _buildRestoreButton(),
                  const SizedBox(height: 40),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── Header ───────────────────────────────────────────────
  Widget _buildHeader() {
    return Container(
      height: 260,
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF6B0020), _primaryDark, _primary],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: Stack(
        children: [
          // Motif décoratif
          Positioned(
            right: -40,
            top: -40,
            child: Container(
              width: 200,
              height: 200,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.05),
              ),
            ),
          ),
          Positioned(
            left: -20,
            bottom: -30,
            child: Container(
              width: 140,
              height: 140,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: Colors.white.withOpacity(0.04),
              ),
            ),
          ),
          // Contenu
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Bouton retour
                  GestureDetector(
                    onTap: () => Navigator.of(context).maybePop(),
                    child: Container(
                      width: 38,
                      height: 38,
                      decoration: BoxDecoration(
                        color: Colors.white.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: const Icon(
                        Icons.arrow_back_ios_new_rounded,
                        color: Colors.white,
                        size: 18,
                      ),
                    ),
                  ),
                  const Spacer(),
                  // Emoji dragon
                  const Text(
                    '🐉',
                    style: TextStyle(fontSize: 44),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Passez à Manda Go Plus',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 26,
                      fontWeight: FontWeight.w800,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Maîtrisez le mandarin 3x plus vite',
                    style: TextStyle(
                      color: Colors.white.withOpacity(0.80),
                      fontSize: 15,
                      fontWeight: FontWeight.w400,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // ─── Toggle mensuel / annuel ───────────────────────────────
  Widget _buildPriceToggle() {
    return Container(
      height: 50,
      decoration: BoxDecoration(
        color: _surface,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: _border, width: 1),
      ),
      child: Row(
        children: [
          Expanded(
            child: _ToggleTab(
              label: 'Mensuel',
              isSelected: !_isYearly,
              onTap: () => setState(() => _isYearly = false),
            ),
          ),
          Expanded(
            child: _ToggleTab(
              label: 'Annuel',
              isSelected: _isYearly,
              onTap: () => setState(() => _isYearly = true),
              badge: '-33%',
            ),
          ),
        ],
      ),
    );
  }

  // ─── Affichage du prix ─────────────────────────────────────
  Widget _buildPriceDisplay() {
    return AnimatedSwitcher(
      duration: const Duration(milliseconds: 250),
      transitionBuilder: (child, anim) => FadeTransition(
        opacity: anim,
        child: SlideTransition(
          position: Tween<Offset>(
            begin: const Offset(0, 0.1),
            end: Offset.zero,
          ).animate(anim),
          child: child,
        ),
      ),
      child: Column(
        key: ValueKey(_isYearly),
        children: [
          Text(
            _isYearly ? _yearlyPrice : _monthlyPrice,
            style: const TextStyle(
              color: _textPrimary,
              fontSize: 38,
              fontWeight: FontWeight.w900,
              letterSpacing: -0.5,
            ),
          ),
          if (_isYearly) ...[
            const SizedBox(height: 4),
            Text(
              'soit $_yearlyMonthlyEquiv',
              style: const TextStyle(
                color: _textSecondary,
                fontSize: 14,
              ),
            ),
            const SizedBox(height: 6),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 4),
              decoration: BoxDecoration(
                color: const Color(0xFF2ECC71).withOpacity(0.15),
                borderRadius: BorderRadius.circular(100),
                border: Border.all(
                  color: const Color(0xFF2ECC71).withOpacity(0.35),
                ),
              ),
              child: const Text(
                'Économisez 40€/an',
                style: TextStyle(
                  color: Color(0xFF2ECC71),
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  // ─── Badge comparaison concurrence ────────────────────────
  Widget _buildComparisonBadge() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: _gold.withOpacity(0.08),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: _gold.withOpacity(0.30), width: 1),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: const [
          Icon(Icons.emoji_events_rounded, color: _gold, size: 20),
          SizedBox(width: 8),
          Text(
            '50% moins cher que HelloChinese !',
            style: TextStyle(
              color: _gold,
              fontSize: 13,
              fontWeight: FontWeight.w700,
            ),
          ),
        ],
      ),
    );
  }

  // ─── Liste des avantages ───────────────────────────────────
  Widget _buildFeaturesList() {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: _surface,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: _border, width: 1),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Tout ce qui est inclus',
            style: TextStyle(
              color: _textPrimary,
              fontSize: 15,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 16),
          ...List.generate(_features.length, (i) {
            return Padding(
              padding: EdgeInsets.only(bottom: i < _features.length - 1 ? 14 : 0),
              child: _FeatureRow(feature: _features[i]),
            );
          }),
        ],
      ),
    );
  }

  // ─── Bouton CTA ────────────────────────────────────────────
  Widget _buildSubscribeButton() {
    return SizedBox(
      width: double.infinity,
      height: 58,
      child: _isLoading
          ? Container(
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [_primary, _primaryDark],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: const Center(
                child: SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                    strokeWidth: 2.5,
                    valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                  ),
                ),
              ),
            )
          : _PressableButton(
              onTap: _onSubscribeTap,
              child: Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [_primary, _primaryDark],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: _primary.withOpacity(0.40),
                      blurRadius: 20,
                      offset: const Offset(0, 8),
                    ),
                  ],
                ),
                child: const Center(
                  child: Text(
                    'Commencer l\'éssai gratuit 7 jours',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.2,
                    ),
                  ),
                ),
              ),
            ),
    );
  }

  Widget _buildLegalText() {
    return const Text(
      'Annulable à tout moment · Pas d’engagement',
      style: TextStyle(
        color: _textSecondary,
        fontSize: 13,
      ),
      textAlign: TextAlign.center,
    );
  }

  Widget _buildRestoreButton() {
    return _PressableButton(
      onTap: _onRestoreTap,
      child: Container(
        height: 50,
        width: double.infinity,
        decoration: BoxDecoration(
          color: Colors.transparent,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: _border, width: 1.5),
        ),
        child: const Center(
          child: Text(
            'Restaurer mes achats',
            style: TextStyle(
              color: _textSecondary,
              fontSize: 14,
              fontWeight: FontWeight.w600,
            ),
          ),
        ),
      ),
    );
  }
}

// ─── Sous-widgets ──────────────────────────────────────────────

class _ToggleTab extends StatelessWidget {
  final String label;
  final bool isSelected;
  final VoidCallback onTap;
  final String? badge;

  const _ToggleTab({
    required this.label,
    required this.isSelected,
    required this.onTap,
    this.badge,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 180),
        margin: const EdgeInsets.all(4),
        decoration: BoxDecoration(
          color: isSelected ? _primary : Colors.transparent,
          borderRadius: BorderRadius.circular(10),
          boxShadow: isSelected
              ? [
                  BoxShadow(
                    color: _primary.withOpacity(0.30),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ]
              : null,
        ),
        child: Center(
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                label,
                style: TextStyle(
                  color: isSelected ? Colors.white : _textSecondary,
                  fontSize: 14,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                ),
              ),
              if (badge != null) ...[
                const SizedBox(width: 6),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                  decoration: BoxDecoration(
                    color: isSelected
                        ? Colors.white.withOpacity(0.25)
                        : const Color(0xFF2ECC71).withOpacity(0.20),
                    borderRadius: BorderRadius.circular(100),
                  ),
                  child: Text(
                    badge!,
                    style: TextStyle(
                      color: isSelected ? Colors.white : const Color(0xFF2ECC71),
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _FeatureRow extends StatelessWidget {
  final _PremiumFeature feature;

  const _FeatureRow({required this.feature});

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Container(
          width: 36,
          height: 36,
          decoration: BoxDecoration(
            color: _primary.withOpacity(0.10),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(feature.icon, color: _primary, size: 18),
        ),
        const SizedBox(width: 14),
        Expanded(
          child: Text(
            feature.label,
            style: const TextStyle(
              color: _textPrimary,
              fontSize: 14,
              fontWeight: FontWeight.w500,
              height: 1.4,
            ),
          ),
        ),
        const Icon(Icons.check_circle_rounded, color: Color(0xFF2ECC71), size: 20),
      ],
    );
  }
}

/// Bouton avec animation scale au tap, sans dépendance externe.
class _PressableButton extends StatefulWidget {
  final Widget child;
  final VoidCallback onTap;

  const _PressableButton({required this.child, required this.onTap});

  @override
  State<_PressableButton> createState() => _PressableButtonState();
}

class _PressableButtonState extends State<_PressableButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _ctrl;
  late final Animation<double> _scale;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 90),
    );
    _scale = Tween<double>(begin: 1.0, end: 0.96).animate(
      CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTapDown: (_) => _ctrl.forward(),
      onTapUp: (_) {
        _ctrl.reverse();
        widget.onTap();
      },
      onTapCancel: () => _ctrl.reverse(),
      child: AnimatedBuilder(
        animation: _scale,
        builder: (_, child) => Transform.scale(scale: _scale.value, child: child),
        child: widget.child,
      ),
    );
  }
}

// ─── Modèle de données ─────────────────────────────────────────

class _PremiumFeature {
  final IconData icon;
  final String label;

  const _PremiumFeature({required this.icon, required this.label});
}
