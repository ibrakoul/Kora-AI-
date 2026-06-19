-- =============================================================
-- MANDA GO — Données Initiales (Seed)
-- =============================================================

-- =============================================================
-- COURS HSK
-- =============================================================
INSERT INTO courses (hsk_level, title, title_zh, description, total_lessons, total_vocabulary, estimated_hours, is_published) VALUES
(1, 'HSK 1 — Débutant', 'HSK一级', '150 mots essentiels, bases du mandarin. Idéal pour les débutants absolus.', 20, 150, 10, TRUE),
(2, 'HSK 2 — Élémentaire', 'HSK二级', '300 mots, situations quotidiennes. Commandez au restaurant, demandez votre chemin.', 25, 300, 15, TRUE),
(3, 'HSK 3 — Intermédiaire', 'HSK三级', '600 mots, communication courante. Exprimez-vous sur vos loisirs et votre travail.', 30, 600, 25, TRUE),
(4, 'HSK 4 — Intermédiaire Avancé', 'HSK四级', '1200 mots, sujets variés. Débattez, exprimez des opinions nuancées.', 35, 1200, 40, TRUE),
(5, 'HSK 5 — Avancé', 'HSK五级', '2500 mots, niveau courant. Lisez journaux et littérature contemporaine.', 40, 2500, 70, FALSE),
(6, 'HSK 6 — Maîtrise', 'HSK六级', '5000+ mots, niveau quasi-natif. Compréhension de documents complexes.', 45, 5000, 120, FALSE),
(7, 'HSK 7-9 — Expert', 'HSK七至九级', 'Niveau expert et professionnel. Certification académique et professionnelle.', 50, 11000, 200, FALSE);

-- =============================================================
-- VOCABULAIRE HSK 1 (50 premiers mots)
-- =============================================================
INSERT INTO vocabulary (hanzi, pinyin, meaning_fr, meaning_en, hsk_level, stroke_count, radical, frequency_rank) VALUES
('你好', 'nǐ hǎo', 'Bonjour', 'Hello', 1, NULL, '人', 1),
('我', 'wǒ', 'Je/Moi', 'I/Me', 1, 7, '手', 2),
('你', 'nǐ', 'Tu/Toi', 'You', 1, 7, '人', 3),
('他', 'tā', 'Il/Lui', 'He/Him', 1, 5, '人', 4),
('她', 'tā', 'Elle', 'She/Her', 1, 6, '女', 5),
('们', 'men', 'Pluriel (suffixe)', 'Plural marker', 1, 5, '人', 6),
('是', 'shì', 'Être', 'To be', 1, 9, '日', 7),
('不', 'bù', 'Non/Pas', 'No/Not', 1, 4, '一', 8),
('有', 'yǒu', 'Avoir', 'To have', 1, 6, '月', 9),
('没有', 'méi yǒu', 'Ne pas avoir', 'Not have', 1, NULL, '水', 10),
('好', 'hǎo', 'Bien/Bon', 'Good/Well', 1, 6, '女', 11),
('大', 'dà', 'Grand', 'Big/Large', 1, 3, '大', 12),
('小', 'xiǎo', 'Petit', 'Small/Little', 1, 3, '小', 13),
('多', 'duō', 'Beaucoup', 'Many/Much', 1, 6, '夕', 14),
('少', 'shǎo', 'Peu', 'Few/Little', 1, 4, '小', 15),
('中国', 'zhōng guó', 'Chine', 'China', 1, NULL, '口', 16),
('人', 'rén', 'Personne', 'Person', 1, 2, '人', 17),
('日本', 'rì běn', 'Japon', 'Japan', 1, NULL, '日', 18),
('苹果', 'píng guǒ', 'Pomme', 'Apple', 1, NULL, '艹', 19),
('水', 'shuǐ', 'Eau', 'Water', 1, 4, '水', 20),
('饭', 'fàn', 'Riz cuit/Repas', 'Rice/Meal', 1, 7, '食', 21),
('茶', 'chá', 'Thé', 'Tea', 1, 9, '艹', 22),
('猫', 'māo', 'Chat', 'Cat', 1, 11, '犬', 23),
('狗', 'gǒu', 'Chien', 'Dog', 1, 8, '犬', 24),
('书', 'shū', 'Livre', 'Book', 1, 4, '曰', 25),
('学', 'xué', 'Apprendre/Étudier', 'Learn/Study', 1, 16, '子', 26),
('汉语', 'hàn yǔ', 'Chinois (langue)', 'Chinese language', 1, NULL, '水', 27),
('英语', 'yīng yǔ', 'Anglais (langue)', 'English language', 1, NULL, '艹', 28),
('说', 'shuō', 'Parler/Dire', 'Speak/Say', 1, 9, '言', 29),
('听', 'tīng', 'Écouter', 'Listen', 1, 7, '耳', 30),
('看', 'kàn', 'Regarder/Voir', 'Look/See', 1, 9, '目', 31),
('吃', 'chī', 'Manger', 'Eat', 1, 6, '口', 32),
('喝', 'hē', 'Boire', 'Drink', 1, 12, '口', 33),
('去', 'qù', 'Aller', 'Go', 1, 5, '厶', 34),
('来', 'lái', 'Venir', 'Come', 1, 7, '木', 35),
('工作', 'gōng zuò', 'Travail/Travailler', 'Work', 1, NULL, '工', 36),
('学校', 'xué xiào', 'École', 'School', 1, NULL, '子', 37),
('家', 'jiā', 'Maison/Famille', 'Home/Family', 1, 10, '宀', 38),
('朋友', 'péng yǒu', 'Ami(e)', 'Friend', 1, NULL, '月', 39),
('老师', 'lǎo shī', 'Professeur', 'Teacher', 1, NULL, '土', 40),
('学生', 'xué shēng', 'Étudiant(e)', 'Student', 1, NULL, '子', 41),
('医生', 'yī shēng', 'Médecin', 'Doctor', 1, NULL, '匚', 42),
('钱', 'qián', 'Argent', 'Money', 1, 10, '金', 43),
('时间', 'shí jiān', 'Temps', 'Time', 1, NULL, '日', 44),
('今天', 'jīn tiān', 'Aujourd''hui', 'Today', 1, NULL, '人', 45),
('明天', 'míng tiān', 'Demain', 'Tomorrow', 1, NULL, '日', 46),
('昨天', 'zuó tiān', 'Hier', 'Yesterday', 1, NULL, '日', 47),
('一', 'yī', 'Un', 'One', 1, 1, '一', 48),
('二', 'èr', 'Deux', 'Two', 1, 2, '二', 49),
('三', 'sān', 'Trois', 'Three', 1, 3, '一', 50);

