import 'package:flutter/material.dart';

// ─── Couleurs hardcodées ──────────────────────────────────────
const Color _primary = Color(0xFFE8163C);
const Color _surface = Color(0xFF1A1A26);
const Color _textPrimary = Color(0xFFF8F9FF);
const Color _textSecondary = Color(0xFF9A9AB0);

/// Widget d'erreur générique affiché à la place d'un contenu en échec.
///
/// Affiche une icône dans un fond coloré, un [title] en gras,
/// un [message] optionnel, et un bouton "Réessayer" si [onRetry] est fourni.
class MandaErrorWidget extends StatelessWidget {
  final String title;
  final String? message;
  final VoidCallback? onRetry;
  final IconData icon;
  final Color? iconColor;

  const MandaErrorWidget({
    super.key,
    this.title = 'Quelque chose s\'est mal passé',
    this.message,
    this.onRetry,
    this.icon = Icons.error_outline_rounded,
    this.iconColor,
  });

  /// Constructeur pour les erreurs réseau.
  const MandaErrorWidget.network({
    super.key,
    this.onRetry,
  })  : title = 'Pas de connexion',
        message = 'Vérifiez votre connexion internet et réessayez.',
        icon = Icons.wifi_off_rounded,
        iconColor = const Color(0xFF3498DB);

  /// Constructeur pour les erreurs "contenu introuvable".
  const MandaErrorWidget.notFound({
    super.key,
    this.onRetry,
  })  : title = 'Contenu introuvable',
        message = 'Ce contenu n\'existe pas ou a été supprimé.',
        icon = Icons.search_off_rounded,
        iconColor = const Color(0xFFFFB800);

  @override
  Widget build(BuildContext context) {
    final Color resolvedIconColor = iconColor ?? _primary;

    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // ─── Icône avec fond coloré ──────────────────────
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: resolvedIconColor.withOpacity(0.12),
                shape: BoxShape.circle,
                border: Border.all(
                  color: resolvedIconColor.withOpacity(0.25),
                  width: 1.5,
                ),
              ),
              child: Icon(
                icon,
                size: 38,
                color: resolvedIconColor,
              ),
            ),

            const SizedBox(height: 20),

            // ─── Titre ───────────────────────────────────────
            Text(
              title,
              style: const TextStyle(
                color: _textPrimary,
                fontSize: 18,
                fontWeight: FontWeight.w700,
                height: 1.3,
              ),
              textAlign: TextAlign.center,
            ),

            // ─── Message optionnel ────────────────────────────
            if (message != null) ...[
              const SizedBox(height: 10),
              Text(
                message!,
                style: const TextStyle(
                  color: _textSecondary,
                  fontSize: 14,
                  height: 1.5,
                ),
                textAlign: TextAlign.center,
              ),
            ],

            // ─── Bouton réessayer ─────────────────────────────
            if (onRetry != null) ...[
              const SizedBox(height: 28),
              _RetryButton(onRetry: onRetry!),
            ],
          ],
        ),
      ),
    );
  }
}

class _RetryButton extends StatefulWidget {
  final VoidCallback onRetry;

  const _RetryButton({required this.onRetry});

  @override
  State<_RetryButton> createState() => _RetryButtonState();
}

class _RetryButtonState extends State<_RetryButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scaleAnim;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 90),
    );
    _scaleAnim = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _scaleAnim,
      builder: (context, child) => Transform.scale(
        scale: _scaleAnim.value,
        child: child,
      ),
      child: GestureDetector(
        onTapDown: (_) => _controller.forward(),
        onTapUp: (_) => _controller.reverse(),
        onTapCancel: () => _controller.reverse(),
        onTap: widget.onRetry,
        child: Container(
          height: 48,
          padding: const EdgeInsets.symmetric(horizontal: 32),
          decoration: BoxDecoration(
            color: _primary,
            borderRadius: BorderRadius.circular(14),
            boxShadow: [
              BoxShadow(
                color: _primary.withOpacity(0.30),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: const Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.refresh_rounded, color: Colors.white, size: 18),
                SizedBox(width: 8),
                Text(
                  'Réessayer',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 15,
                    fontWeight: FontWeight.w700,
                    letterSpacing: 0.2,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
