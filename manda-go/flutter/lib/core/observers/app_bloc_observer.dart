import 'package:flutter/foundation.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class AppBlocObserver extends BlocObserver {
  const AppBlocObserver();

  @override
  void onCreate(BlocBase<dynamic> bloc) {
    super.onCreate(bloc);
    if (kDebugMode) {
      debugPrint('[BLoC] onCreate -- ${bloc.runtimeType}');
    }
  }

  @override
  void onClose(BlocBase<dynamic> bloc) {
    super.onClose(bloc);
    if (kDebugMode) {
      debugPrint('[BLoC] onClose -- ${bloc.runtimeType}');
    }
  }

  @override
  void onChange(BlocBase<dynamic> bloc, Change<dynamic> change) {
    super.onChange(bloc, change);
    if (kDebugMode) {
      debugPrint(
        '[BLoC] onChange -- ${bloc.runtimeType}\n'
        '  Current: ${change.currentState.runtimeType}\n'
        '  Next:    ${change.nextState.runtimeType}',
      );
    }
  }

  @override
  void onEvent(Bloc<dynamic, dynamic> bloc, Object? event) {
    super.onEvent(bloc, event);
    if (kDebugMode) {
      debugPrint('[BLoC] onEvent -- ${bloc.runtimeType}: ${event.runtimeType}');
    }
  }

  @override
  void onTransition(
    Bloc<dynamic, dynamic> bloc,
    Transition<dynamic, dynamic> transition,
  ) {
    super.onTransition(bloc, transition);
    if (kDebugMode) {
      debugPrint(
        '[BLoC] onTransition -- ${bloc.runtimeType}\n'
        '  Event:   ${transition.event.runtimeType}\n'
        '  Current: ${transition.currentState.runtimeType}\n'
        '  Next:    ${transition.nextState.runtimeType}',
      );
    }
  }

  @override
  void onError(BlocBase<dynamic> bloc, Object error, StackTrace stackTrace) {
    super.onError(bloc, error, stackTrace);
    debugPrint('[BLoC] onError -- ${bloc.runtimeType}: $error');
    if (kDebugMode) {
      debugPrint('Stack trace:\n$stackTrace');
    }
  }
}
