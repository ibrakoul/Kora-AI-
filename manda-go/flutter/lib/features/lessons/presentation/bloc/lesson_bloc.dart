import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

import '../../data/models/lesson_model.dart';

// ─────────────────────────────────────────────
// EVENTS
// ─────────────────────────────────────────────

abstract class LessonEvent extends Equatable {
  const LessonEvent();

  @override
  List<Object?> get props => [];
}

class LessonLoadRequested extends LessonEvent {
  final String courseId;
  const LessonLoadRequested(this.courseId);

  @override
  List<Object?> get props => [courseId];
}

class LessonStarted extends LessonEvent {
  final LessonModel lesson;
  const LessonStarted(this.lesson);

  @override
  List<Object?> get props => [lesson.id];
}

class LessonExerciseAnswered extends LessonEvent {
  final int exerciseIndex;
  final bool isCorrect;
  final int xpEarned;
  const LessonExerciseAnswered({
    required this.exerciseIndex,
    required this.isCorrect,
    this.xpEarned = 3,
  });

  @override
  List<Object?> get props => [exerciseIndex, isCorrect];
}

class LessonNextExercise extends LessonEvent {
  const LessonNextExercise();
}

class LessonCompleted extends LessonEvent {
  const LessonCompleted();
}

class LessonReset extends LessonEvent {
  const LessonReset();
}

// ─────────────────────────────────────────────
// STATES
// ─────────────────────────────────────────────

abstract class LessonState extends Equatable {
  const LessonState();

  @override
  List<Object?> get props => [];
}

class LessonInitial extends LessonState {
  const LessonInitial();
}

class LessonLoading extends LessonState {
  const LessonLoading();
}

class LessonLoaded extends LessonState {
  final List<LessonModel> lessons;
  final String courseId;

  const LessonLoaded({required this.lessons, required this.courseId});

  @override
  List<Object?> get props => [lessons, courseId];
}

class LessonInProgress extends LessonState {
  final LessonModel lesson;
  final int currentExerciseIndex;
  final int xpEarned;
  final List<bool> results;
  final bool showFeedback;
  final bool? lastAnswerCorrect;
  final int lives;

  const LessonInProgress({
    required this.lesson,
    required this.currentExerciseIndex,
    required this.xpEarned,
    required this.results,
    this.showFeedback = false,
    this.lastAnswerCorrect,
    this.lives = 3,
  });

  int get totalExercises => lesson.exercises.length;
  int get correctCount => results.where((r) => r).length;
  double get accuracyPercent =>
      results.isEmpty ? 0 : (correctCount / results.length) * 100;
  bool get isLastExercise =>
      currentExerciseIndex >= totalExercises - 1;

  LessonInProgress copyWith({
    int? currentExerciseIndex,
    int? xpEarned,
    List<bool>? results,
    bool? showFeedback,
    bool? lastAnswerCorrect,
    int? lives,
  }) {
    return LessonInProgress(
      lesson: lesson,
      currentExerciseIndex: currentExerciseIndex ?? this.currentExerciseIndex,
      xpEarned: xpEarned ?? this.xpEarned,
      results: results ?? this.results,
      showFeedback: showFeedback ?? this.showFeedback,
      lastAnswerCorrect: lastAnswerCorrect,
      lives: lives ?? this.lives,
    );
  }

  @override
  List<Object?> get props => [
        lesson.id,
        currentExerciseIndex,
        xpEarned,
        results,
        showFeedback,
        lastAnswerCorrect,
        lives,
      ];
}

class LessonFinished extends LessonState {
  final LessonModel lesson;
  final int finalScore;
  final int xpEarned;
  final int accuracy;
  final int timeSeconds;
  final int correctAnswers;
  final int totalAnswers;

  const LessonFinished({
    required this.lesson,
    required this.finalScore,
    required this.xpEarned,
    required this.accuracy,
    required this.timeSeconds,
    required this.correctAnswers,
    required this.totalAnswers,
  });

  @override
  List<Object?> get props => [lesson.id, finalScore, xpEarned];
}

class LessonError extends LessonState {
  final String message;
  const LessonError(this.message);

  @override
  List<Object?> get props => [message];
}

// ─────────────────────────────────────────────
// BLOC
// ─────────────────────────────────────────────

class LessonBloc extends Bloc<LessonEvent, LessonState> {
  DateTime? _lessonStartTime;

  LessonBloc() : super(const LessonInitial()) {
    on<LessonLoadRequested>(_onLoadRequested);
    on<LessonStarted>(_onLessonStarted);
    on<LessonExerciseAnswered>(_onExerciseAnswered);
    on<LessonNextExercise>(_onNextExercise);
    on<LessonCompleted>(_onLessonCompleted);
    on<LessonReset>(_onReset);
  }

  Future<void> _onLoadRequested(
    LessonLoadRequested event,
    Emitter<LessonState> emit,
  ) async {
    emit(const LessonLoading());
    try {
      // TODO: Replace with API call
      await Future<void>.delayed(const Duration(milliseconds: 500));
      final lessons = LessonModel.getMockLessons();
      emit(LessonLoaded(lessons: lessons, courseId: event.courseId));
    } catch (e) {
      emit(LessonError(e.toString()));
    }
  }

  void _onLessonStarted(LessonStarted event, Emitter<LessonState> emit) {
    _lessonStartTime = DateTime.now();
    emit(LessonInProgress(
      lesson: event.lesson,
      currentExerciseIndex: 0,
      xpEarned: 0,
      results: const [],
      lives: 3,
    ));
  }

  void _onExerciseAnswered(
    LessonExerciseAnswered event,
    Emitter<LessonState> emit,
  ) {
    final currentState = state;
    if (currentState is! LessonInProgress) return;

    final newResults = [...currentState.results, event.isCorrect];
    final newXp = currentState.xpEarned + (event.isCorrect ? event.xpEarned : 0);
    final newLives = event.isCorrect ? currentState.lives : currentState.lives - 1;

    emit(currentState.copyWith(
      results: newResults,
      xpEarned: newXp,
      showFeedback: true,
      lastAnswerCorrect: event.isCorrect,
      lives: newLives,
    ));
  }

  void _onNextExercise(LessonNextExercise event, Emitter<LessonState> emit) {
    final currentState = state;
    if (currentState is! LessonInProgress) return;

    if (currentState.isLastExercise) {
      add(const LessonCompleted());
      return;
    }

    emit(currentState.copyWith(
      currentExerciseIndex: currentState.currentExerciseIndex + 1,
      showFeedback: false,
      lastAnswerCorrect: null,
    ));
  }

  void _onLessonCompleted(LessonCompleted event, Emitter<LessonState> emit) {
    final currentState = state;
    if (currentState is! LessonInProgress) return;

    final timeSeconds = _lessonStartTime != null
        ? DateTime.now().difference(_lessonStartTime!).inSeconds
        : 60;

    final accuracy = currentState.results.isEmpty
        ? 0
        : ((currentState.correctCount / currentState.results.length) * 100).round();

    emit(LessonFinished(
      lesson: currentState.lesson,
      finalScore: accuracy,
      xpEarned: currentState.xpEarned,
      accuracy: accuracy,
      timeSeconds: timeSeconds,
      correctAnswers: currentState.correctCount,
      totalAnswers: currentState.results.length,
    ));
  }

  void _onReset(LessonReset event, Emitter<LessonState> emit) {
    _lessonStartTime = null;
    emit(const LessonInitial());
  }
}
