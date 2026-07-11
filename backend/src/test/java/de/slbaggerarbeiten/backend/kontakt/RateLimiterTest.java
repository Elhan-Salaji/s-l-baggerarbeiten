package de.slbaggerarbeiten.backend.kontakt;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import org.junit.jupiter.api.Test;

class RateLimiterTest {

    /** Verstellbare Uhr: Tests spulen die Zeit vor, statt zu warten. */
    private static final class TestClock extends Clock {

        private Instant now = Instant.parse("2026-07-11T08:00:00Z");

        void vorspulen(Duration duration) {
            now = now.plus(duration);
        }

        @Override
        public Instant instant() {
            return now;
        }

        @Override
        public ZoneId getZone() {
            return ZoneOffset.UTC;
        }

        @Override
        public Clock withZone(ZoneId zone) {
            return this;
        }
    }

    private final TestClock clock = new TestClock();
    private final RateLimiter rateLimiter = new RateLimiter(clock);

    @Test
    void erlaubtAnfragenBisEinschliesslichDesLimits() {
        for (int i = 1; i <= RateLimiter.LIMIT; i++) {
            assertThat(rateLimiter.allow("192.0.2.1")).as("Anfrage %d", i).isTrue();
        }
    }

    @Test
    void blocktDieAnfrageUeberDemLimit() {
        for (int i = 0; i < RateLimiter.LIMIT; i++) {
            rateLimiter.allow("192.0.2.1");
        }

        assertThat(rateLimiter.allow("192.0.2.1")).isFalse();
    }

    @Test
    void erlaubtWiederNachAblaufDesFensters() {
        for (int i = 0; i <= RateLimiter.LIMIT; i++) {
            rateLimiter.allow("192.0.2.1");
        }
        clock.vorspulen(RateLimiter.WINDOW.plusSeconds(1));

        assertThat(rateLimiter.allow("192.0.2.1")).isTrue();
    }

    @Test
    void zaehltGegenstellenUnabhaengigVoneinander() {
        for (int i = 0; i < RateLimiter.LIMIT; i++) {
            rateLimiter.allow("192.0.2.1");
        }

        assertThat(rateLimiter.allow("192.0.2.2")).isTrue();
    }
}
