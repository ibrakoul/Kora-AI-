import 'dart:io';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../constants/app_constants.dart';
import '../errors/failures.dart';

class ApiService {
  late final Dio _dio;
  final FlutterSecureStorage _secureStorage;
  bool _isRefreshing = false;

  ApiService({required FlutterSecureStorage secureStorage})
      : _secureStorage = secureStorage {
    _dio = Dio(_buildBaseOptions());
    _setupInterceptors();
  }

  Dio get dio => _dio;

  BaseOptions _buildBaseOptions() {
    return BaseOptions(
      baseUrl: AppConstants.baseUrl,
      connectTimeout: const Duration(milliseconds: AppConstants.connectTimeout),
      receiveTimeout: const Duration(milliseconds: AppConstants.receiveTimeout),
      sendTimeout: const Duration(milliseconds: AppConstants.sendTimeout),
      headers: {
        HttpHeaders.contentTypeHeader: 'application/json',
        HttpHeaders.acceptHeader: 'application/json',
        'X-App-Version': '1.0.0',
        'X-Platform': Platform.operatingSystem,
      },
      validateStatus: (status) => status != null && status < 500,
    );
  }

  void _setupInterceptors() {
    // Auth interceptor
    _dio.interceptors.add(_AuthInterceptor(_secureStorage, _dio, this));

    // Logging interceptor (only in debug)
    if (kDebugMode) {
      _dio.interceptors.add(
        LogInterceptor(
          request: true,
          requestHeader: true,
          requestBody: true,
          responseHeader: false,
          responseBody: true,
          error: true,
          logPrint: (obj) => debugPrint('[API] $obj'),
        ),
      );
    }

    // Retry interceptor
    _dio.interceptors.add(_RetryInterceptor(_dio));
  }

  Future<Response<T>> get<T>(
    String path, {
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.get<T>(
        path,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<Response<T>> post<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.post<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<Response<T>> put<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.put<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<Response<T>> patch<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.patch<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<Response<T>> delete<T>(
    String path, {
    dynamic data,
    Map<String, dynamic>? queryParameters,
    Options? options,
    CancelToken? cancelToken,
  }) async {
    try {
      return await _dio.delete<T>(
        path,
        data: data,
        queryParameters: queryParameters,
        options: options,
        cancelToken: cancelToken,
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Future<Response<T>> uploadFile<T>(
    String path,
    File file, {
    String fieldName = 'file',
    Map<String, dynamic>? extraData,
    ProgressCallback? onSendProgress,
    CancelToken? cancelToken,
  }) async {
    try {
      final formData = FormData.fromMap({
        fieldName: await MultipartFile.fromFile(
          file.path,
          filename: file.path.split('/').last,
        ),
        if (extraData != null) ...extraData,
      });

      return await _dio.post<T>(
        path,
        data: formData,
        onSendProgress: onSendProgress,
        cancelToken: cancelToken,
        options: Options(
          headers: {'Content-Type': 'multipart/form-data'},
        ),
      );
    } on DioException catch (e) {
      throw _handleDioError(e);
    }
  }

  Failure _handleDioError(DioException error) {
    switch (error.type) {
      case DioExceptionType.connectionTimeout:
      case DioExceptionType.receiveTimeout:
      case DioExceptionType.sendTimeout:
        return const TimeoutFailure();
      case DioExceptionType.connectionError:
        return const NetworkFailure();
      case DioExceptionType.badResponse:
        final statusCode = error.response?.statusCode;
        final data = error.response?.data;
        final message = data is Map ? data['message'] as String? : null;

        switch (statusCode) {
          case 400:
            return ValidationFailure(message: message ?? 'Bad request');
          case 401:
            return const UnauthorizedFailure();
          case 403:
            return const UnauthorizedFailure(message: 'Access forbidden');
          case 404:
            return NotFoundFailure(message: message ?? 'Not found');
          case 409:
            return EmailAlreadyExistsFailure(message: message ?? 'Conflict');
          case 422:
            return ValidationFailure(message: message ?? 'Validation error');
          case 429:
            return const ServerFailure(message: 'Too many requests. Please slow down.');
          default:
            return ServerFailure(
              message: message ?? 'Server error',
              statusCode: statusCode,
            );
        }
      case DioExceptionType.cancel:
        return const NetworkFailure(message: 'Request was cancelled');
      default:
        return const UnknownFailure();
    }
  }

  void setAuthToken(String token) {
    _dio.options.headers['Authorization'] = 'Bearer $token';
  }

  void clearAuthToken() {
    _dio.options.headers.remove('Authorization');
  }

  bool get isRefreshing => _isRefreshing;
  set isRefreshing(bool value) => _isRefreshing = value;
}

class _AuthInterceptor extends Interceptor {
  final FlutterSecureStorage _secureStorage;
  final Dio _dio;
  final ApiService _apiService;

  _AuthInterceptor(this._secureStorage, this._dio, this._apiService);

  @override
  Future<void> onRequest(
    RequestOptions options,
    RequestInterceptorHandler handler,
  ) async {
    final token = await _secureStorage.read(key: AppConstants.accessTokenKey);
    if (token != null && !options.headers.containsKey('Authorization')) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    if (err.response?.statusCode == 401 && !_apiService.isRefreshing) {
      _apiService.isRefreshing = true;
      try {
        final refreshToken = await _secureStorage.read(
          key: AppConstants.refreshTokenKey,
        );
        if (refreshToken != null) {
          final response = await _dio.post(
            AppConstants.refreshTokenEndpoint,
            data: {'refresh_token': refreshToken},
            options: Options(headers: {'Authorization': null}),
          );
          final newToken = response.data['access_token'] as String?;
          if (newToken != null) {
            await _secureStorage.write(
              key: AppConstants.accessTokenKey,
              value: newToken,
            );
            err.requestOptions.headers['Authorization'] = 'Bearer $newToken';
            final retryResponse = await _dio.fetch<dynamic>(err.requestOptions);
            return handler.resolve(retryResponse);
          }
        }
      } catch (_) {
        await _secureStorage.deleteAll();
      } finally {
        _apiService.isRefreshing = false;
      }
    }
    handler.next(err);
  }
}

class _RetryInterceptor extends Interceptor {
  final Dio _dio;
  static const int _maxRetries = 3;

  _RetryInterceptor(this._dio);

  @override
  Future<void> onError(
    DioException err,
    ErrorInterceptorHandler handler,
  ) async {
    final retryCount = err.requestOptions.extra['retry_count'] as int? ?? 0;

    if (_shouldRetry(err) && retryCount < _maxRetries) {
      await Future<void>.delayed(
        Duration(milliseconds: 500 * (retryCount + 1)),
      );
      err.requestOptions.extra['retry_count'] = retryCount + 1;
      try {
        final response = await _dio.fetch<dynamic>(err.requestOptions);
        return handler.resolve(response);
      } on DioException catch (e) {
        return handler.next(e);
      }
    }
    handler.next(err);
  }

  bool _shouldRetry(DioException err) {
    return err.type == DioExceptionType.connectionTimeout ||
        err.type == DioExceptionType.receiveTimeout ||
        err.type == DioExceptionType.connectionError;
  }
}
