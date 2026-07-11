package de.slbaggerarbeiten.backend.kontakt;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

class MailNotificationServiceTest {

    private static final KontaktRequest ANFRAGE = new KontaktRequest(
            "Erika Musterfrau",
            "erika@example.de",
            "Bitte um ein Angebot für einen Leitungsgraben im Garten.",
            true,
            null);

    private JavaMailSender mailSender;
    private MailNotificationService service;

    @BeforeEach
    void setUp() {
        mailSender = mock(JavaMailSender.class);
        var properties = new KontaktMailProperties("betreiber@example.de", "noreply@example.de");
        service = new MailNotificationService(mailSender, properties);
    }

    @Test
    void versendetAnfrageMitAdressenAusKonfigurationUndAntwortAnAbsender() {
        service.sendeKontaktanfrage(ANFRAGE);

        ArgumentCaptor<SimpleMailMessage> captor = ArgumentCaptor.forClass(SimpleMailMessage.class);
        verify(mailSender).send(captor.capture());
        SimpleMailMessage mail = captor.getValue();

        assertThat(mail.getTo()).containsExactly("betreiber@example.de");
        assertThat(mail.getFrom()).isEqualTo("noreply@example.de");
        assertThat(mail.getReplyTo()).isEqualTo("erika@example.de");
        assertThat(mail.getSubject()).isEqualTo("Neue Kontaktanfrage von Erika Musterfrau");
        assertThat(mail.getText())
                .contains("Erika Musterfrau")
                .contains("erika@example.de")
                .contains("Bitte um ein Angebot für einen Leitungsgraben im Garten.");
    }

    @Test
    void reichtVersandfehlerAnDenAufruferWeiter() {
        doThrow(new MailSendException("SMTP nicht erreichbar")).when(mailSender).send(any(SimpleMailMessage.class));

        assertThatExceptionOfType(MailSendException.class)
                .isThrownBy(() -> service.sendeKontaktanfrage(ANFRAGE));
    }
}
