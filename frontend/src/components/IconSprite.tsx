/**
 * Icon-Set der Leistungen: einmal definiert, in den Karten per
 * <use href="#i-..."> verwendet. Strichstärke und Farbe kommen aus
 * dem CSS der Klasse service__icon.
 */
function IconSprite() {
  return (
    <svg className="sprite" aria-hidden="true" focusable="false" width="0" height="0">
      <defs>
        <symbol id="i-fundament" viewBox="0 0 24 24"><path d="M4 20h16M6 20V10l6-4 6 4v10M10 20v-5h4v5" /></symbol>
        <symbol id="i-leitung" viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="6" rx="3" /><path d="M9 9v6M15 9v6" /></symbol>
        <symbol id="i-versickerung" viewBox="0 0 24 24"><path d="M3 7h5M16 7h5" /><path d="M12 4c-2.2 3.2-3.6 5.2-3.6 7.2a3.6 3.6 0 0 0 7.2 0c0-2-1.4-4-3.6-7.2z" /></symbol>
        <symbol id="i-planum" viewBox="0 0 24 24"><rect x="3" y="9" width="18" height="6" rx="1" /><circle cx="12" cy="12" r="1.6" /><path d="M10.4 12h3.2" /></symbol>
        <symbol id="i-pflaster" viewBox="0 0 24 24"><path d="M12 4 3 9l9 5 9-5-9-5z" /><path d="M3 14l9 5 9-5" /></symbol>
        <symbol id="i-roden" viewBox="0 0 24 24"><path d="M12 21v-7M12 14c0-3 2-5.2 5.2-5.2C17.2 12 15.2 14 12 14zM12 14c0-3-2-5.2-5.2-5.2C6.8 12 8.8 14 12 14z" /></symbol>
        <symbol id="i-mutterboden" viewBox="0 0 24 24"><path d="M5 14h14M12 14V5M7 14v4M10.5 14v4M13.5 14v4M17 14v4" /></symbol>
        <symbol id="i-verfuellen" viewBox="0 0 24 24"><path d="M4 13v6a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-6M12 3v8M8 7l4 4 4-4" /></symbol>
        <symbol id="i-boeschung" viewBox="0 0 24 24"><path d="M3 19h18M5 19 19 7M9 19v-3.5M12.5 19v-6M16 19v-8.5" /></symbol>
        <symbol id="i-garten" viewBox="0 0 24 24"><rect x="3" y="15.5" width="11" height="3.2" rx="1.6" /><path d="M6.5 15.5V12h4l1.2 3.5M11 12l4.2-3 3 4M18 13.4l2.2 1-1 2.2-2.4-1z" /></symbol>
      </defs>
    </svg>
  )
}

export default IconSprite
