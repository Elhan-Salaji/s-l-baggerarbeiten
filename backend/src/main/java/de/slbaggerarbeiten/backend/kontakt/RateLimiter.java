package de.slbaggerarbeiten.backend.kontakt;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.springframework.stereotype.Component;

/**
 * Begrenzt Kontaktanfragen je Absender-Adresse auf ein festes
 * Stundenfenster. Der Zustand lebt im Speicher: Ein Neustart setzt die
 * Zähler zurück, und mehrere Instanzen zählen getrennt. Für eine
 * einzelne Backend-Instanz mit Handvoll Anfragen pro Tag reicht das
 * (siehe ADR 0004).
 */
@Component
public class RateLimiter {

    static final int LIMIT = 5;
    static final Duration WINDOW = Duration.ofHours(1);

    private final ConcurrentHashMap<String, Window> windows = new ConcurrentHashMap<>();
    private final Clock clock;

    public RateLimiter(Clock clock) {
        this.clock = clock;
    }

    /** Meldet, ob eine weitere Anfrage dieser Gegenstelle noch ins Fenster passt. */
    public boolean allow(String clientKey) {
        Instant now = clock.instant();
        // Abgelaufene Fenster bei der Gelegenheit ausräumen, die Map bleibt klein.
        windows.entrySet().removeIf(entry -> entry.getValue().isExpired(now));

        Window window = windows.compute(clientKey, (key, existing) ->
                existing == null || existing.isExpired(now) ? new Window(now, new AtomicInteger()) : existing);
        return window.count().incrementAndGet() <= LIMIT;
    }

    private record Window(Instant start, AtomicInteger count) {

        boolean isExpired(Instant now) {
            return start.plus(WINDOW).isBefore(now);
        }
    }
}
