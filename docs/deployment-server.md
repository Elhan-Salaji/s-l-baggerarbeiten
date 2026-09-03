# Server-Einrichtung für s-l-baggerarbeiten.de (abgelöst)

> Diese Anleitung beschreibt den Betrieb bis Version 2.0.2 auf einem
> eigenen Server. Seit Version 3.0.0 läuft die Seite auf Vercel, siehe
> [deployment.md](deployment.md) und ADR 0006. Der Text bleibt hier,
> solange der alte Server als Rollback bereitsteht.

Die Seite läuft auf einem eigenen Linux-Server mit Docker. Caddy holt
die TLS-Zertifikate automatisch bei Let's Encrypt, gebaut wird direkt
auf dem Server. Die Schritte gelten für Ubuntu LTS, andere
Distributionen weichen bei Paketnamen ab.

## Voraussetzungen

- Server mit öffentlicher IPv4-Adresse, Ports 80 und 443 frei
- SSH-Zugang mit sudo-Benutzer
- Zugriff auf die DNS-Verwaltung der Domain
- SMTP-Zugangsdaten für den Mailversand des Kontaktformulars

## 1. DNS

Bei der DNS-Verwaltung zwei Einträge auf die Server-IP anlegen, beide
braucht Caddy für die Zertifikate:

| Typ | Name | Wert |
|-----|------|------|
| A | s-l-baggerarbeiten.de | Server-IPv4 |
| A | www.s-l-baggerarbeiten.de | Server-IPv4 |

Hat der Server IPv6, zusätzlich beide AAAA-Einträge setzen. Vor dem
ersten Start prüfen, dass die Einträge greifen:

```
dig +short s-l-baggerarbeiten.de
dig +short www.s-l-baggerarbeiten.de
```

## 2. Server absichern

```
adduser deploy && usermod -aG sudo deploy   # Arbeitsbenutzer statt root
```

In `/etc/ssh/sshd_config`: `PasswordAuthentication no` und
`PermitRootLogin no` setzen (SSH-Schlüssel vorher hinterlegen), danach
`systemctl restart ssh`. Automatische Sicherheitsupdates einschalten:

```
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

Firewall: nur SSH, HTTP und HTTPS öffnen.

```
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443
sudo ufw enable
```

Docker veröffentlicht seine Ports an ufw vorbei. Weil nur Caddy Ports
veröffentlicht (80 und 443), deckt sich das mit der Firewall-Regel.

## 3. Docker installieren

Docker Engine und das Compose-Plugin aus dem offiziellen Repository
installieren: https://docs.docker.com/engine/install/ubuntu/

Danach den Arbeitsbenutzer in die Docker-Gruppe aufnehmen:

```
sudo usermod -aG docker deploy
```

## 4. Deployen

```
git clone <Repo-Adresse> benito
cd benito/docker
cp .env.example .env
nano .env                    # SMTP-Zugang, Adressen, ACME-E-Mail
docker compose up -d --build
```

Der erste Build dauert einige Minuten (Maven- und npm-Downloads).
Danach:

```
docker compose ps            # alle Dienste "healthy"
docker compose logs caddy    # Zertifikatsausstellung im Blick
```

## 5. Prüfen

```
curl -I  https://s-l-baggerarbeiten.de        # 200, gültiges Zertifikat
curl -I  http://s-l-baggerarbeiten.de         # Umleitung auf https
curl -I  https://www.s-l-baggerarbeiten.de    # Umleitung auf die Hauptdomain
```

Anschließend im Browser das Kontaktformular absenden und prüfen, dass
die Mail beim Empfänger ankommt. Landet sie im Spam-Ordner, fehlen
SPF- oder DKIM-Einträge für die Absenderadresse; die Werte stellt der
SMTP-Anbieter bereit.

Negativprobe: `curl --max-time 5 http://<Server-IP>:8080` darf keine
Antwort liefern, Frontend und Backend sind nur über Caddy erreichbar.

## Aktualisieren

```
cd benito/docker
git pull
docker compose up -d --build
```

Die Zertifikate liegen im Volume `caddy_data` und überleben Neubauten
und Server-Neustarts. `docker compose down` stoppt die Seite,
`docker compose down -v` löscht auch die Zertifikate (danach stellt
Caddy neue aus, Let's Encrypt begrenzt das auf wenige pro Woche).

## Vor dem Live-Gang

- Impressum und Datenschutz: Platzhalter durch echte Daten ersetzen
  (`frontend/src/pages/`), rechtlich prüfen lassen
- `.env` vollständig ausgefüllt, Testmail angekommen
- SPF/DKIM für die Absenderadresse gesetzt
