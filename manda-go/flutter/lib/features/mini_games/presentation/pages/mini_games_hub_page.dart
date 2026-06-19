import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/manda_card.dart';

class MiniGamesHubPage extends StatefulWidget {
  const MiniGamesHubPage({super.key});

  @override
  State<MiniGamesHubPage> createState() => _MiniGamesHubPageState();
}

class _MiniGamesHubPageState extends State<MiniGamesHubPage> {
  String _selectedFilter = 'Tous';

  final List<String> _filters = [
    'Tous',
    'Vocabulaire',
    'Prononciation',
    'Grammaire',
    'Écriture',
    'Culture',
    'Lecture',
  ];

  static const List<_GameData> _freeGames = [
    _GameData(
      emoji: '🐉',
      name: 'Dragon Chase',
      category: 'Vocabulaire',
      stars: 2,
      badge: 'POPULAIRE',
      bestScore: 8450,
    ),
    _GameData(
      emoji: '🎵',
      name: 'Tone Tower',
      category: 'Prononciation',
      stars: 2,
      badge: 'NOUVEAU',
      bestScore: null,
    ),
    _GameData(
      emoji: '🃏',
      name: 'Manda Match',
      category: 'Vocabulaire',
      stars: 1,
      badge: null,
      bestScore: 1200,
    ),
    _GameData(
      emoji: '☔',
      name: 'Pinyin Rain',
      category: 'Prononciation',
      stars: 2,
      badge: null,
      bestScore: 3300,
    ),
    _GameData(
      emoji: '✍️',
      name: 'Stroke Master',
      category: 'Écriture',
      stars: 3,
      badge: 'POPULAIRE',
      bestScore: null,
    ),
    _GameData(
      emoji: '🛒',
      name: 'Market Rush',
      category: 'Grammaire',
      stars: 2,
      badge: 'NOUVEAU',
      bestScore: null,
    ),
    _GameData(
      emoji: '🧱',
      name: 'Grammar Builder',
      category: 'Grammaire',
      stars: 2,
      badge: null,
      bestScore: 5600,
    ),
    _GameData(
      emoji: '🏮',
      name: 'Culture Quiz',
      category: 'Culture',
      stars: 1,
      badge: null,
      bestScore: 920,
    ),
    _GameData(
      emoji: '🥷',
      name: 'Listening Ninja',
      category: 'Prononciation',
      stars: 2,
      badge: 'NOUVEAU',
      bestScore: null,
    ),
    _GameData(
      emoji: '⛓️',
      name: 'Word Chain',
      category: 'Vocabulaire',
      stars: 2,
      badge: null,
      bestScore: 2100,
    ),
    _GameData(
      emoji: '🎨',
      name: 'Hanzi Artist',
      category: 'Écriture',
      stars: 3,
      badge: 'POPULAIRE',
      bestScore: null,
    ),
    _GameData(
      emoji: '🔢',
      name: 'Number Ninja',
      category: 'Vocabulaire',
      stars: 1,
      badge: null,
      bestScore: 4400,
    ),
    _GameData(
      emoji: '📖',
      name: 'Speed Reader',
      category: 'Lecture',
      stars: 3,
      badge: null,
      bestScore: null,
    ),
    _GameData(
      emoji: '🔀',
      name: 'Sentence Scramble',
      category: 'Grammaire',
      stars: 2,
      badge: 'NOUVEAU',
      bestScore: null,
    ),
    _GameData(
      emoji: '🎤',
      name: 'Manda Karaoke',
      category: 'Culture',
      stars: 2,
      badge: 'POPULAIRE',
      bestScore: 6700,
    ),
  ];

