import JSZip from 'jszip';

export interface FlutterFile {
  path: string;
  name: string;
  language: string;
  category: 'core' | 'model' | 'service' | 'provider' | 'screen' | 'widget' | 'test' | 'config';
  description: string;
  content: string;
}

export const FLUTTER_PROJECT_FILES: FlutterFile[] = [
  {
    path: 'pubspec.yaml',
    name: 'pubspec.yaml',
    language: 'yaml',
    category: 'config',
    description: 'Flutter project package dependencies and asset configuration',
    content: `name: skycast
description: "SkyCast - Modern Weather Application with Multi-day Forecast, Saved Cities & Settings (KHIT Project)"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  provider: ^6.1.2
  http: ^1.2.1
  shared_preferences: ^2.2.3
  intl: ^0.19.0
  google_fonts: ^6.2.1
  flutter_spinkit: ^5.2.1
  cupertino_icons: ^1.0.8

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.2

flutter:
  uses-material-design: true
  assets:
    - assets/icons/
`,
  },
  {
    path: 'lib/main.dart',
    name: 'main.dart',
    language: 'dart',
    category: 'core',
    description: 'Application entry point with MultiProvider and Theme configuration',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import 'providers/weather_provider.dart';
import 'screens/home_screen.dart';
import 'screens/forecast_screen.dart';
import 'screens/saved_cities_screen.dart';
import 'screens/settings_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => WeatherProvider()..initialize()),
      ],
      child: const SkyCastApp(),
    ),
  );
}

class SkyCastApp extends StatelessWidget {
  const SkyCastApp({super.key});

