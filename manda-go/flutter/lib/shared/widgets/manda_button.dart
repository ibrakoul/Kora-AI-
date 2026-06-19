import 'package:flutter/material.dart';

/// Bouton primaire Manda Go avec animation scale au tap.
///
/// Utilise le gradient rouge de la marque par défaut.
/// Supporte un état [isLoading] avec spinner blanc,
/// une variante [isOutlined] transparente, et une icône optionnelle.
class MandaButton extends StatefulWidget {
  final String text;
  final VoidCallback? onPressed;
  final bool isLoading;
  final bool isOutlined;
  final IconData? icon;
  final Color? backgroundColor;
  final double? width; // null = pleine largeur

  const MandaButton({
    super.key,
    required this.text,
    this.onPressed,
    this.isLoading = false,
    this.isOutlined = false,
    this.icon,
    this.backgroundColor,
    this.width,
  });

  @override
  State<MandaButton> createState() => _MandaButtonState();
}

class _MandaButtonState extends State<MandaButton>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _scaleAnimation;

  // ─── Couleurs hardcodées (pas de dépendance AppTheme) ─────
  static const Color _primary = Color(0xFFE8163C);
  static const Color _primaryDark = Color(0xFFC0102D);
  static const Color _textOnDark = Color(0xFFF8F9FF);
  static const Color _surface = Color(0xFF1A1A26);

  static const LinearGradient _primaryGradient = LinearGradient(
    colors: [_primary, _primaryDark],
    begin: Alignment.topLeft,
    end: Alignment.bottomRight,
  );

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 100),
      lowerBound: 0.0,
      upperBound: 1.0,
    );
    _scaleAnimation = Tween<double>(begin: 1.0, end: 0.95).animate(
      CurvedAnimation(parent: _controller, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _onTapDown(TapDownDetails _) {
    if (widget.onPressed != null && !widget.isLoading) {
      _controller.forward();
    }
  }

  void _onTapUp(TapUpDetails _) {
    _controller.reverse();
  }

  void _onTapCancel() {
    _controller.reverse();
  }

  @override
  Widget build(BuildContext context) {
    final bool isDisabled = widget.onPressed == null || widget.isLoading;

    return AnimatedBuilder(
      animation: _scaleAnimation,
      builder: (context, child) {
        return Transform.scale(
          scale: _scaleAnimation.value,
          child: child,
        );
      },
      child: GestureDetector(
        onTapDown: _onTapDown,
        onTapUp: _onTapUp,
        onTapCancel: _onTapCancel,
        onTap: (widget.onPressed != null && !widget.isLoading)
            ? widget.onPressed
            : null,
        child: SizedBox(
          width: widget.width,
          height: 56,
          child: widget.isOutlined
              ? _buildOutlined(isDisabled)
              : _buildFilled(isDisabled),
        ),
      ),
    );
  }

  Widget _buildFilled(bool isDisabled) {
    final gradient = widget.backgroundColor != null
        ? LinearGradient(colors: [widget.backgroundColor!, widget.backgroundColor!])
        : _primaryGradient;

    return AnimatedOpacity(
      opacity: isDisabled ? 0.55 : 1.0,
      duration: const Duration(milliseconds: 150),
      child: Container(
        decoration: BoxDecoration(
          gradient: gradient,
          borderRadius: BorderRadius.circular(16),
          boxShadow: isDisabled
              ? null
              : [
                  BoxShadow(
                    color: _primary.withOpacity(0.35),
                    blurRadius: 16,
                    offset: const Offset(0, 6),
                    spreadRadius: 0,
                  ),
                ],
        ),
        child: _buildContent(color: _textOnDark),
      ),
    );
  }

  Widget _buildOutlined(bool isDisabled) {
    return AnimatedOpacity(
      opacity: isDisabled ? 0.55 : 1.0,
      duration: const Duration(milliseconds: 150),
      child: Container(
        decoration: BoxDecoration(
          color: _surface,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: _primary, width: 1.5),
        ),
        child: _buildContent(color: _primary),
      ),
    );
  }

  Widget _buildContent({required Color color}) {
    if (widget.isLoading) {
      return Center(
        child: SizedBox(
          width: 22,
          height: 22,
          child: CircularProgressIndicator(
            strokeWidth: 2.5,
            valueColor: AlwaysStoppedAnimation<Color>(
              widget.isOutlined ? _primary : _textOnDark,
            ),
          ),
        ),
      );
    }

    final children = <Widget>[];

    if (widget.icon != null) {
      children.add(Icon(widget.icon, color: color, size: 20));
      children.add(const SizedBox(width: 8));
    }

    children.add(
      Text(
        widget.text,
        style: TextStyle(
          color: color,
          fontSize: 16,
          fontWeight: FontWeight.w700,
          letterSpacing: 0.3,
        ),
      ),
    );

    return Center(
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: children,
      ),
    );
  }
}
