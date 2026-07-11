package de.slbaggerarbeiten.backend.kontakt;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Eine Anfrage aus dem Kontaktformular. Die Validierung läuft an der
 * Schnittstelle, bevor die Daten die Anwendung erreichen.
 *
 * @param name        Name der anfragenden Person
 * @param email       Antwortadresse, wird als Reply-To übernommen
 * @param nachricht   Inhalt der Anfrage
 * @param datenschutz Zustimmung zur Datenschutzerklärung, muss gesetzt sein
 * @param website     Honeypot-Feld: Menschen lassen es leer, Bots füllen es.
 *                    Ein gefülltes Feld führt zum stillen Verwerfen der Anfrage.
 */
public record KontaktRequest(

        @NotBlank(message = "Bitte geben Sie Ihren Namen an.")
        @Size(max = 100, message = "Der Name darf höchstens 100 Zeichen lang sein.")
        String name,

        @NotBlank(message = "Bitte geben Sie Ihre E-Mail-Adresse an.")
        @Email(message = "Bitte geben Sie eine gültige E-Mail-Adresse an.")
        @Size(max = 200, message = "Die E-Mail-Adresse darf höchstens 200 Zeichen lang sein.")
        String email,

        @NotBlank(message = "Bitte geben Sie eine Nachricht ein.")
        @Size(min = 10, max = 5000, message = "Die Nachricht muss zwischen 10 und 5000 Zeichen lang sein.")
        String nachricht,

        @AssertTrue(message = "Bitte stimmen Sie der Datenschutzerklärung zu.")
        boolean datenschutz,

        String website) {

    /** Meldet, ob das Honeypot-Feld gefüllt wurde und die Anfrage von einem Bot stammt. */
    public boolean istHoneypotAusgeloest() {
        return website != null && !website.isBlank();
    }
}
