import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';

import '../../../../shared/widgets/manda_card.dart';
import '../../data/models/lesson_model.dart';
import '../bloc/lesson_bloc.dart';

class LessonMapPage extends StatefulWidget {
  const LessonMapPage({super.key});

  @override
  State<LessonMapPage> createState() => _LessonMapPageState();
}

class _LessonMapPageState extends State<LessonMapPage>
    with SingleTickerProviderStateMixin {
  late TabController _tabController;
  int _selectedHsk = 1;

  static const _hskLevels = [1, 2, 3, 4, 5, 6];
  static const _hskColors = [
    Color(0xFFE8163C), // HSK 1 - Red
    Color(0xFFFF6B35), // HSK 2 - Orange
    Color(0xFFFFB800), // HSK 3 - Gold
    Color(0xFF2ECC71), // HSK 4 - Green
    Color(0xFF3498DB), // HSK 5 - Blue
    Color(0xFF9B59B6), // HSK 6 - Purple
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: _hskLevels.length, vsync: this);
    _tabController.addListener(() {
      if (!_tabController.indexIsChanging) {
        setState(() => _selectedHsk = _hskLevels[_tabController.index]);
      }
    });
    context.read<LessonBloc>().add(const LessonLoadRequested('hsk1'));
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0A0A0F),
      body: NestedScrollView(
        headerSliverBuilder: (context, innerBoxIsScrolled) => [
          _buildAppBar(context, innerBoxIsScrolled),
        ],
        body: TabBarView(
          controller: _tabController,
          children: _hskLevels.map((hsk) => _buildHskTab(hsk)).toList(),
        ),
      ),
    );
  }

  SliverAppBar _buildAppBar(BuildContext context, bool innerBoxIsScrolled) {
    return SliverAppBar(
      backgroundColor: const Color(0xFF0A0A0F),
      expandedHeight: 140,
      pinned: true,
      floating: false,
      forceElevated: innerBoxIsScrolled,
      flexibleSpace: FlexibleSpaceBar(
        background: Container(
          padding: const EdgeInsets.fromLTRB(20, 60, 20, 0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Parcours',
                style: TextStyle(
                  color: Color(0xFFF8F9FF),
                  fontSize: 28,
                  fontWeight: FontWeight.w800,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'HSK $_selectedHsk · 学习路线',
                style: const TextStyle(color: Color(0xFF9A9AB0), fontSize: 14),
              ),
            ],
          ),
        ),
      ),
      bottom: TabBar(
        controller: _tabController,
        isScrollable: true,
        tabAlignment: TabAlignment.start,
        labelStyle: const TextStyle(fontWeight: FontWeight.w700, fontSize: 13),
        unselectedLabelStyle: const TextStyle(fontWeight: FontWeight.normal, fontSize: 13),
        labelColor: const Color(0xFFE8163C),
        unselectedLabelColor: const Color(0xFF9A9AB0),
        indicatorColor: const Color(0xFFE8163C),
        indicatorWeight: 2,
        dividerColor: const Color(0xFF2A2A3A),
        tabs: _hskLevels.map((hsk) => Tab(
          text: 'HSK $hsk',
          icon: hsk > 3
              ? const Icon(Icons.lock_outline, size: 14)
              : null,
        )).toList(),
      ),
    );
  }

  Widget _buildHskTab(int hsk) {
    if (hsk > 3) {
      return _buildLockedTab(hsk);
    }

    return BlocBuilder<LessonBloc, LessonState>(
      builder: (context, state) {
        if (state is LessonLoading) {
          return const Center(
            child: CircularProgressIndicator(color: Color(0xFFE8163C)),
          );
        }

        final lessons = hsk == 1
            ? LessonModel.getMockLessons()
            : List.generate(20, (i) => LessonModel(
                id: 'hsk$hsk-lesson-$i',
                title: 'Leçon ${i + 1}',
                titleZh: '第${i + 1}课',
                type: 'vocabulary',
                hskLevel: hsk,
                orderIndex: i + 1,
                isPremium: hsk > 1,
              ));

        return _buildLessonGrid(lessons, hsk);
      },
    );
  }

  Widget _buildLessonGrid(List<LessonModel> lessons, int hsk) {
    final color = _hskColors[(hsk - 1).clamp(0, 5)];
    final unlockedCount = hsk == 1 ? 6 : 0;

    return CustomScrollView(
      slivers: [
        SliverPadding(
          padding: const EdgeInsets.all(20),
          sliver: SliverToBoxAdapter(
            child: _buildHskHeader(hsk, color, lessons.length, unlockedCount),
          ),
        ),
        SliverPadding(
          padding: const EdgeInsets.symmetric(horizontal: 20),
          sliver: SliverGrid(
            gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
              crossAxisCount: 4,
              crossAxisSpacing: 12,
              mainAxisSpacing: 16,
              childAspectRatio: 0.85,
            ),
            delegate: SliverChildBuilderDelegate(
              (context, index) => _buildLessonNode(lessons[index], index, color, unlockedCount),
              childCount: lessons.length,
            ),
          ),
        ),
        const SliverPadding(padding: EdgeInsets.only(bottom: 40)),
      ],
    );
  }

  Widget _buildHskHeader(int hsk, Color color, int total, int unlocked) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [color.withOpacity(0.15), color.withOpacity(0.05)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Center(
              child: Text(
                'H$hsk',
                style: TextStyle(
                  color: color,
                  fontSize: 16,
                  fontWeight: FontWeight.w900,
                ),
              ),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'HSK $hsk — ${_getHskDescription(hsk)}',
                  style: const TextStyle(
                    color: Color(0xFFF8F9FF),
                    fontWeight: FontWeight.w700,
                    fontSize: 14,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  '$unlocked/$total leçons débloquées · ${_getHskVocab(hsk)} mots',
                  style: const TextStyle(color: Color(0xFF9A9AB0), fontSize: 12),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLessonNode(LessonModel lesson, int index, Color color, int unlockedCount) {
    final isCompleted = index < 2; // mock: first 2 completed
    final isCurrent = index == 2; // mock: 3rd is current
    final isLocked = index >= unlockedCount;

    return GestureDetector(
      onTap: isLocked
          ? () => _showLockedDialog(context)
          : () => context.push('/lessons/${lesson.id}', extra: lesson),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Stack(
            alignment: Alignment.center,
            children: [
              // Connector line
              if (index > 0)
                Positioned(
                  top: 0,
                  child: Container(
                    width: 2,
                    height: 10,
                    color: isCompleted
                        ? color.withOpacity(0.4)
                        : const Color(0xFF2A2A3A),
                  ),
                ),
              // Node circle
              AnimatedContainer(
                duration: const Duration(milliseconds: 300),
                width: 52,
                height: 52,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: isCompleted
                      ? color
                      : isCurrent
                          ? const Color(0xFF1A1A26)
                          : const Color(0xFF1A1A26),
                  border: Border.all(
                    color: isCompleted
                        ? color
                        : isCurrent
                            ? color
                            : const Color(0xFF2A2A3A),
                    width: isCurrent ? 3 : 2,
                  ),
                  boxShadow: isCurrent
                      ? [
                          BoxShadow(
                            color: color.withOpacity(0.5),
                            blurRadius: 12,
                            spreadRadius: 2,
                          )
                        ]
                      : null,
                ),
                child: Center(
                  child: isLocked
                      ? Icon(Icons.lock, color: const Color(0xFF9A9AB0), size: 20)
                      : isCompleted
                          ? const Icon(Icons.check, color: Colors.white, size: 22)
                          : Text(
                              lesson.thumbnailEmoji ?? '${index + 1}',
                              style: const TextStyle(fontSize: 20),
                              textAlign: TextAlign.center,
                            ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            lesson.title,
            textAlign: TextAlign.center,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              color: isLocked
                  ? const Color(0xFF9A9AB0)
                  : const Color(0xFFF8F9FF),
              fontSize: 10,
              fontWeight: isCurrent ? FontWeight.w700 : FontWeight.normal,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLockedTab(int hsk) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              width: 80,
              height: 80,
              decoration: BoxDecoration(
                color: const Color(0xFF1A1A26),
                shape: BoxShape.circle,
                border: Border.all(color: const Color(0xFF2A2A3A), width: 2),
              ),
              child: const Icon(Icons.lock_outline, color: Color(0xFF9A9AB0), size: 36),
            ),
            const SizedBox(height: 24),
            Text(
              'HSK $hsk',
              style: const TextStyle(
                color: Color(0xFFF8F9FF),
                fontSize: 24,
                fontWeight: FontWeight.w800,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'Completez HSK ${hsk - 1} pour\ndébloquer ce niveau.',
              textAlign: TextAlign.center,
              style: const TextStyle(color: Color(0xFF9A9AB0), fontSize: 15),
            ),
            const SizedBox(height: 32),
            SizedBox(
              width: double.infinity,
              child: DecoratedBox(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFE8163C), Color(0xFFC0102D)],
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: ElevatedButton(
                  onPressed: () => _tabController.animateTo(0),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.transparent,
                    shadowColor: Colors.transparent,
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: const Text(
                    'Continuer HSK 1',
                    style: TextStyle(color: Colors.white, fontWeight: FontWeight.w700),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showLockedDialog(BuildContext context) {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: const Color(0xFF1A1A26),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('🔒 Leçon verrouillée', style: TextStyle(color: Color(0xFFF8F9FF))),
        content: const Text(
          'Completez les leçons précédentes pour débloquer celle-ci.',
          style: TextStyle(color: Color(0xFF9A9AB0)),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('OK', style: TextStyle(color: Color(0xFFE8163C))),
          ),
        ],
      ),
    );
  }

  String _getHskDescription(int hsk) => switch (hsk) {
        1 => 'Débutant (150 mots)',
        2 => 'Élémentaire (300 mots)',
        3 => 'Intermédiaire (600 mots)',
        4 => 'Intermédiaire+ (1200 mots)',
        5 => 'Avancé (2500 mots)',
        _ => 'Expert (5000+ mots)',
      };

  String _getHskVocab(int hsk) => switch (hsk) {
        1 => '150',
        2 => '300',
        3 => '600',
        4 => '1200',
        5 => '2500',
        _ => '5000+',
      };
}
