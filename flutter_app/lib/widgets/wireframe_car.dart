import 'package:flutter/material.dart';
import '../theme/cyber_theme.dart';

class WireframeCarView extends StatelessWidget {
  const WireframeCarView({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 180,
      width: double.infinity,
      decoration: BoxDecoration(
        color: CyberTheme.bgSecondary.withOpacity(0.6),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: CyberTheme.cyberCyan.withOpacity(0.3)),
      ),
      child: Stack(
        alignment: Alignment.center,
        children: [
          CustomPaint(
            size: const Size(280, 140),
            painter: _CarWireframePainter(),
          ),
          Positioned(
            left: 70,
            top: 40,
            child: _Hotspot(label: 'Front Inverter', color: CyberTheme.cyberCyan),
          ),
          Positioned(
            child: _Hotspot(label: 'BMS Pack (0x100)', color: CyberTheme.cyberGreen),
          ),
          Positioned(
            right: 40,
            top: 75,
            child: _Hotspot(label: 'CCS2 Fast Port', color: CyberTheme.cyberAmber),
          ),
        ],
      ),
    );
  }
}

class _Hotspot extends StatelessWidget {
  final String label;
  final Color color;
  const _Hotspot({required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Hotspot: $label - Secure Status OK'),
            backgroundColor: CyberTheme.bgSecondary,
          ),
        );
      },
      child: Container(
        width: 14,
        height: 14,
        decoration: BoxDecoration(
          color: color,
          shape: BoxShape.circle,
          boxShadow: [
            BoxShadow(color: color.withOpacity(0.8), blurRadius: 8, spreadRadius: 2),
          ],
        ),
      ),
    );
  }
}

class _CarWireframePainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final linePaint = Paint()
      ..color = CyberTheme.cyberCyan.withOpacity(0.7)
      ..strokeWidth = 1.5
      ..style = PaintingStyle.stroke;

    final wheelPaint = Paint()
      ..color = CyberTheme.cyberGreen
      ..strokeWidth = 2.0
      ..style = PaintingStyle.stroke;

    final path = Path();
    path.moveTo(30, 95);
    path.lineTo(60, 45);
    path.lineTo(130, 32);
    path.lineTo(200, 32);
    path.lineTo(240, 60);
    path.lineTo(260, 95);
    path.close();

    canvas.drawPath(path, linePaint);
    canvas.drawCircle(Offset(75, 100), 16, wheelPaint);
    canvas.drawCircle(Offset(220, 100), 16, wheelPaint);

    final bmsRect = RRect.fromRectAndRadius(
      Rect.fromCenter(center: Offset(size.width / 2, 80), width: 90, height: 22),
      const Radius.circular(4),
    );
    canvas.drawRRect(bmsRect, linePaint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
