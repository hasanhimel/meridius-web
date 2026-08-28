import AppKit
import CoreGraphics
import Foundation

struct SoftwareCursorGlyphRenderState {
    let rotation: CGFloat
    let cursorBodyOffset: CGVector
    let fogOffset: CGVector
    let fogOpacity: CGFloat
    let fogScale: CGFloat
    let clickProgress: CGFloat
    let displayScale: CGFloat

    init(
        rotation: CGFloat,
        cursorBodyOffset: CGVector,
        fogOffset: CGVector,
        fogOpacity: CGFloat,
        fogScale: CGFloat,
        clickProgress: CGFloat,
        displayScale: CGFloat = 1.0
    ) {
        self.rotation = rotation
        self.cursorBodyOffset = cursorBodyOffset
        self.fogOffset = fogOffset
        self.fogOpacity = fogOpacity
        self.fogScale = fogScale
        self.clickProgress = clickProgress
        self.displayScale = displayScale
    }

    var appKitDrawingState: SoftwareCursorGlyphRenderState {
        SoftwareCursorGlyphRenderState(
            rotation: -rotation,
            cursorBodyOffset: CGVector(dx: cursorBodyOffset.dx, dy: -cursorBodyOffset.dy),
            fogOffset: CGVector(dx: fogOffset.dx, dy: -fogOffset.dy),
            fogOpacity: fogOpacity,
            fogScale: fogScale,
            clickProgress: clickProgress,
            displayScale: displayScale
        )
    }
}

enum SoftwareCursorGlyphMetrics {
    static let windowSize = CGSize(width: 126, height: 126)
    static let tipAnchor = CGPoint(x: 63.0, y: 63.0)
    static let referenceImageResourceName = "official-software-cursor-window-252"

    // Recomputed for the traced rounded-arrow artwork: its own bounding box has
    // width:height aspect 375.1:452.0 (0.82987), not the old placeholder's 19:20.6.
    // Height kept at 20.6 to preserve the on-screen cursor size; width derived from
    // the traced shape's own aspect ratio so mapPoint() doesn't stretch it.
    static let pointerSize = CGSize(width: 17.09527, height: 20.6)

    static let targetNeutralHeading = -(3 * CGFloat.pi / 4)

    // 🔶 The old placeholder path was a symmetric "north-pointing" kite that needed
    // +45° to become the up-left arrow. The traced path is already drawn in that
    // final up-left orientation — identical convention to drawReferenceImage(),
    // which applies zero extra rotation on top of `state.rotation`. So this is now 0.
    // If `targetNeutralHeading` (or code elsewhere) was tuned assuming the old +45°
    // offset, that math should be re-checked against this change.
    static let pointerArtworkRotation: CGFloat = 0.0
}

private enum SoftwareCursorGlyphColors {
    static let pointerFill = NSColor(calibratedRed: 0.12, green: 0.12, blue: 0.14, alpha: 1.0)
    static let pointerStroke = NSColor(calibratedWhite: 1.0, alpha: 0.96)
}

enum SoftwareCursorGlyphRenderer {
    nonisolated(unsafe) private static let referenceImage = loadReferenceCursorWindowImage()

    static func draw(
        in bounds: CGRect,
        context: CGContext,
        state: SoftwareCursorGlyphRenderState
    ) {
        let drawingState = state.appKitDrawingState
        let scale = drawingState.displayScale
        let tipAnchor = SoftwareCursorGlyphMetrics.tipAnchor

        context.saveGState()
        if scale != 1.0 && scale > 0 {
            context.translateBy(x: tipAnchor.x, y: tipAnchor.y)
            context.scaleBy(x: scale, y: scale)
            context.translateBy(x: -tipAnchor.x, y: -tipAnchor.y)
        }

        if let referenceImage {
            drawReferenceImage(
                referenceImage,
                in: bounds,
                context: context,
                state: drawingState
            )
            context.restoreGState()
            return
        }

        let pulse = drawingState.clickProgress
        drawPointer(
            in: context,
            tipAnchor: tipAnchor,
            rotation: drawingState.rotation,
            clickProgress: pulse,
            cursorBodyOffset: drawingState.cursorBodyOffset
        )
        context.restoreGState()
    }

    private static func drawReferenceImage(
        _ image: NSImage,
        in bounds: CGRect,
        context: CGContext,
        state: SoftwareCursorGlyphRenderState
    ) {
        let motionCompression = min(hypot(state.cursorBodyOffset.dx, state.cursorBodyOffset.dy) * 0.008, 0.018)
        let pulseCompression = state.clickProgress * 0.03

        context.saveGState()
        context.interpolationQuality = .high
        context.translateBy(
            x: bounds.midX + state.cursorBodyOffset.dx,
            y: bounds.midY + state.cursorBodyOffset.dy
        )
        context.rotate(by: state.rotation)
        context.scaleBy(
            x: 1 - motionCompression - pulseCompression,
            y: 1 + (pulseCompression * 0.4)
        )
        context.translateBy(x: -bounds.midX, y: -bounds.midY)
        image.draw(in: bounds, from: .zero, operation: .sourceOver, fraction: 1)
        context.restoreGState()
    }

