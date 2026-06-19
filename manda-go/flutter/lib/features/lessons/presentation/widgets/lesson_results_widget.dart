import 'dart:math' as math;
import 'package:flutter/material.dart';

class LessonResultsWidget extends StatefulWidget {
  final int score;
  final int xpEarned;
  final int timeSeconds;
  final int correctAnswers;
  final int totalAnswers;
  final VoidCallback onContinue;
  final VoidCallback onReplay;

  const LessonResultsWidget({
    super.key,
    required this.score,
    required this.xpEarned,
    required this.timeSeconds,
    required this.correctAnswers,
    required this.totalAnswers,
    required this.onContinue,
    required this.onReplay,
  });

  @override
  State<LessonResultsWidget> createState() => _LessonResultsWidgetState();
}

class _LessonResultsWidgetState extends State<LessonResultsWidget>
    with TickerProviderStateMixin {
  late AnimationController _progressController;
  late AnimationController _confettiController;
  late AnimationController _xpController;
  late Animation<double> _progressAnim;
  late Animation<int> _xpCountAnim;
  final List<_ConfettiParticle> _particles = [];
  final _random = math.Random();

  @override
  void initState() {
    super.initState();

    _progressController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
    _progressAnim = Tween<double>(begin: 0, end: widget.score / 100).animate(
      CurvedAnimation(parent: _progressController, curve: Curves.easeOutCubic),
    );

    _confettiController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2500),
    );

    _xpController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );
    _xpCountAnim = IntTween(begin: 0, end: widget.xpEarned).animate(
      CurvedAnimation(parent: _xpController, curve: Curves.easeOut),
    );

    // Generate confetti particles
    for (var i = 0; i < 40; i++) {
      _particles.add(_ConfettiParticle(
        x: _random.nextDouble(),
        delay: _random.nextDouble() * 0.5,
        color: [
          const Color(0xFFE8163C),
          const Color(0xFFFFB800),
          const Color(0xFF2ECC71),
          const Color(0xFF3498DB),
          Colors.white,
        ][_random.nextInt(5)],
        size: 6 + _random.nextDouble() * 8,
      ));
    }

    if (widget.score >= 60) {
      _confettiController.forward();
    }
    _progressController.forward();
    Future<void>.delayed(const Duration(milliseconds: 500), () {
      if (mounted) _xpController.forward();
    });
  }

  @override
  void dispose() {
    _progressController.dispose();
    _confettiController.dispose();
    _xpController.dispose();
    super.dispose();
  }

  String get _scoreEmoji {
    if (widget.score >= 90) return '🏆';
    if (widget.score >= 70) return '⭐';
    if (widget.score >= 50) return '👍';
    return '💪';
  }

  String get _scoreMessage {
    if (widget.score >= 90) return 'Parfait ! 完美！';
    if (widget.score >= 70) return 'Excellent ! 很好！';
    if (widget.score >= 50) return 'Bien joué ! 不错！';
    return 'Continuez ! 加油！';
  }

  String _formatTime(int seconds) {
    final m = seconds ~/ 60;
    final s = seconds % 60;
    return m > 0 ? '${m}m ${s}s' : '${s}s';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0F),
      body: Stack(
        children: [
          // Confetti overlay
          if (widget.score >= 60)
            AnimatedBuilder(
              animation: _confettiController,
              builder: (context, child) => CustomPaint(
                painter: _ConfettiPainter(
                  particles: _particles,
                  progress: _confettiController.value,
                ),
                size: MediaQuery.of(context).size,
              ),
            ),
          // Main content
          SafeArea(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                children: [
                  const SizedBox(height: 24),
                  Text(
                    _scoreEmoji,
                    style: const TextStyle(fontSize: 72),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    _scoreMessage,
                    style: const TextStyle(
                      color: Color(0xFFF8F9FF),
                      fontSize: 28,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Leçon complétée !',
                    style: TextStyle(color: Color(0xFF9A9AB0), fontSize: 16),
                  ),
                  const SizedBox(height: 40),
                  // Score ring
                  _buildScoreRing(),
                  const SizedBox(height: 32),
                  // Stats row
                  _buildStatsRow(),
                  const SizedBox(height: 32),
                  // XP earned
                  _buildXpBanner(),
                  const Spacer(),
                  // Buttons
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: widget.onReplay,
                          style: OutlinedButton.styleFrom(
                            foregroundColor: const Color(0xFF9A9AB0),
                            side: const BorderSide(color: Color(0xFF2A2A3A)),
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(16),
                            ),
                          ),
                          child: const Text('🔄 Rejouer', style: TextStyle(fontWeight: FontWeight.w700)),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        flex: 2,
                        child: DecoratedBox(
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [Color(0xFFE8163C), Color(0xFFC0102D)],
                            ),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: ElevatedButton(
                            onPressed: widget.onContinue,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.transparent,
                              shadowColor: Colors.transparent,
                              padding: const EdgeInsets.symmetric(vertical: 16),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(16),
                              ),
                            ),
                            child: const Text(
                              'Continuer →',
                              style: TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.w700,
                                fontSize: 16,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildScoreRing() {
    return AnimatedBuilder(
      animation: _progressAnim,
      builder: (context, child) {
        return Stack(
          alignment: Alignment.center,
          children: [
            SizedBox(
              width: 140,
              height: 140,
              child: CircularProgressIndicator(
                value: _progressAnim.value,
                strokeWidth: 10,
                backgroundColor: const Color(0xFF1A1A26),
                valueColor: AlwaysStoppedAnimation<Color>(
                  widget.score >= 70
                      ? const Color(0xFF2ECC71)
                      : widget.score >= 50
                          ? const Color(0xFFFFB800)
                          : const Color(0xFFE8163C),
                ),
              ),
            ),
            Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Text(
                  '${(widget.score * _progressAnim.value).round()}%',
                  style: const TextStyle(
                    color: Color(0xFFF8F9FF),
                    fontSize: 36,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const Text(
                  'précision',
                  style: TextStyle(color: Color(0xFF9A9AB0), fontSize: 12),
                ),
              ],
            ),
          ],
        );
      },
    );
  }

  Widget _buildStatsRow() {
    return Row(
      children: [
        _buildStat('✅', '${widget.correctAnswers}/${widget.totalAnswers}', 'Bonnes réponses'),
        _buildStatDivider(),
        _buildStat('⏱️', _formatTime(widget.timeSeconds), 'Temps'),
        _buildStatDivider(),
        _buildStat('📚', '${widget.totalAnswers}', 'Mots vus'),
      ],
    );
  }

  Widget _buildStat(String emoji, String value, String label) {
    return Expanded(
      child: Column(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 24)),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              color: Color(0xFFF8F9FF),
              fontSize: 18,
              fontWeight: FontWeight.w800,
            ),
          ),
          Text(
            label,
            textAlign: TextAlign.center,
            style: const TextStyle(color: Color(0xFF9A9AB0), fontSize: 10),
          ),
        ],
      ),
    );
  }

  Widget _buildStatDivider() => Container(
        width: 1,
        height: 50,
        color: const Color(0xFF2A2A3A),
      );

  Widget _buildXpBanner() {
    return AnimatedBuilder(
      animation: _xpCountAnim,
      builder: (context, child) {
        return Container(
          width: double.infinity,
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            color: const Color(0xFFFFB800).withOpacity(0.12),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFFFFB800).withOpacity(0.4)),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text('⭐', style: TextStyle(fontSize: 24)),
              const SizedBox(width: 8),
              Text(
                '+${_xpCountAnim.value} XP',
                style: const TextStyle(
                  color: Color(0xFFFFB800),
                  fontSize: 24,
                  fontWeight: FontWeight.w900,
                ),
              ),
              const SizedBox(width: 8),
              const Text('gagnés !', style: TextStyle(color: Color(0xFFFFB800), fontSize: 16)),
            ],
          ),
        );
      },
    );
  }
}

class _ConfettiParticle {
  final double x;
  final double delay;
  final Color color;
  final double size;
  const _ConfettiParticle({
    required this.x,
    required this.delay,
    required this.color,
    required this.size,
  });
}

class _ConfettiPainter extends CustomPainter {
  final List<_ConfettiParticle> particles;
  final double progress;

  const _ConfettiPainter({required this.particles, required this.progress});

  @override
  void paint(Canvas canvas, Size size) {
    for (final p in particles) {
      final t = ((progress - p.delay) / (1 - p.delay)).clamp(0.0, 1.0);
      if (t <= 0) continue;
      final x = p.x * size.width;
      final y = t * size.height;
      final rotation = t * math.pi * 4;
      canvas.save();
      canvas.translate(x, y);
      canvas.rotate(rotation);
      canvas.drawRect(
        Rect.fromCenter(center: Offset.zero, width: p.size, height: p.size * 0.5),
        Paint()..color = p.color.withOpacity((1 - t).clamp(0.0, 1.0)),
      );
      canvas.restore();
    }
  }

  @override
  bool shouldRepaint(_ConfettiPainter old) => old.progress != progress;
}
