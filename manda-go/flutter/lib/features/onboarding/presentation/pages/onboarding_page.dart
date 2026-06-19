import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class OnboardingPage extends StatefulWidget {
  const OnboardingPage({super.key});

  @override
  State<OnboardingPage> createState() => _OnboardingPageState();
}

class _OnboardingPageState extends State<OnboardingPage> {
  final PageController _pageController = PageController();
  int _currentPage = 0;

  // Step 2 — goal selection
  String? _selectedGoal;
  // Step 3 — level
  String? _selectedLevel;
  // Step 4 — time
  int _dailyMinutes = 15;

  static const _totalPages = 5;

  static const _goals = [
    {'emoji': '✈️', 'label': 'Voyage', 'value': 'travel'},
    {'emoji': '💼', 'label': 'Travail', 'value': 'work'},
    {'emoji': '🏮', 'label': 'Culture', 'value': 'culture'},
    {'emoji': '❤️', 'label': 'Romance', 'value': 'romance'},
    {'emoji': '🎓', 'label': 'HSK', 'value': 'hsk'},
  ];

  static const _levels = [
    {'emoji': '🌱', 'label': 'Débutant', 'sub': 'Je commence de zéro', 'value': 'beginner'},
    {'emoji': '📖', 'label': 'Élémentaire', 'sub': 'Je connais quelques mots', 'value': 'elementary'},
    {'emoji': '💬', 'label': 'Intermédiaire', 'sub': 'Je peux me débrouiller', 'value': 'intermediate'},
    {'emoji': '🏆', 'label': 'Avancé', 'sub': 'Je parle couramment', 'value': 'advanced'},
  ];

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  void _nextPage() {
    if (_currentPage < _totalPages - 1) {
      _pageController.nextPage(
        duration: const Duration(milliseconds: 350),
        curve: Curves.easeInOutCubic,
      );
    } else {
      context.go('/home');
    }
  }

