import 'package:flutter/material.dart';

import '../../core/theme/app_theme.dart';

class MandaCard extends StatelessWidget {
  final Widget child;
  final EdgeInsets padding;
  final Gradient? gradient;
  final Color? backgroundColor;
  final double borderRadius;
  final List<BoxShadow>? shadows;
  final VoidCallback? onTap;
  final Border? border;

  const MandaCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(20),
    this.gradient,
    this.backgroundColor,
    this.borderRadius = 20,
    this.shadows,
    this.onTap,
    this.border,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: padding,
        decoration: BoxDecoration(
          gradient: gradient,
          color: gradient == null ? (backgroundColor ?? AppTheme.colorSurface) : null,
          borderRadius: BorderRadius.circular(borderRadius),
          border: border ?? Border.all(
            color: gradient != null
                ? Colors.transparent
                : AppTheme.colorBorder,
            width: 1,
          ),
          boxShadow: shadows ?? [
            if (gradient != null)
              BoxShadow(
                color: AppTheme.colorPrimary.withOpacity(0.25),
                blurRadius: 20,
                offset: const Offset(0, 8),
              )
            else
              BoxShadow(
                color: Colors.black.withOpacity(0.15),
                blurRadius: 10,
                offset: const Offset(0, 4),
              ),
          ],
        ),
        child: child,
      ),
    );
  }
}
