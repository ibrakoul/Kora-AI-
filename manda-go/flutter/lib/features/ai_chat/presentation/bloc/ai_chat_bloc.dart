import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:equatable/equatable.dart';

// Events
abstract class AiChatEvent extends Equatable {
  const AiChatEvent();

  @override
  List<Object?> get props => [];
}

class AiChatSendMessage extends AiChatEvent {
  final String text;
  const AiChatSendMessage(this.text);

  @override
  List<Object?> get props => [text];
}

class AiChatSendVoice extends AiChatEvent {
  final String audioPath;
  const AiChatSendVoice(this.audioPath);

  @override
  List<Object?> get props => [audioPath];
}

class AiChatClearHistory extends AiChatEvent {}

// States
abstract class AiChatState extends Equatable {
  const AiChatState();

  @override
  List<Object?> get props => [];
}

class AiChatInitial extends AiChatState {}

class AiChatLoading extends AiChatState {
  final List<ChatMessage> messages;
  const AiChatLoading(this.messages);

  @override
  List<Object?> get props => [messages];
}

class AiChatLoaded extends AiChatState {
  final List<ChatMessage> messages;
  const AiChatLoaded(this.messages);

  @override
  List<Object?> get props => [messages];
}

class AiChatMessageReceived extends AiChatLoaded {
  const AiChatMessageReceived(super.messages);
}

class AiChatError extends AiChatState {
  final String message;
  final List<ChatMessage> previousMessages;
  const AiChatError(this.message, this.previousMessages);

  @override
  List<Object?> get props => [message];
}

// Model
class ChatMessage extends Equatable {
  final String id;
  final String content;
  final bool isUser;
  final DateTime timestamp;
  final String? correction;
  final String? pinyin;
  final bool isLoading;

  const ChatMessage({
    required this.id,
    required this.content,
    required this.isUser,
    required this.timestamp,
    this.correction,
    this.pinyin,
    this.isLoading = false,
  });

  @override
  List<Object?> get props => [id, content, isUser, timestamp];
}

// BLoC
class AiChatBloc extends Bloc<AiChatEvent, AiChatState> {
  AiChatBloc() : super(AiChatInitial()) {
    on<AiChatSendMessage>(_onSendMessage);
    on<AiChatSendVoice>(_onSendVoice);
    on<AiChatClearHistory>(_onClearHistory);
  }

  Future<void> _onSendMessage(AiChatSendMessage event, Emitter<AiChatState> emit) async {
    final currentMessages = state is AiChatLoaded ? (state as AiChatLoaded).messages : <ChatMessage>[];

    final userMessage = ChatMessage(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      content: event.text,
      isUser: true,
      timestamp: DateTime.now(),
    );

    final loadingMessage = ChatMessage(
      id: 'loading',
      content: '',
      isUser: false,
      timestamp: DateTime.now(),
      isLoading: true,
    );

    emit(AiChatLoading([...currentMessages, userMessage, loadingMessage]));

    try {
      // TODO: Call AI service repository
      await Future.delayed(const Duration(seconds: 2));

      final aiResponse = ChatMessage(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        content: '你好！C\'est une bonne question. En mandarin, on dit... (réponse IA simulée)',
        isUser: false,
        timestamp: DateTime.now(),
        pinyin: 'Nǐ hǎo!',
      );

      final updatedMessages = [...currentMessages, userMessage, aiResponse];
      emit(AiChatMessageReceived(updatedMessages));
    } catch (e) {
      emit(AiChatError(e.toString(), [...currentMessages, userMessage]));
    }
  }

  Future<void> _onSendVoice(AiChatSendVoice event, Emitter<AiChatState> emit) async {
    // TODO: Implement voice to text then chat
  }

  void _onClearHistory(AiChatClearHistory event, Emitter<AiChatState> emit) {
    emit(AiChatInitial());
  }
}
