import SwiftUI

// MARK: - Animated Logo Mark (Native macOS SwiftUI Canvas)
/// A high-performance, native SwiftUI implementation of the Meridius 3D dotted isometric logo animation.
/// Uses hardware-accelerated Canvas + TimelineView rendering with dynamic Light/Dark mode 3-face shading.
public struct AnimatedLogoMarkView: View {
    @Environment(\.colorScheme) private var colorScheme
    
    public var size: CGFloat?
    
    // Geometry & Timeline constants matching the website
    private let originX: Double = 259.0
    private let originY: Double = 258.14
    private let expandStart: Double = 0.5
    private let holdDuration: Double = 15.0
    private var shrinkStart: Double { 2.5 + holdDuration } // 17.5s
    private var cycleDuration: Double { shrinkStart + 2.7 } // 20.2s
    private let waveSpeed: Double = 190.0 // px/sec

    @State private var startTime: Date = Date()
    
    public init(size: CGFloat? = nil) {
        self.size = size
    }
    
    public var body: some View {
        TimelineView(.animation) { timeline in
            Canvas { context, canvasSize in
                let side = min(canvasSize.width, canvasSize.height)
                guard side > 0 else { return }
                
                let scale = side / 512.0
                let offsetX = (canvasSize.width - 512.0 * scale) / 2.0
                let offsetY = (canvasSize.height - 512.0 * scale) / 2.0
                
                let totalElapsed = timeline.date.timeIntervalSince(startTime)
                let cycleTime = totalElapsed.truncatingRemainder(dividingBy: cycleDuration)
                let isDark = (colorScheme == .dark)
                
                for dot in Self.processedDots {
                    let minR = min(2.0, dot.targetR)
                    let deltaR = dot.targetR - minR
                    var currentRadius = minR
                    var isExpanded = false
                    
                    if cycleTime < expandStart {
                        // Stage 1: Uniform small baseline
                        currentRadius = minR
                    } else if cycleTime >= expandStart && cycleTime < shrinkStart {
                        // Stage 2: Wave 1 expands from center -> scales to exact targetR
                        let waveFront = (cycleTime - expandStart) * waveSpeed
                        let distFromWave = waveFront - dot.dist
                        
                        if distFromWave <= 0 {
                            currentRadius = minR
                        } else {
                            let timeSinceArrival = distFromWave / waveSpeed
                            let progress = smoothStep(timeSinceArrival / 0.45)
                            currentRadius = minR + deltaR * progress
                            if progress > 0.6 { isExpanded = true }
                        }
                    } else {
                        // Stage 3: Wave 2 shrinks from center -> returns to minR
                        let shrinkWaveFront = (cycleTime - shrinkStart) * waveSpeed
                        let distFromShrinkWave = shrinkWaveFront - dot.dist
                        
                        if distFromShrinkWave <= 0 {
                            currentRadius = dot.targetR
                            isExpanded = true
                        } else {
                            let timeSinceArrival = distFromShrinkWave / waveSpeed
                            let progress = smoothStep(timeSinceArrival / 0.45)
                            currentRadius = dot.targetR - deltaR * progress
                            if progress < 0.4 { isExpanded = true }
                        }
                    }
                    
                    // Shading & Color calculation
                    let fillColor: Color
                    if dot.isMShape && isExpanded && currentRadius > 3.0 {
                        // 100% Solid Primary
                        fillColor = isDark ? Color(red: 0.96, green: 0.96, blue: 0.93) // #f5f5ee
                                           : Color(red: 0.17, green: 0.17, blue: 0.16) // #2b2b2a
                    } else {
                        fillColor = getSmallDotFaceColor(face: dot.face, isDark: isDark)
                    }
                    
                    // Render the scaled circle
                    let rScaled = max(1.0, currentRadius) * scale
                    let cxScaled = (dot.cx * scale) + offsetX
                    let cyScaled = (dot.cy * scale) + offsetY
                    
                    let rect = CGRect(
                        x: cxScaled - rScaled,
                        y: cyScaled - rScaled,
                        width: rScaled * 2,
                        height: rScaled * 2
                    )
                    
                    context.fill(Path(ellipseIn: rect), with: .color(fillColor))
                }
            }
        }
        .frame(width: size, height: size)
        .aspectRatio(1, contentMode: .fit)
        .onAppear {
            self.startTime = Date()
        }
    }
    
