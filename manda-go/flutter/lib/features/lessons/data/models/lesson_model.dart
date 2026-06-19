import 'package:flutter/foundation.dart';

class ExerciseModel {
  final String id;
  final String type; // vocabulary, multiple_choice, writing, listening
  final Map<String, dynamic> questionJson;
  final Map<String, dynamic> answerJson;
  final int xpReward;

  const ExerciseModel({
    required this.id,
    required this.type,
    required this.questionJson,
    required this.answerJson,
    this.xpReward = 2,
  });

  factory ExerciseModel.fromJson(Map<String, dynamic> json) => ExerciseModel(
        id: json['id'] as String,
        type: json['type'] as String,
        questionJson: json['questionJson'] as Map<String, dynamic>,
        answerJson: json['answerJson'] as Map<String, dynamic>,
        xpReward: (json['xpReward'] as int?) ?? 2,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'type': type,
        'questionJson': questionJson,
        'answerJson': answerJson,
        'xpReward': xpReward,
      };
}

class LessonModel {
  final String id;
  final String title;
  final String titleZh;
  final String type; // vocabulary, grammar, conversation, culture, review
  final int hskLevel;
  final int xpReward;
  final int estimatedMinutes;
  final bool isCompleted;
  final bool isPremium;
  final int orderIndex;
  final List<ExerciseModel> exercises;
  final String? description;
  final String? thumbnailEmoji;

  const LessonModel({
    required this.id,
    required this.title,
    required this.titleZh,
    required this.type,
    required this.hskLevel,
    required this.orderIndex,
    this.xpReward = 15,
    this.estimatedMinutes = 10,
    this.isCompleted = false,
    this.isPremium = false,
    this.exercises = const [],
    this.description,
    this.thumbnailEmoji,
  });

  LessonModel copyWith({bool? isCompleted}) => LessonModel(
        id: id,
        title: title,
        titleZh: titleZh,
        type: type,
        hskLevel: hskLevel,
        orderIndex: orderIndex,
        xpReward: xpReward,
        estimatedMinutes: estimatedMinutes,
        isCompleted: isCompleted ?? this.isCompleted,
        isPremium: isPremium,
        exercises: exercises,
        description: description,
        thumbnailEmoji: thumbnailEmoji,
      );

  factory LessonModel.fromJson(Map<String, dynamic> json) => LessonModel(
        id: json['id'] as String,
        title: json['title'] as String,
        titleZh: json['titleZh'] as String,
        type: json['type'] as String,
        hskLevel: (json['hskLevel'] as int?) ?? 1,
        orderIndex: (json['orderIndex'] as int?) ?? 0,
        xpReward: (json['xpReward'] as int?) ?? 15,
        estimatedMinutes: (json['estimatedMinutes'] as int?) ?? 10,
        isCompleted: (json['isCompleted'] as bool?) ?? false,
        isPremium: (json['isPremium'] as bool?) ?? false,
        exercises: (json['exercises'] as List<dynamic>?)
                ?.map((e) => ExerciseModel.fromJson(e as Map<String, dynamic>))
                .toList() ??
            [],
        description: json['description'] as String?,
        thumbnailEmoji: json['thumbnailEmoji'] as String?,
      );

  Map<String, dynamic> toJson() => {
        'id': id,
        'title': title,
        'titleZh': titleZh,
        'type': type,
        'hskLevel': hskLevel,
        'orderIndex': orderIndex,
        'xpReward': xpReward,
        'estimatedMinutes': estimatedMinutes,
        'isCompleted': isCompleted,
        'isPremium': isPremium,
        'exercises': exercises.map((e) => e.toJson()).toList(),
        'description': description,
        'thumbnailEmoji': thumbnailEmoji,
      };

