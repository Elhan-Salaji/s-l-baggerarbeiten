package de.slbaggerarbeiten.backend.kontakt;

/**
 * Leitet Kontaktanfragen an den Betreiber weiter. Der Versandweg ist
 * austauschbar: Aktuell verschickt {@link MailNotificationService}
 * E-Mails per SMTP.
 */
public interface NotificationService {

    /**
     * Leitet die Anfrage weiter.
     *
     * @throws org.springframework.mail.MailException wenn der Versand fehlschlägt
     */
    void sendeKontaktanfrage(KontaktRequest request);
}
