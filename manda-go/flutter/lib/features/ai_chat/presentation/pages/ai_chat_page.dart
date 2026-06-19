import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

import '../../../../core/theme/app_theme.dart';
import '../bloc/ai_chat_bloc.dart';
import '../widgets/message_bubble_widget.dart';
import '../widgets/voice_input_widget.dart';

class AiChatPage extends StatefulWidget {
  const AiChatPage({super.key});

  @override
  State<AiChatPage> createState() => _AiChatPageState();
}

class _AiChatPageState extends State<AiChatPage> {
  final TextEditingController _textController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  bool _isVoiceMode = false;

  @override
  void dispose() {
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.colorBackground,
      appBar: _buildAppBar(context),
      body: Column(
        children: [
          _buildTeacherHeader(context),
          Expanded(
            child: BlocConsumer<AiChatBloc, AiChatState>(
              listener: (context, state) {
                if (state is AiChatMessageReceived) {
                  _scrollToBottom();
                }
              },
              builder: (context, state) {
                if (state is AiChatInitial) {
                  return _buildWelcomeScreen(context);
                }
                final messages = state is AiChatLoaded ? state.messages : [];
                return ListView.builder(
                  controller: _scrollController,
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  itemCount: messages.length,
                  itemBuilder: (context, index) => MessageBubbleWidget(
                    message: messages[index],
                  ),
                );
              },
            ),
          ),
          _buildInputSection(context),
        ],
      ),
    );
  }

  AppBar _buildAppBar(BuildContext context) {
    return AppBar(
      backgroundColor: AppTheme.colorBackground,
      title: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('MandaBot', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
          Text(
            'Professeur IA · 中文老师',
            style: TextStyle(fontSize: 11, color: AppTheme.colorTextSecondary),
          ),
        ],
      ),
      actions: [
        IconButton(
          icon: const Icon(Icons.info_outline),
          onPressed: () => _showTeacherInfo(context),
        ),
      ],
    );
  }

  Widget _buildTeacherHeader(BuildContext context) {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: AppTheme.colorSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.colorPrimary.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            width: 48,
            height: 48,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient: AppTheme.primaryGradient,
            ),
            child: const Center(child: Text('🐉', style: TextStyle(fontSize: 24))),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Mei Mei · 美美老师', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
                Text(
                  'Professeur amicale · Niveau HSK 1',
                  style: TextStyle(fontSize: 12, color: AppTheme.colorTextSecondary),
                ),
              ],
            ),
          ),
          IconButton(
            icon: Icon(_isVoiceMode ? Icons.keyboard : Icons.mic, color: AppTheme.colorPrimary),
            onPressed: () => setState(() => _isVoiceMode = !_isVoiceMode),
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomeScreen(BuildContext context) {
    return Center(
      child: Padding(
        padding: const EdgeInsets.all(32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text('🐉', style: TextStyle(fontSize: 64)),
            const SizedBox(height: 16),
            Text(
              'Bonjour ! Je suis Mei Mei, votre professeur de mandarin.',
              textAlign: TextAlign.center,
              style: Theme.of(context).textTheme.titleMedium,
            ),
            const SizedBox(height: 8),
            Text(
              'Posez-moi n\'importe quelle question en chinois ou sur le chinois !',
              textAlign: TextAlign.center,
              style: TextStyle(color: AppTheme.colorTextSecondary),
            ),
            const SizedBox(height: 24),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              alignment: WrapAlignment.center,
              children: [
                _buildSuggestionChip(context, 'Comment dire "merci" ?'),
                _buildSuggestionChip(context, 'Explique les tons'),
                _buildSuggestionChip(context, 'Pratiquons une conversation'),
                _buildSuggestionChip(context, 'Corrige ma phrase'),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSuggestionChip(BuildContext context, String text) {
    return GestureDetector(
      onTap: () {
        _textController.text = text;
        _sendMessage(text);
      },
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: AppTheme.colorSurface,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: AppTheme.colorPrimary.withOpacity(0.4)),
        ),
        child: Text(text, style: TextStyle(fontSize: 13, color: AppTheme.colorTextPrimary)),
      ),
    );
  }

  Widget _buildInputSection(BuildContext context) {
    if (_isVoiceMode) {
      return const VoiceInputWidget();
    }
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 8, 16, 24),
      decoration: BoxDecoration(
        color: AppTheme.colorBackground,
        border: Border(top: BorderSide(color: AppTheme.colorSurface)),
      ),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _textController,
              maxLines: null,
              style: TextStyle(color: AppTheme.colorTextPrimary),
              decoration: InputDecoration(
                hintText: 'Écrivez en français ou en chinois...',
                filled: true,
                fillColor: AppTheme.colorSurface,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(24),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
              ),
              onSubmitted: _sendMessage,
            ),
          ),
          const SizedBox(width: 8),
          GestureDetector(
            onTap: () => _sendMessage(_textController.text),
            child: Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: AppTheme.primaryGradient,
              ),
              child: const Icon(Icons.send_rounded, color: Colors.white, size: 20),
            ),
          ),
        ],
      ),
    );
  }

  void _sendMessage(String text) {
    if (text.trim().isEmpty) return;
    context.read<AiChatBloc>().add(AiChatSendMessage(text.trim()));
    _textController.clear();
  }

  void _showTeacherInfo(BuildContext context) {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppTheme.colorSurface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (context) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            const Text('Changer de professeur', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            _buildTeacherOption('Mei Mei 美美', 'Amicale et encourageante', '😊', isSelected: true),
            _buildTeacherOption('Liu Laoshi 刘老师', 'Stricte et méticuleuse', '📚'),
            _buildTeacherOption('Master Chen 陈大师', 'Gamifiée et dynamique', '🎮'),
          ],
        ),
      ),
    );
  }

  Widget _buildTeacherOption(String name, String description, String emoji, {bool isSelected = false}) {
    return ListTile(
      leading: Text(emoji, style: const TextStyle(fontSize: 28)),
      title: Text(name, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Text(description),
      trailing: isSelected ? Icon(Icons.check_circle, color: AppTheme.colorPrimary) : null,
      onTap: () => Navigator.pop(context),
    );
  }
}
