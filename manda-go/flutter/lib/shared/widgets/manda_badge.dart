import 'package:flutter/material.dart';

// ─── Couleurs hardcodées ──────────────────────────────────────
const Color _primary = Color(0xFFE8163C);
const Color _gold = Color(0xFFFFB800);
const Color _surface = Color(0xFF1A1A26);
const Color _textPrimary = Color(0xFFF8F9FF);

/// Badge générique: pill ou chip carré.
///
/// [isPill] true → bords arrondis à 100 (forme pilule)
/// [isPill] false → bords arrondis à 8 (chip rectangulaire)
class MandaBadge extends StatelessWidget {
  final String text;
  final Color color;
  final Color? textColor;
  final bool isPill;

  const MandaBadge({
    super.key,
    required this.text,
    required this.color,
    this.textColor,
    this.isPill = true,
  });

  @override
  Widget build(BuildContext context) {
    final Color resolvedText = textColor ?? _textPrimary;
    final double radius = isPill ? 100 : 8;

    return Container(
      padding: EdgeInsets.symmetric(
        horizontal: isPill ? 12 : 10,
        vertical: isPill ? 4 : 4,
      ),
      decoration: BoxDecoration(
        color: color.withOpacity(0.18),
        borderRadius: BorderRadius.circular(radius),
        border: Border.all(color: color.withOpacity(0.40), width: 1),
      ),
      child: Text(
        text,
        style: TextStyle(
          color: resolvedText != _textPrimary ? resolvedText : color,
          fontSize: 12,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.3,
        ),
      ),
    );
  }
}

/// Badge XP affichant une valeur de points d'expérience.
///
/// Exemple: `XpBadge(xp: 150)` → "+150 XP"
class XpBadge extends StatelessWidget {
  final int xp;
  final bool showPlus;

  const XpBadge({
    super.key,
    required this.xp,
    this.showPlus = true,
  });

  @override
  Widget build(BuildContext context) {
    final String label = showPlus ? '+$xp XP' : '$xp XP';

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFFFFB800), Color(0xFFE67E22)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(100),
        boxShadow: [
          BoxShadow(
            color: _gold.withOpacity(0.35),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: Color(0xFF0A0A0F),
          fontSize: 12,
          fontWeight: FontWeight.w800,
          letterSpacing: 0.2,
        ),
      ),
    );
  }
}

/// Badge de niveau avec numéro et titre optionnel.
///
/// Exemple: `LevelBadge(level: 12, title: 'Intermédiaire')`
class LevelBadge extends StatelessWidget {
  final int level;
  final String? title;

  const LevelBadge({
    super.key,
    required this.level,
    this.title,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: _surface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: _primary.withOpacity(0.4), width: 1.5),
        boxShadow: [
          BoxShadow(
            color: _primary.withOpacity(0.10),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          const Text(
            'Niv.',
            style: TextStyle(
              color: Color(0xFF9A9AB0),
              fontSize: 11,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(width: 4),
          Text(
            '$level',
            style: const TextStyle(
              color: _primary,
              fontSize: 15,
              fontWeight: FontWeight.w800,
            ),
          ),
          if (title != null) ...[
            const SizedBox(width: 6),
            Container(
              width: 1,
              height: 12,
              color: _primary.withOpacity(0.3),
            ),
            const SizedBox(width: 6),
            Text(
              title!,
              style: const TextStyle(
                color: _textPrimary,
                fontSize: 12,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ],
      ),
    );
  }
}

/// Badge de notification avec compteur (ex: 3 messages non lus).
class NotificationBadge extends StatelessWidget {
  final int count;
  final Color color;

  const NotificationBadge({
    super.key,
    required this.count,
    this.color = _primary,
  });

  @override
  Widget build(BuildContext context) {
    if (count <= 0) return const SizedBox.shrink();

    final String label = count > 99 ? '99+' : '$count';

    return Container(
      constraints: const BoxConstraints(minWidth: 20, minHeight: 20),
      padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(100),
      ),
      child: Text(
        label,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 11,
          fontWeight: FontWeight.w800,
        ),
        textAlign: TextAlign.center,
      ),
    );
  }
}

/// Badge de rareté pour les items et récompenses.
enum Rarity { common, rare, epic, legendary }

class RarityBadge extends StatelessWidget {
  final Rarity rarity;

  const RarityBadge({super.key, required this.rarity});

  static const Map<Rarity, _RarityConfig> _configs = {
    Rarity.common: _RarityConfig(
      label: 'Commun',
      color: Color(0xFF9A9AB0),
    ),
    Rarity.rare: _RarityConfig(
      label: 'Rare',
      color: Color(0xFF3498DB),
    ),
    Rarity.epic: _RarityConfig(
      label: 'Épique',
      color: Color(0xFF9B59B6),
    ),
    Rarity.legendary: _RarityConfig(
      label: 'Légendaire',
      color: Color(0xFFFFB800),
    ),
  };

  @override
  Widget build(BuildContext context) {
    final config = _configs[rarity]!;

    return MandaBadge(
      text: config.label,
      color: config.color,
      isPill: true,
    );
  }
}

class _RarityConfig {
  final String label;
  final Color color;

  const _RarityConfig({required this.label, required this.color});
}
