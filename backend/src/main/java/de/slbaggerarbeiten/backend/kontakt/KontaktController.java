package de.slbaggerarbeiten.backend.kontakt;

import jakarta.validation.Valid;
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

    private final NotificationService notificationService;

    public KontaktController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping
    public ResponseEntity<Void> sendeAnfrage(@Valid @RequestBody KontaktRequest request) {
        notificationService.sendeKontaktanfrage(request);
        return ResponseEntity.ok().build();
    }
}