  // ─────────────────────────────────────────────
  // MOCK DATA — HSK 1 lessons for MVP demo
  // ─────────────────────────────────────────────
  static List<LessonModel> getMockLessons() => [
        LessonModel(
          id: 'lesson-hsk1-01',
          title: 'Salutations',
          titleZh: '问候语',
          type: 'vocabulary',
          hskLevel: 1,
          orderIndex: 1,
          xpReward: 15,
          estimatedMinutes: 8,
          thumbnailEmoji: '👋',
          description: 'Apprenez à dire bonjour et au revoir en mandarin.',
          exercises: _buildVocabExercises('lesson-hsk1-01', [
            {'hanzi': '你好', 'pinyin': 'nǐ hǎo', 'meaning': 'Bonjour'},
            {'hanzi': '再见', 'pinyin': 'zài jiàn', 'meaning': 'Au revoir'},
            {'hanzi': '谢谢', 'pinyin': 'xiè xiè', 'meaning': 'Merci'},
            {'hanzi': '不客气', 'pinyin': 'bù kè qì', 'meaning': 'De rien'},
            {'hanzi': '对不起', 'pinyin': 'duì bu qǐ', 'meaning': 'Pardon'},
          ]),
        ),
        LessonModel(
          id: 'lesson-hsk1-02',
          title: 'Moi & Toi',
          titleZh: '我和你',
          type: 'vocabulary',
          hskLevel: 1,
          orderIndex: 2,
          xpReward: 15,
          thumbnailEmoji: '🤝',
          description: 'Pronoms personnels de base.',
          exercises: _buildMCQExercises('lesson-hsk1-02'),
        ),
        LessonModel(
          id: 'lesson-hsk1-03',
          title: 'Les Nombres',
          titleZh: '数字',
          type: 'vocabulary',
          hskLevel: 1,
          orderIndex: 3,
          xpReward: 20,
          thumbnailEmoji: '🔢',
          description: 'Comptez de 1 à 10 en chinois.',
          exercises: _buildVocabExercises('lesson-hsk1-03', [
            {'hanzi': '一', 'pinyin': 'yī', 'meaning': 'Un'},
            {'hanzi': '二', 'pinyin': 'èr', 'meaning': 'Deux'},
            {'hanzi': '三', 'pinyin': 'sān', 'meaning': 'Trois'},
            {'hanzi': '四', 'pinyin': 'sì', 'meaning': 'Quatre'},
            {'hanzi': '五', 'pinyin': 'wǔ', 'meaning': 'Cinq'},
          ]),
        ),
        LessonModel(
          id: 'lesson-hsk1-04',
          title: 'La Famille',
          titleZh: '家庭',
          type: 'vocabulary',
          hskLevel: 1,
          orderIndex: 4,
          xpReward: 15,
          thumbnailEmoji: '👨‍👩‍👧',
          description: 'Membres de la famille en mandarin.',
          exercises: _buildVocabExercises('lesson-hsk1-04', [
            {'hanzi': '爸爸', 'pinyin': 'bà ba', 'meaning': 'Papa'},
            {'hanzi': '妈妈', 'pinyin': 'mā ma', 'meaning': 'Maman'},
            {'hanzi': '哥哥', 'pinyin': 'gē ge', 'meaning': 'Grand frère'},
            {'hanzi': '姐姐', 'pinyin': 'jiě jie', 'meaning': 'Grande sœur'},
            {'hanzi': '朋友', 'pinyin': 'péng yǒu', 'meaning': 'Ami(e)'},
          ]),
        ),
        LessonModel(
          id: 'lesson-hsk1-05',
          title: 'Manger & Boire',
          titleZh: '吃喝',
          type: 'vocabulary',
          hskLevel: 1,
          orderIndex: 5,
          xpReward: 20,
          thumbnailEmoji: '🍜',
          description: 'Nourriture et boissons essentielles.',
          exercises: _buildMCQExercises('lesson-hsk1-05'),
        ),
        LessonModel(
          id: 'lesson-hsk1-06',
          title: 'Verbe Être',
          titleZh: '是字句',
          type: 'grammar',
          hskLevel: 1,
          orderIndex: 6,
          xpReward: 20,
          thumbnailEmoji: '📝',
          description: 'La structure "A est B" en mandarin.',
          exercises: _buildMCQExercises('lesson-hsk1-06'),
        ),
        // Lessons 7-20 — unlocked via premium or progression
        ...List.generate(14, (i) {
          final idx = i + 7;
          return LessonModel(
            id: 'lesson-hsk1-0$idx',
            title: _mockLessonTitles[i % _mockLessonTitles.length],
            titleZh: _mockLessonTitleZh[i % _mockLessonTitleZh.length],
            type: i % 3 == 0 ? 'grammar' : 'vocabulary',
            hskLevel: 1,
            orderIndex: idx,
            isPremium: idx > 10,
            thumbnailEmoji: _lessonEmojis[i % _lessonEmojis.length],
            exercises: [],
          );
        }),
      ];

