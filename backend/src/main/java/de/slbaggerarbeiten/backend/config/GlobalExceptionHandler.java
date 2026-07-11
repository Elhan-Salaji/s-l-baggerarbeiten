package de.slbaggerarbeiten.backend.config;

import java.util.LinkedHashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.mail.MailException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * Übersetzt Fehler in ProblemDetail-Antworten (RFC 9457) mit deutschen
 * Meldungen, die das Frontend den Besuchern direkt anzeigen kann.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /** Validierungsfehler: 400 mit einer Meldung je Feld. */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ProblemDetail handleValidierungsfehler(MethodArgumentNotValidException exception) {
        Map<String, String> felder = new LinkedHashMap<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(fehler -> felder.putIfAbsent(fehler.getField(), fehler.getDefaultMessage()));

        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
        problem.setTitle("Ungültige Anfrage");
        problem.setDetail("Bitte prüfen Sie Ihre Eingaben.");
        problem.setProperty("felder", felder);
        return problem;
    }

    /** Versandfehler: 503, die Anfrage kann später wiederholt werden. */
    @ExceptionHandler(MailException.class)
    public ProblemDetail handleVersandfehler(MailException exception) {
        log.error("Mailversand fehlgeschlagen", exception);

        ProblemDetail problem = ProblemDetail.forStatus(HttpStatus.SERVICE_UNAVAILABLE);
        problem.setTitle("Versand derzeit nicht möglich");
        problem.setDetail("Ihre Nachricht konnte gerade nicht übermittelt werden. "
                + "Bitte versuchen Sie es später erneut oder rufen Sie direkt an.");
        return problem;
    }
}