  bool get _canProceed {
    return switch (_currentPage) {
      1 => _selectedGoal != null,
      2 => _selectedLevel != null,
      _ => true,
    };
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0F),
      body: SafeArea(
        child: Column(
          children: [
            _buildHeader(),
            Expanded(
              child: PageView(
                controller: _pageController,
                physics: const NeverScrollableScrollPhysics(),
                onPageChanged: (i) => setState(() => _currentPage = i),
                children: [
                  _buildWelcomePage(),
                  _buildGoalPage(),
                  _buildLevelPage(),
                  _buildTimePage(),
                  _buildProgramPage(),
                ],
              ),
            ),
            _buildFooter(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 16, 24, 0),
      child: Column(
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              if (_currentPage > 0)
                GestureDetector(
                  onTap: () => _pageController.previousPage(
                    duration: const Duration(milliseconds: 300),
                    curve: Curves.easeOut,
                  ),
                  child: const Icon(Icons.arrow_back_ios, color: Color(0xFF9A9AB0), size: 20),
                )
              else
                const SizedBox(width: 20),
              Text(
                '${_currentPage + 1} / $_totalPages',
                style: const TextStyle(color: Color(0xFF9A9AB0), fontSize: 13),
              ),
              if (_currentPage < _totalPages - 1)
                GestureDetector(
                  onTap: () => context.go('/home'),
                  child: const Text('Passer', style: TextStyle(color: Color(0xFF9A9AB0), fontSize: 13)),
                )
              else
                const SizedBox(width: 40),
            ],
          ),
          const SizedBox(height: 12),
          ClipRRect(
            borderRadius: BorderRadius.circular(4),
            child: LinearProgressIndicator(
              value: (_currentPage + 1) / _totalPages,
              minHeight: 4,
              backgroundColor: const Color(0xFF1A1A26),
              valueColor: const AlwaysStoppedAnimation<Color>(Color(0xFFE8163C)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFooter() {
    final isLast = _currentPage == _totalPages - 1;
    return Padding(
      padding: const EdgeInsets.fromLTRB(24, 12, 24, 32),
      child: SizedBox(
        width: double.infinity,
        height: 56,
        child: AnimatedOpacity(
          opacity: _canProceed ? 1.0 : 0.5,
          duration: const Duration(milliseconds: 200),
          child: DecoratedBox(
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFFE8163C), Color(0xFFC0102D)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFFE8163C).withOpacity(0.4),
                  blurRadius: 20,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: ElevatedButton(
              onPressed: _canProceed ? _nextPage : null,
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.transparent,
                shadowColor: Colors.transparent,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
              child: Text(
                isLast ? 'Commencer ! 🐉' : 'Suivant →',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  // ─── PAGE 1: WELCOME ───
  Widget _buildWelcomePage() {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _buildAnimatedEmoji('🐉', size: 96),
          const SizedBox(height: 32),
          const Text(
            'Manda Go',
            style: TextStyle(
              color: Color(0xFFF8F9FF),
              fontSize: 40,
              fontWeight: FontWeight.w900,
              letterSpacing: -1,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            '漫达',
            style: TextStyle(
              color: Color(0xFFE8163C),
              fontSize: 28,
              fontWeight: FontWeight.w300,
              letterSpacing: 8,
            ),
          ),
          const SizedBox(height: 24),
          const Text(
            'Apprenez le mandarin avec\nl\'intelligence artificielle.',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Color(0xFF9A9AB0),
              fontSize: 18,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 40),
          _buildFeatureRow('🤖', 'Professeur IA personnalisé'),
          const SizedBox(height: 12),
          _buildFeatureRow('🎮', '35 mini-jeux éducatifs'),
          const SizedBox(height: 12),
          _buildFeatureRow('🎤', 'Correction de prononciation'),
          const SizedBox(height: 12),
          _buildFeatureRow('🏆', 'Gamification avancée'),
        ],
      ),
    );
  }

  // ─── PAGE 2: GOAL ───
  Widget _buildGoalPage() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),
          const Text(
            'Quel est votre\nobjectif ?',
            style: TextStyle(
              color: Color(0xFFF8F9FF),
              fontSize: 32,
              fontWeight: FontWeight.w800,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Nous adapterons votre parcours.',
            style: TextStyle(color: Color(0xFF9A9AB0), fontSize: 15),
          ),
          const SizedBox(height: 32),
          ...(_goals.map((goal) => _buildGoalCard(goal))),
        ],
      ),
    );
  }

  Widget _buildGoalCard(Map<String, String> goal) {
    final isSelected = _selectedGoal == goal['value'];
    return GestureDetector(
      onTap: () => setState(() => _selectedGoal = goal['value']),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          color: isSelected
              ? const Color(0xFFE8163C).withOpacity(0.15)
              : const Color(0xFF1A1A26),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? const Color(0xFFE8163C) : const Color(0xFF2A2A3A),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Text(goal['emoji']!, style: const TextStyle(fontSize: 28)),
            const SizedBox(width: 16),
            Text(
              goal['label']!,
              style: TextStyle(
                color: isSelected ? const Color(0xFFE8163C) : const Color(0xFFF8F9FF),
                fontSize: 17,
                fontWeight: FontWeight.w600,
              ),
            ),
            const Spacer(),
            if (isSelected)
              const Icon(Icons.check_circle, color: Color(0xFFE8163C), size: 22),
          ],
        ),
      ),
    );
  }

  // ─── PAGE 3: LEVEL ───
  Widget _buildLevelPage() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),
          const Text(
            'Quel est votre\nniveau actuel ?',
            style: TextStyle(
              color: Color(0xFFF8F9FF),
              fontSize: 32,
              fontWeight: FontWeight.w800,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 32),
          ...(_levels.map((level) => _buildLevelCard(level))),
        ],
      ),
    );
  }

  Widget _buildLevelCard(Map<String, String> level) {
    final isSelected = _selectedLevel == level['value'];
    return GestureDetector(
      onTap: () => setState(() => _selectedLevel = level['value']),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        margin: const EdgeInsets.only(bottom: 10),
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
        decoration: BoxDecoration(
          color: isSelected
              ? const Color(0xFFE8163C).withOpacity(0.15)
              : const Color(0xFF1A1A26),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(
            color: isSelected ? const Color(0xFFE8163C) : const Color(0xFF2A2A3A),
            width: isSelected ? 2 : 1,
          ),
        ),
        child: Row(
          children: [
            Text(level['emoji']!, style: const TextStyle(fontSize: 32)),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    level['label']!,
                    style: TextStyle(
                      color: isSelected ? const Color(0xFFE8163C) : const Color(0xFFF8F9FF),
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  Text(
                    level['sub']!,
                    style: const TextStyle(color: Color(0xFF9A9AB0), fontSize: 12),
                  ),
                ],
              ),
            ),
            if (isSelected)
              const Icon(Icons.check_circle, color: Color(0xFFE8163C), size: 22),
          ],
        ),
      ),
    );
  }

  // ─── PAGE 4: TIME ───
  Widget _buildTimePage() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const SizedBox(height: 24),
          const Text(
            'Combien de temps\npar jour ?',
            style: TextStyle(
              color: Color(0xFFF8F9FF),
              fontSize: 32,
              fontWeight: FontWeight.w800,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Même 5 minutes par jour font une différence !',
            style: TextStyle(color: Color(0xFF9A9AB0), fontSize: 15),
          ),
          const SizedBox(height: 48),
          Center(
            child: Column(
              children: [
                Text(
                  '$_dailyMinutes',
                  style: const TextStyle(
                    color: Color(0xFFE8163C),
                    fontSize: 80,
                    fontWeight: FontWeight.w900,
                  ),
                ),
                const Text(
                  'minutes par jour',
                  style: TextStyle(color: Color(0xFF9A9AB0), fontSize: 18),
                ),
              ],
            ),
          ),
          const SizedBox(height: 32),
          Slider(
            value: _dailyMinutes.toDouble(),
            min: 5,
            max: 30,
            divisions: 5,
            activeColor: const Color(0xFFE8163C),
            inactiveColor: const Color(0xFF2A2A3A),
            onChanged: (v) => setState(() => _dailyMinutes = v.round()),
          ),
          const SizedBox(height: 8),
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('5 min', style: TextStyle(color: Color(0xFF9A9AB0), fontSize: 12)),
              Text('30 min', style: TextStyle(color: Color(0xFF9A9AB0), fontSize: 12)),
            ],
          ),
          const SizedBox(height: 32),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFF1A1A26),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF2A2A3A)),
            ),
            child: Row(
              children: [
                const Text('🎯', style: TextStyle(fontSize: 28)),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    _getTimeMotivation(),
                    style: const TextStyle(color: Color(0xFFF8F9FF), fontSize: 14, height: 1.4),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ─── PAGE 5: PROGRAM GENERATED ───
  Widget _buildProgramPage() {
    return Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          _buildAnimatedEmoji('✨', size: 72),
          const SizedBox(height: 24),
          const Text(
            'Votre programme\nest prêt !',
            textAlign: TextAlign.center,
            style: TextStyle(
              color: Color(0xFFF8F9FF),
              fontSize: 32,
              fontWeight: FontWeight.w800,
              height: 1.2,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            '我们的课程计划准备好了！',
            style: TextStyle(color: Color(0xFFE8163C), fontSize: 16),
          ),
          const SizedBox(height: 40),
          _buildProgramCard('🎯', 'Objectif', _getGoalLabel()),
          const SizedBox(height: 10),
          _buildProgramCard('📊', 'Niveau de départ', _getLevelLabel()),
          const SizedBox(height: 10),
          _buildProgramCard('⏱️', 'Objectif quotidien', '$_dailyMinutes minutes/jour'),
          const SizedBox(height: 10),
          _buildProgramCard('🗓️', 'Durée estimée', _getEstimatedDuration()),
          const SizedBox(height: 10),
          _buildProgramCard('📚', 'Première leçon', 'Salutations en mandarin'),
        ],
      ),
    );
  }

  Widget _buildProgramCard(String emoji, String label, String value) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: const Color(0xFF1A1A26),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFF2A2A3A)),
      ),
      child: Row(
        children: [
          Text(emoji, style: const TextStyle(fontSize: 20)),
          const SizedBox(width: 12),
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(label, style: const TextStyle(color: Color(0xFF9A9AB0), fontSize: 11)),
              Text(
                value,
                style: const TextStyle(
                  color: Color(0xFFF8F9FF),
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  // ─── HELPERS ───
  Widget _buildAnimatedEmoji(String emoji, {double size = 64}) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.5, end: 1.0),
      duration: const Duration(milliseconds: 600),
      curve: Curves.elasticOut,
      builder: (context, value, child) {
        return Transform.scale(scale: value, child: child);
      },
      child: Text(emoji, style: TextStyle(fontSize: size)),
    );
  }

  Widget _buildFeatureRow(String emoji, String text) {
    return Row(
      children: [
        Container(
          width: 40,
          height: 40,
          decoration: BoxDecoration(
            color: const Color(0xFF1A1A26),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Center(child: Text(emoji, style: const TextStyle(fontSize: 20))),
        ),
        const SizedBox(width: 12),
        Text(
          text,
          style: const TextStyle(color: Color(0xFFF8F9FF), fontSize: 15),
        ),
      ],
    );
  }

  String _getTimeMotivation() {
    if (_dailyMinutes <= 5) return 'Parfait pour commencer ! 5 min/jour = HSK 1 en 6 mois.';
    if (_dailyMinutes <= 10) return 'Un bon rythme ! 10 min/jour = HSK 1 en 3 mois.';
    if (_dailyMinutes <= 15) return 'Excellent ! 15 min/jour = HSK 2 en 6 mois.';
    if (_dailyMinutes <= 20) return 'Ambitieux ! 20 min/jour = HSK 3 en 8 mois.';
    return 'Très motivé ! 30 min/jour = conversationnel en 1 an.';
  }

  String _getGoalLabel() => _goals
      .firstWhere((g) => g['value'] == _selectedGoal, orElse: () => _goals.first)['label'] ?? '';

  String _getLevelLabel() => _levels
      .firstWhere((l) => l['value'] == _selectedLevel, orElse: () => _levels.first)['label'] ?? '';

  String _getEstimatedDuration() {
    final months = (30 / (_dailyMinutes / 5)).round();
    return '$months mois pour HSK 1 (150 mots)';
  }
}
