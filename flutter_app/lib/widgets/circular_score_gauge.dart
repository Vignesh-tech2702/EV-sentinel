import 'dart:math';
import 'package:flutter/material.dart';
import '../theme/cyber_theme.dart';

class CircularSecurityGauge extends StatelessWidget {
  final int score;
  final String status;
  final double size;

  const CircularSecurityGauge({
    Key? key,
    required this.score,
    required this.status,
    this.size = 180.0,
  }) : super(key: key);

  Color get statusColor {
    if (score >= 85) return CyberTheme.cyberGreen;
    if (score >= 60) return CyberTheme.cyberAmber;
    return CyberTheme.cyberCrimson;
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          CustomPaint(
            size: Size(size, size),
            painter: _GaugePainter(
              score: score,
              arcColor: statusColor,
            ),
          ),
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '$score%',
                style: TextStyle(
                  fontSize: size * 0.22,
                  fontWeight: FontWeight.w900,
                  color: statusColor,
                  fontFamily: 'monospace',
                ),
              ),
              const SizedBox(height: 4),
              Text(
                status.toUpperCase(),
                style: TextStyle(
                  fontSize: size * 0.08,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.5,
                  color: statusColor,
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}

class _GaugePainter extends CustomPainter {
  final int score;
  final Color arcColor;

  _GaugePainter({required this.score, required this.arcColor});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    final radius = (size.width - 24) / 2;
    const strokeWidth = 10.0;

    final bgPaint = Paint()
      ..color = Colors.white.withOpacity(0.08)
      ..strokeWidth = strokeWidth
      ..style = PaintingStyle.stroke;

    canvas.drawCircle(center, radius, bgPaint);

    final progressPaint = Paint()
      ..color = arcColor
      ..strokeWidth = strokeWidth
      ..strokeCap = StrokeCap.round
      ..style = PaintingStyle.stroke;

    final sweepAngle = 2 * pi * (score / 100.0);
    canvas.drawArc(
      Rect.fromCircle(center: center, radius: radius),
      -pi / 2,
      sweepAngle,
      false,
      progressPaint,
    );
  }

  @override
  bool shouldRepaint(covariant _GaugePainter oldDelegate) {
    return oldDelegate.score != score || oldDelegate.arcColor != arcColor;
  }
}