  static List<ExerciseModel> _buildVocabExercises(
    String lessonId,
    List<Map<String, String>> words,
  ) {
    return words.asMap().entries.map((entry) {
      final i = entry.key;
      final word = entry.value;
      return ExerciseModel(
        id: '$lessonId-ex-$i',
        type: 'vocabulary',
        questionJson: {
          'hanzi': word['hanzi'],
          'pinyin': word['pinyin'],
          'meaning': word['meaning'],
        },
        answerJson: {'known': true},
        xpReward: 3,
      );
    }).toList();
  }

  static List<ExerciseModel> _buildMCQExercises(String lessonId) {
    return List.generate(5, (i) {
      const questions = [
        {
          'question': '我 (wǒ) signifie:',
          'options': ['Je/Moi', 'Tu/Toi', 'Il/Elle', 'Nous'],
          'correct': 0,
          'hanzi': '我',
        },
        {
          'question': 'Comment dit-on "merci" en chinois ?',
          'options': ['再见', '你好', '谢谢', '对不起'],
          'correct': 2,
          'hanzi': '谢谢',
        },
        {
          'question': '喝 (hē) signifie:',
          'options': ['Manger', 'Boire', 'Dormir', 'Parler'],
          'correct': 1,
          'hanzi': '喝',
        },
        {
          'question': 'Le 3e ton en pinyin ressemble à:',
          'options': ['/ montant', '¯ plat', 'V creux', '\\ descendant'],
          'correct': 2,
          'hanzi': '你好',
        },
        {
          'question': '猫 (māo) signifie:',
          'options': ['Chien', 'Chat', 'Oiseau', 'Poisson'],
          'correct': 1,
          'hanzi': '猫',
        },
      ];
      final q = questions[i % questions.length] as Map<String, dynamic>;
      return ExerciseModel(
        id: '$lessonId-mcq-$i',
        type: 'multiple_choice',
        questionJson: {
          'question': q['question'],
          'hanzi': q['hanzi'],
          'options': q['options'],
        },
        answerJson: {'correctIndex': q['correct']},
        xpReward: 3,
      );
    });
  }

  static const List<String> _mockLessonTitles = [
    'Les Couleurs', 'Les Animaux', 'La Maison', 'Le Temps', 'Les Vêtements',
    'Le Corps', 'Les Transports', 'La Ville', 'Le Travail', 'Les Loisirs',
    'Au Restaurant', 'Au Marché', 'À l\'École', 'La Santé',
  ];

  static const List<String> _mockLessonTitleZh = [
    '颜色', '动物', '家', '天气', '衣服',
    '身体', '交通', '城市', '工作', '爱好',
    '餐厅', '市场', '学校', '健康',
  ];

  static const List<String> _lessonEmojis = [
    '🌈', '🐼', '🏠', '☀️', '👕', '💪', '🚗', '🏙️', '💼', '🎮',
    '🍜', '🛒', '📚', '💊',
  ];
}