    private static func drawFog(
        in context: CGContext,
        center: CGPoint,
        pulse: CGFloat,
        fogOpacity: CGFloat,
        fogScale: CGFloat
    ) {
        let radius = ((66 * fogScale) / 2) + (pulse * 1.2)
        let glowRadius = radius * (0.30 + (pulse * 0.025))
        let opacityMultiplier = max(0.28, min(fogOpacity / 0.12, 2.2))
        let colors = [
            NSColor(calibratedRed: 0.38, green: 0.36, blue: 0.35, alpha: (0.40 + (pulse * 0.02)) * opacityMultiplier).cgColor,
            NSColor(calibratedRed: 0.43, green: 0.41, blue: 0.40, alpha: (0.28 + (pulse * 0.015)) * opacityMultiplier).cgColor,
            NSColor(calibratedRed: 0.46, green: 0.44, blue: 0.43, alpha: 0.11 * opacityMultiplier).cgColor,
            NSColor(calibratedWhite: 0.60, alpha: 0.0).cgColor,
        ] as CFArray
        let locations: [CGFloat] = [0, 0.50, 0.82, 1]
        let colorSpace = CGColorSpaceCreateDeviceRGB()

        guard let gradient = CGGradient(colorsSpace: colorSpace, colors: colors, locations: locations) else {
            return
        }

        context.saveGState()
        context.drawRadialGradient(
            gradient,
            startCenter: center,
            startRadius: 0,
            endCenter: center,
            endRadius: radius,
            options: [.drawsBeforeStartLocation, .drawsAfterEndLocation]
        )
        context.restoreGState()

        let coreColors = [
            NSColor(calibratedRed: 0.41, green: 0.39, blue: 0.38, alpha: (0.020 + (pulse * 0.006)) * opacityMultiplier).cgColor,
            NSColor(calibratedRed: 0.44, green: 0.41, blue: 0.40, alpha: 0.008 * opacityMultiplier).cgColor,
            NSColor(calibratedWhite: 0.80, alpha: 0.0).cgColor,
        ] as CFArray
        let coreLocations: [CGFloat] = [0, 0.62, 1]
        guard let coreGradient = CGGradient(colorsSpace: colorSpace, colors: coreColors, locations: coreLocations) else {
            return
        }

        context.saveGState()
        context.drawRadialGradient(
            coreGradient,
            startCenter: center,
            startRadius: 0,
            endCenter: center,
            endRadius: glowRadius,
            options: [.drawsBeforeStartLocation, .drawsAfterEndLocation]
        )
        context.restoreGState()
    }

    private static func drawPointer(
        in context: CGContext,
        tipAnchor: CGPoint,
        rotation: CGFloat,
        clickProgress: CGFloat,
        cursorBodyOffset: CGVector
    ) {
        let pointerWidth = SoftwareCursorGlyphMetrics.pointerSize.width
        let pointerHeight = SoftwareCursorGlyphMetrics.pointerSize.height

        // Traced tip sits ~6.93% across the artwork's own bounding box (it's far
        // left of center — the belly/tail extends well to the right of the tip),
        // not ~50% like the old symmetric placeholder. Recomputed from the trace.
        let tipOffsetX = 0.06931 * pointerWidth

        let pointerRect = CGRect(
            x: tipAnchor.x - tipOffsetX,
            y: tipAnchor.y - pointerHeight,
            width: pointerWidth,
            height: pointerHeight
        )
        let outerPath = smoothCursorPath(in: pointerRect)

        context.saveGState()
        // Rotate and scale cleanly around tipAnchor so the tip NEVER drifts
        context.translateBy(
            x: tipAnchor.x + cursorBodyOffset.dx,
            y: tipAnchor.y + cursorBodyOffset.dy
        )
        context.rotate(by: rotation + SoftwareCursorGlyphMetrics.pointerArtworkRotation)
        context.scaleBy(x: 1 - (clickProgress * 0.04), y: 1 + (clickProgress * 0.02))
        context.translateBy(
            x: -(tipAnchor.x + cursorBodyOffset.dx),
            y: -(tipAnchor.y + cursorBodyOffset.dy)
        )

        NSGraphicsContext.saveGraphicsState()
        let shadow = NSShadow()
        shadow.shadowBlurRadius = 3.5 + (clickProgress * 1.4)
        shadow.shadowOffset = CGSize(width: 0, height: -1.8)
        shadow.shadowColor = NSColor.black.withAlphaComponent(0.28)
        shadow.set()
        NSColor.black.withAlphaComponent(0.12).setFill()
        outerPath.fill()
        NSGraphicsContext.restoreGraphicsState()

        SoftwareCursorGlyphColors.pointerFill.setFill()
        outerPath.fill()

        SoftwareCursorGlyphColors.pointerStroke.setStroke()
        outerPath.lineWidth = 1.4
        outerPath.lineJoinStyle = .round
        outerPath.lineCapStyle = .round
        outerPath.stroke()

        context.restoreGState()
    }

