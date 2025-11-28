import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/constants.dart';

class ApiClient {
  late final Dio dio;

  ApiClient({String? baseUrl}) {
    dio = Dio(BaseOptions(
      baseUrl: baseUrl ?? API_BASE,
      connectTimeout: const Duration(seconds: 12),
      receiveTimeout: const Duration(seconds: 12),
    ));

    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final prefs = await SharedPreferences.getInstance();
        final token = prefs.getString("token");
        if (token != null && token.isNotEmpty) {
          options.headers["Authorization"] = "Bearer $token";
        }
        return handler.next(options);
      },
      onError: (e, handler) {
        return handler.next(e);
      },
    ));
  }

  Future<Response> get(String path, {Map<String, dynamic>? queryParameters}) =>
      dio.get(path, queryParameters: queryParameters);

  Future<Response> post(String path, dynamic data) => dio.post(path, data: data);

  Future<Response> put(String path, dynamic data) => dio.put(path, data: data);

  Future<Response> delete(String path) => dio.delete(path);
}
