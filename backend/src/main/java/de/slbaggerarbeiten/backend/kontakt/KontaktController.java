package de.slbaggerarbeiten.backend.kontakt;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Nimmt Kontaktanfragen der Webseite entgegen. Der Aufruf ist synchron:
 * Die Antwort sagt ehrlich, ob die Nachricht den Betreiber erreicht.
 */
@RestController
@RequestMapping("/api/kontakt")
public class KontaktController {

    private static final Logger log = LoggerFactory.getLogger(KontaktController.class);

    private final NotificationService notificationService;
    private final RateLimiter rateLimiter;

    public KontaktController(NotificationService notificationService, RateLimiter rateLimiter) {
        this.notificationService = notificationService;
        this.rateLimiter = rateLimiter;
    }

    @PostMapping
    public ResponseEntity<Void> sendeAnfrage(@Valid @RequestBody KontaktRequest request,
            HttpServletRequest httpRequest) {
        if (!rateLimiter.allow(httpRequest.getRemoteAddr())) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS).build();
        }

        // Bots bekommen dieselbe Antwort wie Menschen und lernen nichts.
        if (request.istHoneypotAusgeloest()) {
            log.info("Honeypot ausgelöst, Anfrage still verworfen");
            return ResponseEntity.ok().build();
        }

        notificationService.sendeKontaktanfrage(request);
        return ResponseEntity.ok().build();
    }
}
