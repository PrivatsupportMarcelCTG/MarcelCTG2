# MarcelCTG – GitHub Pages Edition

Enthält die vollständige responsive Website mit Logo, Startseite, Creator-Bereich, Shop-Anfrage, Streamingplan und Adminformular. Das Frontend wird über GitHub Pages gehostet. Ein Cloudflare Worker stellt die API bereit und sendet Discord-Webhooks serverseitig.

## 1. GitHub Pages veröffentlichen
1. Entpacke den ZIP-Inhalt und lade **alle Dateien und Ordner** in das Wurzelverzeichnis deines bestehenden GitHub-Repositories hoch (nicht den übergeordneten ZIP-Ordner).
2. Stelle sicher, dass der Standard-Branch `main` heißt oder passe `.github/workflows/pages.yml` an.
3. GitHub → Repository → **Settings → Pages** → Build and deployment: **GitHub Actions** auswählen.
4. Änderungen auf `main` pushen. Unter **Actions** läuft dann der Pages-Deploy. Die dort angezeigte URL ist deine Website.

## 2. Discord/API-Backend (Cloudflare Worker)
GitHub Pages ist statisches Hosting und kann keine geheimen Discord-Webhook-URLs oder Admin-Passwörter sicher ausführen. Darum liegt das Backend separat unter `backend/worker`.

1. Cloudflare-Konto erstellen und Node.js/npm installieren.
2. Im Terminal in `backend/worker` wechseln und `npx wrangler login` ausführen.
3. KV-Namespace erstellen: `npx wrangler kv namespace create STREAMS`. Die ausgegebene ID in `wrangler.toml` statt `HIER_KV_NAMESPACE_ID_EINTRAGEN` eintragen.
4. Secrets setzen:
   - `npx wrangler secret put DISCORD_WEBHOOK_URL`
   - `npx wrangler secret put ADMIN_TOKEN` (ein langes, zufälliges Passwort verwenden)
5. Optional die GitHub-Pages-Origin als Variable `ALLOWED_ORIGIN` setzen, z. B. `https://DEIN-NAME.github.io` (bei Projektseiten ggf. dieselbe Origin; keine Unterpfade).
6. `npx wrangler deploy` ausführen. Cloudflare zeigt eine Worker-URL an.
7. In der Datei `config.js` im Website-Root `window.MARCELCTG_API_BASE` auf diese Worker-URL setzen und erneut zu GitHub pushen.

## 3. Nutzung
- Streams werden über den Adminbereich am Seitenende veröffentlicht. Admin-Token eingeben; Worker speichert den Plan in KV und sendet eine Discord-Nachricht.
- Shop-Anfragen werden an den Worker gesendet und als Discord-Nachricht gemeldet. Es wird **keine Zahlung** verarbeitet.
- Webhook und Admin-Token gehören ausschließlich in Cloudflare Secrets, niemals in `config.js`, HTML oder JavaScript.

## Vor Veröffentlichung anpassen
- Social-Media-Links und Twitch-/YouTube-Adressen in `index.html`.
- Demoartikel und Preise in `index.html`.
- Beispiel-Stream in `backend/worker/src/index.js`.
- Impressum, Datenschutzerklärung, Kontakt- und Verbraucherinformationen passend zum tatsächlichen Betrieb ergänzen und rechtlich prüfen.

## Grenzen / Sicherheit
- Diese ZIP-Datei kann nicht selbst in dein GitHub-Repository hochgeladen werden; das musst du mit deinem GitHub-Zugang tun.
- Der Adminschutz verwendet einen geheimen Token. Verwende ein starkes, nur dafür genutztes Passwort. Bei einer öffentlichen Website ist zusätzlich Rate-Limiting/Bot-Schutz für Bestellformulare sinnvoll.
- Der Shop ist derzeit ein unverbindlicher Anfrageablauf, kein Checkout und keine Zahlungsabwicklung.
