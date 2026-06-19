import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../data/models/lesson_model.dart';
import '../bloc/lesson_bloc.dart';
import '../widgets/exercise_multiple_choice_widget.dart';
import '../widgets/exercise_vocabulary_widget.dart';
import '../widgets/exercise_writing_widget.dart';
import '../widgets/lesson_results_widget.dart';

class LessonDetailPage extends StatefulWidget {
  final String lessonId;
  final bool startExercise;

  const LessonDetailPage({
    super.key,
    required this.lessonId,
    this.startExercise = false,
  });

  @override
  State<LessonDetailPage> createState() => _LessonDetailPageState();
}

class _LessonDetailPageState extends State<LessonDetailPage>
    with TickerProviderStateMixin {
  LessonModel? _lesson;
  int _currentIndex = 0;
  final List<bool> _results = [];
  bool _showFeedback = false;
  bool? _lastAnswerCorrect;
  bool _showResults = false;
  int _lives = 3;
  int _xpEarned = 0;
  late AnimationController _feedbackController;
  late Animation<Color?> _bgAnimation;
  DateTime? _startTime;

  @override
  void initState() {
    super.initState();
    _startTime = DateTime.now();
    _feedbackController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );
    _bgAnimation = ColorTween(
      begin: const Color(0xFF0A0A0F),
      end: const Color(0xFF0A0A0F),
    ).animate(_feedbackController);

    // Find lesson from mock data
    _lesson = LessonModel.getMockLessons()
        .where((l) => l.id == widget.lessonId)
        .firstOrNull ?? LessonModel.getMockLessons().first;
  }

  @override
  void dispose() {
    _feedbackController.dispose();
    super.dispose();
  }

  ExerciseModel? get _currentExercise {
    if (_lesson == null || _lesson!.exercises.isEmpty) return null;
    if (_currentIndex >= _lesson!.exercises.length) return null;
    return _lesson!.exercises[_currentIndex];
  }

  int get _totalExercises => _lesson?.exercises.length ?? 0;

  void _onAnswer(bool isCorrect) {
    if (_showFeedback) return;
    HapticFeedback.lightImpact();

    setState(() {
      _showFeedback = true;
      _lastAnswerCorrect = isCorrect;
      _results.add(isCorrect);
      if (isCorrect) {
        _xpEarned += 3;
      } else {
        _lives = (_lives - 1).clamp(0, 3);
      }
    });

    // Flash background
    _feedbackController.forward(from: 0);
  }

  void _onNext() {
    setState(() => _showFeedback = false);

    if (_currentIndex >= _totalExercises - 1) {
      setState(() => _showResults = true);
      return;
    }

    setState(() => _currentIndex++);
  }

  int get _timeSeconds =>
      _startTime != null ? DateTime.now().difference(_startTime!).inSeconds : 60;

  int get _accuracy => _results.isEmpty
      ? 0
      : ((_results.where((r) => r).length / _results.length) * 100).round();

  @override
  Widget build(BuildContext context) {
    if (_showResults || (_lives == 0)) {
      return _buildResultsOverlay();
    }

    return AnimatedBuilder(
      animation: _feedbackController,
      builder: (context, child) {
        Color bgColor = const Color(0xFF0A0A0F);
        if (_showFeedback && _lastAnswerCorrect != null) {
          bgColor = _lastAnswerCorrect!
              ? const Color(0xFF0D1F0D)
              : const Color(0xFF1F0D0D);
        }
        return ColoredBox(color: bgColor, child: child!);
      },
      child: Scaffold(
        backgroundColor: Colors.transparent,
        appBar: _buildAppBar(),
        body: Column(
          children: [
            _buildProgressBar(),
            Expanded(child: _buildExerciseBody()),
            if (_showFeedback) _buildFeedbackBanner(),
            _buildActionButton(),
          ],
        ),
      ),
    );
  }

  AppBar _buildAppBar() {
    return AppBar(
      backgroundColor: Colors.transparent,
      elevation: 0,
      leading: IconButton(
        icon: const Icon(Icons.close, color: Color(0xFF9A9AB0)),
        onPressed: () => _showExitDialog(),
      ),
      title: Row(
        mainAxisSize: MainAxisSize.min,
        children: List.generate(3, (i) => Padding(
          padding: const EdgeInsets.symmetric(horizontal: 2),
          child: Icon(
            i < _lives ? Icons.favorite : Icons.favorite_border,
            color: i < _lives ? const Color(0xFFE8163C) : const Color(0xFF9A9AB0),
            size: 18,
          ),
        )),
      ),
      centerTitle: true,
      actions: [
        Padding(
          padding: const EdgeInsets.only(right: 16),
          child: Center(
            child: Text(
              '+$_xpEarned XP',
              style: const TextStyle(
                color: Color(0xFFFFB800),
                fontWeight: FontWeight.w700,
                fontSize: 14,
              ),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildProgressBar() {
    final progress = _totalExercises > 0 ? _currentIndex / _totalExercises : 0.0;
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 4),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                _lesson?.title ?? '',
                style: const TextStyle(color: Color(0xFF9A9AB0), fontSize: 12),
              ),
              Text(
                '${_currentIndex + 1} / $_totalExercises',
                style: const TextStyle(color: Color(0xFF9A9AB0), fontSize: 12),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: TweenAnimationBuilder<double>(
              tween: Tween(begin: 0, end: progress),
              duration: const Duration(milliseconds: 300),
              builder: (context, value, _) => LinearProgressIndicator(
                value: value,
                minHeight: 6,
                backgroundColor: const Color(0xFF1A1A26),
                valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFE8163C)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildExerciseBody() {
    final exercise = _currentExercise;
    if (exercise == null) {
      return _buildNoExercisePlaceholder();
    }

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 20),
      child: switch (exercise.type) {
        'vocabulary' => ExerciseVocabularyWidget(
            hanzi: exercise.questionJson['hanzi'] as String? ?? '',
            pinyin: exercise.questionJson['pinyin'] as String? ?? '',
            meaning: exercise.questionJson['meaning'] as String? ?? '',
            onAnswer: _onAnswer,
            enabled: !_showFeedback,
          ),
        'multiple_choice' => ExerciseMultipleChoiceWidget(
            question: exercise.questionJson['question'] as String? ?? '',
            hanzi: exercise.questionJson['hanzi'] as String? ?? '',
            options: (exercise.questionJson['options'] as List<dynamic>?)
                    ?.cast<String>() ?? [],
            correctIndex: (exercise.answerJson['correctIndex'] as int?) ?? 0,
            onAnswer: _onAnswer,
            enabled: !_showFeedback,
          ),
        'writing' => ExerciseWritingWidget(
            hanzi: exercise.questionJson['hanzi'] as String? ?? '',
            pinyin: exercise.questionJson['pinyin'] as String? ?? '',
            strokeOrder: exercise.questionJson['strokeOrder'] as String? ?? '一、丨',
            onAnswer: () => _onAnswer(true),
          ),
        _ => _buildNoExercisePlaceholder(),
      },
    );
  }

  Widget _buildNoExercisePlaceholder() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('📚', style: TextStyle(fontSize: 64)),
          const SizedBox(height: 16),
          Text(
            _lesson?.title ?? 'Leçon',
            style: const TextStyle(
              color: Color(0xFFF8F9FF),
              fontSize: 24,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            _lesson?.description ?? 'Apprenez le vocabulaire mandarin.',
            textAlign: TextAlign.center,
            style: const TextStyle(color: Color(0xFF9A9AB0)),
          ),
        ],
      ),
    );
  }

  Widget _buildFeedbackBanner() {
    final isCorrect = _lastAnswerCorrect ?? false;
    return AnimatedContainer(
      duration: const Duration(milliseconds: 300),
      margin: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 14),
      decoration: BoxDecoration(
        color: isCorrect
            ? const Color(0xFF1A3A1A)
            : const Color(0xFF3A1A1A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isCorrect ? const Color(0xFF2ECC71) : const Color(0xFFE8163C),
        ),
      ),
      child: Row(
        children: [
          Text(
            isCorrect ? '✅' : '❌',
            style: const TextStyle(fontSize: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Text(
              isCorrect
                  ? 'Excellent ! 很好 ! +3 XP'
                  : 'Pas tout à fait… Réessayez !',
              style: TextStyle(
                color: isCorrect ? const Color(0xFF2ECC71) : const Color(0xFFE8163C),
                fontWeight: FontWeight.w600,
                fontSize: 14,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 8, 20, 32),
      child: SizedBox(
        width: double.infinity,
        height: 56,
        child: DecoratedBox(
          decoration: BoxDecoration(
            gradient: _showFeedback
                ? const LinearGradient(colors: [Color(0xFFE8163C), Color(0xFFC0102D)])
                : LinearGradient(
                    colors: [
                      const Color(0xFF1A1A26),
                      const Color(0xFF1A1A26).withOpacity(0.8),
                    ],
                  ),
            borderRadius: BorderRadius.circular(16),
            border: _showFeedback
                ? null
                : Border.all(color: const Color(0xFF2A2A3A)),
          ),
          child: ElevatedButton(
            onPressed: _showFeedback ? _onNext : null,
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.transparent,
              shadowColor: Colors.transparent,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            ),
            child: Text(
              _showFeedback
                  ? (_currentIndex >= _totalExercises - 1 ? 'Voir les résultats 🎉' : 'Continuer →')
                  : 'Répondre d\'abord',
              style: TextStyle(
                color: _showFeedback ? Colors.white : const Color(0xFF9A9AB0),
                fontSize: 16,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildResultsOverlay() {
    final correctCount = _results.where((r) => r).length;
    return LessonResultsWidget(
      score: _accuracy,
      xpEarned: _xpEarned,
      timeSeconds: _timeSeconds,
      correctAnswers: correctCount,
      totalAnswers: _results.length,
      onContinue: () => context.pop(),
      onReplay: () {
        setState(() {
          _currentIndex = 0;
          _results.clear();
          _showFeedback = false;
          _lastAnswerCorrect = null;
          _showResults = false;
          _lives = 3;
          _xpEarned = 0;
          _startTime = DateTime.now();
        });
      },
    );
  }

  void _showExitDialog() {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A26),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Quitter la leçon ?', style: TextStyle(color: Color(0xFFF8F9FF))),
        content: const Text(
          'Votre progression dans cette leçon sera perdue.',
          style: TextStyle(color: Color(0xFF9A9AB0)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Continuer', style: TextStyle(color: Color(0xFFE8163C))),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(ctx);
              context.pop();
            },
            child: const Text('Quitter', style: TextStyle(color: Color(0xFF9A9AB0))),
          ),
        ],
      ),
    );
  }
}
