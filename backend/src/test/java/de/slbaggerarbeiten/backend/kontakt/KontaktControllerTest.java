package de.slbaggerarbeiten.backend.kontakt;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mail.MailSendException;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

@WebMvcTest(KontaktController.class)
class KontaktControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private NotificationService notificationService;

    private ResultActions sende(String json) throws Exception {
        return mockMvc.perform(post("/api/kontakt")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json));
    }

    private static String gueltigeAnfrage() {
        return """
                {
                  "name": "Erika Musterfrau",
                  "email": "erika@example.de",
                  "nachricht": "Bitte um ein Angebot für einen Leitungsgraben im Garten.",
                  "datenschutz": true
                }
                """;
    }

    @Test
    void gueltigeAnfrageWirdVersendetUndBeantwortet() throws Exception {
        sende(gueltigeAnfrage()).andExpect(status().isOk());

        verify(notificationService).sendeKontaktanfrage(any(KontaktRequest.class));
    }

    @Test
    void leererNameWirdMitFeldmeldungAbgelehnt() throws Exception {
        sende("""
                {"name": "", "email": "erika@example.de",
                 "nachricht": "Bitte um ein Angebot für den Gartenaushub.", "datenschutz": true}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.felder.name").exists());

        verifyNoInteractions(notificationService);
    }

    @Test
    void ungueltigeMailadresseWirdMitFeldmeldungAbgelehnt() throws Exception {
        sende("""
                {"name": "Erika Musterfrau", "email": "keine-adresse",
                 "nachricht": "Bitte um ein Angebot für den Gartenaushub.", "datenschutz": true}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.felder.email").exists());

        verifyNoInteractions(notificationService);
    }

    @Test
    void zuKurzeNachrichtWirdMitFeldmeldungAbgelehnt() throws Exception {
        sende("""
                {"name": "Erika Musterfrau", "email": "erika@example.de",
                 "nachricht": "zu kurz", "datenschutz": true}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.felder.nachricht").exists());

        verifyNoInteractions(notificationService);
    }

    @Test
    void ueberlangerNameWirdMitFeldmeldungAbgelehnt() throws Exception {
        sende("""
                {"name": "%s", "email": "erika@example.de",
                 "nachricht": "Bitte um ein Angebot für den Gartenaushub.", "datenschutz": true}
                """.formatted("x".repeat(101)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.felder.name").exists());

        verifyNoInteractions(notificationService);
    }

    @Test
    void fehlendeDatenschutzZustimmungWirdMitFeldmeldungAbgelehnt() throws Exception {
        sende("""
                {"name": "Erika Musterfrau", "email": "erika@example.de",
                 "nachricht": "Bitte um ein Angebot für den Gartenaushub.", "datenschutz": false}
                """)
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.felder.datenschutz").exists());

        verifyNoInteractions(notificationService);
    }

    @Test
    void versandfehlerFuehrtZuDienstNichtVerfuegbar() throws Exception {
        doThrow(new MailSendException("SMTP nicht erreichbar"))
                .when(notificationService).sendeKontaktanfrage(any(KontaktRequest.class));

        sende(gueltigeAnfrage())
                .andExpect(status().isServiceUnavailable())
                .andExpect(jsonPath("$.detail").exists());
    }
}