    // Smoothstep easing
    private func smoothStep(_ t: Double) -> Double {
        let clamped = max(0.0, min(1.0, t))
        return clamped * clamped * (3.0 - 2.0 * clamped)
    }
    
    // 3D Cube Face Shading
    private func getSmallDotFaceColor(face: CubeFace, isDark: Bool) -> Color {
        let base = isDark ? Color(red: 0.96, green: 0.96, blue: 0.93)
                          : Color(red: 0.17, green: 0.17, blue: 0.16)
        if isDark {
            switch face {
            case .top:   return base.opacity(0.90)
            case .left:  return base.opacity(0.60)
            case .right: return base.opacity(0.35)
            }
        } else {
            switch face {
            case .top:   return base.opacity(0.35)
            case .left:  return base.opacity(0.65)
            case .right: return base.opacity(0.92)
            }
        }
    }
}

// MARK: - Internal Types & Dot Data
private enum CubeFace {
    case top, left, right
}

private struct ProcessedDot {
    let cx: Double
    let cy: Double
    let targetR: Double
    let dist: Double
    let isMShape: Bool
    let face: CubeFace
}

extension AnimatedLogoMarkView {
    private static let processedDots: [ProcessedDot] = {
        let originX = 259.0
        let originY = 258.14
        
        return rawLogoDots.map { raw in
            let dx = raw.0 - originX
            let dy = raw.1 - originY
            let dist = sqrt(dx * dx + dy * dy)
            let isMShape = raw.2 >= 3.5
            
            let lineLeft = originY + 0.57735 * (raw.0 - originX)
            let lineRight = originY - 0.57735 * (raw.0 - originX)
            
            let face: CubeFace
            if raw.1 < lineLeft - 2.0 && raw.1 < lineRight - 2.0 {
                face = .top
            } else if raw.0 <= originX {
                face = .left
            } else {
                face = .right
            }
            
            return ProcessedDot(cx: raw.0, cy: raw.1, targetR: raw.2, dist: dist, isMShape: isMShape, face: face)
        }
    }()
    