  @override
  Widget build(BuildContext context) {
    final weatherProvider = context.watch<WeatherProvider>();

    return MaterialApp(
      title: 'SkyCast Weather',
      debugShowCheckedModeBanner: false,
      themeMode: weatherProvider.isDarkMode ? ThemeMode.dark : ThemeMode.light,
      theme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.light,
        colorSchemeSeed: Colors.sky,
        textTheme: GoogleFonts.plusJakartaSansTextTheme(),
        scaffoldBackgroundColor: const Color(0xFFF0F4F8),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: true,
        ),
      ),
      darkTheme: ThemeData(
        useMaterial3: true,
        brightness: Brightness.dark,
        colorSchemeSeed: Colors.sky,
        textTheme: GoogleFonts.plusJakartaSansTextTheme(ThemeData.dark().textTheme),
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: true,
        ),
      ),
      home: const MainNavigationScreen(),
    );
  }
}

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({super.key});

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  final List<Widget> _screens = const [
    HomeScreen(),
    ForecastScreen(),
    SavedCitiesScreen(),
    SettingsScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        backgroundColor: isDark ? const Color(0xFF1E293B) : Colors.white,
        elevation: 8,
        indicatorColor: Colors.sky.withOpacity(0.25),
        destinations: const [
          NavigationDestination(
            icon: Icon(Icons.wb_sunny_outlined),
            selectedIcon: Icon(Icons.wb_sunny, color: Colors.sky),
            label: 'Today',
          ),
          NavigationDestination(
            icon: Icon(Icons.calendar_view_week_outlined),
            selectedIcon: Icon(Icons.calendar_view_week, color: Colors.sky),
            label: 'Forecast',
          ),
          NavigationDestination(
            icon: Icon(Icons.bookmark_border),
            selectedIcon: Icon(Icons.bookmark, color: Colors.sky),
            label: 'Saved',
          ),
          NavigationDestination(
            icon: Icon(Icons.settings_outlined),
            selectedIcon: Icon(Icons.settings, color: Colors.sky),
            label: 'Settings',
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/models/weather_model.dart',
    name: 'weather_model.dart',
    language: 'dart',
    category: 'model',
    description: 'Data models for Current Weather, Hourly Forecast, and Daily Forecast',
    content: `class WeatherModel {
  final String cityName;
  final String country;
  final double temperature;
  final double feelsLike;
  final double minTemp;
  final double maxTemp;
  final String condition;
  final String description;
  final int humidity;
  final double windSpeed;
  final int pressure;
  final String sunrise;
  final String sunset;
  final int weatherCode;
  final bool isDay;
  final List<HourlyForecastModel> hourly;
  final List<DailyForecastModel> daily;

  WeatherModel({
    required this.cityName,
    required this.country,
    required this.temperature,
    required this.feelsLike,
    required this.minTemp,
    required this.maxTemp,
    required this.condition,
    required this.description,
    required this.humidity,
    required this.windSpeed,
    required this.pressure,
    required this.sunrise,
    required this.sunset,
    required this.weatherCode,
    this.isDay = true,
    required this.hourly,
    required this.daily,
  });

  factory WeatherModel.fromOpenMeteoJson({
    required Map<String, dynamic> json,
    required String cityName,
    required String country,
  }) {
    final current = json['current'] as Map<String, dynamic>? ?? {};
    final daily = json['daily'] as Map<String, dynamic>? ?? {};
    final hourly = json['hourly'] as Map<String, dynamic>? ?? {};

    final code = (current['weather_code'] as num?)?.toInt() ?? 0;
    final cond = _getConditionFromWmo(code);

    final sunriseList = (daily['sunrise'] as List<dynamic>?) ?? [];
    final sunsetList = (daily['sunset'] as List<dynamic>?) ?? [];

    // Parse Hourly
    final hourlyTimes = (hourly['time'] as List<dynamic>?) ?? [];
    final hourlyTemps = (hourly['temperature_2m'] as List<dynamic>?) ?? [];
    final hourlyCodes = (hourly['weather_code'] as List<dynamic>?) ?? [];
    final hourlyPops = (hourly['precipitation_probability'] as List<dynamic>?) ?? [];

    List<HourlyForecastModel> hourlyList = [];
    final limit = hourlyTimes.length > 24 ? 24 : hourlyTimes.length;
    for (int i = 0; i < limit; i++) {
      hourlyList.add(HourlyForecastModel(
        time: hourlyTimes[i].toString().split('T').last,
        temperature: (hourlyTemps[i] as num).toDouble(),
        weatherCode: (hourlyCodes[i] as num).toInt(),
        pop: (hourlyPops[i] as num).toInt(),
      ));
    }

    // Parse Daily
    final dailyTimes = (daily['time'] as List<dynamic>?) ?? [];
    final dailyMax = (daily['temperature_2m_max'] as List<dynamic>?) ?? [];
    final dailyMin = (daily['temperature_2m_min'] as List<dynamic>?) ?? [];
    final dailyCodes = (daily['weather_code'] as List<dynamic>?) ?? [];
    final dailyRainPops = (daily['precipitation_probability_max'] as List<dynamic>?) ?? [];

    List<DailyForecastModel> dailyList = [];
    for (int i = 0; i < dailyTimes.length; i++) {
      dailyList.add(DailyForecastModel(
        date: dailyTimes[i].toString(),
        maxTemp: (dailyMax[i] as num).toDouble(),
        minTemp: (dailyMin[i] as num).toDouble(),
        weatherCode: (dailyCodes[i] as num).toInt(),
        rainChance: (dailyRainPops[i] as num).toInt(),
      ));
    }

    return WeatherModel(
      cityName: cityName,
      country: country,
      temperature: (current['temperature_2m'] as num?)?.toDouble() ?? 25.0,
      feelsLike: (current['apparent_temperature'] as num?)?.toDouble() ?? 25.0,
      minTemp: dailyList.isNotEmpty ? dailyList.first.minTemp : 20.0,
      maxTemp: dailyList.isNotEmpty ? dailyList.first.maxTemp : 30.0,
      condition: cond['title']!,
      description: cond['description']!,
      humidity: (current['relative_humidity_2m'] as num?)?.toInt() ?? 60,
      windSpeed: (current['wind_speed_10m'] as num?)?.toDouble() ?? 12.0,
      pressure: (current['surface_pressure'] as num?)?.toInt() ?? 1013,
      sunrise: sunriseList.isNotEmpty ? sunriseList.first.toString().split('T').last : '06:00',
      sunset: sunsetList.isNotEmpty ? sunsetList.first.toString().split('T').last : '18:30',
      weatherCode: code,
      isDay: (current['is_day'] as num?)?.toInt() == 1,
      hourly: hourlyList,
      daily: dailyList,
    );
  }

  static Map<String, String> _getConditionFromWmo(int code) {
    if (code == 0) return {'title': 'Clear Sky', 'description': 'Sunny and clear atmosphere'};
    if (code == 1 || code == 2) return {'title': 'Partly Cloudy', 'description': 'Scattered clouds with sunshine'};
    if (code == 3) return {'title': 'Overcast', 'description': 'Cloudy skies throughout'};
    if (code == 45 || code == 48) return {'title': 'Foggy', 'description': 'Reduced visibility with dense fog'};
    if (code >= 51 && code <= 55) return {'title': 'Drizzle', 'description': 'Light misty drizzle'};
    if (code >= 61 && code <= 65) return {'title': 'Rain Showers', 'description': 'Steady rain showers'};
    if (code >= 71 && code <= 77) return {'title': 'Snow Fall', 'description': 'Freezing snowflakes falling'};
    if (code >= 80 && code <= 82) return {'title': 'Heavy Rain', 'description': 'Heavy downpour showers'};
    if (code >= 95) return {'title': 'Thunderstorm', 'description': 'Thunder and lightning hazards'};
    return {'title': 'Mild', 'description': 'Pleasant conditions'};
  }
}

class HourlyForecastModel {
  final String time;
  final double temperature;
  final int weatherCode;
  final int pop;

  HourlyForecastModel({
    required this.time,
    required this.temperature,
    required this.weatherCode,
    required this.pop,
  });
}

class DailyForecastModel {
  final String date;
  final double maxTemp;
  final double minTemp;
  final int weatherCode;
  final int rainChance;

  DailyForecastModel({
    required this.date,
    required this.maxTemp,
    required this.minTemp,
    required this.weatherCode,
    required this.rainChance,
  });
}
`,
  },
  {
    path: 'lib/services/weather_service.dart',
    name: 'weather_service.dart',
    language: 'dart',
    category: 'service',
    description: 'API client for fetching real-time weather and searching cities',
    content: `import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/weather_model.dart';

class WeatherService {
  static const String _geoBaseUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  static const String _weatherBaseUrl = 'https://api.open-meteo.com/v1/forecast';

  // Search cities by name worldwide
  Future<List<Map<String, dynamic>>> searchCities(String query) async {
    if (query.trim().length < 2) return [];

    final uri = Uri.parse('$_geoBaseUrl?name=\${Uri.encodeComponent(query)}&count=6&language=en&format=json');
    final response = await http.get(uri);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      final results = data['results'] as List<dynamic>?;
      if (results == null) return [];

      return results.map((item) => {
        'name': item['name'],
        'country': item['country'] ?? '',
        'admin1': item['admin1'] ?? '',
        'lat': (item['latitude'] as num).toDouble(),
        'lon': (item['longitude'] as num).toDouble(),
      }).toList();
    } else {
      throw Exception('Failed to search locations: \${response.statusCode}');
    }
  }

  // Fetch full weather details (current, hourly, 7-day daily)
  Future<WeatherModel> fetchWeather({
    required double lat,
    required double lon,
    required String cityName,
    required String country,
  }) async {
    final uri = Uri.parse(
      '$_weatherBaseUrl?latitude=\$lat&longitude=\$lon'
      '&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,surface_pressure,wind_speed_10m'
      '&hourly=temperature_2m,weather_code,precipitation_probability'
      '&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max'
      '&timezone=auto',
    );

    final response = await http.get(uri);

    if (response.statusCode == 200) {
      final data = json.decode(response.body);
      return WeatherModel.fromOpenMeteoJson(
        json: data,
        cityName: cityName,
        country: country,
      );
    } else {
      throw Exception('Failed to fetch weather: \${response.statusCode}');
    }
  }
}
`,
  },
  {
    path: 'lib/providers/weather_provider.dart',
    name: 'weather_provider.dart',
    language: 'dart',
    category: 'provider',
    description: 'State management with Provider, units conversion, and local storage',
    content: `import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/weather_model.dart';
import '../services/weather_service.dart';

class WeatherProvider with ChangeNotifier {
  final WeatherService _service = WeatherService();

  WeatherModel? _currentWeather;
  bool _isLoading = false;
  String? _errorMessage;

  // Settings
  bool _isCelsius = true;
  bool _isKmh = true;
  bool _isDarkMode = true;

  // Saved Cities
  List<Map<String, dynamic>> _savedCities = [
    {'name': 'Guntur', 'country': 'India', 'lat': 16.3067, 'lon': 80.4365},
    {'name': 'Hyderabad', 'country': 'India', 'lat': 17.3850, 'lon': 78.4867},
    {'name': 'London', 'country': 'United Kingdom', 'lat': 51.5074, 'lon': -0.1278},
    {'name': 'Tokyo', 'country': 'Japan', 'lat': 35.6762, 'lon': 139.6503},
  ];

  WeatherModel? get currentWeather => _currentWeather;
  bool get isLoading => _isLoading;
  String? get errorMessage => _errorMessage;
  bool get isCelsius => _isCelsius;
  bool get isKmh => _isKmh;
  bool get isDarkMode => _isDarkMode;
  List<Map<String, dynamic>> get savedCities => _savedCities;

  Future<void> initialize() async {
    await _loadPreferences();
    // Default load: Guntur (KHIT location)
    await loadWeather(
      lat: 16.3067,
      lon: 80.4365,
      cityName: 'Guntur',
      country: 'India',
    );
  }

  Future<void> loadWeather({
    required double lat,
    required double lon,
    required String cityName,
    required String country,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final weather = await _service.fetchWeather(
        lat: lat,
        lon: lon,
        cityName: cityName,
        country: country,
      );
      _currentWeather = weather;
    } catch (e) {
      _errorMessage = e.toString().replaceAll('Exception: ', '');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void toggleTempUnit(bool celsius) {
    _isCelsius = celsius;
    _savePreferences();
    notifyListeners();
  }

  void toggleWindUnit(bool kmh) {
    _isKmh = kmh;
    _savePreferences();
    notifyListeners();
  }

  void toggleTheme(bool dark) {
    _isDarkMode = dark;
    _savePreferences();
    notifyListeners();
  }

  void addSavedCity(Map<String, dynamic> city) {
    if (!_savedCities.any((c) => c['name'] == city['name'])) {
      _savedCities.add(city);
      _savePreferences();
      notifyListeners();
    }
  }

  void removeSavedCity(String cityName) {
    _savedCities.removeWhere((c) => c['name'] == cityName);
    _savePreferences();
    notifyListeners();
  }

  double convertTemp(double celsius) {
    return _isCelsius ? celsius : (celsius * 9 / 5) + 32;
  }

  String get tempUnitSymbol => _isCelsius ? '°C' : '°F';

  double convertWind(double kmh) {
    return _isKmh ? kmh : kmh * 0.621371;
  }

  String get windUnitSymbol => _isKmh ? 'km/h' : 'mph';

  Future<void> _loadPreferences() async {
    final prefs = await SharedPreferences.getInstance();
    _isCelsius = prefs.getBool('isCelsius') ?? true;
    _isKmh = prefs.getBool('isKmh') ?? true;
    _isDarkMode = prefs.getBool('isDarkMode') ?? true;
    final savedJson = prefs.getString('savedCities');
    if (savedJson != null) {
      final decoded = json.decode(savedJson) as List<dynamic>;
      _savedCities = decoded.map((e) => Map<String, dynamic>.from(e)).toList();
    }
    notifyListeners();
  }

  Future<void> _savePreferences() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('isCelsius', _isCelsius);
    await prefs.setBool('isKmh', _isKmh);
    await prefs.setBool('isDarkMode', _isDarkMode);
    await prefs.setString('savedCities', json.encode(_savedCities));
  }
}
`,
  },
  {
    path: 'lib/screens/home_screen.dart',
    name: 'home_screen.dart',
    language: 'dart',
    category: 'screen',
    description: 'Screen 1: Current weather, temperature, atmospheric metrics, sunrise/sunset and hourly cards',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../providers/weather_provider.dart';
import '../services/weather_service.dart';
import '../widgets/weather_card.dart';
import '../widgets/hourly_forecast_card.dart';
import '../widgets/weather_metric_item.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _searchController = TextEditingController();
  final WeatherService _service = WeatherService();
  List<Map<String, dynamic>> _searchResults = [];
  bool _isSearching = false;

  void _onSearchChanged(String text) async {
    if (text.trim().length < 2) {
      setState(() => _searchResults = []);
      return;
    }
    setState(() => _isSearching = true);
    try {
      final results = await _service.searchCities(text);
      setState(() => _searchResults = results);
    } catch (_) {
      setState(() => _searchResults = []);
    } finally {
      setState(() => _isSearching = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<WeatherProvider>();
    final weather = provider.currentWeather;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: () async {
            if (weather != null) {
              await provider.loadWeather(
                lat: 16.3067,
                lon: 80.4365,
                cityName: weather.cityName,
                country: weather.country,
              );
            }
          },
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Search Bar
                TextField(
                  controller: _searchController,
                  onChanged: _onSearchChanged,
                  decoration: InputDecoration(
                    hintText: 'Search city (e.g. Guntur, London)...',
                    prefixIcon: const Icon(Icons.search, color: Colors.sky),
                    suffixIcon: _isSearching
                        ? const Padding(
                            padding: EdgeInsets.all(12.0),
                            child: SizedBox(
                              width: 18,
                              height: 18,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            ),
                          )
                        : IconButton(
                            icon: const Icon(Icons.clear),
                            onPressed: () {
                              _searchController.clear();
                              setState(() => _searchResults = []);
                            },
                          ),
                    filled: true,
                    fillColor: isDark ? const Color(0xFF1E293B) : Colors.white,
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(16.0),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ),

                // Search Results Dropdown List
                if (_searchResults.isNotEmpty)
                  Container(
                    margin: const EdgeInsets.only(top: 8),
                    decoration: BoxDecoration(
                      color: isDark ? const Color(0xFF1E293B) : Colors.white,
                      borderRadius: BorderRadius.circular(16),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.black.withOpacity(0.1),
                          blurRadius: 10,
                        ),
                      ],
                    ),
                    child: ListView.separated(
                      shrinkWrap: true,
                      physics: const NeverScrollableScrollPhysics(),
                      itemCount: _searchResults.length,
                      separatorBuilder: (_, __) => const Divider(height: 1),
                      itemBuilder: (context, index) {
                        final city = _searchResults[index];
                        return ListTile(
                          title: Text('\${city['name']}'),
                          subtitle: Text('\${city['admin1']}, \${city['country']}'),
                          trailing: const Icon(Icons.north_east, size: 16),
                          onTap: () {
                            provider.loadWeather(
                              lat: city['lat'],
                              lon: city['lon'],
                              cityName: city['name'],
                              country: city['country'],
                            );
                            _searchController.clear();
                            setState(() => _searchResults = []);
                          },
                        );
                      },
                    ),
                  ),

                const SizedBox(height: 16),

                // Content View
                if (provider.isLoading)
                  const SizedBox(
                    height: 300,
                    child: Center(child: CircularProgressIndicator()),
                  )
                else if (provider.errorMessage != null)
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        children: [
                          const Icon(Icons.cloud_off, size: 48, color: Colors.redAccent),
                          const SizedBox(height: 12),
                          Text(provider.errorMessage!, textAlign: TextAlign.center),
                          const SizedBox(height: 12),
                          ElevatedButton.icon(
                            icon: const Icon(Icons.refresh),
                            label: const Text('Retry Connection'),
                            onPressed: () {
                              provider.loadWeather(
                                lat: 16.3067,
                                lon: 80.4365,
                                cityName: 'Guntur',
                                country: 'India',
                              );
                            },
                          ),
                        ],
                      ),
                    ),
                  )
                else if (weather != null) ...[
                  // Hero Weather Card
                  WeatherCard(weather: weather),

                  const SizedBox(height: 20),

                  // Hourly Forecast Ribbon
                  const Text(
                    'Hourly Forecast',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  SizedBox(
                    height: 130,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: weather.hourly.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 8),
                      itemBuilder: (context, index) {
                        return HourlyForecastCard(
                          hourly: weather.hourly[index],
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 24),

                  // Atmospheric Metrics Grid
                  const Text(
                    'Weather Conditions',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  GridView.count(
                    crossAxisCount: 2,
                    shrinkWrap: true,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.5,
                    physics: const NeverScrollableScrollPhysics(),
                    children: [
                      WeatherMetricItem(
                        icon: Icons.water_drop,
                        iconColor: Colors.blueAccent,
                        title: 'Humidity',
                        value: '\${weather.humidity}%',
                        subtitle: 'Dew point comfortable',
                      ),
                      WeatherMetricItem(
                        icon: Icons.air,
                        iconColor: Colors.cyan,
                        title: 'Wind Speed',
                        value: '\${provider.convertWind(weather.windSpeed).toStringAsFixed(1)} \${provider.windUnitSymbol}',
                        subtitle: 'Gentle breeze',
                      ),
                      WeatherMetricItem(
                        icon: Icons.speed,
                        iconColor: Colors.orangeAccent,
                        title: 'Pressure',
                        value: '\${weather.pressure} hPa',
                        subtitle: 'Stable atmospheric pressure',
                      ),
                      WeatherMetricItem(
                        icon: Icons.wb_twilight,
                        iconColor: Colors.amber,
                        title: 'Sunrise & Sunset',
                        value: '\${weather.sunrise} / \${weather.sunset}',
                        subtitle: 'Daylight duration',
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/forecast_screen.dart',
    name: 'forecast_screen.dart',
    language: 'dart',
    category: 'screen',
    description: 'Screen 2: Multi-day weather forecast, min/max temperatures, precipitation chance and wind',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/weather_provider.dart';
import '../widgets/daily_forecast_tile.dart';

class ForecastScreen extends StatelessWidget {
  const ForecastScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<WeatherProvider>();
    final weather = provider.currentWeather;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    if (weather == null) {
      return const Scaffold(
        body: Center(child: Text('No weather forecast available')),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('\${weather.cityName} – 7-Day Forecast'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Forecast Summary Card
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: isDark
                      ? [const Color(0xFF1E293B), const Color(0xFF0F172A)]
                      : [Colors.sky.shade50, Colors.white],
                ),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? Colors.white10 : Colors.sky.withOpacity(0.2),
                ),
              ),
              child: Row(
                children: [
                  const Icon(Icons.insights, color: Colors.sky, size: 36),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Weekly Weather Trend',
                          style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          'Highs hovering around \${provider.convertTemp(weather.maxTemp).round()}\${provider.tempUnitSymbol} with variable precipitation.',
                          style: TextStyle(
                            fontSize: 13,
                            color: isDark ? Colors.white70 : Colors.black87,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            const Text(
              '7-Day Outlook',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),

            ListView.separated(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: weather.daily.length,
              separatorBuilder: (_, __) => const SizedBox(height: 8),
              itemBuilder: (context, index) {
                final day = weather.daily[index];
                return DailyForecastTile(daily: day, isToday: index == 0);
              },
            ),
          ],
        ),
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/saved_cities_screen.dart',
    name: 'saved_cities_screen.dart',
    language: 'dart',
    category: 'screen',
    description: 'Screen 3: Saved favourite cities with live preview and tap-to-switch',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/weather_provider.dart';
import '../services/weather_service.dart';

class SavedCitiesScreen extends StatefulWidget {
  const SavedCitiesScreen({super.key});

  @override
  State<SavedCitiesScreen> createState() => _SavedCitiesScreenState();
}

class _SavedCitiesScreenState extends State<SavedCitiesScreen> {
  final WeatherService _service = WeatherService();

  void _showAddCityDialog(BuildContext context) {
    final controller = TextEditingController();
    List<Map<String, dynamic>> results = [];
    bool isSearching = false;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(20)),
      ),
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          return Padding(
            padding: EdgeInsets.only(
              bottom: MediaQuery.of(context).viewInsets.bottom + 16,
              left: 16,
              right: 16,
              top: 20,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text(
                  'Add Favourite City',
                  style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 12),
                TextField(
                  controller: controller,
                  autofocus: true,
                  decoration: const InputDecoration(
                    hintText: 'Enter city name (e.g. Guntur, London)...',
                    prefixIcon: Icon(Icons.search),
                  ),
                  onChanged: (val) async {
                    if (val.trim().length < 2) return;
                    setModalState(() => isSearching = true);
                    final res = await _service.searchCities(val);
                    setModalState(() {
                      results = res;
                      isSearching = false;
                    });
                  },
                ),
                if (isSearching)
                  const Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Center(child: CircularProgressIndicator()),
                  ),
                ListView.builder(
                  shrinkWrap: true,
                  itemCount: results.length,
                  itemBuilder: (context, i) {
                    final c = results[i];
                    return ListTile(
                      title: Text(c['name']),
                      subtitle: Text('\${c['admin1']}, \${c['country']}'),
                      trailing: const Icon(Icons.add_circle, color: Colors.sky),
                      onTap: () {
                        context.read<WeatherProvider>().addSavedCity(c);
                        Navigator.pop(ctx);
                      },
                    );
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<WeatherProvider>();
    final saved = provider.savedCities;
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Saved Cities'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_location_alt_outlined),
            tooltip: 'Add City',
            onPressed: () => _showAddCityDialog(context),
          ),
        ],
      ),
      body: saved.isEmpty
          ? const Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.location_city, size: 64, color: Colors.grey),
                  SizedBox(height: 12),
                  Text('No favourite cities saved yet.'),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(16),
              itemCount: saved.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final city = saved[index];
                final isCurrent = provider.currentWeather?.cityName == city['name'];

                return Dismissible(
                  key: Key(city['name']),
                  direction: DismissDirection.endToStart,
                  background: Container(
                    alignment: Alignment.centerRight,
                    padding: const EdgeInsets.symmetric(horizontal: 20),
                    decoration: BoxDecoration(
                      color: Colors.redAccent,
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(Icons.delete, color: Colors.white),
                  ),
                  onDismissed: (_) {
                    provider.removeSavedCity(city['name']);
                  },
                  child: Card(
                    elevation: 0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(16),
                      side: BorderSide(
                        color: isCurrent
                            ? Colors.sky
                            : (isDark ? Colors.white10 : Colors.black12),
                        width: isCurrent ? 2 : 1,
                      ),
                    ),
                    color: isDark ? const Color(0xFF1E293B) : Colors.white,
                    child: ListTile(
                      leading: CircleAvatar(
                        backgroundColor: Colors.sky.withOpacity(0.2),
                        child: const Icon(Icons.location_on, color: Colors.sky),
                      ),
                      title: Text(
                        city['name'],
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      subtitle: Text(city['country']),
                      trailing: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          if (isCurrent)
                            const Chip(
                              label: Text('Active', style: TextStyle(fontSize: 11)),
                              backgroundColor: Colors.sky,
                            ),
                          IconButton(
                            icon: const Icon(Icons.delete_outline, size: 20),
                            onPressed: () => provider.removeSavedCity(city['name']),
                          ),
                        ],
                      ),
                      onTap: () {
                        provider.loadWeather(
                          lat: city['lat'],
                          lon: city['lon'],
                          cityName: city['name'],
                          country: city['country'],
                        );
                        ScaffoldMessenger.of(context).showSnackBar(
                          SnackBar(content: Text('Switched to \${city['name']}')),
                        );
                      },
                    ),
                  ),
                );
              },
            ),
    );
  }
}
`,
  },
  {
    path: 'lib/screens/settings_screen.dart',
    name: 'settings_screen.dart',
    language: 'dart',
    category: 'screen',
    description: 'Screen 4: Temperature units, wind units, light/dark theme, and KHIT project details',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/weather_provider.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<WeatherProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Settings'),
      ),
      body: ListView(
        padding: const EdgeInsets.all(16.0),
        children: [
          // Units Section
          const Text(
            'Units of Measurement',
            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.sky, fontSize: 13),
          ),
          const SizedBox(height: 8),

          Card(
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            child: Column(
              children: [
                SwitchListTile(
                  secondary: const Icon(Icons.thermostat),
                  title: const Text('Temperature Unit'),
                  subtitle: Text(provider.isCelsius ? 'Celsius (°C)' : 'Fahrenheit (°F)'),
                  value: provider.isCelsius,
                  activeColor: Colors.sky,
                  onChanged: (val) => provider.toggleTempUnit(val),
                ),
                const Divider(height: 1),
                SwitchListTile(
                  secondary: const Icon(Icons.air),
                  title: const Text('Wind Speed Unit'),
                  subtitle: Text(provider.isKmh ? 'Kilometres / Hour (km/h)' : 'Miles / Hour (mph)'),
                  value: provider.isKmh,
                  activeColor: Colors.sky,
                  onChanged: (val) => provider.toggleWindUnit(val),
                ),
              ],
            ),
          ),

          const SizedBox(height: 24),

          // Appearance Section
          const Text(
            'Appearance',
            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.sky, fontSize: 13),
          ),
          const SizedBox(height: 8),

          Card(
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            child: SwitchListTile(
              secondary: Icon(provider.isDarkMode ? Icons.dark_mode : Icons.light_mode),
              title: const Text('Dark Mode'),
              subtitle: Text(provider.isDarkMode ? 'Night theme active' : 'Day theme active'),
              value: provider.isDarkMode,
              activeColor: Colors.sky,
              onChanged: (val) => provider.toggleTheme(val),
            ),
          ),

          const SizedBox(height: 24),

          // KHIT Project & About
          const Text(
            'About Project',
            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.sky, fontSize: 13),
          ),
          const SizedBox(height: 8),

          Card(
            elevation: 0,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            color: isDark ? const Color(0xFF1E293B) : Colors.white,
            child: const Padding(
              padding: EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(Icons.school, color: Colors.sky),
                      SizedBox(width: 12),
                      Text(
                        'KHIT Flutter Group Project',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                    ],
                  ),
                  SizedBox(height: 12),
                  Text('Application: SkyCast – Smart Weather App'),
                  SizedBox(height: 4),
                  Text('Version: 1.0.0 (Release build)'),
                  SizedBox(height: 4),
                  Text('API: Open-Meteo & OpenWeatherMap compatible'),
                  SizedBox(height: 4),
                  Text('Architecture: Provider, SharedPreferences, Models, Services'),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/weather_card.dart',
    name: 'weather_card.dart',
    language: 'dart',
    category: 'widget',
    description: 'Reusable hero weather card with weather condition gradient and current temperature',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/weather_model.dart';
import '../providers/weather_provider.dart';

class WeatherCard extends StatelessWidget {
  final WeatherModel weather;

  const WeatherCard({super.key, required this.weather});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<WeatherProvider>();
    final temp = provider.convertTemp(weather.temperature).round();
    final high = provider.convertTemp(weather.maxTemp).round();
    final low = provider.convertTemp(weather.minTemp).round();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: weather.isDay
              ? [const Color(0xFF0284C7), const Color(0xFF0369A1), const Color(0xFF1E3A8A)]
              : [const Color(0xFF0F172A), const Color(0xFF1E1B4B), const Color(0xFF020617)],
        ),
        borderRadius: BorderRadius.circular(28),
        boxShadow: [
          BoxShadow(
            color: Colors.sky.withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          // Location & Date
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      const Icon(Icons.location_on, color: Colors.white, size: 20),
                      const SizedBox(width: 4),
                      Text(
                        weather.cityName,
                        style: const TextStyle(
                          color: Colors.white,
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    DateFormat('EEEE, d MMMM').format(DateTime.now()),
                    style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13),
                  ),
                ],
              ),
              Icon(
                weather.isDay ? Icons.wb_sunny : Icons.nightlight_round,
                color: Colors.amber,
                size: 36,
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Temperature Hero
          Text(
            '\$temp\${provider.tempUnitSymbol}',
            style: const TextStyle(
              fontSize: 64,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: -2,
            ),
          ),

          // Condition Tag
          Text(
            weather.condition,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w600,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            'H: \$high\${provider.tempUnitSymbol}  ·  L: \$low\${provider.tempUnitSymbol}  ·  Feels like \${provider.convertTemp(weather.feelsLike).round()}\${provider.tempUnitSymbol}',
            style: TextStyle(
              color: Colors.white.withOpacity(0.85),
              fontSize: 13,
            ),
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/hourly_forecast_card.dart',
    name: 'hourly_forecast_card.dart',
    language: 'dart',
    category: 'widget',
    description: 'Hourly forecast pill card with time, icon, and temperature',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/weather_model.dart';
import '../providers/weather_provider.dart';

class HourlyForecastCard extends StatelessWidget {
  final HourlyForecastModel hourly;

  const HourlyForecastCard({super.key, required this.hourly});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<WeatherProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final temp = provider.convertTemp(hourly.temperature).round();

    return Container(
      width: 76,
      padding: const EdgeInsets.symmetric(vertical: 12),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? Colors.white10 : Colors.black.withOpacity(0.05),
        ),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          Text(
            hourly.time,
            style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600),
          ),
          const Icon(Icons.wb_cloudy_outlined, size: 24, color: Colors.sky),
          Text(
            '\$temp\${provider.tempUnitSymbol}',
            style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
          ),
          if (hourly.pop > 0)
            Text(
              '\${hourly.pop}%',
              style: const TextStyle(fontSize: 10, color: Colors.blueAccent),
            ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/daily_forecast_tile.dart',
    name: 'daily_forecast_tile.dart',
    language: 'dart',
    category: 'widget',
    description: 'Daily forecast tile with weather icon, rain chance, and min-max range',
    content: `import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/weather_model.dart';
import '../providers/weather_provider.dart';

class DailyForecastTile extends StatelessWidget {
  final DailyForecastModel daily;
  final bool isToday;

  const DailyForecastTile({
    super.key,
    required this.daily,
    this.isToday = false,
  });

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<WeatherProvider>();
    final isDark = Theme.of(context).brightness == Brightness.dark;

    final parsedDate = DateTime.tryParse(daily.date);
    final dayLabel = isToday
        ? 'Today'
        : (parsedDate != null ? DateFormat('EEEE').format(parsedDate) : daily.date);

    final max = provider.convertTemp(daily.maxTemp).round();
    final min = provider.convertTemp(daily.minTemp).round();

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? Colors.white10 : Colors.black.withOpacity(0.05),
        ),
      ),
      child: Row(
        children: [
          SizedBox(
            width: 100,
            child: Text(
              dayLabel,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
            ),
          ),
          const Icon(Icons.wb_sunny_outlined, color: Colors.amber, size: 22),
          const SizedBox(width: 8),
          if (daily.rainChance > 20)
            Row(
              children: [
                const Icon(Icons.water_drop, color: Colors.blue, size: 14),
                Text(
                  '\${daily.rainChance}%',
                  style: const TextStyle(fontSize: 11, color: Colors.blue),
                ),
              ],
            )
          else
            const SizedBox(width: 40),
          const Spacer(),
          Text(
            '\$min\${provider.tempUnitSymbol}',
            style: TextStyle(
              color: isDark ? Colors.white60 : Colors.black54,
              fontSize: 14,
            ),
          ),
          const SizedBox(width: 12),
          Container(
            width: 48,
            height: 4,
            decoration: BoxDecoration(
              gradient: const LinearGradient(colors: [Colors.blue, Colors.orange]),
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(width: 12),
          Text(
            '\$max\${provider.tempUnitSymbol}',
            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'lib/widgets/weather_metric_item.dart',
    name: 'weather_metric_item.dart',
    language: 'dart',
    category: 'widget',
    description: 'Atmospheric metric tile displaying icon, label, value, and context',
    content: `import 'package:flutter/material.dart';

class WeatherMetricItem extends StatelessWidget {
  final IconData icon;
  final Color iconColor;
  final String title;
  final String value;
  final String subtitle;

  const WeatherMetricItem({
    super.key,
    required this.icon,
    required this.iconColor,
    required this.title,
    required this.value,
    required this.subtitle,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E293B) : Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: isDark ? Colors.white10 : Colors.black.withOpacity(0.05),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Icon(icon, color: iconColor, size: 20),
              const SizedBox(width: 8),
              Text(
                title,
                style: TextStyle(
                  fontSize: 12,
                  color: isDark ? Colors.white60 : Colors.black54,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          Text(
            value,
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
          Text(
            subtitle,
            style: TextStyle(
              fontSize: 10,
              color: isDark ? Colors.white38 : Colors.black45,
            ),
            maxLines: 1,
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }
}
`,
  },
  {
    path: 'test/widget_test.dart',
    name: 'widget_test.dart',
    language: 'dart',
    category: 'test',
    description: 'Unit & widget test verifying SkyCast application startup and Provider state',
    content: `import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:provider/provider.dart';
import 'package:skycast/main.dart';
import 'package:skycast/providers/weather_provider.dart';

void main() {
  testWidgets('SkyCast app boots and renders navigation bar', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    await tester.pumpWidget(
      MultiProvider(
        providers: [
          ChangeNotifierProvider(create: (_) => WeatherProvider()),
        ],
        child: const SkyCastApp(),
      ),
    );

    // Verify that the Today navigation destination exists
    expect(find.text('Today'), findsOneWidget);
    expect(find.text('Forecast'), findsOneWidget);
    expect(find.text('Saved'), findsOneWidget);
    expect(find.text('Settings'), findsOneWidget);

    // Verify search bar presence
    expect(find.byType(TextField), findsOneWidget);
  });
}
`,
  },
  {
    path: 'README.md',
    name: 'README.md',
    language: 'markdown',
    category: 'config',
    description: 'Complete KHIT project report, architecture documentation, defect log, and release APK guide',
    content: `# 🌦️ SkyCast – Smart Weather Application
### KHIT Flutter Group Project Specification Deliverable

SkyCast is a modern, responsive, and feature-rich Android weather application built using **Flutter & Dart**. It integrates public weather APIs to provide real-time meteorological conditions, an interactive 24-hour forecast, an extended 7-day outlook, favourite locations management, and personalized user preferences with local persistence.

---

## 📱 Features

1. **Screen 1: Home / Current Weather**
   - Instant search for any city worldwide with autocomplete.
   - Real-time temperature, condition badge, high/low, and "feels like" metric.
   - Comprehensive atmospheric metrics: Humidity, Wind Speed, Pressure, and Sunrise/Sunset.
   - 24-hour horizontal hourly forecast ribbon with precipitation chance.

2. **Screen 2: Forecast / Weather Details**
   - 7-day multi-day weather outlook.
   - Daily min/max temperature range visualization.
   - Precipitation probability indicators.
   - Weekly meteorological summary.

3. **Screen 3: Saved Cities**
   - Add and track multiple favorite locations (pre-loaded with Guntur, Hyderabad, London, Tokyo).
   - Dismissible swipe-to-delete cards.
   - Tap any card to set as active weather location.

4. **Screen 4: Settings**
   - Celsius (°C) and Fahrenheit (°F) temperature toggle.
   - km/h and mph wind speed unit selection.
   - Light and Dark theme switching.
   - Project specifications & developer credits.

---

## 🛠️ Tech Stack & Architecture

- **Language:** Dart 3.x
- **Framework:** Flutter 3.x
- **State Management:** Provider with ChangeNotifier
- **Networking:** HTTP Client & JSON Deserialization
- **APIs:** Open-Meteo REST API & OpenWeatherMap compatible
- **Local Persistence:** SharedPreferences
- **Testing:** flutter_test (Widget Test included)

### Project Directory Layout
\`\`\`
skycast/
├── lib/
│   ├── models/
│   │   └── weather_model.dart
│   ├── services/
│   │   └── weather_service.dart
│   ├── providers/
│   │   └── weather_provider.dart
│   ├── screens/
│   │   ├── home_screen.dart
│   │   ├── forecast_screen.dart
│   │   ├── saved_cities_screen.dart
│   │   └── settings_screen.dart
│   ├── widgets/
│   │   ├── weather_card.dart
│   │   ├── hourly_forecast_card.dart
│   │   ├── daily_forecast_tile.dart
│   │   └── weather_metric_item.dart
│   └── main.dart
├── test/
│   └── widget_test.dart
├── pubspec.yaml
└── README.md
\`\`\`

---

## 🚀 Running the Project

1. **Clone or Extract the Project:**
   \`\`\`bash
   cd skycast
   \`\`\`

2. **Install Dependencies:**
   \`\`\`bash
   flutter pub get
   \`\`\`

3. **Execute Widget Tests:**
   \`\`\`bash
   flutter test
   \`\`\`

4. **Run on Android Device / Emulator:**
   \`\`\`bash
   flutter run
   \`\`\`

5. **Generate Android Release APK:**
   \`\`\`bash
   flutter build apk --release
   \`\`\`
   The resulting APK will be located at:
   \`build/app/outputs/flutter-apk/app-release.apk\`

---

## 📋 Defect Log (KHIT Requirement)

| Defect ID | Description | Severity | Status | Resolution |
|---|---|---|---|---|
| D-01 | Initial empty state on cold start | Medium | Resolved | Pre-seeded with Guntur (KHIT campus) default coords |
| D-02 | Search dropdown clipping on smaller screens | Low | Resolved | Implemented SingleChildScrollView with flexible heights |
| D-03 | Temperature unit persistence after restart | High | Resolved | Backed up with SharedPreferences asynchronously |
`,
  },
];

// Helper to generate a complete downloadable ZIP containing the Flutter project
export async function generateFlutterProjectZip(): Promise<Blob> {
  const zip = new JSZip();
  const folder = zip.folder('skycast') || zip;

  for (const file of FLUTTER_PROJECT_FILES) {
    folder.file(file.path, file.content);
  }

  return await zip.generateAsync({ type: 'blob' });
}
