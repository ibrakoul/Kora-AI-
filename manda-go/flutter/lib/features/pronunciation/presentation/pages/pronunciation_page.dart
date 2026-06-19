import 'dart:async';
import 'dart:math' as math;

import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/manda_card.dart';

class PronunciationPage extends StatefulWidget {
  final String character;
  final String pinyin;
  final String translation;

  const PronunciationPage({
    super.key,
    required this.character,
    required this.pinyin,
    required this.translation,
  });

  @override
  State<PronunciationPage> createState() => _PronunciationPageState();
}

class _PronunciationPageState extends State<PronunciationPage>
    with TickerProviderStateMixin {
  late AnimationController _pulseController;
  late AnimationController _recordingController;
  late Animation<double> _pulseAnimation;

  bool _isRecording = false;
  final List<int> _attemptScores = [];
  int? _currentScore;
  int _selectedTone = 1;
  final int _maxAttempts = 3;
  final _random = math.Random();

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 900),
    )..repeat(reverse: true);

    _recordingController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 2000),
    );

    _pulseAnimation = Tween<double>(begin: 0.9, end: 1.15).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    _recordingController.dispose();
    super.dispose();
  }

  void _toggleRecording() {
    if (_isRecording) return;
    if (_attemptScores.length >= _maxAttempts) return;

    setState(() {
      _isRecording = true;
      _currentScore = null;
    });

    _recordingController.forward(from: 0);

    Future.delayed(const Duration(milliseconds: 2000), () {
      if (!mounted) return;
      final score = 70 + _random.nextInt(31);
      setState(() {
        _isRecording = false;
        _currentScore = score;
        _attemptScores.add(score);
      });
      _recordingController.reset();
    });
  }

  String _getFeedback(int score) {
    if (score == 100) return 'Parfait! 完美!';
    if (score >= 80) return 'Excellent! 非常好!';
    return 'Continuez à pratiquer! 继续练习!';
  }

  Color _getScoreColor(int score) {
    if (score >= 90) return AppColors.jadeGreen;
    if (score >= 75) return AppColors.gold;
    return AppColors.coralOrange;
  }

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
          'Prononciation',
          style: TextStyle(color: AppColors.textOnDark, fontSize: 18, fontWeight: FontWeight.w700),
        ),
        centerTitle: true,
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline, color: AppColors.textTertiary),
            onPressed: () => _showToneInfo(context),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 20),
        child: Column(
          children: [
            const SizedBox(height: 16),
            _buildCharacterCard(),
            const SizedBox(height: 24),
            _buildToneVisualizer(),
            const SizedBox(height: 28),
            _buildRecordButton(),
            const SizedBox(height: 24),
            if (_currentScore != null) _buildScoreCard(_currentScore!),
            const SizedBox(height: 20),
            _buildNativeListenButton(),
            const SizedBox(height: 24),
            _buildAttemptsHistory(),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }

  Widget _buildCharacterCard() {
    return MandaCard(
      padding: const EdgeInsets.all(28),
      child: Column(
        children: [
          Text(
            widget.character,
            style: const TextStyle(
              fontFamily: 'NotoSansSC',
              fontSize: 80,
              color: AppColors.textOnDark,
              fontWeight: FontWeight.w700,
              height: 1.0,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            widget.pinyin,
            style: const TextStyle(
              color: AppColors.vermilionRed,
              fontSize: 24,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 6),
          Text(
            widget.translation,
            style: TextStyle(
              color: AppTheme.colorTextSecondary,
              fontSize: 16,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildToneVisualizer() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Les 4 tons',
          style: TextStyle(
            color: AppTheme.colorTextPrimary,
            fontSize: 15,
            fontWeight: FontWeight.w700,
          ),
        ),
        const SizedBox(height: 12),
        MandaCard(
          padding: const EdgeInsets.all(16),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: List.generate(4, (i) {
              final toneNum = i + 1;
              final isSelected = _selectedTone == toneNum;
              return GestureDetector(
                onTap: () => setState(() => _selectedTone = toneNum),
                child: Column(
                  children: [
                    Container(
                      width: 64,
                      height: 50,
                      decoration: BoxDecoration(
                        color: isSelected
                            ? AppTheme.colorPrimary.withOpacity(0.15)
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                          color: isSelected
                              ? AppTheme.colorPrimary
                              : AppTheme.colorBorder,
                          width: 1.5,
                        ),
                      ),
                      child: CustomPaint(
                        painter: _ToneCurvePainter(
                          toneNumber: toneNum,
                          color: isSelected ? AppTheme.colorPrimary : AppTheme.colorTextSecondary,
                        ),
                      ),
                    ),
                    const SizedBox(height: 6),
                    Text(
                      'Ton $toneNum',
                      style: TextStyle(
                        color: isSelected ? AppTheme.colorPrimary : AppTheme.colorTextSecondary,
                        fontSize: 11,
                        fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400,
                      ),
                    ),
                    Text(
                      _tonePinyinMark(toneNum),
                      style: TextStyle(
                        color: isSelected ? AppTheme.colorPrimary : AppTheme.colorTextSecondary,
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                  ],
                ),
              );
            }),
          ),
        ),
      ],
    );
  }

  String _tonePinyinMark(int tone) {
    const marks = {1: 'ā', 2: 'á', 3: 'ǎ', 4: 'à'};
    return marks[tone] ?? '';
  }

  Widget _buildRecordButton() {
    final canRecord = !_isRecording && _attemptScores.length < _maxAttempts;
    return Column(
      children: [
        Text(
          _isRecording ? 'Enregistrement...' : (canRecord ? 'Appuyez pour parler' : 'Tentatives épuisées'),
          style: TextStyle(
            color: _isRecording ? AppTheme.colorPrimary : AppTheme.colorTextSecondary,
            fontSize: 14,
            fontWeight: FontWeight.w500,
          ),
        ),
        const SizedBox(height: 16),
        GestureDetector(
          onTap: canRecord ? _toggleRecording : null,
          child: AnimatedBuilder(
            animation: _pulseAnimation,
            builder: (_, child) {
              final scale = _isRecording ? _pulseAnimation.value : 1.0;
              return Transform.scale(
                scale: scale,
                child: child,
              );
            },
            child: Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: canRecord
                    ? (_isRecording ? AppColors.error : AppTheme.colorPrimary)
                    : AppTheme.colorSurface,
                boxShadow: canRecord
                    ? [
                        BoxShadow(
                          color: (_isRecording ? AppColors.error : AppTheme.colorPrimary)
                              .withOpacity(0.4),
                          blurRadius: 24,
                          spreadRadius: 4,
                        ),
                      ]
                    : null,
              ),
              child: Icon(
                _isRecording ? Icons.stop_rounded : Icons.mic,
                color: Colors.white,
                size: 36,
              ),
            ),
          ),
        ),
        const SizedBox(height: 10),
        if (_isRecording)
          LinearProgressIndicator(
            backgroundColor: AppTheme.colorBorder,
            valueColor: AlwaysStoppedAnimation<Color>(AppTheme.colorPrimary),
          ),
      ],
    );
  }

  Widget _buildScoreCard(int score) {
    final color = _getScoreColor(score);
    final feedback = _getFeedback(score);
    return MandaCard(
      padding: const EdgeInsets.all(20),
      backgroundColor: color.withOpacity(0.1),
      border: Border.all(color: color.withOpacity(0.4)),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                '$score%',
                style: TextStyle(
                  color: color,
                  fontSize: 48,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: LinearProgressIndicator(
              value: score / 100,
              backgroundColor: AppTheme.colorBorder,
              valueColor: AlwaysStoppedAnimation<Color>(color),
              minHeight: 8,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            feedback,
            style: TextStyle(
              color: color,
              fontSize: 16,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNativeListenButton() {
    return OutlinedButton.icon(
      onPressed: () {},
      icon: const Icon(Icons.volume_up_outlined),
      label: const Text('Écouter le natif'),
      style: OutlinedButton.styleFrom(
        foregroundColor: AppTheme.colorTextPrimary,
        side: BorderSide(color: AppTheme.colorBorder),
        minimumSize: const Size(double.infinity, 48),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
      ),
    );
  }

  Widget _buildAttemptsHistory() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Tentatives',
              style: TextStyle(
                color: AppTheme.colorTextPrimary,
                fontSize: 15,
                fontWeight: FontWeight.w700,
              ),
            ),
            Text(
              '${_attemptScores.length} / $_maxAttempts',
              style: TextStyle(
                color: AppTheme.colorTextSecondary,
                fontSize: 13,
              ),
            ),
          ],
        ),
        const SizedBox(height: 10),
        Row(
          children: List.generate(_maxAttempts, (i) {
            final hasScore = i < _attemptScores.length;
            final score = hasScore ? _attemptScores[i] : null;
            final color = score != null ? _getScoreColor(score) : AppTheme.colorBorder;
            return Expanded(
              child: Container(
                margin: EdgeInsets.only(right: i < _maxAttempts - 1 ? 8 : 0),
                padding: const EdgeInsets.symmetric(vertical: 12),
                decoration: BoxDecoration(
                  color: hasScore ? color.withOpacity(0.1) : AppTheme.colorSurface,
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: color),
                ),
                child: Column(
                  children: [
                    Text(
                      hasScore ? '$score%' : '-',
                      style: TextStyle(
                        color: hasScore ? color : AppTheme.colorTextSecondary,
                        fontSize: 18,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      'Essai ${i + 1}',
                      style: TextStyle(
                        color: AppTheme.colorTextSecondary,
                        fontSize: 11,
                      ),
                    ),
                  ],
                ),
              ),
            );
          }),
        ),
      ],
    );
  }

  void _showToneInfo(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.colorSurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Center(
              child: Container(
                width: 40, height: 4,
                decoration: BoxDecoration(
                  color: AppTheme.colorBorder,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Guide des tons',
              style: TextStyle(
                color: AppTheme.colorTextPrimary,
                fontSize: 18,
                fontWeight: FontWeight.w700,
              ),
            ),
            const SizedBox(height: 16),
            ...[
              ('Ton 1 (ā)', 'Niveau haut et stable — restez sur une note haute.'),
              ('Ton 2 (á)', 'Montant — comme une question en français.'),
              ('Ton 3 (ǎ)', 'En forme de V — descend puis remonte.'),
              ('Ton 4 (à)', 'Descendant — comme un ordre ou une surprise.'),
            ].map((t) => Padding(
              padding: const EdgeInsets.only(bottom: 10),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 6, height: 6,
                    margin: const EdgeInsets.only(top: 6, right: 10),
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: AppTheme.colorPrimary,
                    ),
                  ),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(t.$1, style: TextStyle(color: AppTheme.colorTextPrimary, fontWeight: FontWeight.w600, fontSize: 13)),
                        Text(t.$2, style: TextStyle(color: AppTheme.colorTextSecondary, fontSize: 12)),
                      ],
                    ),
                  ),
                ],
              ),
            )),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }
}

class _ToneCurvePainter extends CustomPainter {
  final int toneNumber;
  final Color color;

  _ToneCurvePainter({required this.toneNumber, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = color
      ..strokeWidth = 2.5
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final path = Path();
    final w = size.width;
    final h = size.height;
    final padH = h * 0.2;
    final padW = w * 0.15;

    switch (toneNumber) {
      case 1:
        // Flat high line
        path.moveTo(padW, padH);
        path.lineTo(w - padW, padH);
        break;
      case 2:
        // Rising line
        path.moveTo(padW, h - padH);
        path.lineTo(w - padW, padH);
        break;
      case 3:
        // V shape (dip then rise)
        path.moveTo(padW, h * 0.35);
        path.quadraticBezierTo(w * 0.5, h - padH, w - padW, h * 0.3);
        break;
      case 4:
        // Falling line
        path.moveTo(padW, padH);
        path.lineTo(w - padW, h - padH);
        break;
    }

    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(_ToneCurvePainter old) =>
      old.toneNumber != toneNumber || old.color != color;
}