  static const List<_GameData> _premiumGames = [
    _GameData(emoji: '🏯', name: 'Castle Defense', category: 'Vocabulaire', stars: 3, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🧩', name: 'Radical Puzzle', category: 'Écriture', stars: 3, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🎭', name: 'Drama Scene', category: 'Culture', stars: 2, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🚂', name: 'Train Express', category: 'Vocabulaire', stars: 2, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🌊', name: 'Wave Surfer', category: 'Prononciation', stars: 3, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🗺️', name: 'Map Quest', category: 'Grammaire', stars: 2, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🎪', name: 'Circus Words', category: 'Vocabulaire', stars: 1, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🔭', name: 'Star Reader', category: 'Lecture', stars: 3, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🧮', name: 'Number Sage', category: 'Grammaire', stars: 2, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🎸', name: 'Melody Match', category: 'Culture', stars: 1, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🏄', name: 'Surf Vocab', category: 'Vocabulaire', stars: 2, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🦋', name: 'Butterfly Write', category: 'Écriture', stars: 3, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🎲', name: 'Lucky Words', category: 'Vocabulaire', stars: 1, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🌐', name: 'World Tour', category: 'Culture', stars: 2, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🏋️', name: 'Grammar Gym', category: 'Grammaire', stars: 3, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🎯', name: 'Tone Sniper', category: 'Prononciation', stars: 3, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🌸', name: 'Blossom Read', category: 'Lecture', stars: 2, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🐼', name: 'Panda Speak', category: 'Prononciation', stars: 2, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🔮', name: 'Crystal Vocab', category: 'Vocabulaire', stars: 3, badge: null, bestScore: null, isPremium: true),
    _GameData(emoji: '🌙', name: 'Night Story', category: 'Culture', stars: 2, badge: null, bestScore: null, isPremium: true),
  ];

  List<_GameData> get _filteredFreeGames {
    if (_selectedFilter == 'Tous') return _freeGames;
    return _freeGames.where((g) => g.category == _selectedFilter).toList();
  }

  List<_GameData> get _filteredPremiumGames {
    if (_selectedFilter == 'Tous') return _premiumGames;
    return _premiumGames.where((g) => g.category == _selectedFilter).toList();
  }

