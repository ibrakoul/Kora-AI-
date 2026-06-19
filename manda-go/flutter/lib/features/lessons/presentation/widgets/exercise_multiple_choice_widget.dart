import 'package:flutter/material.dart';

class ExerciseMultipleChoiceWidget extends StatefulWidget {
  final String question;
  final String hanzi;
  final List<String> options;
  final int correctIndex;
  final ValueChanged<bool> onAnswer;
  final bool enabled;

  const ExerciseMultipleChoiceWidget({
    super.key,
    required this.question,
    required this.hanzi,
    required this.options,
    required this.correctIndex,
    required this.onAnswer,
    this.enabled = true,
  });

  @override
  State<ExerciseMultipleChoiceWidget> createState() =>
      _ExerciseMultipleChoiceWidgetState();
}

class _ExerciseMultipleChoiceWidgetState
    extends State<ExerciseMultipleChoiceWidget> {
  int? _selectedIndex;

  void _selectOption(int index) {
    if (!widget.enabled || _selectedIndex != null) return;
    setState(() => _selectedIndex = index);
    widget.onAnswer(index == widget.correctIndex);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 24),
        const Text(
          'Quelle est la bonne traduction ?',
          style: TextStyle(color: Color(0xFF9A9AB0), fontSize: 16),
        ),
        const SizedBox(height: 32),
        // Character display
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 24),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF1E1E2E), Color(0xFF16162A)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(24),
            border: Border.all(color: const Color(0xFF2A2A3A)),
          ),
          child: Column(
            children: [
              Text(
                widget.hanzi,
                style: const TextStyle(
                  color: Color(0xFFF8F9FF),
                  fontSize: 64,
                  fontWeight: FontWeight.w300,
                  height: 1,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                widget.question,
                textAlign: TextAlign.center,
                style: const TextStyle(color: Color(0xFF9A9AB0), fontSize: 14),
              ),
            ],
          ),
        ),
        const SizedBox(height: 32),
        // Options grid
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 12,
            childAspectRatio: 2.2,
          ),
          itemCount: widget.options.length,
          itemBuilder: (context, index) => _buildOption(index),
        ),
      ],
    );
  }

  Widget _buildOption(int index) {
    final isSelected = _selectedIndex == index;
    final isCorrect = index == widget.correctIndex;
    final hasAnswered = _selectedIndex != null;

    Color borderColor = const Color(0xFF2A2A3A);
    Color bgColor = const Color(0xFF1A1A26);
    Color textColor = const Color(0xFFF8F9FF);

    if (hasAnswered) {
      if (isCorrect) {
        borderColor = const Color(0xFF2ECC71);
        bgColor = const Color(0xFF2ECC71).withOpacity(0.15);
        textColor = const Color(0xFF2ECC71);
      } else if (isSelected) {
        borderColor = const Color(0xFFE8163C);
        bgColor = const Color(0xFFE8163C).withOpacity(0.15);
        textColor = const Color(0xFFE8163C);
      }
    } else if (isSelected) {
      borderColor = const Color(0xFFE8163C);
      bgColor = const Color(0xFFE8163C).withOpacity(0.1);
    }

    return GestureDetector(
      onTap: () => _selectOption(index),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        decoration: BoxDecoration(
          color: bgColor,
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: borderColor, width: isSelected || (hasAnswered && isCorrect) ? 2 : 1),
        ),
        child: Center(
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              if (hasAnswered && isCorrect)
                const Text('✅ ', style: TextStyle(fontSize: 14))
              else if (hasAnswered && isSelected && !isCorrect)
                const Text('❌ ', style: TextStyle(fontSize: 14)),
              Flexible(
                child: Text(
                  widget.options[index],
                  textAlign: TextAlign.center,
                  style: TextStyle(
                    color: textColor,
                    fontWeight: isSelected || (hasAnswered && isCorrect)
                        ? FontWeight.w700
                        : FontWeight.normal,
                    fontSize: 14,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
