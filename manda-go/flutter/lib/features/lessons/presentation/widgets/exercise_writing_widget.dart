import 'package:flutter/material.dart';

class ExerciseWritingWidget extends StatefulWidget {
  final String hanzi;
  final String pinyin;
  final String strokeOrder;
  final VoidCallback onAnswer;

  const ExerciseWritingWidget({
    super.key,
    required this.hanzi,
    required this.pinyin,
    required this.strokeOrder,
    required this.onAnswer,
  });

  @override
  State<ExerciseWritingWidget> createState() => _ExerciseWritingWidgetState();
}

class _ExerciseWritingWidgetState extends State<ExerciseWritingWidget> {
  bool _hasWritten = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 16),
        const Text(
          'Tracez ce caractère',
          style: TextStyle(color: Color(0xFF9A9AB0), fontSize: 16),
        ),
        const SizedBox(height: 8),
        Text(
          widget.pinyin,
          style: const TextStyle(
            color: Color(0xFFE8163C),
            fontSize: 20,
            fontStyle: FontStyle.italic,
          ),
        ),
        const SizedBox(height: 24),
        // Character reference grid
        Center(
          child: Container(
            width: 200,
            height: 200,
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A26),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: const Color(0xFF2A2A3A)),
            ),
            child: Stack(
              alignment: Alignment.center,
              children: [
                // Grid lines
                CustomPaint(
                  size: const Size(200, 200),
                  painter: _GridPainter(),
                ),
                // Character
                Text(
                  widget.hanzi,
                  style: TextStyle(
                    color: const Color(0xFFF8F9FF).withOpacity(0.15),
                    fontSize: 140,
                    fontWeight: FontWeight.w200,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 24),
        // Stroke order guide
        Container(
          padding: const EdgeInsets.all(16),
          margin: const EdgeInsets.symmetric(horizontal: 8),
          decoration: BoxDecoration(
            color: const Color(0xFF1A1A26),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: const Color(0xFF2A2A3A)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                '📋 Ordre des traits:',
                style: TextStyle(
                  color: Color(0xFF9A9AB0),
                  fontSize: 13,
                  fontWeight: FontWeight.w600,
                ),
              ),
              const SizedBox(height: 8),
              Text(
                widget.strokeOrder,
                style: const TextStyle(color: Color(0xFFF8F9FF), fontSize: 15),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        Container(
          padding: const EdgeInsets.all(12),
          margin: const EdgeInsets.symmetric(horizontal: 8),
          decoration: BoxDecoration(
            color: const Color(0xFFFFB800).withOpacity(0.1),
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: const Color(0xFFFFB800).withOpacity(0.3)),
          ),
          child: const Row(
            children: [
              Text('🎨', style: TextStyle(fontSize: 18)),
              SizedBox(width: 8),
              Expanded(
                child: Text(
                  'Le tracé interactif arrive bientôt. En attendant, entrainez-vous sur papier !',
                  style: TextStyle(color: Color(0xFFFFB800), fontSize: 12),
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 8),
          child: SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _hasWritten ? null : () {
                setState(() => _hasWritten = true);
                widget.onAnswer();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF2ECC71),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(16),
                ),
              ),
              child: Text(
                _hasWritten ? '✅ Validé !' : '✅ J\'ai tracé le caractère',
                style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
              ),
            ),
          ),
        ),
      ],
    );
  }
}

class _GridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF2A2A3A)
      ..strokeWidth = 1;

    // Center cross
    canvas.drawLine(
      Offset(size.width / 2, 0),
      Offset(size.width / 2, size.height),
      paint,
    );
    canvas.drawLine(
      Offset(0, size.height / 2),
      Offset(size.width, size.height / 2),
      paint,
    );

    // Diagonal guides (dashed)
    paint
      ..color = const Color(0xFF2A2A3A).withOpacity(0.5)
      ..strokeWidth = 0.5;
    canvas.drawLine(const Offset(0, 0), Offset(size.width, size.height), paint);
    canvas.drawLine(Offset(size.width, 0), Offset(0, size.height), paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
