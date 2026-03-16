# Assignment 2 – Cloud Notes

Dette prosjektet er utviklet i React Native med Expo og Supabase.  
Appen lar brukere registrere seg, logge inn og samarbeide på notater i en felles notatliste.

## Kjøring av prosjektet

1. Installer avhengigheter:
   ```bash
   npm install
   ```

2. Start prosjektet:
   ```bash
   npx expo start
   ```

3. Åpne appen i Expo Go på mobil, eller kjør emulator.

## Miljøvariabler

Opprett en `.env`-fil i prosjektroten:

```env
EXPO_PUBLIC_SUPABASE_URL=din_supabase_url
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=din_supabase_publishable_key
```

## Kravsjekk

### Autentisering
- [x] Sign-up: Bruker kan opprette konto med e-post/passord
- [x] Email template: Templaten i Supabase er endret ved sign-up
- [x] Login/Logout: Brukeren må logge inn før appen kan brukes
- [x] Credentials: Innlogget bruker forblir innlogget, og credentials er kryptert

### Database
- [x] Auth-kobling: Bare innloggede brukere kan gjøre noe med databasen
- [x] Create: Lagre nytt notat med tittel, tekst, bruker og sist endret
- [x] Read: Alle notater vises i skjermen **Jobb Notater**
- [x] Update: Brukere kan oppdatere notat
- [x] Delete: Brukere kan slette notat med bekreftelse før sletting

### Validering
- [x] Ingen tomme felter i notater
- [x] Ingen tomme felter i brukernavn og passord
- [x] Success: Brukeren får godkjenning når operasjoner er utført

### Visualisering
- [x] ER-diagram er laget
- [x] Sekvensdiagram for å lage et notat er laget

### Innlevering
- [x] `ProjectFolder/` er med
- [x] `README.md` er med
- [x] `ER-Diagram.pdf/png/jpg` er med
- [x] `Sekvens-Diagram.pdf/png/jpg` er med
- [x] `video.mp4` er med

## Prosjektstruktur

- `app/` – skjermer og routing
- `components/` – komponenter
- `context/` – state/context
- `lib/supabase.ts` – oppsett av Supabase-klient