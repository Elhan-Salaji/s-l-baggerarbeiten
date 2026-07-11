package de.slbaggerarbeiten.backend.kontakt;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * Adressen für den Versand der Kontaktanfragen.
 *
 * @param recipient Empfänger der Anfragen, der Betreiber
 * @param from      fester, beim SMTP-Anbieter autorisierter Absender.
 *                  Die Adresse aus dem Formular wird bewusst nur als
 *                  Reply-To gesetzt, sonst lehnen Mailserver den Versand
 *                  als gefälschten Absender ab (SPF/DKIM).
 */
@ConfigurationProperties(prefix = "app.kontakt")
public record KontaktMailProperties(String recipient, String from) {
}
