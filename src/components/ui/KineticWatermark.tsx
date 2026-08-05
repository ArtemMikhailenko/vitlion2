export default function KineticWatermark({ text = 'VITLION' }: { text?: string }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden pointer-events-none select-none"
      aria-hidden="true"
    >
      <div
        className="absolute -inset-8 flex items-center justify-center animate-kinetic"
        style={{ opacity: 0.055 }}
      >
        <span
          className="text-[22vw] font-black tracking-widest text-gold whitespace-nowrap"
          style={{ letterSpacing: '0.2em' }}
        >
          {text}
        </span>
      </div>
    </div>
  )
}