  @override
  Widget build(BuildContext context) {
    final freeGames = _filteredFreeGames;
    final premiumGames = _filteredPremiumGames;
    final allGames = [...freeGames, ...premiumGames];

    return Scaffold(
      backgroundColor: AppTheme.colorBackground,
      appBar: AppBar(
        backgroundColor: AppTheme.colorBackground,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, color: AppColors.textOnDark),
          onPressed: () => context.pop(),
        ),
        title: const Text(
          'Mini-Jeux 🎮',
          style: TextStyle(
            color: AppColors.textOnDark,
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
        actions: [
          Container(
            margin: const EdgeInsets.only(right: 16),
            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
            decoration: BoxDecoration(
              color: AppTheme.colorPrimary.withOpacity(0.15),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: AppTheme.colorPrimary.withOpacity(0.3)),
            ),
            child: Text(
              '35 jeux',
              style: TextStyle(
                color: AppTheme.colorPrimary,
                fontSize: 12,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
        ],
      ),
      body: Column(
        children: [
          _buildFilterBar(),
          Expanded(
            child: allGames.isEmpty
                ? _buildEmptyState()
                : GridView.builder(
                    padding: const EdgeInsets.all(16),
                    gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 12,
                      mainAxisSpacing: 12,
                      childAspectRatio: 0.82,
                    ),
                    itemCount: allGames.length,
                    itemBuilder: (context, i) => _GameCard(
                      game: allGames[i],
                      onTap: () => _onGameTap(context, allGames[i]),
                    ),
                  ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterBar() {
    return Container(
      height: 44,
      margin: const EdgeInsets.only(top: 4, bottom: 4),
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16),
        itemCount: _filters.length,
        itemBuilder: (context, i) {
          final filter = _filters[i];
          final isSelected = _selectedFilter == filter;
          return GestureDetector(
            onTap: () => setState(() => _selectedFilter = filter),
            child: AnimatedContainer(
              duration: const Duration(milliseconds: 200),
              margin: const EdgeInsets.only(right: 8),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              decoration: BoxDecoration(
                color: isSelected ? AppTheme.colorPrimary : AppTheme.colorSurface,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(
                  color: isSelected ? AppTheme.colorPrimary : AppTheme.colorBorder,
                ),
              ),
              child: Text(
                filter,
                style: TextStyle(
                  color: isSelected ? Colors.white : AppTheme.colorTextSecondary,
                  fontSize: 13,
                  fontWeight: isSelected ? FontWeight.w700 : FontWeight.w400,
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text('🎮', style: TextStyle(fontSize: 48)),
          const SizedBox(height: 16),
          Text(
            'Aucun jeu dans cette catégorie',
            style: TextStyle(color: AppTheme.colorTextSecondary, fontSize: 15),
          ),
        ],
      ),
    );
  }

  void _onGameTap(BuildContext context, _GameData game) {
    if (game.isPremium) {
      _showPremiumDialog(context);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Lancement de ${game.name}...'),
          backgroundColor: AppTheme.colorSurface,
          duration: const Duration(seconds: 2),
        ),
      );
    }
  }

  void _showPremiumDialog(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.colorSurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (_) => Padding(
        padding: const EdgeInsets.all(28),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Container(
              width: 40, height: 4,
              decoration: BoxDecoration(color: AppTheme.colorBorder, borderRadius: BorderRadius.circular(2)),
            ),
            const SizedBox(height: 20),
            const Text('💎', style: TextStyle(fontSize: 44)),
            const SizedBox(height: 12),
            Text(
              'Contenu Premium',
              style: TextStyle(color: AppTheme.colorTextPrimary, fontSize: 20, fontWeight: FontWeight.w700),
            ),
            const SizedBox(height: 8),
            Text(
              'Débloquez ce jeu et 19 autres avec Manda Go Premium!',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppTheme.colorTextSecondary, fontSize: 14),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppColors.gold,
                foregroundColor: Colors.black,
                minimumSize: const Size(double.infinity, 52),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text('Passer à Premium', style: TextStyle(fontWeight: FontWeight.w700)),
            ),
            const SizedBox(height: 10),
          ],
        ),
      ),
    );
  }
}

class _GameCard extends StatelessWidget {
  final _GameData game;
  final VoidCallback onTap;

  const _GameCard({required this.game, required this.onTap});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        decoration: BoxDecoration(
          color: AppTheme.colorSurface,
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: game.isPremium
                ? AppColors.gold.withOpacity(0.3)
                : AppTheme.colorBorder,
          ),
        ),
        child: Stack(
          children: [
            Padding(
              padding: const EdgeInsets.all(14),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(game.emoji, style: const TextStyle(fontSize: 36)),
                      if (game.isPremium)
                        Container(
                          padding: const EdgeInsets.all(4),
                          decoration: BoxDecoration(
                            color: AppColors.gold.withOpacity(0.15),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.lock, color: AppColors.gold, size: 14),
                        ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  Text(
                    game.name,
                    maxLines: 2,
                    overflow: TextOverflow.ellipsis,
                    style: TextStyle(
                      color: game.isPremium
                          ? AppTheme.colorTextSecondary
                          : AppTheme.colorTextPrimary,
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    game.category,
                    style: TextStyle(
                      color: AppTheme.colorTextSecondary,
                      fontSize: 11,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: List.generate(3, (i) {
                      return Icon(
                        i < game.stars ? Icons.star_rounded : Icons.star_outline_rounded,
                        color: AppColors.gold,
                        size: 14,
                      );
                    }),
                  ),
                  const Spacer(),
                  if (game.bestScore != null)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppColors.jadeGreen.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: AppColors.jadeGreen.withOpacity(0.3)),
                      ),
                      child: Text(
                        'Meilleur: ${game.bestScore}',
                        style: const TextStyle(
                          color: AppColors.jadeGreen,
                          fontSize: 10,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                ],
              ),
            ),
            if (game.badge != null && !game.isPremium)
              Positioned(
                top: 0,
                right: 0,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
                  decoration: BoxDecoration(
                    color: game.badge == 'NOUVEAU'
                        ? AppTheme.colorPrimary
                        : AppColors.gold,
                    borderRadius: const BorderRadius.only(
                      topRight: Radius.circular(16),
                      bottomLeft: Radius.circular(10),
                    ),
                  ),
                  child: Text(
                    game.badge!,
                    style: const TextStyle(
                      color: Colors.white,
                      fontSize: 9,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 0.5,
                    ),
                  ),
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class _GameData {
  final String emoji;
  final String name;
  final String category;
  final int stars;
  final String? badge;
  final int? bestScore;
  final bool isPremium;

  const _GameData({
    required this.emoji,
    required this.name,
    required this.category,
    required this.stars,
    required this.badge,
    required this.bestScore,
    this.isPremium = false,
  });
}
