"use client"

import * as React from "react"

type Point = { x: number; y: number }
type PathSpec = { points: Point[] }

export function HeroConnectionBackground() {
	const width = 1200
	const height = 360

	const [paths, setPaths] = React.useState<PathSpec[]>([])
	const pathRefs = React.useRef<(SVGPathElement | null)[]>([])
	const [pathLengths, setPathLengths] = React.useState<number[]>([])

	React.useEffect(() => {
		// Generate 2-3 random paths with 5-8 dots each
		const numPaths = 2 + Math.floor(Math.random() * 2) // 2..3
		const generated: PathSpec[] = []
		for (let p = 0; p < numPaths; p++) {
			const numDots = 5 + Math.floor(Math.random() * 4) // 5..8
			const marginX = 40
			const marginY = 60
			const bandTop = marginY + p * 40
			const bandBottom = height - marginY - p * 30
			const segment = (width - marginX * 2) / (numDots - 1)
			const pts: Point[] = []
			for (let i = 0; i < numDots; i++) {
				const x = marginX + i * segment + (Math.random() - 0.5) * 30
				const y =
					bandTop +
					Math.random() * Math.max(20, bandBottom - bandTop)
				pts.push({ x, y })
			}
			generated.push({ points: pts })
		}
		setPaths(generated)
	}, [])

	React.useEffect(() => {
		// compute lengths after refs set
		const lengths = pathRefs.current.map((el) => {
			try {
				return el?.getTotalLength() ?? 1
			} catch {
				return 1
			}
		})
		setPathLengths(lengths)
	}, [paths])

	const lineDuration = 2200 // ms

	return (
		<div
			aria-hidden
			className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40 mix-blend-overlay"
			style={{
				WebkitMaskImage:
					"linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
				maskImage:
					"linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)",
			}}
		>
			<svg
				className="h-full w-full blur-[1px]"
				viewBox={`0 0 ${width} ${height}`}
				preserveAspectRatio="none"
			>
				{paths.map((path, idx) => {
					const d =
						path.points.length > 0
							? `M ${path.points
									.map((p, i) =>
										i === 0 ? `${p.x},${p.y}` : `L ${p.x},${p.y}`,
									)
									.join(" ")}`.replace("L", "")
							: ""
					const length = pathLengths[idx] ?? 1
					const delay = idx * 300
					return (
						<g key={`path-${idx}`} strokeLinecap="round" strokeLinejoin="round">
							<path
								ref={(el) => (pathRefs.current[idx] = el)}
								d={d}
								fill="none"
								stroke="currentColor"
								className="text-primary/60"
								strokeWidth={3}
								style={{
									strokeDasharray: length,
									strokeDashoffset: length,
									animation: `draw-connection ${lineDuration}ms ease forwards`,
									animationDelay: `${delay}ms`,
								}}
							/>
							{path.points.map((p, i) => {
								const dotDelay =
									delay + ((i + 1) / path.points.length) * lineDuration
								return (
									<g key={`dot-${idx}-${i}`}>
										<circle
											cx={p.x}
											cy={p.y}
											r={6}
											fill="currentColor"
											className="text-primary"
											style={{
												opacity: 0,
												animation: "fade-in 300ms ease forwards",
												animationDelay: `${dotDelay}ms`,
											}}
										/>
										<g
											transform={`translate(${p.x} ${p.y})`}
											className="text-primary-foreground"
											style={{
												transformOrigin: `${p.x}px ${p.y}px`,
												opacity: 0,
												animation: "pop-in 450ms ease forwards",
												animationDelay: `${dotDelay + 100}ms`,
											}}
										>
											<path
												d="M -3 0 l2 2 l5 -5"
												fill="none"
												stroke="currentColor"
												strokeWidth={2.5}
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</g>
									</g>
								)
							})}
						</g>
					)
				})}
			</svg>

			<style jsx global>{`
        @keyframes draw-connection {
          to {
            stroke-dashoffset: 0;
          }
        }
        @keyframes pop-in {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          60% {
            transform: scale(1.1);
            opacity: 1;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
		</div>
	)
}