    /// Traced from the reference cursor artwork (potrace → cubic beziers), rather
    /// than hand-authored. This is a single continuous sweep — tip, long outer
    /// curve down to the belly, rounded notch, short inner leg, back to the tip —
    /// unlike the old placeholder's symmetric tip+two-tails construction. There is
    /// no longer a genuinely sharp vertex anywhere on this path; every join is a
    /// soft curve, so `.round` line joins remain correct but aren't load-bearing
    /// the way they were for the old apex.
    private static func smoothCursorPath(in rect: CGRect) -> NSBezierPath {
        let sourceMinX: CGFloat = 39.50000
        let sourceWidth: CGFloat = 375.10000
        let sourceMinY: CGFloat = -0.50000
        let sourceHeight: CGFloat = 452.00000

        func mapPoint(_ x: CGFloat, _ y: CGFloat) -> CGPoint {
            let normX = (x - sourceMinX) / sourceWidth
            let normY = 1.0 - ((y - sourceMinY) / sourceHeight)
            return CGPoint(
                x: rect.minX + (normX * rect.width),
                y: rect.minY + (normY * rect.height)
            )
        }

        let path = NSBezierPath()
        path.move(to: mapPoint(65.50000, 0.90000))
        path.curve(
            to: mapPoint(42.20000, 19.80000),
            controlPoint1: mapPoint(55.00000, 3.60000),
            controlPoint2: mapPoint(46.50000, 10.60000)
        )
        path.line(to: mapPoint(39.50000, 421.50000))
        path.line(to: mapPoint(42.80000, 428.20000))
        path.curve(
            to: mapPoint(87.60000, 443.00000),
            controlPoint1: mapPoint(51.00000, 445.00000),
            controlPoint2: mapPoint(70.90000, 451.50000)
        )
        path.line(to: mapPoint(94.40000, 439.50000))
        path.line(to: mapPoint(129.20000, 395.50000))
        path.curve(
            to: mapPoint(180.00000, 331.40000),
            controlPoint1: mapPoint(148.40000, 371.30000),
            controlPoint2: mapPoint(171.20000, 342.40000)
        )
        path.curve(
            to: mapPoint(200.70000, 308.10000),
            controlPoint1: mapPoint(191.00000, 317.50000),
            controlPoint2: mapPoint(197.40000, 310.30000)
        )
        path.curve(
            to: mapPoint(295.60000, 302.00000),
            controlPoint1: mapPoint(210.10000, 301.80000),
            controlPoint2: mapPoint(207.50000, 302.00000)
        )
        path.curve(
            to: mapPoint(390.10000, 298.00000),
            controlPoint1: mapPoint(378.20000, 302.00000),
            controlPoint2: mapPoint(382.40000, 301.80000)
        )
        path.curve(
            to: mapPoint(407.10000, 261.90000),
            controlPoint1: mapPoint(402.20000, 291.80000),
            controlPoint2: mapPoint(409.90000, 275.50000)
        )
        path.curve(
            to: mapPoint(245.50000, 125.80000),
            controlPoint1: mapPoint(404.30000, 248.70000),
            controlPoint2: mapPoint(414.60000, 257.40000)
        )
        path.curve(
            to: mapPoint(86.50000, 3.50000),
            controlPoint1: mapPoint(160.80000, 59.90000),
            controlPoint2: mapPoint(89.20000, 4.80000)
        )
        path.curve(
            to: mapPoint(65.50000, 0.90000),
            controlPoint1: mapPoint(81.00000, 0.80000),
            controlPoint2: mapPoint(70.70000, -0.50000)
        )
        path.close()
        path.lineJoinStyle = .round
        path.lineCapStyle = .round
        return path
    }
}

func loadReferenceCursorWindowImage() -> NSImage? {
    if let bundledReference = Bundle.main.url(
        forResource: SoftwareCursorGlyphMetrics.referenceImageResourceName,
        withExtension: "png"
    ), let image = NSImage(contentsOf: bundledReference) {
        return image
    }

    let fileURL = URL(fileURLWithPath: #filePath).standardizedFileURL
    let repoRoot = fileURL
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()
        .deletingLastPathComponent()

    let referenceURL = repoRoot
        .appendingPathComponent("docs/references/codex-computer-use-reverse-engineering/assets/extracted-2026-04-19/\(SoftwareCursorGlyphMetrics.referenceImageResourceName).png")

    return NSImage(contentsOf: referenceURL)
}
