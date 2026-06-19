import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../../../../core/theme/app_theme.dart';
import '../../../../shared/widgets/manda_card.dart';

class LeaderboardPage extends StatefulWidget {
  const LeaderboardPage({super.key});

  @override
  State<LeaderboardPage> createState() => _LeaderboardPageState();
}

class _LeaderboardPageState extends State<LeaderboardPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<_LeagueData> _leagues = [
    _LeagueData(
      name: 'Bronze',
      icon: '🥉',
      color: const Color(0xFFCD7F32),
      gradient: const LinearGradient(
        colors: [Color(0xFFCD7F32), Color(0xFF8B5A2B)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    ),
    _LeagueData(
      name: 'Argent',
      icon: '🥈',
      color: const Color(0xFFC0C0C0),
      gradient: const LinearGradient(
        colors: [Color(0xFFC0C0C0), Color(0xFF808080)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    ),
    _LeagueData(
      name: 'Or',
      icon: '🥇',
      color: AppColors.gold,
      gradient: AppColors.goldGradient,
    ),
    _LeagueData(
      name: 'Platine',
      icon: '💎',
      color: const Color(0xFF00BFFF),
      gradient: const LinearGradient(
        colors: [Color(0xFF00BFFF), Color(0xFF1E3A8A)],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      ),
    ),
  ];

  static const List<_PlayerData> _players = [
    _PlayerData(name: 'LingMaster', initials: 'LM', xp: 4850, level: 25, color: Color(0xFF9B59B6)),
    _PlayerData(name: 'HanziQueen', initials: 'HQ', xp: 4320, level: 22, color: Color(0xFFE8163C)),
    _PlayerData(name: 'DragonLearner', initials: 'DL', xp: 3980, level: 20, color: Color(0xFFFFB800)),
    _PlayerData(name: 'PinyinPro', initials: 'PP', xp: 3650, level: 18, color: Color(0xFF2ECC71)),
    _PlayerData(name: 'ChenWei', initials: 'CW', xp: 3200, level: 16, color: Color(0xFF3498DB)),
    _PlayerData(name: 'MarieL', initials: 'ML', xp: 2980, level: 15, color: Color(0xFFE67E22)),
    _PlayerData(name: 'Vous', initials: 'Vs', xp: 2740, level: 12, color: Color(0xFFE8163C), isCurrentUser: true),
    _PlayerData(name: 'ToneMaster', initials: 'TM', xp: 2510, level: 13, color: Color(0xFF1ABC9C)),
    _PlayerData(name: 'SophieM', initials: 'SM', xp: 2300, level: 12, color: Color(0xFFFF6B9D)),
    _PlayerData(name: 'LiuYang', initials: 'LY', xp: 2100, level: 11, color: Color(0xFF8E44AD)),
    _PlayerData(name: 'AlexF', initials: 'AF', xp: 1950, level: 10, color: Color(0xFF27AE60)),
    _PlayerData(name: 'WangFang', initials: 'WF', xp: 1820, level: 9, color: Color(0xFF2980B9)),
    _PlayerData(name: 'BenoitR', initials: 'BR', xp: 1700, level: 9, color: Color(0xFFD35400)),
    _PlayerData(name: 'ZhaoLei', initials: 'ZL', xp: 1580, level: 8, color: Color(0xFF8E44AD)),
    _PlayerData(name: 'ClaraB', initials: 'CB', xp: 1460, level: 8, color: Color(0xFFE91E63)),
    _PlayerData(name: 'MingXiao', initials: 'MX', xp: 1340, level: 7, color: Color(0xFF00BCD4)),
    _PlayerData(name: 'JulienD', initials: 'JD', xp: 1220, level: 7, color: Color(0xFF795548)),
    _PlayerData(name: 'XiuLan', initials: 'XL', xp: 1100, level: 6, color: Color(0xFF607D8B)),
    _PlayerData(name: 'EmmaP', initials: 'EP', xp: 980, level: 6, color: Color(0xFFFF5722)),
    _PlayerData(name: 'HaoRan', initials: 'HR', xp: 870, level: 5, color: Color(0xFF009688)),
    _PlayerData(name: 'LucasT', initials: 'LT', xp: 760, level: 5, color: Color(0xFF3F51B5)),
    _PlayerData(name: 'YueYing', initials: 'YY', xp: 650, level: 4, color: Color(0xFFFF9800)),
    _PlayerData(name: 'MathieuC', initials: 'MC', xp: 540, level: 4, color: Color(0xFF4CAF50)),
    _PlayerData(name: 'BaiFeng', initials: 'BF', xp: 430, level: 3, color: Color(0xFF9C27B0)),
    _PlayerData(name: 'CamilleR', initials: 'CR', xp: 350, level: 3, color: Color(0xFFE91E63)),
    _PlayerData(name: 'DongHui', initials: 'DH', xp: 280, level: 2, color: Color(0xFF2196F3)),
    _PlayerData(name: 'AnaïsV', initials: 'AV', xp: 220, level: 2, color: Color(0xFFFF5722)),
    _PlayerData(name: 'QianLong', initials: 'QL', xp: 170, level: 2, color: Color(0xFF8BC34A)),
    _PlayerData(name: 'FlorenceB', initials: 'FB', xp: 130, level: 1, color: Color(0xFF00BCD4)),
    _PlayerData(name: 'HuaMin', initials: 'HM', xp: 100, level: 1, color: Color(0xFFFF9800)),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 4, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
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
          'Classements',
          style: TextStyle(
            color: AppColors.textOnDark,
            fontSize: 18,
            fontWeight: FontWeight.w700,
          ),
        ),
        centerTitle: true,
        actions: [
          const Padding(
            padding: EdgeInsets.only(right: 16),
            child: Icon(Icons.emoji_events, color: AppColors.gold, size: 26),
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: AppTheme.colorPrimary,
          labelColor: AppTheme.colorPrimary,
          unselectedLabelColor: AppTheme.colorTextSecondary,
          labelStyle: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
          tabs: _leagues
              .map((l) => Tab(text: '${l.icon} ${l.name}'))
              .toList(),
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: _leagues
            .map((league) => _LeagueTab(league: league, players: _players))
            .toList(),
      ),
    );
  }
}

class _LeagueTab extends StatelessWidget {
  final _LeagueData league;
  final List<_PlayerData> players;

  const _LeagueTab({required this.league, required this.players});

  @override
  Widget build(BuildContext context) {
    return ListView(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      children: [
        _buildLeagueHeader(context),
        const SizedBox(height: 16),
        _buildTop3(context),
        const SizedBox(height: 12),
        ...List.generate(
          players.length - 3,
          (i) => _buildPlayerRow(context, players[i + 3], i + 4),
        ),
        const SizedBox(height: 24),
      ],
    );
  }

  Widget _buildLeagueHeader(BuildContext context) {
    return MandaCard(
      padding: const EdgeInsets.all(16),
      gradient: league.gradient,
      child: Row(
        children: [
          Text(league.icon, style: const TextStyle(fontSize: 32)),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Ligue ${league.name}',
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    const Icon(Icons.timer_outlined, color: Colors.white70, size: 14),
                    const SizedBox(width: 4),
                    Text(
                      'Se termine dans: 3j 14h',
                      style: TextStyle(
                        color: Colors.white.withOpacity(0.8),
                        fontSize: 12,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${players.length}',
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 22,
                  fontWeight: FontWeight.w800,
                ),
              ),
              Text(
                'joueurs',
                style: TextStyle(
                  color: Colors.white.withOpacity(0.7),
                  fontSize: 11,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTop3(BuildContext context) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Expanded(child: _buildPodiumCard(players[1], 2, 90.0)),
        const SizedBox(width: 8),
        Expanded(child: _buildPodiumCard(players[0], 1, 110.0)),
        const SizedBox(width: 8),
        Expanded(child: _buildPodiumCard(players[2], 3, 75.0)),
      ],
    );
  }

  Widget _buildPodiumCard(_PlayerData player, int rank, double height) {
    const medals = {1: '🥇', 2: '🥈', 3: '🥉'};
    const podiumGradients = <int, LinearGradient>{
      1: LinearGradient(colors: [AppColors.gold, AppColors.coralOrange], begin: Alignment.topLeft, end: Alignment.bottomRight),
      2: LinearGradient(colors: [Color(0xFFC0C0C0), Color(0xFF808080)], begin: Alignment.topLeft, end: Alignment.bottomRight),
      3: LinearGradient(colors: [Color(0xFFCD7F32), Color(0xFF8B5A2B)], begin: Alignment.topLeft, end: Alignment.bottomRight),
    };

    return Container(
      height: height,
      decoration: BoxDecoration(
        gradient: podiumGradients[rank],
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: (rank == 1 ? AppColors.gold : Colors.black).withOpacity(0.3),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Text(medals[rank]!, style: const TextStyle(fontSize: 22)),
          const SizedBox(height: 4),
          CircleAvatar(
            radius: 18,
            backgroundColor: Colors.white.withOpacity(0.3),
            child: Text(
              player.initials,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 11,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          const SizedBox(height: 4),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 4),
            child: Text(
              player.name,
              textAlign: TextAlign.center,
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 10,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          Text(
            '${player.xp} XP',
            style: TextStyle(
              color: Colors.white.withOpacity(0.85),
              fontSize: 10,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPlayerRow(BuildContext context, _PlayerData player, int rank) {
    final isCurrentUser = player.isCurrentUser;
    return Container(
      margin: const EdgeInsets.only(bottom: 6),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
      decoration: BoxDecoration(
        color: isCurrentUser
            ? AppTheme.colorPrimary.withOpacity(0.15)
            : AppTheme.colorSurface,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: isCurrentUser
              ? AppTheme.colorPrimary.withOpacity(0.5)
              : AppTheme.colorBorder,
          width: 1,
        ),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 30,
            child: Text(
              '#$rank',
              style: TextStyle(
                color: AppTheme.colorTextSecondary,
                fontSize: 13,
                fontWeight: FontWeight.w600,
              ),
            ),
          ),
          const SizedBox(width: 10),
          CircleAvatar(
            radius: 18,
            backgroundColor: player.color,
            child: Text(
              player.initials,
              style: const TextStyle(
                color: Colors.white,
                fontSize: 11,
                fontWeight: FontWeight.w700,
              ),
            ),
          ),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Text(
                      player.name,
                      style: TextStyle(
                        color: isCurrentUser
                            ? AppTheme.colorPrimary
                            : AppTheme.colorTextPrimary,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    if (isCurrentUser) ...[
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppTheme.colorPrimary.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          'Vous',
                          style: TextStyle(
                            color: AppTheme.colorPrimary,
                            fontSize: 9,
                            fontWeight: FontWeight.w700,
                          ),
                        ),
                      ),
                    ],
                  ],
                ),
                Text(
                  'Niveau ${player.level}',
                  style: TextStyle(
                    color: AppTheme.colorTextSecondary,
                    fontSize: 11,
                  ),
                ),
              ],
            ),
          ),
          Column(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${player.xp}',
                style: const TextStyle(
                  color: AppColors.gold,
                  fontSize: 14,
                  fontWeight: FontWeight.w700,
                ),
              ),
              Text(
                'XP sem.',
                style: TextStyle(
                  color: AppTheme.colorTextSecondary,
                  fontSize: 10,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _LeagueData {
  final String name;
  final String icon;
  final Color color;
  final LinearGradient gradient;

  const _LeagueData({
    required this.name,
    required this.icon,
    required this.color,
    required this.gradient,
  });
}

class _PlayerData {
  final String name;
  final String initials;
  final int xp;
  final int level;
  final Color color;
  final bool isCurrentUser;

  const _PlayerData({
    required this.name,
    required this.initials,
    required this.xp,
    required this.level,
    required this.color,
    this.isCurrentUser = false,
  });
}