    // 127 Exact Coordinates (cx, cy, r)
    private static let rawLogoDots: [(Double, Double, Double)] = [
        (259, 76.63, 2), (232.76, 92.09, 2.01), (285.15, 92.08, 2.05), (206.52, 107.12, 2.11),
        (258.97, 107.18, 2.09), (311.37, 107.1, 2.1), (180.44, 122.12, 2.15), (232.77, 122.12, 2.1),
        (285.07, 122.12, 2.16), (337.51, 122.1, 2.14), (154.46, 137.12, 2.13), (206.53, 137.16, 2.15),
        (258.96, 137.16, 2.08), (311.39, 137.16, 2.15), (363.44, 137.17, 2.1), (180.48, 152.28, 2.36),
        (337.47, 152.31, 2.26), (128.29, 152.33, 2.17), (232.83, 152.35, 2.16), (285.1, 152.31, 2.16),
        (389.4, 152.29, 2.12), (154.53, 167.53, 5.47), (363.47, 167.54, 5.49), (102.16, 167.46, 2.09),
        (206.55, 167.45, 2.21), (258.95, 167.44, 2.11), (311.34, 167.47, 2.23), (415.48, 167.46, 2.1),
        (128.54, 182.65, 5.25), (180.49, 182.66, 5.31), (337.46, 182.66, 5.33), (389.27, 182.67, 5.24),
        (232.82, 182.58, 2.16), (285.11, 182.58, 2.14), (154.52, 197.81, 9.31), (363.41, 197.82, 9.33),
        (206.63, 198.04, 5.5), (311.37, 198.05, 5.49), (102.18, 197.84, 2.12), (258.95, 197.76, 2.13),
        (415.45, 197.85, 2.12), (180.46, 213.23, 9.91), (337.64, 213.21, 9.86), (128.61, 213, 5.31),
        (232.8, 213.14, 5.42), (285.14, 213.12, 5.41), (389.22, 213.01, 5.27), (154.63, 227.86, 10.16),
        (363.36, 227.88, 10.07), (206.65, 228.13, 9.9), (311.46, 228.12, 9.77), (258.98, 228.16, 5.66),
        (102.17, 228.36, 2.14), (415.49, 228.31, 2.1), (180.29, 242.9, 9.9), (337.42, 242.91, 9.9),
        (232.77, 243.43, 9.86), (285.24, 243.38, 9.85), (128.58, 243.31, 5.23), (389.25, 243.31, 5.26),
        (154.65, 258.21, 10.14), (206.59, 258.22, 9.9), (259, 258.14, 9.99), (311.2, 258.22, 9.9),
        (363.34, 258.21, 10.03), (102.21, 258.71, 2.12), (415.51, 258.65, 2.12), (232.82, 273.22, 9.9),
        (285.08, 273.24, 9.9), (337.2, 273.23, 9.89), (180.3, 273.92, 9.9), (128.59, 273.8, 5.26),
        (389.21, 273.79, 5.24), (258.86, 287.68, 9.9), (154.66, 288.32, 10.08), (363.34, 288.32, 9.88),
        (206.58, 288.66, 5.32), (311.02, 289.16, 5.31), (102.17, 289.02, 2.11), (415.47, 289.04, 2.09),
        (180.29, 303.93, 9.9), (337.42, 303.91, 9.9), (128.63, 303.93, 5.31), (232.82, 303.93, 5.31),
        (285.08, 303.93, 5.32), (389.22, 303.96, 5.27), (154.68, 318.34, 10.14), (363.32, 318.38, 9.99),
        (206.58, 319.16, 5.32), (258.86, 319.16, 5.32), (311.2, 319.16, 5.32), (102.2, 319.27, 2.14),
        (415.53, 319.29, 2.16), (180.3, 333.94, 9.9), (337.41, 333.95, 9.9), (128.59, 334.09, 5.32),
        (389.23, 334.08, 5.29), (232.8, 334.08, 2.13), (285.06, 334.1, 2.14), (154.68, 348.27, 9.93),
        (363.35, 348.35, 9.81), (206.58, 349.18, 5.31), (311.2, 349.18, 5.31), (102.18, 349.43, 2.11),
        (258.94, 349.36, 2.06), (415.44, 349.38, 2.09), (180.29, 363.79, 9.9), (337.43, 363.8, 9.9),
        (128.62, 363.71, 5.09), (389.22, 363.71, 5), (232.78, 363.72, 2.11), (285.09, 363.66, 2.11),
        (363.23, 377.55, 8.21), (154.7, 377.6, 8.12), (206.58, 378.38, 5.32), (311.2, 378.38, 5.32),
        (258.95, 378.57, 2.09), (180.3, 393.04, 8.23), (337.2, 393.05, 8.22), (232.8, 393.16, 2.14),
        (285.08, 393.16, 2.15), (206.39, 408.3, 5.13), (311.2, 408.3, 5.12), (258.94, 408.08, 2.1),
        (232.75, 422.5, 2.11), (285.07, 422.49, 2.13), (258.96, 437.15, 2.12)
    ]
}

// MARK: - Preview
#Preview {
    VStack(spacing: 40) {
        AnimatedLogoMarkView(size: 240)
    }
    .padding(50)
    .frame(width: 400, height: 400)
    .background(Color(red: 0.05, green: 0.05, blue: 0.05))
}