-- =============================================================
-- LIGUES
-- =============================================================
INSERT INTO leagues (tier, name, name_zh, min_rank_in_group, max_rank_in_group, color_hex, is_premium_required) VALUES
('bronze',   'Ligue Bronze',    '铜牌联赛',   null, 30, '#CD7F32', FALSE),
('silver',   'Ligue Argent',    '银牌联赛',   null, 30, '#C0C0C0', FALSE),
('gold',     'Ligue Or',        '金牌联赛',   null, 30, '#FFD700', FALSE),
('platinum', 'Ligue Platine',   '白金联赛',   null, 30, '#E5E4E2', TRUE),
('diamond',  'Ligue Diamant',   '钻石联赛',   null, 30, '#B9F2FF', TRUE),
('obsidian', 'Ligue Obsidienne','黑曜石联赛', null, 30, '#3D1F5F', TRUE),
('dragon',   'Ligue Dragon',    '龙之联赛',   null, 30, '#E8163C', TRUE),
('legend',   'Ligue Légende',   '传奇联赛',   null, 30, '#FFB800', TRUE);

-- =============================================================
-- ACHIEVEMENTS (20 badges de base)
-- =============================================================
INSERT INTO achievements (name, name_zh, description, type, condition_type, condition_value, xp_reward, rarity) VALUES
('Premier Pas', '第一步', 'Compléter votre première leçon', 'lessons', 'lessons_completed', 1, 50, 'common'),
('Explorateur', '探索者', 'Compléter 10 leçons', 'lessons', 'lessons_completed', 10, 100, 'common'),
('Aventurier', '冒险家', 'Compléter 50 leçons', 'lessons', 'lessons_completed', 50, 250, 'rare'),
('Maître des Leçons', '课程大师', 'Compléter 200 leçons', 'lessons', 'lessons_completed', 200, 500, 'epic'),
('Flamme', '火焰', 'Maintenir un streak de 7 jours', 'streak', 'current_streak', 7, 100, 'common'),
('Feu Sacré', '圣火', 'Maintenir un streak de 30 jours', 'streak', 'current_streak', 30, 300, 'rare'),
('Dragon de Feu', '火龙', 'Maintenir un streak de 100 jours', 'streak', 'current_streak', 100, 1000, 'legendary'),
('Apprenti', '学徒', 'Atteindre 1 000 XP', 'xp', 'xp_total', 1000, 50, 'common'),
('Savant', '学者', 'Atteindre 10 000 XP', 'xp', 'xp_total', 10000, 200, 'rare'),
('Grand Maître', '大师', 'Atteindre 100 000 XP', 'xp', 'xp_total', 100000, 1000, 'legendary'),
('Vocabulaire Débutant', '词汇初学', 'Apprendre 50 mots', 'vocabulary', 'vocabulary_mastered', 50, 100, 'common'),
('Vocabulaire HSK 1', 'HSK一级词汇', 'Maîtriser 150 mots HSK 1', 'vocabulary', 'vocabulary_mastered', 150, 300, 'rare'),
('Phonétique', '发音达人', 'Obtenir 90%+ en prononciation 10 fois', 'pronunciation', 'high_score_pronunciation', 10, 200, 'rare'),
('Maître des Tons', '声调大师', 'Score parfait sur les 4 tons', 'pronunciation', 'perfect_tone_score', 1, 300, 'epic'),
('Champion Bronze', '铜牌冠军', 'Finir 1er en Ligue Bronze', 'social', 'league_first_place', 1, 200, 'rare'),
('Champion Dragon', '龙之冠军', 'Finir 1er en Ligue Dragon', 'social', 'league_dragon_first', 1, 2000, 'legendary'),
('Joueur', '游戏玩家', 'Jouer 10 mini-jeux', 'special', 'mini_games_played', 10, 100, 'common'),
('Accro aux Jeux', '游戏达人', 'Jouer 100 mini-jeux', 'special', 'mini_games_played', 100, 500, 'epic'),
('Fondateur', '创始人', 'Être parmi les 10 000 premiers utilisateurs', 'special', 'early_adopter', 10000, 1000, 'legendary'),
('Ambassadeur', '大使', 'Parrainer 5 amis', 'social', 'referrals', 5, 500, 'rare');

-- =============================================================
-- SAISON ACTIVE
-- =============================================================
INSERT INTO league_seasons (season_number, start_date, end_date, is_active) VALUES
(1, CURRENT_DATE, CURRENT_DATE + INTERVAL '7 days', TRUE);
