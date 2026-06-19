import 'package:flutter/material.dart';

// ─── Couleurs hardcodées ──────────────────────────────────────
const Color _background = Color(0xFF0A0A0F);
const Color _surface = Color(0xFF1A1A26);
const Color _textSecondary = Color(0xFF9A9AB0);

// ─── Couleurs shimmer ─────────────────────────────────────────
const Color _shimmerBase = Color(0xFF1A1A26);
const Color _shimmerHighlight = Color(0xFF2E2E42);

/// Widget de chargement centré avec message optionnel.
class LoadingWidget extends StatelessWidget {
  final String? message;

  const LoadingWidget({super.key, this.message});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          const SizedBox(
            width: 36,
            height: 36,
            child: CircularProgressIndicator(
              strokeWidth: 3,
              valueColor: AlwaysStoppedAnimation<Color>(Color(0xFFE8163C)),
            ),
          ),
          if (message != null) ...[
            const SizedBox(height: 16),
            Text(
              message!,
              style: const TextStyle(
                color: _textSecondary,
                fontSize: 14,
                fontWeight: FontWeight.w400,
              ),
              textAlign: TextAlign.center,
            ),
          ],
        ],
      ),
    );
  }
}

/// Carte avec animation shimmer (skeleton loader).
///
/// L'animation shimmer est construite manuellement avec [AnimatedBuilder]
/// et un [LinearGradient] qui se déplace de gauche à droite.
class ShimmerCard extends StatefulWidget {
  final double height;
  final double? width;
  final double borderRadius;

  const ShimmerCard({
    super.key,
    this.height = 80,
    this.width,
    this.borderRadius = 16,
  });

  @override
  State<ShimmerCard> createState() => _ShimmerCardState();
}

class _ShimmerCardState extends State<ShimmerCard>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1400),
    )..repeat();
    _animation = Tween<double>(begin: -1.5, end: 2.5).animate(
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
      animation: _animation,
      builder: (context, child) {
        return Container(
          height: widget.height,
          width: widget.width,
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(widget.borderRadius),
            gradient: LinearGradient(
              begin: Alignment(_animation.value - 1, 0),
              end: Alignment(_animation.value, 0),
              colors: const [
                _shimmerBase,
                _shimmerHighlight,
                _shimmerBase,
              ],
              stops: const [0.0, 0.5, 1.0],
            ),
          ),
        );
      },
    );
  }
}

/// Ligne de texte simulée pour les skeletons.
class _ShimmerLine extends StatelessWidget {
  final double width;
  final double height;

  const _ShimmerLine({required this.width, this.height = 12});

  @override
  Widget build(BuildContext context) {
    return ShimmerCard(height: height, width: width, borderRadius: 6);
  }
}

/// Liste de 3 cartes shimmer empilées verticalement.
class ShimmerList extends StatelessWidget {
  final int count;
  final double cardHeight;
  final double spacing;

  const ShimmerList({
    super.key,
    this.count = 3,
    this.cardHeight = 96,
    this.spacing = 12,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      children: List.generate(count, (index) {
        return Padding(
          padding: EdgeInsets.only(bottom: index < count - 1 ? spacing : 0),
          child: _ShimmerListItem(height: cardHeight),
        );
      }),
    );
  }
}

/// Item de liste shimmer avec avatar + lignes de texte.
class _ShimmerListItem extends StatelessWidget {
  final double height;

  const _ShimmerListItem({this.height = 96});

  @override
  Widget build(BuildContext context) {
    return Container(
      height: height,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: _surface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Row(
        children: [
          ShimmerCard(height: height - 32, width: height - 32, borderRadius: 12),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.center,
              children: const [
                _ShimmerLine(width: 160, height: 14),
                SizedBox(height: 8),
                _ShimmerLine(width: 110, height: 11),
                SizedBox(height: 6),
                _ShimmerLine(width: 80, height: 10),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

/// Grille de cartes shimmer.
class ShimmerGrid extends StatelessWidget {
  final int crossAxisCount;
  final int itemCount;
  final double itemHeight;
  final double spacing;

  const ShimmerGrid({
    super.key,
    this.crossAxisCount = 2,
    this.itemCount = 4,
    this.itemHeight = 140,
    this.spacing = 12,
  });

  @override
  Widget build(BuildContext context) {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: crossAxisCount,
        crossAxisSpacing: spacing,
        mainAxisSpacing: spacing,
        childAspectRatio: (MediaQuery.of(context).size.width / crossAxisCount -
                spacing * (crossAxisCount + 1) / crossAxisCount) /
            itemHeight,
      ),
      itemCount: itemCount,
      itemBuilder: (_, __) => const _ShimmerGridCard(),
    );
  }
}

class _ShimmerGridCard extends StatelessWidget {
  const _ShimmerGridCard();

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: _surface,
        borderRadius: BorderRadius.circular(16),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Expanded(child: ShimmerCard(borderRadius: 10)),
          SizedBox(height: 10),
          _ShimmerLine(width: 90, height: 12),
          SizedBox(height: 6),
          _ShimmerLine(width: 60, height: 10),
        ],
      ),
    );
  }
}
