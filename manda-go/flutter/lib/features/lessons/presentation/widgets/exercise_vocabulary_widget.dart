import 'dart:math' as math;
import 'package:flutter/material.dart';

class ExerciseVocabularyWidget extends StatefulWidget {
  final String hanzi;
  final String pinyin;
  final String meaning;
  final String? example;
  final ValueChanged<bool> onAnswer;
  final bool enabled;

  const ExerciseVocabularyWidget({
    super.key,
    required this.hanzi,
    required this.pinyin,
    required this.meaning,
    this.example,
    required this.onAnswer,
    this.enabled = true,
  });

  @override
  State<ExerciseVocabularyWidget> createState() => _ExerciseVocabularyWidgetState();
}

class _ExerciseVocabularyWidgetState extends State<ExerciseVocabularyWidget>
    with SingleTickerProviderStateMixin {
  late AnimationController _flipController;
  late Animation<double> _flipAnimation;
  bool _isFlipped = false;
  bool _hasAnswered = false;

  @override
  void initState() {
    super.initState();
    _flipController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 500),
    );
    _flipAnimation = Tween<double>(begin: 0, end: 1).animate(
      CurvedAnimation(parent: _flipController, curve: Curves.easeInOutBack),
    );
  }

  @override
  void dispose() {
    _flipController.dispose();
    super.dispose();
  }

  void _flip() {
    if (!widget.enabled) return;
    if (!_isFlipped) {
      _flipController.forward();
      setState(() => _isFlipped = true);
    }
  }

  void _answer(bool knew) {
    if (!widget.enabled || !_isFlipped || _hasAnswered) return;
    setState(() => _hasAnswered = true);
    widget.onAnswer(knew);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 24),
        Center(
          child: Text(
            'Connaissez-vous ce mot ?',
            style: const TextStyle(color: Color(0xFF9A9AB0), fontSize: 16),
          ),
        ),
        const SizedBox(height: 8),
        if (!_isFlipped)
          const Center(
            child: Text(
              'Tapez la carte pour révéler',
              style: TextStyle(color: Color(0xFF9A9AB0), fontSize: 12),
            ),
          ),
        const SizedBox(height: 24),
        Expanded(
          child: GestureDetector(
            onTap: _flip,
            child: AnimatedBuilder(
              animation: _flipAnimation,
              builder: (context, child) {
                final angle = _flipAnimation.value * math.pi;
                final showBack = angle > math.pi / 2;
                return Transform(
                  alignment: Alignment.center,
                  transform: Matrix4.rotationY(angle),
                  child: showBack
                      ? Transform(
                          alignment: Alignment.center,
                          transform: Matrix4.rotationY(math.pi),
                          child: _buildBackCard(),
                        )
                      : _buildFrontCard(),
                );
              },
            ),
          ),
        ),
        const SizedBox(height: 24),
        if (_isFlipped && !_hasAnswered)
          _buildAnswerButtons()
        else if (!_isFlipped)
          _buildTapHint(),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildFrontCard() {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1E1E2E), Color(0xFF16162A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFF2A2A3A)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            widget.hanzi,
            style: const TextStyle(
              color: Color(0xFFF8F9FF),
              fontSize: 80,
              fontWeight: FontWeight.w300,
              height: 1,
            ),
          ),
          const SizedBox(height: 16),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFFE8163C).withOpacity(0.15),
              borderRadius: BorderRadius.circular(20),
            ),
            child: const Text(
              'Tapez pour révéler le sens',
              style: TextStyle(color: Color(0xFFE8163C), fontSize: 13),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBackCard() {
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.symmetric(horizontal: 8),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF1A1A26), Color(0xFF12121A)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFE8163C).withOpacity(0.4)),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFFE8163C).withOpacity(0.15),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(
            widget.hanzi,
            style: const TextStyle(
              color: Color(0xFF9A9AB0),
              fontSize: 40,
              fontWeight: FontWeight.w300,
            ),
          ),
          const SizedBox(height: 12),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A26),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: const Color(0xFF2A2A3A)),
            ),
            child: Text(
              widget.pinyin,
              style: const TextStyle(
                color: Color(0xFFE8163C),
                fontSize: 22,
                fontStyle: FontStyle.italic,
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            widget.meaning,
            style: const TextStyle(
              color: Color(0xFFF8F9FF),
              fontSize: 32,
              fontWeight: FontWeight.w700,
            ),
          ),
          if (widget.example != null) ...[
            const SizedBox(height: 20),
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 32),
              child: Text(
                '例: ${widget.example}',
                textAlign: TextAlign.center,
                style: const TextStyle(
                  color: Color(0xFF9A9AB0),
                  fontSize: 14,
                  fontStyle: FontStyle.italic,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildAnswerButtons() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 8),
      child: Row(
        children: [
          Expanded(
            child: _AnswerButton(
              label: '❌ À revoir',
              color: const Color(0xFFE8163C),
              onTap: () => _answer(false),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: _AnswerButton(
              label: '✅ Je sais !',
              color: const Color(0xFF2ECC71),
              onTap: () => _answer(true),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTapHint() {
    return const Text(
      '👆 Tapez la carte',
      style: TextStyle(color: Color(0xFF9A9AB0), fontSize: 14),
    );
  }
}

class _AnswerButton extends StatelessWidget {
  final String label;
  final Color color;
  final VoidCallback onTap;

  const _AnswerButton({required this.label, required this.color, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 16),
        decoration: BoxDecoration(
          color: color.withOpacity(0.12),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: color.withOpacity(0.5), width: 1.5),
        ),
        child: Text(
          label,
          textAlign: TextAlign.center,
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.w700,
            fontSize: 15,
          ),
        ),
      ),
    );
  }
}
