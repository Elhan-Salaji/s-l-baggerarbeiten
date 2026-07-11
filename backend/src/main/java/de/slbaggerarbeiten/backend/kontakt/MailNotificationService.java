package de.slbaggerarbeiten.backend.kontakt;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Verschickt Kontaktanfragen als E-Mail an den Betreiber. Der Versand
 * läuft synchron im Anfrage-Thread mit knappen SMTP-Timeouts (siehe
 * application.yml): Die Absender bekommen so eine ehrliche Rückmeldung,
 * ob ihre Nachricht angekommen ist.
 */
@Service
public class MailNotificationService implements NotificationService {

    private final JavaMailSender mailSender;
    private final KontaktMailProperties properties;

    public MailNotificationService(JavaMailSender mailSender, KontaktMailProperties properties) {
        this.mailSender = mailSender;
        this.properties = properties;
    }

    @Override
    public void sendeKontaktanfrage(KontaktRequest request) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(properties.recipient());
        message.setFrom(properties.from());
        message.setReplyTo(request.email());
        message.setSubject("Neue Kontaktanfrage von " + request.name());
        message.setText("""
                Neue Anfrage über das Kontaktformular der Webseite.

                Name: %s
                E-Mail: %s

                Nachricht:
                %s
                """.formatted(request.name(), request.email(), request.nachricht()));
        mailSender.send(message);
    }
}
