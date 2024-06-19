export function Logo() {
  return (
    <svg aria-hidden="true" focusable="false" viewBox="-20 -20 442.66 292.6">
      <defs>
        <filter id="outer-glow-1" filterUnits="userSpaceOnUse">
          <feOffset dx="0" dy="0" />
          <feGaussianBlur result="blur" stdDeviation="11" />
          <feFlood floodColor="#27b7ff" floodOpacity="0.3" />
          <feComposite in2="blur" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
        <filter id="outer-glow-2" filterUnits="userSpaceOnUse">
          <feOffset dx="0" dy="0" />
          <feGaussianBlur result="blur-2" stdDeviation="18" />
          <feFlood floodColor="#27b7ff" floodOpacity="1" />
          <feComposite in2="blur-2" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>
      </defs>
      <path
        d="M276.31,130.32c5.77-4.52,10.62-10.16,14.06-16.69,3.81-7.23,6-15.45,6-24.17,0-20.1-11.49-37.54-28.22-46.19-7.13-3.69-15.2-5.8-23.77-5.8h-82.4v30.54h82.4c11.83,0,21.45,9.62,21.45,21.45s-9.62,21.45-21.45,21.45"
        filter="url(#outer-glow-1)"
      />
      <path
        d="M350.07,165.42c-13.6,0-25.33,7.86-30.98,19.27h-25.41c-.36-7.37-.7-14.56-.94-21.74-.46-14.19-4.69-25.73-16.67-32.49,5.79-4.53,10.65-10.19,14.11-16.75,3.83-7.25,6.02-15.5,6.02-24.26,0-20.17-11.53-37.67-28.32-46.35-7.16-3.7-15.25-5.83-23.85-5.83H83.57c-5.65-11.41-17.38-19.27-30.98-19.27-19.11,0-34.59,15.48-34.59,34.59s15.49,34.59,34.59,34.59c13.59,0,25.32-7.86,30.98-19.27h160.46c11.87,0,21.53,9.66,21.53,21.53s-9.66,21.53-21.53,21.53h-87.55c-28.77,0-52.18,23.41-52.18,52.18s23.41,52.18,52.18,52.18h162.61c5.65,11.41,17.38,19.27,30.98,19.27,19.11,0,34.59-15.48,34.59-34.59s-15.48-34.59-34.59-34.59ZM214.81,184.68c0-4.42-.01-8.31,0-12.16.03-6.55-3.48-9.4-9.83-9.37-14.55.06-29.11.11-43.66.17v21.36h-4.86c-11.87,0-21.53-9.66-21.53-21.53s9.66-21.53,21.53-21.53h76.86c10.22,1.23,14.76,7.1,15.92,19.13.77,7.95,1.09,15.94,1.42,23.93h-35.86Z"
        fill="white"
        filter="url(#outer-glow-2)"
      />
    </svg>
  );
}
